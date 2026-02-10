"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_ABOUT_NAME,
  KEY_ABOUT_DESCRIPTION,
  KEY_ABOUT_AVATAR_IMG,
  KEY_ABOUT_SUBTITLE,
  KEY_ABOUT_AVATAR_SKILLS_LEFT,
  KEY_ABOUT_AVATAR_SKILLS_RIGHT,
  KEY_ABOUT_SITE_TIPS,
  KEY_ABOUT_MAP,
  KEY_ABOUT_SELF_INFO,
  KEY_ABOUT_PERSONALITIES,
  KEY_ABOUT_MAXIM,
  KEY_ABOUT_BUFF,
  KEY_ABOUT_GAME,
  KEY_ABOUT_COMIC,
  KEY_ABOUT_LIKE,
  KEY_ABOUT_MUSIC,
  KEY_ABOUT_CAREERS,
  KEY_ABOUT_SKILLS_TIPS,
  KEY_ABOUT_STATISTICS_BG,
  KEY_ABOUT_CUSTOM_CODE,
  KEY_ABOUT_CUSTOM_CODE_HTML,
  KEY_ABOUT_ENABLE_AUTHOR_BOX,
  KEY_ABOUT_ENABLE_PAGE_CONTENT,
  KEY_ABOUT_ENABLE_SKILLS,
  KEY_ABOUT_ENABLE_CAREERS,
  KEY_ABOUT_ENABLE_STATISTIC,
  KEY_ABOUT_ENABLE_MAP_INFO,
  KEY_ABOUT_ENABLE_PERSONALITY,
  KEY_ABOUT_ENABLE_PHOTO,
  KEY_ABOUT_ENABLE_MAXIM,
  KEY_ABOUT_ENABLE_BUFF,
  KEY_ABOUT_ENABLE_GAME,
  KEY_ABOUT_ENABLE_COMIC,
  KEY_ABOUT_ENABLE_LIKE_TECH,
  KEY_ABOUT_ENABLE_MUSIC,
  KEY_ABOUT_ENABLE_CUSTOM_CODE,
  KEY_ABOUT_ENABLE_COMMENT,
} from "@/lib/settings/setting-keys";

