"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Tabs,
  Tab,
  Spinner,
  addToast,
} from "@heroui/react";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { Settings2 } from "lucide-react";
import { themeMallApi } from "@/lib/api/theme-mall";
import type { ThemeSettingGroup, ThemeSettingField } from "@/types/theme-mall";

interface ThemeConfigDialogProps {
  themeName: string | null;
  onClose: () => void;
}

export function ThemeConfigDialog({ themeName, onClose }: ThemeConfigDialogProps) {
  const isOpen = !!themeName;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingGroups, setSettingGroups] = useState<ThemeSettingGroup[]>([]);
  const [configValues, setConfigValues] = useState<Record<string, unknown>>({});
  const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>({});
  const [activeGroup, setActiveGroup] = useState("");

  // 加载主题配置
  useEffect(() => {
    if (!themeName) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [settings, config] = await Promise.all([
          themeMallApi.getThemeSettings(themeName),
          themeMallApi.getUserThemeConfig(themeName),
        ]);

        if (cancelled) return;

        const groups = settings ?? [];
        setSettingGroups(groups);

        if (groups.length > 0) {
          setActiveGroup(groups[0].group);
        }

        // 提取默认值
        const defaults: Record<string, unknown> = {};
        for (const group of groups) {
          for (const field of group.fields) {
            if (field.default !== undefined) {
              defaults[field.name] = field.default;
            }
          }
        }
        setDefaultValues(defaults);

        // 合并默认值和用户配置
        setConfigValues({ ...defaults, ...(config ?? {}) });
      } catch (e) {
        addToast({ title: e instanceof Error ? e.message : "加载主题配置失败", color: "danger", timeout: 3000 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [themeName]);

  // 字段变更
  const updateField = useCallback((name: string, value: unknown) => {
    setConfigValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // 判断字段是否显示（对齐 anheyu-pro shouldShowField）
  const shouldShowField = useCallback(
    (field: ThemeSettingField): boolean => {
      if (!field.condition) return true;
      const { field: depField, operator, value } = field.condition;
      const currentValue = configValues[depField];
      switch (operator) {
        case "eq":
          return currentValue === value;
        case "neq":
          return currentValue !== value;
        case "contains":
          return String(currentValue).includes(String(value));
        case "gt":
          return Number(currentValue) > Number(value);
        case "lt":
          return Number(currentValue) < Number(value);
        default:
          return true;
      }
    },
    [configValues]
  );

  // 保存
  const handleSave = useCallback(async () => {
    if (!themeName) return;
    setSaving(true);
    try {
      await themeMallApi.saveUserThemeConfig({ theme_name: themeName, config: configValues });
      addToast({ title: "配置保存成功", color: "success", timeout: 3000 });
      onClose();
    } catch (e) {
      addToast({ title: e instanceof Error ? e.message : "保存失败", color: "danger", timeout: 3000 });
    } finally {
      setSaving(false);
    }
  }, [themeName, configValues, onClose]);

  // 恢复默认
  const handleReset = useCallback(() => {
    setConfigValues({ ...defaultValues });
    addToast({ title: "已恢复默认配置", color: "success", timeout: 2000 });
  }, [defaultValues]);

  // 关闭清理
  const handleClose = useCallback(() => {
    setSettingGroups([]);
    setConfigValues({});
    setActiveGroup("");
    onClose();
  }, [onClose]);

  // 当前分组
  const currentGroup = useMemo(() => settingGroups.find(g => g.group === activeGroup), [settingGroups, activeGroup]);

  return (
    <AdminDialog
      isOpen={isOpen}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
      size="2xl"
      scrollBehavior="inside"
      header={{
        title: `${themeName} - 主题配置`,
        description: "调整主题参数并实时保存配置",
        icon: Settings2,
      }}
    >
        <ModalBody className="gap-0 p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="sm" label="加载配置中..." />
            </div>
          ) : settingGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-sm">该主题暂无可配置项</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* 分组 Tabs */}
              {settingGroups.length > 1 && (
                <div className="px-6 border-b border-border/50">
                  <Tabs
                    aria-label="配置分组"
                    variant="underlined"
                    size="sm"
                    selectedKey={activeGroup}
                    onSelectionChange={key => setActiveGroup(key as string)}
                    classNames={{ tabList: "gap-4", tab: "px-0 h-8", cursor: "w-full" }}
                  >
                    {settingGroups.map(g => (
                      <Tab key={g.group} title={g.label} />
                    ))}
                  </Tabs>
                </div>
              )}

              {/* 配置字段 */}
              <div className="px-6 py-4 flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
                {currentGroup?.fields.map(field => {
                  if (!shouldShowField(field)) return null;
                  const value = configValues[field.name];

                  return (
                    <div key={field.name}>
                      {field.type === "text" && (
                        <Input
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder || `请输入${field.label}`}
                          value={String(value ?? "")}
                          onValueChange={v => updateField(field.name, v)}
                          isRequired={field.required}
                          size="sm"
                        />
                      )}
                      {field.type === "textarea" && (
                        <Input
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder || `请输入${field.label}`}
                          value={String(value ?? "")}
                          onValueChange={v => updateField(field.name, v)}
                          isRequired={field.required}
                          size="sm"
                        />
                      )}
                      {field.type === "number" && (
                        <Input
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder}
                          type="number"
                          value={String(value ?? "")}
                          onValueChange={v => updateField(field.name, v === "" ? "" : Number(v))}
                          isRequired={field.required}
                          size="sm"
                        />
                      )}
                      {field.type === "select" && field.options && (
                        <Select
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder || `请选择${field.label}`}
                          selectedKeys={value != null ? [String(value)] : []}
                          onSelectionChange={keys => {
                            const selected = Array.from(keys)[0];
                            updateField(field.name, selected);
                          }}
                          isRequired={field.required}
                          size="sm"
                        >
                          {field.options.map(opt => (
                            <SelectItem key={String(opt.value)}>{opt.label}</SelectItem>
                          ))}
                        </Select>
                      )}
                      {field.type === "switch" && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{field.label}</p>
                            {field.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                            )}
                          </div>
                          <Switch isSelected={!!value} onValueChange={v => updateField(field.name, v)} size="sm" />
                        </div>
                      )}
                      {field.type === "color" && (
                        <Input
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder || "#000000"}
                          value={String(value ?? "")}
                          onValueChange={v => updateField(field.name, v)}
                          size="sm"
                          startContent={
                            <div
                              className="w-4 h-4 rounded-full border border-border/50"
                              style={{ backgroundColor: String(value || "#000") }}
                            />
                          }
                        />
                      )}
                      {field.type === "image" && (
                        <Input
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder || "输入图片URL"}
                          value={String(value ?? "")}
                          onValueChange={v => updateField(field.name, v)}
                          size="sm"
                        />
                      )}
                      {field.type === "code" && (
                        <Input
                          label={field.label}
                          description={field.description}
                          placeholder={field.placeholder || "请输入代码"}
                          value={String(value ?? "")}
                          onValueChange={v => updateField(field.name, v)}
                          size="sm"
                          classNames={{ input: "font-mono text-xs" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={handleClose}>
            取消
          </Button>
          <Button variant="flat" onPress={handleReset} isDisabled={settingGroups.length === 0}>
            恢复默认
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={saving} isDisabled={settingGroups.length === 0}>
            保存配置
          </Button>
        </ModalFooter>
    </AdminDialog>
  );
}
