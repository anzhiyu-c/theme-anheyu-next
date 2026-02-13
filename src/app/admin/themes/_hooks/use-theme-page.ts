import { useState, useMemo, useCallback, useEffect } from "react";
import { addToast } from "@heroui/react";
import { isProEdition } from "@/lib/version";
import { themeMallApi } from "@/lib/api/theme-mall";
import {
  useMarketThemes,
  useInstalledThemes,
  useInstalledSSRThemes,
  useInstallTheme,
  useSwitchTheme,
  useUninstallTheme,
  useInstallSSRTheme,
  useUninstallSSRTheme,
  useStartSSRTheme,
  useStopSSRTheme,
  useUploadTheme,
} from "@/hooks/queries/use-theme-mall";
import type { Theme, SSRThemeInfo } from "@/types/theme-mall";

export type TabKey = "market" | "installed";

/**
 * 从 downloadUrl 中提取主题名称（对齐 anheyu-pro extractThemeNameFromUrl）
 * 格式：theme-xxx-v1.0.0.zip / theme-xxx-v1.0.0.tar.gz / theme-xxx-1.0.0.tgz
 */
function extractThemeNameFromUrl(downloadUrl: string): string {
  const fileName = downloadUrl.split("/").pop() || "";
  const nameWithoutExt = fileName
    .replace(/\.tar\.gz$/i, "")
    .replace(/\.tgz$/i, "")
    .replace(/\.zip$/i, "");
  return nameWithoutExt.replace(/-v?\d+(\.\d+)*$/, "");
}

/**
 * 清理主题相关缓存（对齐 anheyu-pro clearThemeCache）
 */
async function clearThemeCache(): Promise<void> {
  // 1. 清理 localStorage
  const lsKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes("theme") || key.includes("Theme"))) {
      lsKeys.push(key);
    }
  }
  lsKeys.forEach(k => localStorage.removeItem(k));

  // 2. 清理 sessionStorage
  const ssKeys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes("theme") || key.includes("Theme"))) {
      ssKeys.push(key);
    }
  }
  ssKeys.forEach(k => sessionStorage.removeItem(k));

  // 3. 清理 Service Worker 缓存
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    } catch {
      /* ignore */
    }
  }

  // 4. 注销 Service Worker
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    } catch {
      /* ignore */
    }
  }
}

/**
 * 版本号比较（对齐 anheyu-pro compareVersions）
 * 返回: 1 (v1 > v2), -1 (v1 < v2), 0 (相等)
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

/**
 * 排序规则（对齐 anheyu-pro sortThemeList）：
 * 1. 当前使用中的主题排最前
 * 2. 官方主题排在前面
 * 3. 其他保持原始顺序
 */
function sortThemeList(themes: Theme[]): Theme[] {
  return [...themes].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    if (a.isOfficial && !b.isOfficial) return -1;
    if (!a.isOfficial && b.isOfficial) return 1;
    return 0;
  });
}

