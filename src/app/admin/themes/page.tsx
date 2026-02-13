"use client";

import { motion } from "framer-motion";
import { Button, Tabs, Tab, Pagination, Spinner } from "@heroui/react";
import {
  Palette,
  Download,
  Check,
  Eye,
  Star,
  ExternalLink,
  Crown,
  RotateCw,
  Trash2,
  Zap,
  ShieldAlert,
  CircleCheckBig,
  Store,
  FolderOpen,
  Upload,
  Settings,
  BookOpen,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { UploadThemeDialog } from "@/components/admin/themes/UploadThemeDialog";
import { ThemeConfigDialog } from "@/components/admin/themes/ThemeConfigDialog";
import { useThemePage, type TabKey } from "./_hooks/use-theme-page";
import type { Theme } from "@/types/theme-mall";

// ===================================
//     价格格式化
// ===================================

function formatPrice(priceCents: number): string {
  return (priceCents / 100).toFixed(2);
}

// ===================================
//     主题卡片
// ===================================

function ThemeCard({
  theme,
  tab,
  onInstall,
  onSwitch,
  onUninstall,
  onInstallSSR,
  onStartSSR,
  onConfig,
  installedSSRNames,
}: {
  theme: Theme;
  tab: TabKey;
  onInstall: (t: Theme) => void;
  onSwitch: (t: Theme) => void;
  onUninstall: (t: Theme) => void;
  onInstallSSR: (t: Theme) => void;
  onStartSSR: (t: Theme) => void;
  onConfig: (t: Theme) => void;
  installedSSRNames: Set<string>;
}) {
  const isCurrent = theme.is_current;
  const isPro = theme.themeType === "pro";
  const isSSR = theme.deployType === "ssr";

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        "bg-white dark:bg-white/[0.04]",
        "border border-border/50 dark:border-white/[0.06]",
        "hover:border-border dark:hover:border-white/[0.12]",
        "hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
        "transition-all duration-200 ease-out group",
        isCurrent && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
      )}
    >
      {/* 预览区 */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-default-100 to-default-50 dark:from-default-100/20 dark:to-default-50/10">
        {theme.previewUrl ? (
          <img src={theme.previewUrl} alt={theme.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Palette className="w-12 h-12 text-muted-foreground/15" />
          </div>
        )}

        {/* 悬停预览按钮 */}
        {theme.demoUrl && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              variant="flat"
              className="bg-white/90 dark:bg-white/20 backdrop-blur-sm shadow-sm"
              onPress={() => window.open(theme.demoUrl, "_blank")}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              预览
            </Button>
          </div>
        )}

        {/* 标签 */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {isCurrent && (
            <span className="px-2 py-0.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold flex items-center gap-1 shadow-sm">
              <Check className="w-3 h-3" />
              使用中
            </span>
          )}
          {theme.isOfficial && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
              <CircleCheckBig className="w-3 h-3" />
              官方
            </span>
          )}
          {isPro && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
              <Crown className="w-3 h-3" />
              PRO
            </span>
          )}
          {isSSR && (
            <span className="px-2 py-0.5 rounded-lg bg-indigo-500 text-white text-[10px] font-semibold shadow-sm">
              SSR
            </span>
          )}
        </div>

        {/* 价格 */}
        {isPro && theme.price > 0 && !theme.is_installed && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-bold">
            ¥{formatPrice(theme.price)}
          </span>
        )}
      </div>

      {/* 信息区 */}
      <div className="px-4 pt-3.5 pb-4">
        <div className="flex items-start justify-between mb-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-tight">{theme.name}</h3>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
              {theme.author} · v{theme.version}
            </p>
          </div>
          {theme.rating > 0 && (
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-semibold">{theme.rating}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground/70 mb-3 line-clamp-2 leading-relaxed">
          {theme.description || "暂无描述"}
        </p>

        {/* 标签 */}
        {theme.tags?.length > 0 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {theme.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-px rounded-md bg-foreground/[0.04] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {theme.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground/40">+{theme.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* 统计 + 操作 */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50">
            <Download className="w-3 h-3" />
            {(theme.downloadCount ?? 0).toLocaleString()}
          </span>

          <div className="flex items-center gap-1.5">
            {tab === "installed" ? (
              // ---- 已安装 Tab 操作 ----
              isSSR ? (
                // SSR 主题
                isCurrent ? (
                  <>
                    <Button size="sm" variant="flat" isDisabled className="h-7 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      当前主题
                    </Button>
                    {theme.ssrStatus === "running" && theme.ssrPort && (
                      <span className="text-[10px] text-muted-foreground/60 bg-default-100 dark:bg-white/[0.06] px-1.5 py-0.5 rounded">
                        端口: {theme.ssrPort}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="h-7 text-xs"
                      onPress={() => onStartSSR(theme)}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      切换
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      className="text-default-400 hover:text-danger h-7 w-7"
                      onPress={() => onUninstall(theme)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )
              ) : // 普通主题
              isCurrent ? (
                <Button size="sm" variant="flat" isDisabled className="h-7 text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  当前主题
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="h-7 text-xs"
                    onPress={() => onSwitch(theme)}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    切换
                  </Button>
                  {!theme.isOfficial && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      className="text-default-400 hover:text-danger h-7 w-7"
                      onPress={() => onUninstall(theme)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </>
              )
            ) : // ---- 商城 Tab 操作 ----
            isSSR ? (
              // SSR 主题
              <>
                {installedSSRNames.has(theme.name) ? (
                  <Button size="sm" variant="flat" isDisabled className="h-7 text-xs">
                    <CircleCheckBig className="w-3 h-3 mr-1" />
                    已安装
                  </Button>
                ) : (
                  <Button size="sm" variant="flat" className="h-7 text-xs" onPress={() => onInstallSSR(theme)}>
                    <Download className="w-3 h-3 mr-1" />
                    安装
                  </Button>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="text-default-400 hover:text-foreground h-7 w-7"
                  onPress={() =>
                    window.open(theme.instructionUrl || "https://dev.anheyu.com/docs/ssr-theme-deploy", "_blank")
                  }
                >
                  <BookOpen className="w-3 h-3" />
                </Button>
                {theme.repoUrl && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="full"
                    className="text-default-400 hover:text-foreground h-7 w-7"
                    onPress={() => window.open(theme.repoUrl, "_blank")}
                  >
                    <Github className="w-3 h-3" />
                  </Button>
                )}
              </>
            ) : theme.is_installed ? (
              <Button size="sm" variant="flat" isDisabled className="h-7 text-xs">
                <CircleCheckBig className="w-3 h-3 mr-1" />
                已安装
              </Button>
            ) : (
              <Button
                size="sm"
                variant="flat"
                className={cn("h-7 text-xs", isPro && "bg-amber-500 text-white hover:bg-amber-600")}
                onPress={() => onInstall(theme)}
              >
                <Download className="w-3 h-3 mr-1" />
                安装
              </Button>
            )}
            {/* 配置按钮（已安装非官方主题） */}
            {tab === "installed" && !theme.isOfficial && !isSSR && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="text-default-400 hover:text-foreground h-7 w-7"
                onPress={() => onConfig(theme)}
              >
                <Settings className="w-3 h-3" />
              </Button>
            )}
            {/* 演示链接 */}
            {theme.demoUrl && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="text-default-400 hover:text-foreground h-7 w-7"
                onPress={() => window.open(theme.demoUrl, "_blank")}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================
//     骨架屏
// ===================================

function ThemeSkeleton() {
  return (
    <div className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8">
      <div className="flex-1 min-h-0 flex flex-col mx-6 mt-5 mb-2 bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-24 rounded-md bg-muted/40 animate-pulse" />
              <div className="h-3 w-48 rounded-md bg-muted/30 animate-pulse" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-muted/30 animate-pulse" />
          </div>
        </div>
        <div className="px-5 py-3 border-b border-border/50">
          <div className="flex gap-6">
            <div className="h-6 w-20 rounded bg-muted/30 animate-pulse" />
            <div className="h-6 w-16 rounded bg-muted/30 animate-pulse" />
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-muted/10 animate-pulse">
                <div className="aspect-[16/9] bg-muted/20" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-24 rounded bg-muted/30" />
                  <div className="h-3 w-32 rounded bg-muted/20" />
                  <div className="h-3 w-full rounded bg-muted/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================
//     主页面
// ===================================

export default function ThemesPage() {
  const tp = useThemePage();

  if (tp.isLoading && tp.currentThemeList.length === 0) {
    return <ThemeSkeleton />;
  }

  return (
    <motion.div
      className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8"
      variants={adminContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={adminItemVariants}
        className="flex-1 min-h-0 flex flex-col mx-6 mt-5 mb-2 bg-card border border-border/60 rounded-xl overflow-hidden"
      >
        {/* 标题区 */}
        <div className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">主题商城</h1>
              <p className="text-xs text-muted-foreground mt-1">发现精美主题，打造个性化站点</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                startContent={<Upload className="w-3.5 h-3.5" />}
                onPress={() => tp.setUploadOpen(true)}
                className="text-default-600"
              >
                上传主题
              </Button>
              <Button
                size="sm"
                variant="flat"
                startContent={<RotateCw className="w-3.5 h-3.5" />}
                onPress={tp.handleRefresh}
                isLoading={tp.isFetching}
                className="text-default-600"
              >
                刷新
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs: 商城 / 已安装 */}
        <div className="px-5 border-b border-border/50">
          <Tabs
            aria-label="主题分类"
            variant="underlined"
            size="sm"
            color="primary"
            selectedKey={tp.activeTab}
            onSelectionChange={key => tp.handleTabChange(key as TabKey)}
            classNames={{
              tabList: "gap-6",
              tab: "px-0 h-9",
              cursor: "w-full",
            }}
          >
            <Tab
              key="market"
              title={
                <span className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  主题商城
                </span>
              }
            />
            <Tab
              key="installed"
              title={
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" />
                  已安装
                </span>
              }
            />
          </Tabs>
        </div>

        {/* 主题列表 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          {tp.isFetching && tp.currentThemeList.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="sm" label="加载中..." />
            </div>
          ) : tp.currentThemeList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tp.currentThemeList.map(theme => (
                <ThemeCard
                  key={theme.id || theme.name}
                  theme={theme}
                  tab={tp.activeTab}
                  onInstall={tp.handleInstall}
                  onSwitch={tp.handleSwitch}
                  onUninstall={tp.setUninstallTarget}
                  onInstallSSR={tp.handleInstallSSR}
                  onStartSSR={tp.handleStartSSR}
                  onConfig={tp.openThemeConfig}
                  installedSSRNames={tp.installedSSRNames}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Palette className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">{tp.activeTab === "installed" ? "暂无已安装主题" : "暂无主题数据"}</p>
              <Button size="sm" variant="flat" className="mt-3" onPress={tp.handleRefresh}>
                重新加载
              </Button>
            </div>
          )}
        </div>

        {/* 分页（仅商城 Tab） */}
        {tp.activeTab === "market" && tp.marketTotalPages > 1 && (
          <div className="px-5 pb-4 flex justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={tp.page}
              total={tp.marketTotalPages}
              onChange={tp.setPage}
            />
          </div>
        )}
      </motion.div>

      {/* 卸载确认 */}
      <ConfirmDialog
        isOpen={!!tp.uninstallTarget}
        onOpenChange={open => {
          if (!open) tp.setUninstallTarget(null);
        }}
        title="卸载主题"
        description={`确定要卸载主题「${tp.uninstallTarget?.name}」吗？此操作不可撤销。`}
        confirmText="卸载"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={tp.uninstallTheme.isPending || tp.uninstallSSR.isPending}
        onConfirm={tp.confirmUninstall}
      />

      {/* 上传主题 */}
      <UploadThemeDialog
        isOpen={tp.uploadOpen}
        onOpenChange={tp.setUploadOpen}
        onUpload={tp.handleUpload}
        isUploading={tp.uploadTheme.isPending}
      />

      {/* 主题配置 */}
      <ThemeConfigDialog themeName={tp.configThemeName} onClose={() => tp.setConfigThemeName(null)} />
    </motion.div>
  );
}
