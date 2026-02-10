"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_ALBUM_BANNER_BG,
  KEY_ALBUM_BANNER_TITLE,
  KEY_ALBUM_BANNER_DESC,
  KEY_ALBUM_BANNER_TIP,
  KEY_ALBUM_LAYOUT_MODE,
  KEY_ALBUM_WATERFALL_COLUMNS,
  KEY_ALBUM_WATERFALL_GAP,
  KEY_ALBUM_PAGE_SIZE,
  KEY_ALBUM_ENABLE_COMMENT,
  KEY_ALBUM_API_URL,
  KEY_ALBUM_DEFAULT_THUMB_PARAM,
  KEY_ALBUM_DEFAULT_BIG_PARAM,
} from "@/lib/settings/setting-keys";

interface AlbumPageFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function AlbumPageForm({ values, onChange, loading }: AlbumPageFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 横幅配置 */}
      <SettingsSection title="横幅配置">
        <FormImageUpload
          label="背景图"
          value={values[KEY_ALBUM_BANNER_BG]}
          onValueChange={(v) => onChange(KEY_ALBUM_BANNER_BG, v)}
          placeholder="请输入横幅背景图 URL"
        />
        <FormInput
          label="标题"
          placeholder="请输入页面标题"
          value={values[KEY_ALBUM_BANNER_TITLE]}
          onValueChange={(v) => onChange(KEY_ALBUM_BANNER_TITLE, v)}
        />
        <FormInput
          label="描述"
          placeholder="请输入页面描述"
          value={values[KEY_ALBUM_BANNER_DESC]}
          onValueChange={(v) => onChange(KEY_ALBUM_BANNER_DESC, v)}
        />
        <FormInput
          label="提示文字"
          placeholder="请输入提示文字"
          value={values[KEY_ALBUM_BANNER_TIP]}
          onValueChange={(v) => onChange(KEY_ALBUM_BANNER_TIP, v)}
        />
      </SettingsSection>

      {/* 布局配置 */}
      <SettingsSection title="布局配置">
        <FormSelect
          label="布局模式"
          value={values[KEY_ALBUM_LAYOUT_MODE]}
          onValueChange={(v) => onChange(KEY_ALBUM_LAYOUT_MODE, v)}
          placeholder="请选择布局模式"
        >
          <FormSelectItem key="waterfall">瀑布流</FormSelectItem>
          <FormSelectItem key="grid">网格</FormSelectItem>
          <FormSelectItem key="justified">自适应</FormSelectItem>
        </FormSelect>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="瀑布流列数"
            placeholder="如 3"
            value={values[KEY_ALBUM_WATERFALL_COLUMNS]}
            onValueChange={(v) => onChange(KEY_ALBUM_WATERFALL_COLUMNS, v)}
          />
          <FormInput
            label="瀑布流间距（px）"
            placeholder="如 10"
            value={values[KEY_ALBUM_WATERFALL_GAP]}
            onValueChange={(v) => onChange(KEY_ALBUM_WATERFALL_GAP, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="每页数量"
          placeholder="如 20"
          value={values[KEY_ALBUM_PAGE_SIZE]}
          onValueChange={(v) => onChange(KEY_ALBUM_PAGE_SIZE, v)}
        />
        <FormSwitch
          label="启用评论"
          description="在相册详情页开启评论功能"
          checked={values[KEY_ALBUM_ENABLE_COMMENT] === "true"}
          onCheckedChange={(v) => onChange(KEY_ALBUM_ENABLE_COMMENT, String(v))}
        />
      </SettingsSection>

      {/* API 配置 */}
      <SettingsSection title="API 配置">
        <FormInput
          label="API 地址"
          placeholder="请输入相册 API 地址"
          value={values[KEY_ALBUM_API_URL]}
          onValueChange={(v) => onChange(KEY_ALBUM_API_URL, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="默认缩略图参数"
            placeholder="如 ?imageView2/1/w/400/h/400"
            value={values[KEY_ALBUM_DEFAULT_THUMB_PARAM]}
            onValueChange={(v) => onChange(KEY_ALBUM_DEFAULT_THUMB_PARAM, v)}
            description="追加到缩略图 URL 后的参数"
          />
          <FormInput
            label="默认大图参数"
            placeholder="如 ?imageView2/0/w/1200"
            value={values[KEY_ALBUM_DEFAULT_BIG_PARAM]}
            onValueChange={(v) => onChange(KEY_ALBUM_DEFAULT_BIG_PARAM, v)}
            description="追加到大图 URL 后的参数"
          />
        </SettingsFieldGroup>
      </SettingsSection>
    </div>
  );
}
