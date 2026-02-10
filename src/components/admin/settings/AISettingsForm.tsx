"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_AI_SUMMARY_PROVIDER,
  KEY_AI_SUMMARY_API_KEY,
  KEY_AI_SUMMARY_API_URL,
  KEY_AI_SUMMARY_MODEL,
  KEY_AI_SUMMARY_SYSTEM_PROMPT,
  KEY_AI_WRITING_PROVIDER,
  KEY_AI_WRITING_API_KEY,
  KEY_AI_WRITING_API_URL,
  KEY_AI_WRITING_MODEL,
  KEY_AI_WRITING_SYSTEM_PROMPT,
  KEY_AI_WRITING_MAX_TOKENS,
  KEY_AI_WRITING_TEMPERATURE,
  KEY_AI_PODCAST_ENABLE,
  KEY_AI_PODCAST_PROVIDER,
  KEY_AI_PODCAST_APP_ID,
  KEY_AI_PODCAST_ACCESS_KEY,
  KEY_AI_PODCAST_RESOURCE_ID,
  KEY_AI_PODCAST_SPEAKER1,
  KEY_AI_PODCAST_SPEAKER2,
  KEY_AI_PODCAST_USE_HEAD_MUSIC,
  KEY_AI_PODCAST_USE_TAIL_MUSIC,
  KEY_AI_PODCAST_AUDIO_FORMAT,
  KEY_AI_PODCAST_SAMPLE_RATE,
  KEY_AI_PODCAST_SPEECH_RATE,
  KEY_AI_PODCAST_BUTTON_TEXT,
  KEY_AI_PODCAST_BUTTON_ICON,
  KEY_AI_ASSISTANT_ENABLE,
  KEY_AI_ASSISTANT_NAME,
  KEY_AI_ASSISTANT_WELCOME,
  KEY_AI_ASSISTANT_CHAT_SUGGESTIONS,
  KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS,
  KEY_AI_ASSISTANT_EMBEDDING_PROVIDER,
  KEY_AI_ASSISTANT_EMBEDDING_API_KEY,
  KEY_AI_ASSISTANT_EMBEDDING_MODEL,
  KEY_AI_ASSISTANT_VECTOR_STORE,
  KEY_AI_ASSISTANT_SYSTEM_PROMPT,
  KEY_AI_ASSISTANT_USER_PROMPT,
  KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT,
} from "@/lib/settings/setting-keys";

