"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { addToast, Button, Chip, Switch, Tooltip } from "@heroui/react";
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  CreditCard,
  Info,
  Loader2,
  Save,
  Shield,
  TestTube,
  XCircle,
  Zap,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  paymentApi,
  type AlipayConfig,
  type WechatConfig,
  type EpayConfig,
  type HupijiaoConfig,
  type PaymentConfigDetails,
  type PaymentProvider,
} from "@/lib/api/payment";
import { getErrorMessage } from "@/lib/api/client";

// ==================== Props ====================

interface PaymentSettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

// ==================== 支付方式图标 ====================

/** 通用图标组件 Props */
interface IconProps {
  className?: string;
}

/** 支付宝图标 - 使用 Remix Icon */
function AlipayIcon({ className }: IconProps) {
  return <Icon icon="ri:alipay-fill" className={className} />;
}

/** 微信支付图标 - 使用 Remix Icon */
function WechatPayIcon({ className }: IconProps) {
  return <Icon icon="ri:wechat-pay-fill" className={className} />;
}

/** 易支付图标 */
function EpayIcon({ className }: IconProps) {
  return <Zap className={className} />;
}

/** 虎皮椒图标 */
function HupijiaoIcon({ className }: IconProps) {
  return <CreditCard className={className} />;
}

// ==================== 支付方式定义 ====================

type ProviderKey = "alipay" | "wechat" | "epay" | "hupijiao";

interface ProviderInfo {
  key: ProviderKey;
  type: PaymentProvider;
  name: string;
  description: string;
  accent: string;
  icon: React.ComponentType<IconProps>;
}

const nativeProviders: ProviderInfo[] = [
  {
    key: "alipay",
    type: "ALIPAY",
    name: "支付宝",
    description: "官方直连",
    accent: "#1677ff",
    icon: AlipayIcon,
  },
  {
    key: "wechat",
    type: "WECHAT",
    name: "微信支付",
    description: "官方直连",
    accent: "#07c160",
    icon: WechatPayIcon,
  },
];

const aggregateProviders: ProviderInfo[] = [
  {
    key: "epay",
    type: "EPAY",
    name: "易支付",
    description: "聚合通道",
    accent: "#e38100",
    icon: EpayIcon,
  },
  {
    key: "hupijiao",
    type: "HUPIJIAO",
    name: "虎皮椒V3",
    description: "聚合通道",
    accent: "#ffa940",
    icon: HupijiaoIcon,
  },
];

const providerOrder: ProviderKey[] = ["alipay", "wechat", "epay", "hupijiao"];

// ==================== 折叠卡片组件 ====================

interface ProviderCardProps {
  provider: ProviderInfo;
  details?: PaymentConfigDetails[ProviderKey];
  expanded: boolean;
  toggling: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  children: React.ReactNode;
}

