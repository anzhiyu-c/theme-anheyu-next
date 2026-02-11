"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_MUSIC_PLAYER_ENABLE,
  KEY_MUSIC_PLAYER_PLAYLIST_ID,
  KEY_MUSIC_PLAYER_CUSTOM_PLAYLIST,
  KEY_MUSIC_CAPSULE_PLAYLIST_ID,
  KEY_MUSIC_CAPSULE_CUSTOM_PLAYLIST,
  KEY_MUSIC_PAGE_PLAYLIST_ID,
  KEY_MUSIC_PAGE_CUSTOM_PLAYLIST,
  KEY_MUSIC_API_BASE_URL,
  KEY_MUSIC_VINYL_BACKGROUND,
  KEY_MUSIC_VINYL_OUTER,
  KEY_MUSIC_VINYL_INNER,
  KEY_MUSIC_VINYL_NEEDLE,
  KEY_MUSIC_VINYL_GROOVE,
} from "@/lib/settings/setting-keys";

interface MusicPageFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function MusicPageForm({ values, onChange, loading }: MusicPageFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 播放器配置 */}
      <SettingsSection title="播放器配置">
        <FormSwitch
          label="启用音乐播放器"
          description="在站点中显示音乐播放器"
          checked={values[KEY_MUSIC_PLAYER_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_MUSIC_PLAYER_ENABLE, String(v))}
        />
        <FormInput
          label="API 地址"
          placeholder="请输入音乐 API 基础地址"
          value={values[KEY_MUSIC_API_BASE_URL]}
          onValueChange={v => onChange(KEY_MUSIC_API_BASE_URL, v)}
          description="音乐解析 API 的基础 URL"
        />
        <FormInput
          label="全局歌单 ID"
          placeholder="请输入网易云歌单 ID"
          value={values[KEY_MUSIC_PLAYER_PLAYLIST_ID]}
          onValueChange={v => onChange(KEY_MUSIC_PLAYER_PLAYLIST_ID, v)}
          description="全局播放器使用的歌单 ID"
        />
        <FormJsonEditor
          label="全局自定义歌单"
          description={
            "JSON 数组，每项：id（可选）、name 歌名、artist 歌手、url 音频地址。填写后优先于上方「全局歌单 ID」使用。"
          }
          value={values[KEY_MUSIC_PLAYER_CUSTOM_PLAYLIST]}
          onValueChange={v => onChange(KEY_MUSIC_PLAYER_CUSTOM_PLAYLIST, v)}
        />
      </SettingsSection>

      {/* 胶囊播放器 */}
      <SettingsSection title="胶囊播放器">
        <FormInput
          label="歌单 ID"
          placeholder="请输入网易云歌单 ID"
          value={values[KEY_MUSIC_CAPSULE_PLAYLIST_ID]}
          onValueChange={v => onChange(KEY_MUSIC_CAPSULE_PLAYLIST_ID, v)}
        />
        <FormJsonEditor
          label="自定义歌单"
          description="JSON 数组，每项含 name、artist、url 等，格式同全局自定义歌单。填写后优先于上方歌单 ID。"
          value={values[KEY_MUSIC_CAPSULE_CUSTOM_PLAYLIST]}
          onValueChange={v => onChange(KEY_MUSIC_CAPSULE_CUSTOM_PLAYLIST, v)}
        />
      </SettingsSection>

      {/* 音乐页面 */}
      <SettingsSection title="音乐页面">
        <FormInput
          label="歌单 ID"
          placeholder="请输入网易云歌单 ID"
          value={values[KEY_MUSIC_PAGE_PLAYLIST_ID]}
          onValueChange={v => onChange(KEY_MUSIC_PAGE_PLAYLIST_ID, v)}
        />
        <FormJsonEditor
          label="自定义歌单"
          description="JSON 数组，每项含 name、artist、url。与网易云歌单 ID 二选一，填写本项则优先使用自定义歌单。"
          value={values[KEY_MUSIC_PAGE_CUSTOM_PLAYLIST]}
          onValueChange={v => onChange(KEY_MUSIC_PAGE_CUSTOM_PLAYLIST, v)}
        />
      </SettingsSection>

      {/* 唱片机样式 */}
      <SettingsSection title="唱片机样式">
        <FormImageUpload
          label="背景图"
          value={values[KEY_MUSIC_VINYL_BACKGROUND]}
          onValueChange={v => onChange(KEY_MUSIC_VINYL_BACKGROUND, v)}
          placeholder="请输入唱片机背景图 URL"
        />
        <SettingsFieldGroup cols={2}>
          <FormImageUpload
            label="外圈图片"
            value={values[KEY_MUSIC_VINYL_OUTER]}
            onValueChange={v => onChange(KEY_MUSIC_VINYL_OUTER, v)}
            placeholder="唱片外圈图片 URL"
            previewSize="sm"
          />
          <FormImageUpload
            label="内圈图片"
            value={values[KEY_MUSIC_VINYL_INNER]}
            onValueChange={v => onChange(KEY_MUSIC_VINYL_INNER, v)}
            placeholder="唱片内圈图片 URL"
            previewSize="sm"
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormImageUpload
            label="唱针图片"
            value={values[KEY_MUSIC_VINYL_NEEDLE]}
            onValueChange={v => onChange(KEY_MUSIC_VINYL_NEEDLE, v)}
            placeholder="唱针图片 URL"
            previewSize="sm"
          />
          <FormImageUpload
            label="纹路图片"
            value={values[KEY_MUSIC_VINYL_GROOVE]}
            onValueChange={v => onChange(KEY_MUSIC_VINYL_GROOVE, v)}
            placeholder="唱片纹路图片 URL"
            previewSize="sm"
          />
        </SettingsFieldGroup>
      </SettingsSection>
    </div>
  );
}
