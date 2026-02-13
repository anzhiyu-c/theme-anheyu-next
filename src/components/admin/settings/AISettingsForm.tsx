"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { FormStringList } from "@/components/ui/form-string-list";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { PlaceholderHelpPanel } from "@/components/ui/placeholder-help-panel";
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

interface SelectOption {
  key: string;
  label: string;
}

const AI_PROVIDER_OPTIONS: SelectOption[] = [
  { key: "glm", label: "智谱 GLM" },
  { key: "openai", label: "OpenAI" },
  { key: "qwen", label: "通义千问" },
  { key: "claude", label: "Claude" },
  { key: "deepseek", label: "DeepSeek" },
  { key: "doubao", label: "豆包" },
];

const AI_PROVIDER_MODEL_OPTIONS: Record<string, SelectOption[]> = {
  glm: [
    { key: "glm-4-flash", label: "GLM-4-Flash" },
    { key: "glm-4-air", label: "GLM-4-Air" },
    { key: "glm-4-airx", label: "GLM-4-AirX" },
    { key: "glm-4-long", label: "GLM-4-Long" },
    { key: "glm-4-plus", label: "GLM-4-Plus" },
    { key: "glm-4", label: "GLM-4" },
    { key: "glm-4-0520", label: "GLM-4-0520" },
    { key: "glm-4v", label: "GLM-4V" },
    { key: "glm-4v-plus", label: "GLM-4V-Plus" },
  ],
  openai: [
    { key: "gpt-4o-mini", label: "GPT-4o Mini" },
    { key: "gpt-4o", label: "GPT-4o" },
    { key: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { key: "gpt-4", label: "GPT-4" },
    { key: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { key: "o1-preview", label: "O1 Preview" },
    { key: "o1-mini", label: "O1 Mini" },
  ],
  qwen: [
    { key: "qwen-turbo", label: "Qwen Turbo" },
    { key: "qwen-plus", label: "Qwen Plus" },
    { key: "qwen-max", label: "Qwen Max" },
    { key: "qwen-max-longcontext", label: "Qwen Max Long" },
    { key: "qwen-long", label: "Qwen Long" },
    { key: "qwen2.5-72b-instruct", label: "Qwen2.5 72B" },
    { key: "qwen2.5-32b-instruct", label: "Qwen2.5 32B" },
    { key: "qwen2.5-14b-instruct", label: "Qwen2.5 14B" },
    { key: "qwen2.5-7b-instruct", label: "Qwen2.5 7B" },
  ],
  claude: [
    { key: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku" },
    { key: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
    { key: "claude-3-opus-latest", label: "Claude 3 Opus" },
    { key: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
    { key: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
  ],
  deepseek: [
    { key: "deepseek-chat", label: "DeepSeek Chat" },
    { key: "deepseek-coder", label: "DeepSeek Coder" },
    { key: "deepseek-reasoner", label: "DeepSeek Reasoner" },
  ],
  doubao: [
    { key: "doubao-seed-1-6-251015", label: "Doubao-Seed-1.6 (251015)" },
    { key: "doubao-seed-1-6-250615", label: "Doubao-Seed-1.6 (250615)" },
    { key: "doubao-seed-1-6-lite-251015", label: "Doubao-Seed-1.6-lite" },
    { key: "doubao-seed-1-6-flash-250828", label: "Doubao-Seed-1.6-flash" },
    { key: "doubao-seed-1-6-vision-250815", label: "Doubao-Seed-1.6-vision" },
    { key: "doubao-seed-1-6-thinking-250715", label: "Doubao-Seed-1.6-thinking" },
    { key: "doubao-seedance-1-0-pro-250528", label: "Doubao-Seedance-1.0-pro" },
    { key: "doubao-seedance-1-0-pro-fast-251015", label: "Doubao-Seedance-1.0-pro-fast" },
    { key: "doubao-1-5-pro-32k-250115", label: "Doubao-1.5-pro-32k" },
    { key: "doubao-1-5-lite-32k-250115", label: "Doubao-1.5-lite-32k" },
  ],
};

const PODCAST_PROVIDER_OPTIONS: SelectOption[] = [{ key: "doubao", label: "豆包（火山引擎）" }];

const PODCAST_SPEAKER_OPTIONS: SelectOption[] = [
  { key: "zh_male_dayixiansheng_v2_saturn_bigtts", label: "大义先生 (男声)" },
  { key: "zh_female_mizaitongxue_v2_saturn_bigtts", label: "米仔同学 (女声)" },
  { key: "zh_male_liufei_v2_saturn_bigtts", label: "刘飞 (男声)" },
  { key: "zh_male_xiaolei_v2_saturn_bigtts", label: "小雷 (男声)" },
];

const PODCAST_AUDIO_FORMAT_OPTIONS: SelectOption[] = [
  { key: "mp3", label: "MP3" },
  { key: "ogg_opus", label: "OGG Opus" },
  { key: "pcm", label: "PCM" },
  { key: "aac", label: "AAC" },
];

const PODCAST_SAMPLE_RATE_OPTIONS: SelectOption[] = [
  { key: "16000", label: "16000 Hz" },
  { key: "24000", label: "24000 Hz（推荐）" },
  { key: "48000", label: "48000 Hz" },
];

const EMBEDDING_PROVIDER_OPTIONS: SelectOption[] = [
  { key: "siliconflow", label: "硅基流动（推荐）" },
  { key: "zhipu", label: "智谱 AI" },
  { key: "openai", label: "OpenAI" },
  { key: "qwen", label: "通义千问" },
  { key: "ollama", label: "Ollama（本地）" },
];

const EMBEDDING_MODEL_OPTIONS: Record<string, SelectOption[]> = {
  siliconflow: [
    { key: "BAAI/bge-m3", label: "BGE-M3（推荐）" },
    { key: "BAAI/bge-large-zh-v1.5", label: "BGE-Large-zh" },
  ],
  zhipu: [{ key: "embedding-3", label: "Embedding-3" }],
  openai: [
    { key: "text-embedding-3-small", label: "text-embedding-3-small" },
    { key: "text-embedding-3-large", label: "text-embedding-3-large" },
  ],
  qwen: [{ key: "text-embedding-v2", label: "text-embedding-v2" }],
  ollama: [
    { key: "nomic-embed-text", label: "nomic-embed-text" },
    { key: "bge-m3", label: "bge-m3" },
  ],
};

const VECTOR_STORE_OPTIONS: SelectOption[] = [
  { key: "embedded", label: "内嵌存储（推荐）" },
  { key: "pgvector", label: "pgvector" },
  { key: "qdrant", label: "Qdrant" },
];

function withCurrentValue(value: string | undefined, options: SelectOption[]): SelectOption[] {
  const trimmed = (value ?? "").trim();
  if (trimmed === "" || options.some(option => option.key === trimmed)) {
    return options;
  }
  return [{ key: trimmed, label: `当前值（${trimmed}）` }, ...options];
}

export function AISettingsForm({ values, onChange, loading }: AISettingsFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const podcastEnabled = values[KEY_AI_PODCAST_ENABLE] === "true";
  const hasPodcastHistory =
    !podcastEnabled &&
    [
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
    ]
      .map(key => values[key] ?? "")
      .some(value => value.trim() !== "");
  const assistantEnabled = values[KEY_AI_ASSISTANT_ENABLE] === "true";
  const hasAssistantHistory =
    !assistantEnabled &&
    [
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
    ]
      .map(key => values[key] ?? "")
      .some(value => value.trim() !== "");
  const summaryProvider = (values[KEY_AI_SUMMARY_PROVIDER] || "").trim();
  const writingProvider = (values[KEY_AI_WRITING_PROVIDER] || "").trim();
  const podcastProvider = (values[KEY_AI_PODCAST_PROVIDER] || "").trim();
  const embeddingProvider = (values[KEY_AI_ASSISTANT_EMBEDDING_PROVIDER] || "").trim();

  const summaryProviderOptions = withCurrentValue(summaryProvider, AI_PROVIDER_OPTIONS);
  const writingProviderOptions = withCurrentValue(writingProvider, AI_PROVIDER_OPTIONS);
  const summaryModelOptions = withCurrentValue(
    values[KEY_AI_SUMMARY_MODEL],
    AI_PROVIDER_MODEL_OPTIONS[summaryProvider] || []
  );
  const writingModelOptions = withCurrentValue(
    values[KEY_AI_WRITING_MODEL],
    AI_PROVIDER_MODEL_OPTIONS[writingProvider] || []
  );

  const podcastProviderOptions = withCurrentValue(podcastProvider, PODCAST_PROVIDER_OPTIONS);
  const podcastSpeaker1Options = withCurrentValue(values[KEY_AI_PODCAST_SPEAKER1], PODCAST_SPEAKER_OPTIONS);
  const podcastSpeaker2Options = withCurrentValue(values[KEY_AI_PODCAST_SPEAKER2], PODCAST_SPEAKER_OPTIONS);
  const podcastAudioFormatOptions = withCurrentValue(values[KEY_AI_PODCAST_AUDIO_FORMAT], PODCAST_AUDIO_FORMAT_OPTIONS);
  const podcastSampleRateOptions = withCurrentValue(values[KEY_AI_PODCAST_SAMPLE_RATE], PODCAST_SAMPLE_RATE_OPTIONS);

  const embeddingProviderOptions = withCurrentValue(embeddingProvider, EMBEDDING_PROVIDER_OPTIONS);
  const embeddingModelOptions = withCurrentValue(
    values[KEY_AI_ASSISTANT_EMBEDDING_MODEL],
    EMBEDDING_MODEL_OPTIONS[embeddingProvider] || []
  );
  const vectorStoreOptions = withCurrentValue(values[KEY_AI_ASSISTANT_VECTOR_STORE], VECTOR_STORE_OPTIONS);

  return (
    <div className="space-y-8">
      {/* AI 摘要 */}
      <SettingsSection
        title="AI 摘要 (PRO)"
        description="用于文章摘要生成。建议先确认模型可访问，再逐步调整 Prompt，避免一次改动过大导致效果不可控。"
      >
        <SettingsFieldGroup cols={2}>
          <FormSelect
            label="提供商"
            placeholder="请选择提供商"
            value={values[KEY_AI_SUMMARY_PROVIDER]}
            onValueChange={v => onChange(KEY_AI_SUMMARY_PROVIDER, v)}
            description="按服务商筛选可选模型"
          >
            {summaryProviderOptions.map(option => (
              <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
            ))}
          </FormSelect>
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
          <FormSelect
            label="模型"
            placeholder="请选择模型"
            value={values[KEY_AI_SUMMARY_MODEL]}
            onValueChange={v => onChange(KEY_AI_SUMMARY_MODEL, v)}
          >
            {summaryModelOptions.map(option => (
              <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
            ))}
          </FormSelect>
        </SettingsFieldGroup>

        <FormCodeEditor
          label="System Prompt"
          value={values[KEY_AI_SUMMARY_SYSTEM_PROMPT]}
          onValueChange={v => onChange(KEY_AI_SUMMARY_SYSTEM_PROMPT, v)}
          language="text"
          minRows={4}
          description="指导模型如何生成摘要，例如要求长度、风格等"
        />
        <PlaceholderHelpPanel
          title="Prompt 配置建议"
          subtitle="摘要 Prompt 通常不需要变量，重点描述目标长度、语言和输出格式"
          items={[
            { variable: "长度约束", description: "例如 100-200 字、单段输出" },
            { variable: "语气约束", description: "例如客观、中性、避免营销语" },
            { variable: "事实约束", description: "例如无依据时不要臆测" },
          ]}
          className="mt-2"
        />
      </SettingsSection>

      {/* AI 写作 */}
      <SettingsSection
        title="AI 写作 (PRO)"
        description="用于生成文章初稿。建议优先设置模型与温度，再通过 System Prompt 固定结构和风格。"
      >
        <SettingsFieldGroup cols={2}>
          <FormSelect
            label="提供商"
            placeholder="请选择提供商"
            value={values[KEY_AI_WRITING_PROVIDER]}
            onValueChange={v => onChange(KEY_AI_WRITING_PROVIDER, v)}
            description="按服务商筛选可选模型"
          >
            {writingProviderOptions.map(option => (
              <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
            ))}
          </FormSelect>
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
          <FormSelect
            label="模型"
            placeholder="请选择模型"
            value={values[KEY_AI_WRITING_MODEL]}
            onValueChange={v => onChange(KEY_AI_WRITING_MODEL, v)}
          >
            {writingModelOptions.map(option => (
              <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
            ))}
          </FormSelect>
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
          description="定义 AI 写作时的角色与输出要求"
        />
        <PlaceholderHelpPanel
          title="写作 Prompt 建议"
          subtitle="可通过规则化描述让输出更稳定"
          items={[
            { variable: "结构要求", description: "例如：前言、正文分节、总结" },
            { variable: "格式要求", description: "例如：输出 Markdown，代码块必须标注语言" },
            { variable: "准确性要求", description: "例如：不确定的信息要显式说明" },
          ]}
          className="mt-2"
        />
      </SettingsSection>

      {/* AI 播客 */}
      <SettingsSection title="AI 播客 (PRO)">
        <FormSwitch
          label="启用 AI 播客"
          description="开启后文章页将显示 AI 播客生成按钮"
          checked={podcastEnabled}
          onCheckedChange={v => onChange(KEY_AI_PODCAST_ENABLE, String(v))}
          isPro
        />

        {podcastEnabled ? (
          <>
            <FormSelect
              label="提供商"
              placeholder="请选择提供商"
              value={values[KEY_AI_PODCAST_PROVIDER]}
              onValueChange={v => onChange(KEY_AI_PODCAST_PROVIDER, v)}
              description="当前播客能力基于火山引擎豆包语音服务"
            >
              {podcastProviderOptions.map(option => (
                <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
              ))}
            </FormSelect>

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
              <FormSelect
                label="主讲人 1"
                placeholder="请选择主讲人 1"
                value={values[KEY_AI_PODCAST_SPEAKER1]}
                onValueChange={v => onChange(KEY_AI_PODCAST_SPEAKER1, v)}
              >
                {podcastSpeaker1Options.map(option => (
                  <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
                ))}
              </FormSelect>
              <FormSelect
                label="主讲人 2"
                placeholder="请选择主讲人 2"
                value={values[KEY_AI_PODCAST_SPEAKER2]}
                onValueChange={v => onChange(KEY_AI_PODCAST_SPEAKER2, v)}
              >
                {podcastSpeaker2Options.map(option => (
                  <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
                ))}
              </FormSelect>
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
              <FormSelect
                label="音频格式"
                placeholder="请选择音频格式"
                value={values[KEY_AI_PODCAST_AUDIO_FORMAT]}
                onValueChange={v => onChange(KEY_AI_PODCAST_AUDIO_FORMAT, v)}
              >
                {podcastAudioFormatOptions.map(option => (
                  <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
                ))}
              </FormSelect>
              <FormSelect
                label="采样率"
                placeholder="请选择采样率"
                value={values[KEY_AI_PODCAST_SAMPLE_RATE]}
                onValueChange={v => onChange(KEY_AI_PODCAST_SAMPLE_RATE, v)}
              >
                {podcastSampleRateOptions.map(option => (
                  <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
                ))}
              </FormSelect>
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
          </>
        ) : (
          hasPodcastHistory && (
            <div className="rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-700 dark:text-warning-300">
              AI 播客当前关闭，但检测到历史配置已保留；重新开启后会继续生效。
            </div>
          )
        )}
      </SettingsSection>

      {/* AI 助手 */}
      <SettingsSection
        title="AI 助手 (PRO)"
        description="用于站点问答与检索增强。建议先确认 Embedding 与向量库可用，再调 Prompt 模板。"
      >
        <FormSwitch
          label="启用 AI 助手"
          description="开启后站点将显示 AI 助手入口"
          checked={assistantEnabled}
          onCheckedChange={v => onChange(KEY_AI_ASSISTANT_ENABLE, String(v))}
          isPro
        />

        {assistantEnabled ? (
          <>
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

            <FormStringList
              label="聊天建议"
              description="对话页展示的快捷问题，每行一条，建议设置为高频问题"
              value={values[KEY_AI_ASSISTANT_CHAT_SUGGESTIONS]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_CHAT_SUGGESTIONS, v)}
              placeholder="例如：你是谁？"
              addButtonText="添加建议"
            />

            <FormStringList
              label="搜索建议"
              description="搜索/联想展示的快捷词，每行一条，建议设置为站内核心主题"
              value={values[KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS, v)}
              placeholder="例如：最新文章"
              addButtonText="添加建议"
            />

            <SettingsFieldGroup cols={2}>
              <FormSelect
                label="Embedding 提供商"
                placeholder="请选择 Embedding 提供商"
                value={values[KEY_AI_ASSISTANT_EMBEDDING_PROVIDER]}
                onValueChange={v => onChange(KEY_AI_ASSISTANT_EMBEDDING_PROVIDER, v)}
              >
                {embeddingProviderOptions.map(option => (
                  <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
                ))}
              </FormSelect>
              <FormSelect
                label="Embedding 模型"
                placeholder="请选择 Embedding 模型"
                value={values[KEY_AI_ASSISTANT_EMBEDDING_MODEL]}
                onValueChange={v => onChange(KEY_AI_ASSISTANT_EMBEDDING_MODEL, v)}
              >
                {embeddingModelOptions.map(option => (
                  <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
                ))}
              </FormSelect>
            </SettingsFieldGroup>

            <FormInput
              label="Embedding API Key"
              placeholder="请输入 Embedding API Key"
              type="password"
              value={values[KEY_AI_ASSISTANT_EMBEDDING_API_KEY]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_EMBEDDING_API_KEY, v)}
            />

            <FormSelect
              label="向量数据库"
              placeholder="请选择向量数据库"
              value={values[KEY_AI_ASSISTANT_VECTOR_STORE]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_VECTOR_STORE, v)}
            >
              {vectorStoreOptions.map(option => (
                <FormSelectItem key={option.key}>{option.label}</FormSelectItem>
              ))}
            </FormSelect>

            <FormCodeEditor
              label="System Prompt"
              value={values[KEY_AI_ASSISTANT_SYSTEM_PROMPT]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_SYSTEM_PROMPT, v)}
              language="text"
              minRows={6}
              description="助手的系统角色与行为设定，影响回复风格与边界"
            />
            <FormCodeEditor
              label="用户 Prompt 模板"
              value={values[KEY_AI_ASSISTANT_USER_PROMPT]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_USER_PROMPT, v)}
              language="text"
              minRows={6}
              description="带上下文的用户消息模板，可含占位符以注入检索内容"
            />
            <FormCodeEditor
              label="无上下文 Prompt 模板"
              value={values[KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT]}
              onValueChange={v => onChange(KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT, v)}
              language="text"
              minRows={6}
              description="无检索结果时使用的提示模板"
            />
            <PlaceholderHelpPanel
              title="助手 Prompt 可用占位符"
              subtitle="点击可复制；变量由系统在运行时自动替换"
              items={[
                { variable: "{{context}}", description: "检索到的站点内容片段" },
                { variable: "{{question}}", description: "用户当前问题" },
                { variable: "{{site_name}}", description: "站点名称" },
              ]}
              className="mt-2"
            />
          </>
        ) : (
          hasAssistantHistory && (
            <div className="rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-700 dark:text-warning-300">
              AI 助手当前关闭，但检测到历史配置已保留；重新开启后会继续生效。
            </div>
          )
        )}
      </SettingsSection>
    </div>
  );
}