export function useThemePage() {
  // ---- PRO 版本检测 ----
  const [isProVersion, setIsProVersion] = useState(false);
  useEffect(() => {
    isProEdition()
      .then(setIsProVersion)
      .catch(() => setIsProVersion(false));
  }, []);

  // ---- Tab 状态 ----
  const [activeTab, setActiveTab] = useState<TabKey>("market");

  // ---- 搜索 & 分页 ----
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // ---- 弹窗状态 ----
  const [uninstallTarget, setUninstallTarget] = useState<Theme | null>(null);

  // ---- 数据查询 ----
  const marketQuery = useMarketThemes({ page, limit });
  const installedQuery = useInstalledThemes();
  const ssrListQuery = useInstalledSSRThemes();

  // ---- 弹窗状态（上传 & 配置） ----
  const [uploadOpen, setUploadOpen] = useState(false);
  const [configThemeName, setConfigThemeName] = useState<string | null>(null);

  // ---- Mutations ----
  const installTheme = useInstallTheme();
  const switchTheme = useSwitchTheme();
  const uninstallTheme = useUninstallTheme();
  const installSSR = useInstallSSRTheme();
  const uninstallSSR = useUninstallSSRTheme();
  const startSSR = useStartSSRTheme();
  const stopSSR = useStopSSRTheme();
  const uploadTheme = useUploadTheme();

  // ---- 已安装 SSR 主题名称集合 ----
  const installedSSRNames = useMemo(() => {
    if (!ssrListQuery.data) return new Set<string>();
    return new Set(ssrListQuery.data.map((ssr: SSRThemeInfo) => ssr.name));
  }, [ssrListQuery.data]);

  // ---- 商城主题列表（去重 + 排序） ----
  const marketThemes = useMemo(() => {
    const list = marketQuery.data?.list ?? [];
    // 按主题名称去重（优先保留 SSR 版本）
    const map = new Map<string, Theme>();
    list.forEach(theme => {
      const existing = map.get(theme.name);
      if (!existing || (theme.deployType === "ssr" && existing.deployType !== "ssr")) {
        map.set(theme.name, theme);
      }
    });
    return sortThemeList(Array.from(map.values()));
  }, [marketQuery.data]);

  const marketTotal = marketQuery.data?.total ?? 0;
  const marketTotalPages = Math.max(1, Math.ceil(marketTotal / limit));

  // ---- 已安装主题列表（合并普通 + SSR，排序） ----
  const installedThemes = useMemo(() => {
    const normalThemes = installedQuery.data ?? [];
    const ssrList = ssrListQuery.data ?? [];

    // 收集 SSR 主题名称用于去重
    const ssrNames = new Set(ssrList.map((s: SSRThemeInfo) => s.name));

    // 普通主题（排除已有 SSR 版本的）
    const filtered = normalThemes.filter((t: Theme) => !ssrNames.has(t.name));

    // SSR 主题转换为 Theme 格式
    const ssrThemes: Theme[] = ssrList.map((ssr: SSRThemeInfo) => {
      // 尝试从商城数据中获取详细信息
      const marketTheme = (marketQuery.data?.list ?? []).find((t: Theme) => t.name === ssr.name);
      return {
        id: marketTheme?.id ?? 0,
        name: ssr.name,
        author: marketTheme?.author ?? "SSR Theme",
        description:
          marketTheme?.description ?? `SSR 主题 - ${ssr.status === "running" ? `运行中 (端口 ${ssr.port})` : "已安装"}`,
        themeType: (marketTheme?.themeType ?? "pro") as Theme["themeType"],
        deployType: "ssr" as const,
        repoUrl: marketTheme?.repoUrl ?? "",
        instructionUrl: marketTheme?.instructionUrl ?? "",
        price: marketTheme?.price ?? 0,
        downloadUrl: marketTheme?.downloadUrl ?? "",
        tags: marketTheme?.tags ?? ["SSR"],
        previewUrl: marketTheme?.previewUrl ?? "",
        demoUrl: marketTheme?.demoUrl ?? "",
        version: ssr.version || marketTheme?.version || "1.0.0",
        downloadCount: marketTheme?.downloadCount ?? 0,
        rating: marketTheme?.rating ?? 0,
        isOfficial: marketTheme?.isOfficial ?? false,
        isActive: true,
        createdAt: ssr.installedAt ?? "",
        updatedAt: ssr.startedAt ?? "",
        is_current: ssr.is_current ?? false,
        is_installed: true,
        ssrStatus: ssr.status,
        ssrPort: ssr.port,
      };
    });

    return sortThemeList([...filtered, ...ssrThemes]);
  }, [installedQuery.data, ssrListQuery.data, marketQuery.data]);

  // ---- 当前列表 ----
  const currentThemeList = activeTab === "market" ? marketThemes : installedThemes;

  // ---- Loading ----
  const isLoading = activeTab === "market" ? marketQuery.isLoading : installedQuery.isLoading || ssrListQuery.isLoading;
  const isFetching =
    activeTab === "market" ? marketQuery.isFetching : installedQuery.isFetching || ssrListQuery.isFetching;

  // ---- Tab 切换 ----
  const handleTabChange = useCallback((key: TabKey) => {
    setActiveTab(key);
    setPage(1);
  }, []);

  // ---- 刷新 ----
  const handleRefresh = useCallback(() => {
    if (activeTab === "market") {
      marketQuery.refetch();
    } else {
      installedQuery.refetch();
      ssrListQuery.refetch();
    }
  }, [activeTab, marketQuery, installedQuery, ssrListQuery]);

  // ---- 安装主题 ----
  const handleInstall = useCallback(
    async (theme: Theme) => {
      // PRO 主题需要 PRO 版本
      if (theme.themeType === "pro" && !isProVersion) {
        addToast({
          title: "PRO 主题仅限 PRO 版本用户使用，请升级后再安装",
          color: "warning",
          timeout: 5000,
        });
        return;
      }
      if (!theme.downloadUrl) {
        addToast({ title: "该主题没有提供下载链接", color: "danger", timeout: 3000 });
        return;
      }
      const themeName = extractThemeNameFromUrl(theme.downloadUrl) || theme.name;
      try {
        await installTheme.mutateAsync({
          theme_name: themeName,
          download_url: theme.downloadUrl,
          theme_market_id: theme.id || undefined,
        });
        addToast({ title: `${theme.name} 安装成功`, color: "success", timeout: 3000 });
      } catch (e) {
        addToast({ title: e instanceof Error ? e.message : "安装失败", color: "danger", timeout: 3000 });
      }
    },
    [installTheme, isProVersion]
  );

  // ---- 切换主题 ----
  const handleSwitch = useCallback(
    async (theme: Theme) => {
      try {
        await switchTheme.mutateAsync({ theme_name: theme.name });
        addToast({ title: `主题启用成功，正在清理缓存...`, color: "success", timeout: 3000 });
        await clearThemeCache();
        setTimeout(() => {
          window.location.href = window.location.pathname + "?_t=" + Date.now();
        }, 1500);
      } catch (e) {
        addToast({ title: e instanceof Error ? e.message : "切换失败", color: "danger", timeout: 3000 });
      }
    },
    [switchTheme]
  );

  // ---- 卸载主题（普通） ----
  const confirmUninstall = useCallback(async () => {
    if (!uninstallTarget) return;
    const isSSR = uninstallTarget.deployType === "ssr";
    try {
      if (isSSR) {
        // SSR 主题：先停止再卸载
        const name = extractThemeNameFromUrl(uninstallTarget.downloadUrl) || uninstallTarget.name;
        if (uninstallTarget.ssrStatus === "running") {
          try {
            await stopSSR.mutateAsync(name);
          } catch {
            /* ignore */
          }
        }
        await uninstallSSR.mutateAsync(name);
      } else {
        await uninstallTheme.mutateAsync({ theme_name: uninstallTarget.name });
      }
      addToast({ title: `${uninstallTarget.name} 已卸载`, color: "success", timeout: 3000 });
    } catch (e) {
      addToast({ title: e instanceof Error ? e.message : "卸载失败", color: "danger", timeout: 3000 });
    }
    setUninstallTarget(null);
  }, [uninstallTarget, uninstallTheme, uninstallSSR, stopSSR]);

  // ---- 安装 SSR 主题 ----
  const handleInstallSSR = useCallback(
    async (theme: Theme) => {
      if (!theme.downloadUrl) {
        addToast({ title: "该主题没有提供下载链接", color: "danger", timeout: 3000 });
        return;
      }
      const themeName = extractThemeNameFromUrl(theme.downloadUrl) || theme.name;
      try {
        await installSSR.mutateAsync({ themeName, downloadUrl: theme.downloadUrl });
        addToast({ title: `SSR 主题 ${theme.name} 安装成功`, color: "success", timeout: 3000 });
      } catch (e) {
        addToast({ title: e instanceof Error ? e.message : "安装 SSR 主题失败", color: "danger", timeout: 3000 });
      }
    },
    [installSSR]
  );

  // ---- 启动 SSR 主题（切换到此主题） ----
  const handleStartSSR = useCallback(
    async (theme: Theme) => {
      const themeName = extractThemeNameFromUrl(theme.downloadUrl) || theme.name;
      try {
        await startSSR.mutateAsync(themeName);
        addToast({ title: `主题已切换，正在清理缓存...`, color: "success", timeout: 3000 });
        await clearThemeCache();
        setTimeout(() => {
          window.location.href = window.location.pathname + "?_t=" + Date.now();
        }, 1500);
      } catch (e) {
        addToast({ title: e instanceof Error ? e.message : "切换 SSR 主题失败", color: "danger", timeout: 3000 });
      }
    },
    [startSSR]
  );

  // ---- 上传主题（对齐 anheyu-pro 验证 + 版本比对流程） ----
  const handleUpload = useCallback(
    async (file: File, forceUpdate = false) => {
      try {
        // 1. 验证主题
        addToast({ title: "正在验证主题...", color: "primary", timeout: 2000 });
        const validation = await themeMallApi.validateTheme(file);

        if (!validation.is_valid) {
          const errorMsg = validation.errors?.join(", ") || "主题验证失败";
          addToast({ title: errorMsg, color: "danger", timeout: 5000 });
          return;
        }

        // 2. 检查是否已存在同名主题
        let shouldForce = forceUpdate;
        if (validation.existing_theme && !forceUpdate) {
          const newVersion = (validation.metadata as Record<string, string> | undefined)?.version || "0.0.0";
          const existingVersion =
            validation.existing_theme.installed_version || validation.existing_theme.version || "0.0.0";
          const cmp = compareVersions(newVersion, existingVersion);

          if (cmp < 0) {
            addToast({
              title: `上传版本 (${newVersion}) 低于已安装版本 (${existingVersion})，已取消`,
              color: "warning",
              timeout: 5000,
            });
            return;
          }
          // 版本相同或更高，强制更新
          shouldForce = true;
        }

        // 3. 执行上传
        const result = await uploadTheme.mutateAsync({ file, forceUpdate: shouldForce });
        addToast({ title: result.message || "主题上传成功", color: "success", timeout: 3000 });
        setUploadOpen(false);
        handleTabChange("installed");
      } catch (e) {
        addToast({ title: e instanceof Error ? e.message : "上传失败", color: "danger", timeout: 3000 });
      }
    },
    [uploadTheme, handleTabChange]
  );

  // ---- 打开主题配置 ----
  const openThemeConfig = useCallback((theme: Theme) => {
    setConfigThemeName(theme.name);
  }, []);

  return {
    // Tab
    activeTab,
    handleTabChange,

    // 数据
    currentThemeList,
    marketTotal,
    marketTotalPages,
    installedSSRNames,
    isLoading,
    isFetching,

    // 分页
    page,
    setPage,

    // 操作
    handleRefresh,
    handleInstall,
    handleSwitch,
    installTheme,
    switchTheme,

    // SSR 操作
    handleInstallSSR,
    handleStartSSR,
    installSSR,
    startSSR,

    // 卸载
    uninstallTarget,
    setUninstallTarget,
    confirmUninstall,
    uninstallTheme,
    uninstallSSR,

    // 上传
    uploadOpen,
    setUploadOpen,
    handleUpload,
    uploadTheme,

    // 配置
    configThemeName,
    setConfigThemeName,
    openThemeConfig,
  };
}