function PaymentProviderCard({
  provider,
  details,
  expanded,
  toggling,
  onToggleExpand,
  onToggleEnabled,
  children,
}: ProviderCardProps) {
  const enabled = details?.enabled ?? false;
  const configured = details?.configured ?? false;
  const ProviderIcon = provider.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-300",
        expanded
          ? "border-primary/30 bg-primary/2 shadow-(--anzhiyu-shadow-border)"
          : "border-default-200 bg-default-50/30 hover:border-default-300"
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onToggleExpand} className="flex flex-1 items-start gap-3 text-left">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm"
            style={{ backgroundColor: provider.accent }}
          >
            <ProviderIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{provider.name}</span>
              <span className="text-xs text-default-400">{provider.description}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Chip
                size="sm"
                variant="flat"
                color={enabled ? "success" : "default"}
                startContent={enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                classNames={{ base: "h-6", content: "text-[11px] font-medium px-1" }}
              >
                {enabled ? "已启用" : "未启用"}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                color={configured ? "success" : "default"}
                classNames={{ base: "h-6", content: "text-[11px] font-medium px-1" }}
              >
                {configured ? "已配置" : "未配置"}
              </Chip>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <Tooltip content={configured ? (enabled ? "点击禁用" : "点击启用") : "请先完成配置"}>
            <div>
              <Switch
                size="sm"
                isSelected={enabled}
                onValueChange={() => onToggleEnabled()}
                isDisabled={!configured || toggling}
                aria-label={`${provider.name} 启用开关`}
              />
            </div>
          </Tooltip>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={onToggleExpand}
            aria-label={expanded ? "收起配置" : "展开配置"}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")} />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-default-200/70 px-4 pb-5 pt-4 space-y-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function NotifyUrlCard({ url, onCopy }: { url?: string; onCopy: (value: string) => void }) {
  if (!url) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg bg-default-100 p-3">
      <Info className="w-4 h-4 text-default-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-default-600">异步通知地址（自动生成）</p>
        <p className="text-xs text-default-500 mt-0.5 break-all font-mono">{url}</p>
      </div>
      <Button size="sm" variant="light" isIconOnly onPress={() => onCopy(url)} aria-label="复制通知地址">
        <Copy className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

// ==================== 主组件 ====================

export function PaymentSettingsForm({ loading: pageLoading }: PaymentSettingsFormProps) {
  // 配置详情
  const [configDetails, setConfigDetails] = useState<PaymentConfigDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 表单数据
  const [alipayForm, setAlipayForm] = useState<AlipayConfig>({
    app_id: "",
    app_private_key: "",
    alipay_public_key: "",
  });

  const [wechatForm, setWechatForm] = useState<WechatConfig>({
    app_id: "",
    mch_id: "",
    mch_serial_no: "",
    api_v3_key: "",
    private_key_data: "",
  });

  const [epayForm, setEpayForm] = useState<EpayConfig>({
    mch_id: "",
    key: "",
    gateway: "",
    return_url: "",
  });

  const [hupijiaoForm, setHupijiaoForm] = useState<HupijiaoConfig>({
    app_id: "",
    app_secret: "",
    gateway: "https://api.xunhupay.com",
    return_url: "",
  });

  // 操作状态
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [expandedProvider, setExpandedProvider] = useState<ProviderKey | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { status: "success" | "error"; message?: string; testedAt: string }>
  >({});

  // ==================== 加载数据 ====================

  const loadConfigDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await paymentApi.getConfigDetails();
      const data = response.data;
      setConfigDetails(data);

      // 填充表单数据
      if (data.alipay?.configured) {
        setAlipayForm({
          app_id: data.alipay.app_id || "",
          app_private_key: data.alipay.app_private_key || "",
          alipay_public_key: data.alipay.alipay_public_key || "",
        });
      }

      if (data.wechat?.configured) {
        setWechatForm({
          app_id: data.wechat.app_id || "",
          mch_id: data.wechat.mch_id || "",
          mch_serial_no: data.wechat.mch_serial_no || "",
          api_v3_key: data.wechat.api_v3_key || "",
          private_key_data: data.wechat.private_key_data || "",
        });
      }

      if (data.epay?.configured) {
        setEpayForm({
          mch_id: data.epay.mch_id || "",
          key: data.epay.key || "",
          gateway: data.epay.gateway || "",
          return_url: data.epay.return_url || "",
        });
      }

      if (data.hupijiao?.configured) {
        setHupijiaoForm({
          app_id: data.hupijiao.app_id || "",
          app_secret: data.hupijiao.app_secret || "",
          gateway: data.hupijiao.gateway || "https://api.xunhupay.com",
          return_url: data.hupijiao.return_url || "",
        });
      }
    } catch (error) {
      addToast({
        title: "加载失败",
        description: getErrorMessage(error),
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigDetails();
  }, [loadConfigDetails]);

  const hasInitialExpand = useRef(false);

  useEffect(() => {
    if (!configDetails || hasInitialExpand.current) return;
    hasInitialExpand.current = true;
    const firstUnconfigured = providerOrder.find(key => !configDetails[key]?.configured);
    setExpandedProvider(firstUnconfigured ?? providerOrder[0]);
  }, [configDetails]);

  const handleCopyNotifyUrl = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      addToast({
        title: "已复制",
        description: "通知地址已复制到剪贴板",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "复制失败",
        description: getErrorMessage(error),
        color: "danger",
      });
    }
  }, []);

  // ==================== 保存配置 ====================

  const handleSaveConfig = useCallback(
    async (provider: PaymentProvider) => {
      const providerKey = provider.toLowerCase();
      setSaving(prev => ({ ...prev, [providerKey]: true }));

      try {
        const providerNames: Record<string, string> = {
          ALIPAY: "支付宝",
          WECHAT: "微信支付",
          EPAY: "易支付",
          HUPIJIAO: "虎皮椒V3",
        };

        switch (provider) {
          case "ALIPAY":
            if (!alipayForm.app_id || !alipayForm.app_private_key || !alipayForm.alipay_public_key) {
              addToast({ title: "请填写所有必填项", color: "warning" });
              return;
            }
            await paymentApi.setAlipayConfig(alipayForm);
            break;
          case "WECHAT":
            if (
              !wechatForm.app_id ||
              !wechatForm.mch_id ||
              !wechatForm.mch_serial_no ||
              !wechatForm.api_v3_key ||
              !wechatForm.private_key_data
            ) {
              addToast({ title: "请填写所有必填项", color: "warning" });
              return;
            }
            await paymentApi.setWechatConfig(wechatForm);
            break;
          case "EPAY":
            if (!epayForm.mch_id || !epayForm.key || !epayForm.gateway) {
              addToast({ title: "请填写所有必填项", color: "warning" });
              return;
            }
            await paymentApi.setEpayConfig(epayForm);
            break;
          case "HUPIJIAO":
            if (!hupijiaoForm.app_id || !hupijiaoForm.app_secret) {
              addToast({ title: "请填写所有必填项", color: "warning" });
              return;
            }
            await paymentApi.setHupijiaoConfig(hupijiaoForm);
            break;
        }

        addToast({
          title: `${providerNames[provider]}配置保存成功`,
          color: "success",
        });

        setTestResults(prev => {
          const next = { ...prev };
          delete next[providerKey];
          return next;
        });

        // 重新加载配置详情
        await loadConfigDetails();
      } catch (error) {
        addToast({
          title: "保存失败",
          description: getErrorMessage(error),
          color: "danger",
        });
      } finally {
        setSaving(prev => ({ ...prev, [providerKey]: false }));
      }
    },
    [alipayForm, wechatForm, epayForm, hupijiaoForm, loadConfigDetails]
  );

  // ==================== 测试连接 ====================

  const handleTestConfig = useCallback(async (provider: PaymentProvider) => {
    const providerKey = provider.toLowerCase();
    setTesting(prev => ({ ...prev, [providerKey]: true }));

    try {
      const providerNames: Record<string, string> = {
        ALIPAY: "支付宝",
        WECHAT: "微信支付",
        EPAY: "易支付",
        HUPIJIAO: "虎皮椒V3",
      };

      const response = await paymentApi.testConfig(provider);
      const testedAt = new Date().toLocaleString();
      if (response.code === 200) {
        setTestResults(prev => ({
          ...prev,
          [providerKey]: {
            status: "success",
            message: response.message,
            testedAt,
          },
        }));
        addToast({
          title: `${providerNames[provider]}连接测试成功`,
          description: response.message,
          color: "success",
        });
      } else {
        setTestResults(prev => ({
          ...prev,
          [providerKey]: {
            status: "error",
            message: response.message || "未知错误",
            testedAt,
          },
        }));
        addToast({
          title: `${providerNames[provider]}连接测试失败`,
          description: response.message || "未知错误",
          color: "danger",
        });
      }
    } catch (error) {
      const testedAt = new Date().toLocaleString();
      const message = getErrorMessage(error);
      setTestResults(prev => ({
        ...prev,
        [providerKey]: {
          status: "error",
          message,
          testedAt,
        },
      }));
      addToast({
        title: "测试失败",
        description: message,
        color: "danger",
      });
    } finally {
      setTesting(prev => ({ ...prev, [providerKey]: false }));
    }
  }, []);

  // ==================== 启用/禁用 ====================

  const handleToggleProvider = useCallback(
    async (provider: PaymentProvider) => {
      const providerKey = provider.toLowerCase();
      const currentEnabled =
        configDetails?.[providerKey as keyof Pick<PaymentConfigDetails, "alipay" | "wechat" | "epay" | "hupijiao">]
          ?.enabled ?? false;
      const newEnabled = !currentEnabled;

      setToggling(prev => ({ ...prev, [providerKey]: true }));

      try {
        const providerNames: Record<string, string> = {
          ALIPAY: "支付宝",
          WECHAT: "微信支付",
          EPAY: "易支付",
          HUPIJIAO: "虎皮椒V3",
        };

        await paymentApi.toggleProvider(provider, newEnabled);
        addToast({
          title: `${providerNames[provider]}已${newEnabled ? "启用" : "禁用"}`,
          color: "success",
        });

        // 重新加载配置详情
        await loadConfigDetails();
      } catch (error) {
        addToast({
          title: "操作失败",
          description: getErrorMessage(error),
          color: "danger",
        });
      } finally {
        setToggling(prev => ({ ...prev, [providerKey]: false }));
      }
    },
    [configDetails, loadConfigDetails]
  );

  // ==================== 操作按钮组件 ====================

  function ActionButtons({ provider, configured }: { provider: PaymentProvider; configured?: boolean }) {
    const key = provider.toLowerCase();
    const result = testResults[key];

    return (
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
          <Button
            color="primary"
            startContent={saving[key] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            isLoading={saving[key]}
            onPress={() => handleSaveConfig(provider)}
          >
            保存配置
          </Button>
          <Button
            variant="bordered"
            startContent={
              testing[key] ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />
            }
            isLoading={testing[key]}
            isDisabled={!configured}
            onPress={() => handleTestConfig(provider)}
          >
            测试连接
          </Button>
        </div>
        {result && (
          <div className="flex items-center gap-2 text-xs text-default-500 justify-start sm:justify-end">
            {result.status === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-danger-500" />
            )}
            <span>{result.status === "success" ? "连接测试通过" : "连接测试失败"}</span>
            <span className="text-default-400">· {result.testedAt}</span>
          </div>
        )}
      </div>
    );
  }

  const renderProviderForm = (providerKey: ProviderKey) => {
    const details = configDetails?.[providerKey];

    switch (providerKey) {
      case "alipay":
        return (
          <>
            <FormInput
              label="应用 ID"
              placeholder="请输入支付宝应用 ID"
              value={alipayForm.app_id}
              onValueChange={v => setAlipayForm(prev => ({ ...prev, app_id: v }))}
              isRequired
            />

            <FormTextarea
              label="应用私钥"
              placeholder="请输入应用私钥（支持纯密钥内容或完整 PEM 格式）"
              value={alipayForm.app_private_key}
              onValueChange={v => setAlipayForm(prev => ({ ...prev, app_private_key: v }))}
              isRequired
              minRows={3}
              maxRows={6}
            />

            <FormTextarea
              label="支付宝公钥"
              placeholder="请输入支付宝公钥（支持纯密钥内容或完整 PEM 格式）"
              value={alipayForm.alipay_public_key}
              onValueChange={v => setAlipayForm(prev => ({ ...prev, alipay_public_key: v }))}
              isRequired
              minRows={3}
              maxRows={6}
            />

            <NotifyUrlCard url={details?.notify_url} onCopy={handleCopyNotifyUrl} />
            <ActionButtons provider="ALIPAY" configured={details?.configured} />
          </>
        );

      case "wechat":
        return (
          <>
            <SettingsFieldGroup cols={2}>
              <FormInput
                label="应用 ID"
                placeholder="请输入微信应用 ID"
                value={wechatForm.app_id}
                onValueChange={v => setWechatForm(prev => ({ ...prev, app_id: v }))}
                isRequired
              />
              <FormInput
                label="商户号"
                placeholder="请输入微信商户号"
                value={wechatForm.mch_id}
                onValueChange={v => setWechatForm(prev => ({ ...prev, mch_id: v }))}
                isRequired
              />
            </SettingsFieldGroup>

            <SettingsFieldGroup cols={2}>
              <FormInput
                label="商户序列号"
                placeholder="请输入商户证书序列号"
                value={wechatForm.mch_serial_no}
                onValueChange={v => setWechatForm(prev => ({ ...prev, mch_serial_no: v }))}
                isRequired
              />
              <FormInput
                label="API v3 密钥"
                placeholder="请输入 API v3 密钥"
                type="password"
                value={wechatForm.api_v3_key}
                onValueChange={v => setWechatForm(prev => ({ ...prev, api_v3_key: v }))}
                isRequired
              />
            </SettingsFieldGroup>

            <FormTextarea
              label="商户私钥"
              placeholder="请输入商户私钥（PEM 格式，以 -----BEGIN PRIVATE KEY----- 开头）"
              value={wechatForm.private_key_data}
              onValueChange={v => setWechatForm(prev => ({ ...prev, private_key_data: v }))}
              isRequired
              minRows={3}
              maxRows={6}
            />

            <NotifyUrlCard url={details?.notify_url} onCopy={handleCopyNotifyUrl} />
            <ActionButtons provider="WECHAT" configured={details?.configured} />
          </>
        );

      case "epay":
        return (
          <>
            <SettingsFieldGroup cols={2}>
              <FormInput
                label="商户号"
                placeholder="请输入易支付商户号"
                value={epayForm.mch_id}
                onValueChange={v => setEpayForm(prev => ({ ...prev, mch_id: v }))}
                isRequired
              />
              <FormInput
                label="商户密钥"
                placeholder="请输入商户密钥"
                type="password"
                value={epayForm.key}
                onValueChange={v => setEpayForm(prev => ({ ...prev, key: v }))}
                isRequired
                autoComplete="new-password"
              />
            </SettingsFieldGroup>

            <FormInput
              label="支付网关"
              placeholder="请输入支付网关地址，例如：https://pay.example.com"
              value={epayForm.gateway}
              onValueChange={v => setEpayForm(prev => ({ ...prev, gateway: v }))}
              isRequired
            />

            <FormInput
              label="同步跳转地址"
              placeholder="支付成功后跳转的页面地址（可选）"
              value={epayForm.return_url ?? ""}
              onValueChange={v => setEpayForm(prev => ({ ...prev, return_url: v }))}
              description="用户完成支付后浏览器将跳转到此地址"
            />

            <NotifyUrlCard url={details?.notify_url} onCopy={handleCopyNotifyUrl} />
            <ActionButtons provider="EPAY" configured={details?.configured} />
          </>
        );

      case "hupijiao":
        return (
          <>
            <SettingsFieldGroup cols={2}>
              <FormInput
                label="应用 ID"
                placeholder="请输入虎皮椒应用 ID"
                value={hupijiaoForm.app_id}
                onValueChange={v => setHupijiaoForm(prev => ({ ...prev, app_id: v }))}
                isRequired
              />
              <FormInput
                label="应用密钥"
                placeholder="请输入应用密钥"
                type="password"
                value={hupijiaoForm.app_secret}
                onValueChange={v => setHupijiaoForm(prev => ({ ...prev, app_secret: v }))}
                isRequired
              />
            </SettingsFieldGroup>

            <FormInput
              label="支付网关"
              placeholder="默认：https://api.xunhupay.com"
              value={hupijiaoForm.gateway ?? "https://api.xunhupay.com"}
              onValueChange={v => setHupijiaoForm(prev => ({ ...prev, gateway: v }))}
              description="留空则使用默认网关地址"
            />

            <FormInput
              label="同步跳转地址"
              placeholder="支付成功后跳转的页面地址（可选）"
              value={hupijiaoForm.return_url ?? ""}
              onValueChange={v => setHupijiaoForm(prev => ({ ...prev, return_url: v }))}
              description="用户完成支付后浏览器将跳转到此地址"
            />

            <NotifyUrlCard url={details?.notify_url} onCopy={handleCopyNotifyUrl} />
            <ActionButtons provider="HUPIJIAO" configured={details?.configured} />
          </>
        );

      default:
        return null;
    }
  };

  const renderProviderCard = (provider: ProviderInfo) => {
    const details = configDetails?.[provider.key];
    const expanded = expandedProvider === provider.key;

    return (
      <PaymentProviderCard
        key={provider.key}
        provider={provider}
        details={details}
        expanded={expanded}
        toggling={toggling[provider.key] ?? false}
        onToggleExpand={() => setExpandedProvider(prev => (prev === provider.key ? null : provider.key))}
        onToggleEnabled={() => handleToggleProvider(provider.type)}
      >
        {renderProviderForm(provider.key)}
      </PaymentProviderCard>
    );
  };

  // ==================== 渲染 ====================

  if (pageLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-50/50 border border-success-100">
          <Shield className="w-4 h-4 text-success-500 shrink-0" />
          <span className="text-xs text-success-600">所有密钥信息使用 AES-256-GCM 加密存储</span>
        </div>
      </div>

      <SettingsSection title="原生支付通道" description="直接对接支付宝、微信官方 API，适合有商户资质的站点">
        <div className="space-y-4">{nativeProviders.map(renderProviderCard)}</div>
      </SettingsSection>

      <SettingsSection title="聚合支付通道" description="通过第三方聚合平台接入，配置简单，适合个人站长">
        <div className="space-y-4">{aggregateProviders.map(renderProviderCard)}</div>
      </SettingsSection>
    </div>
  );
}