interface AISettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function AISettingsForm({ values, onChange, loading }: AISettingsFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI 摘要 */}
      <SettingsSection title="AI 摘要 (PRO)">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="提供商"
            placeholder="例如 openai、deepseek"
            value={values[KEY_AI_SUMMARY_PROVIDER]}
            onValueChange={v => onChange(KEY_AI_SUMMARY_PROVIDER, v)}
          />
          <FormInput
            label="API Key"
            placeholder="请输入 API Key"
            type="password"
            value={values[KEY_AI_SUMMARY_API_KEY]}
            onValueChange={v => onChange(KEY_AI_SUMMARY_API_KEY, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="API URL"
            placeholder="https://api.openai.com/v1"
            value={values[KEY_AI_SUMMARY_API_URL]}
            onValueChange={v => onChange(KEY_AI_SUMMARY_API_URL, v)}
          />
          <FormInput
            label="模型"
            placeholder="例如 gpt-4o-mini"
            value={values[KEY_AI_SUMMARY_MODEL]}
            onValueChange={v => onChange(KEY_AI_SUMMARY_MODEL, v)}
          />
        </SettingsFieldGroup>

        <FormCodeEditor
          label="System Prompt"
          value={values[KEY_AI_SUMMARY_SYSTEM_PROMPT]}
          onValueChange={v => onChange(KEY_AI_SUMMARY_SYSTEM_PROMPT, v)}
          language="text"
          minRows={4}
        />
      </SettingsSection>

      {/* AI 写作 */}
      <SettingsSection title="AI 写作 (PRO)">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="提供商"
            placeholder="例如 openai、deepseek"
            value={values[KEY_AI_WRITING_PROVIDER]}
            onValueChange={v => onChange(KEY_AI_WRITING_PROVIDER, v)}
          />
          <FormInput
            label="API Key"
            placeholder="请输入 API Key"
            type="password"
            value={values[KEY_AI_WRITING_API_KEY]}
            onValueChange={v => onChange(KEY_AI_WRITING_API_KEY, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="API URL"
            placeholder="https://api.openai.com/v1"
            value={values[KEY_AI_WRITING_API_URL]}
            onValueChange={v => onChange(KEY_AI_WRITING_API_URL, v)}
          />
          <FormInput
            label="模型"
            placeholder="例如 gpt-4o-mini"
            value={values[KEY_AI_WRITING_MODEL]}
            onValueChange={v => onChange(KEY_AI_WRITING_MODEL, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="最大 Token 数"
            placeholder="例如 2048"
            value={values[KEY_AI_WRITING_MAX_TOKENS]}
            onValueChange={v => onChange(KEY_AI_WRITING_MAX_TOKENS, v)}
          />
          <FormInput
            label="Temperature"
            placeholder="例如 0.7"
            value={values[KEY_AI_WRITING_TEMPERATURE]}
            onValueChange={v => onChange(KEY_AI_WRITING_TEMPERATURE, v)}
          />
        </SettingsFieldGroup>

        <FormCodeEditor
          label="System Prompt"
          value={values[KEY_AI_WRITING_SYSTEM_PROMPT]}
          onValueChange={v => onChange(KEY_AI_WRITING_SYSTEM_PROMPT, v)}
          language="text"
          minRows={4}
        />
      </SettingsSection>

      {/* AI 播客 */}
      <SettingsSection title="AI 播客 (PRO)">
        <FormSwitch
          label="启用 AI 播客"
          description="开启后文章页将显示 AI 播客生成按钮"
          checked={values[KEY_AI_PODCAST_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_AI_PODCAST_ENABLE, String(v))}
          isPro
        />

        <FormInput
          label="提供商"
          placeholder="例如 doubao"
          value={values[KEY_AI_PODCAST_PROVIDER]}
          onValueChange={v => onChange(KEY_AI_PODCAST_PROVIDER, v)}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="App ID"
            placeholder="请输入播客服务 App ID"
            value={values[KEY_AI_PODCAST_APP_ID]}
            onValueChange={v => onChange(KEY_AI_PODCAST_APP_ID, v)}
          />
          <FormInput
            label="Access Key"
            placeholder="请输入 Access Key"
            type="password"
            value={values[KEY_AI_PODCAST_ACCESS_KEY]}
            onValueChange={v => onChange(KEY_AI_PODCAST_ACCESS_KEY, v)}
          />
        </SettingsFieldGroup>

        <FormInput
          label="Resource ID"
          placeholder="请输入 Resource ID"
          value={values[KEY_AI_PODCAST_RESOURCE_ID]}
          onValueChange={v => onChange(KEY_AI_PODCAST_RESOURCE_ID, v)}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="主讲人 1"
            placeholder="请输入主讲人 1 声音 ID"
            value={values[KEY_AI_PODCAST_SPEAKER1]}
            onValueChange={v => onChange(KEY_AI_PODCAST_SPEAKER1, v)}
          />
          <FormInput
            label="主讲人 2"
            placeholder="请输入主讲人 2 声音 ID"
            value={values[KEY_AI_PODCAST_SPEAKER2]}
            onValueChange={v => onChange(KEY_AI_PODCAST_SPEAKER2, v)}
          />
        </SettingsFieldGroup>

        <FormSwitch
          label="使用片头音乐"
          checked={values[KEY_AI_PODCAST_USE_HEAD_MUSIC] === "true"}
          onCheckedChange={v => onChange(KEY_AI_PODCAST_USE_HEAD_MUSIC, String(v))}
          isPro
        />
        <FormSwitch
          label="使用片尾音乐"
          checked={values[KEY_AI_PODCAST_USE_TAIL_MUSIC] === "true"}
          onCheckedChange={v => onChange(KEY_AI_PODCAST_USE_TAIL_MUSIC, String(v))}
          isPro
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="音频格式"
            placeholder="例如 mp3"
            value={values[KEY_AI_PODCAST_AUDIO_FORMAT]}
            onValueChange={v => onChange(KEY_AI_PODCAST_AUDIO_FORMAT, v)}
          />
          <FormInput
            label="采样率"
            placeholder="例如 24000"
            value={values[KEY_AI_PODCAST_SAMPLE_RATE]}
            onValueChange={v => onChange(KEY_AI_PODCAST_SAMPLE_RATE, v)}
          />
        </SettingsFieldGroup>

        <FormInput
          label="语速"
          placeholder="例如 1.0"
          value={values[KEY_AI_PODCAST_SPEECH_RATE]}
          onValueChange={v => onChange(KEY_AI_PODCAST_SPEECH_RATE, v)}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="按钮文本"
            placeholder="例如 AI 播客"
            value={values[KEY_AI_PODCAST_BUTTON_TEXT]}
            onValueChange={v => onChange(KEY_AI_PODCAST_BUTTON_TEXT, v)}
          />
          <FormInput
            label="按钮图标"
            placeholder="例如 podcast"
            value={values[KEY_AI_PODCAST_BUTTON_ICON]}
            onValueChange={v => onChange(KEY_AI_PODCAST_BUTTON_ICON, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* AI 助手 */}
      <SettingsSection title="AI 助手 (PRO)">
        <FormSwitch
          label="启用 AI 助手"
          description="开启后站点将显示 AI 助手入口"
          checked={values[KEY_AI_ASSISTANT_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_AI_ASSISTANT_ENABLE, String(v))}
          isPro
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="助手名称"
            placeholder="例如 AnHeYu AI"
            value={values[KEY_AI_ASSISTANT_NAME]}
            onValueChange={v => onChange(KEY_AI_ASSISTANT_NAME, v)}
          />
          <FormInput
            label="欢迎语"
            placeholder="请输入助手欢迎语"
            value={values[KEY_AI_ASSISTANT_WELCOME]}
            onValueChange={v => onChange(KEY_AI_ASSISTANT_WELCOME, v)}
          />
        </SettingsFieldGroup>

        <FormJsonEditor
          label="聊天建议"
          description='JSON 数组格式，例如：["你是谁？", "介绍一下这个站点"]'
          value={values[KEY_AI_ASSISTANT_CHAT_SUGGESTIONS]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_CHAT_SUGGESTIONS, v)}
          minRows={4}
        />

        <FormJsonEditor
          label="搜索建议"
          description='JSON 数组格式，例如：["最新文章", "热门标签"]'
          value={values[KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS, v)}
          minRows={4}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Embedding 提供商"
            placeholder="例如 openai"
            value={values[KEY_AI_ASSISTANT_EMBEDDING_PROVIDER]}
            onValueChange={v => onChange(KEY_AI_ASSISTANT_EMBEDDING_PROVIDER, v)}
          />
          <FormInput
            label="Embedding 模型"
            placeholder="例如 text-embedding-3-small"
            value={values[KEY_AI_ASSISTANT_EMBEDDING_MODEL]}
            onValueChange={v => onChange(KEY_AI_ASSISTANT_EMBEDDING_MODEL, v)}
          />
        </SettingsFieldGroup>

        <FormInput
          label="Embedding API Key"
          placeholder="请输入 Embedding API Key"
          type="password"
          value={values[KEY_AI_ASSISTANT_EMBEDDING_API_KEY]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_EMBEDDING_API_KEY, v)}
        />

        <FormInput
          label="向量数据库"
          placeholder="例如 qdrant、pinecone"
          value={values[KEY_AI_ASSISTANT_VECTOR_STORE]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_VECTOR_STORE, v)}
        />

        <FormCodeEditor
          label="System Prompt"
          value={values[KEY_AI_ASSISTANT_SYSTEM_PROMPT]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_SYSTEM_PROMPT, v)}
          language="text"
          minRows={6}
        />
        <FormCodeEditor
          label="用户 Prompt 模板"
          value={values[KEY_AI_ASSISTANT_USER_PROMPT]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_USER_PROMPT, v)}
          language="text"
          minRows={6}
        />
        <FormCodeEditor
          label="无上下文 Prompt 模板"
          value={values[KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT]}
          onValueChange={v => onChange(KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT, v)}
          language="text"
          minRows={6}
        />
      </SettingsSection>
    </div>
  );
}