interface AboutPageFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function AboutPageForm({ values, onChange, loading }: AboutPageFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 基本信息 */}
      <SettingsSection title="基本信息">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="名称"
            placeholder="请输入名称"
            value={values[KEY_ABOUT_NAME]}
            onValueChange={(v) => onChange(KEY_ABOUT_NAME, v)}
          />
          <FormInput
            label="副标题"
            placeholder="请输入副标题"
            value={values[KEY_ABOUT_SUBTITLE]}
            onValueChange={(v) => onChange(KEY_ABOUT_SUBTITLE, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="描述"
          placeholder="请输入个人描述"
          value={values[KEY_ABOUT_DESCRIPTION]}
          onValueChange={(v) => onChange(KEY_ABOUT_DESCRIPTION, v)}
        />
        <FormImageUpload
          label="头像"
          value={values[KEY_ABOUT_AVATAR_IMG]}
          onValueChange={(v) => onChange(KEY_ABOUT_AVATAR_IMG, v)}
          placeholder="请输入头像图片 URL"
          rounded
        />
      </SettingsSection>

      {/* 板块开关 */}
      <SettingsSection title="板块开关">
        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="作者信息"
            checked={values[KEY_ABOUT_ENABLE_AUTHOR_BOX] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_AUTHOR_BOX, String(v))}
          />
          <FormSwitch
            label="页面正文"
            checked={values[KEY_ABOUT_ENABLE_PAGE_CONTENT] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_PAGE_CONTENT, String(v))}
          />
          <FormSwitch
            label="技能"
            checked={values[KEY_ABOUT_ENABLE_SKILLS] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_SKILLS, String(v))}
          />
          <FormSwitch
            label="职业经历"
            checked={values[KEY_ABOUT_ENABLE_CAREERS] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_CAREERS, String(v))}
          />
          <FormSwitch
            label="统计"
            checked={values[KEY_ABOUT_ENABLE_STATISTIC] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_STATISTIC, String(v))}
          />
          <FormSwitch
            label="地图与信息"
            checked={values[KEY_ABOUT_ENABLE_MAP_INFO] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_MAP_INFO, String(v))}
          />
          <FormSwitch
            label="性格"
            checked={values[KEY_ABOUT_ENABLE_PERSONALITY] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_PERSONALITY, String(v))}
          />
          <FormSwitch
            label="相册"
            checked={values[KEY_ABOUT_ENABLE_PHOTO] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_PHOTO, String(v))}
          />
          <FormSwitch
            label="座右铭"
            checked={values[KEY_ABOUT_ENABLE_MAXIM] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_MAXIM, String(v))}
          />
          <FormSwitch
            label="Buff"
            checked={values[KEY_ABOUT_ENABLE_BUFF] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_BUFF, String(v))}
          />
          <FormSwitch
            label="游戏"
            checked={values[KEY_ABOUT_ENABLE_GAME] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_GAME, String(v))}
          />
          <FormSwitch
            label="追番"
            checked={values[KEY_ABOUT_ENABLE_COMIC] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_COMIC, String(v))}
          />
          <FormSwitch
            label="喜欢的技术"
            checked={values[KEY_ABOUT_ENABLE_LIKE_TECH] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_LIKE_TECH, String(v))}
          />
          <FormSwitch
            label="音乐"
            checked={values[KEY_ABOUT_ENABLE_MUSIC] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_MUSIC, String(v))}
          />
          <FormSwitch
            label="自定义代码"
            checked={values[KEY_ABOUT_ENABLE_CUSTOM_CODE] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_CUSTOM_CODE, String(v))}
          />
          <FormSwitch
            label="评论"
            checked={values[KEY_ABOUT_ENABLE_COMMENT] === "true"}
            onCheckedChange={(v) => onChange(KEY_ABOUT_ENABLE_COMMENT, String(v))}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 内容配置 */}
      <SettingsSection title="内容配置">
        <FormJsonEditor
          label="头像左侧技能"
          description="头像左侧显示的技能标签 JSON 数组"
          value={values[KEY_ABOUT_AVATAR_SKILLS_LEFT]}
          onValueChange={(v) => onChange(KEY_ABOUT_AVATAR_SKILLS_LEFT, v)}
        />
        <FormJsonEditor
          label="头像右侧技能"
          description="头像右侧显示的技能标签 JSON 数组"
          value={values[KEY_ABOUT_AVATAR_SKILLS_RIGHT]}
          onValueChange={(v) => onChange(KEY_ABOUT_AVATAR_SKILLS_RIGHT, v)}
        />
        <FormInput
          label="关于站点提示"
          placeholder="请输入关于站点的提示文字"
          value={values[KEY_ABOUT_SITE_TIPS]}
          onValueChange={(v) => onChange(KEY_ABOUT_SITE_TIPS, v)}
        />
        <FormInput
          label="技能提示"
          placeholder="请输入技能板块提示文字"
          value={values[KEY_ABOUT_SKILLS_TIPS]}
          onValueChange={(v) => onChange(KEY_ABOUT_SKILLS_TIPS, v)}
        />
        <FormJsonEditor
          label="地图配置"
          description="关于页面地图配置 JSON"
          value={values[KEY_ABOUT_MAP]}
          onValueChange={(v) => onChange(KEY_ABOUT_MAP, v)}
        />
        <FormJsonEditor
          label="个人信息"
          description="个人信息列表 JSON"
          value={values[KEY_ABOUT_SELF_INFO]}
          onValueChange={(v) => onChange(KEY_ABOUT_SELF_INFO, v)}
        />
        <FormJsonEditor
          label="性格"
          description="MBTI 性格 JSON 配置"
          value={values[KEY_ABOUT_PERSONALITIES]}
          onValueChange={(v) => onChange(KEY_ABOUT_PERSONALITIES, v)}
        />
        <FormJsonEditor
          label="座右铭"
          description="座右铭 JSON 数组"
          value={values[KEY_ABOUT_MAXIM]}
          onValueChange={(v) => onChange(KEY_ABOUT_MAXIM, v)}
        />
        <FormJsonEditor
          label="Buff"
          description="Buff 列表 JSON"
          value={values[KEY_ABOUT_BUFF]}
          onValueChange={(v) => onChange(KEY_ABOUT_BUFF, v)}
        />
        <FormJsonEditor
          label="游戏"
          description="游戏列表 JSON"
          value={values[KEY_ABOUT_GAME]}
          onValueChange={(v) => onChange(KEY_ABOUT_GAME, v)}
        />
        <FormJsonEditor
          label="追番"
          description="追番列表 JSON"
          value={values[KEY_ABOUT_COMIC]}
          onValueChange={(v) => onChange(KEY_ABOUT_COMIC, v)}
        />
        <FormJsonEditor
          label="喜欢的技术"
          description="喜欢的技术列表 JSON"
          value={values[KEY_ABOUT_LIKE]}
          onValueChange={(v) => onChange(KEY_ABOUT_LIKE, v)}
        />
        <FormJsonEditor
          label="音乐"
          description="音乐列表 JSON"
          value={values[KEY_ABOUT_MUSIC]}
          onValueChange={(v) => onChange(KEY_ABOUT_MUSIC, v)}
        />
        <FormJsonEditor
          label="职业经历"
          description="职业经历列表 JSON"
          value={values[KEY_ABOUT_CAREERS]}
          onValueChange={(v) => onChange(KEY_ABOUT_CAREERS, v)}
        />
        <FormImageUpload
          label="统计背景图"
          value={values[KEY_ABOUT_STATISTICS_BG]}
          onValueChange={(v) => onChange(KEY_ABOUT_STATISTICS_BG, v)}
          placeholder="请输入统计板块背景图 URL"
        />
      </SettingsSection>

      {/* 自定义代码 */}
      <SettingsSection title="自定义代码">
        <FormCodeEditor
          label="自定义 CSS/JS"
          description="关于页面自定义代码"
          language="css"
          value={values[KEY_ABOUT_CUSTOM_CODE]}
          onValueChange={(v) => onChange(KEY_ABOUT_CUSTOM_CODE, v)}
        />
        <FormCodeEditor
          label="自定义 HTML"
          description="关于页面自定义 HTML 内容"
          language="html"
          value={values[KEY_ABOUT_CUSTOM_CODE_HTML]}
          onValueChange={(v) => onChange(KEY_ABOUT_CUSTOM_CODE_HTML, v)}
        />
      </SettingsSection>
    </div>
  );
}
