/**
 * 设置描述符系统
 * 定义后端键与前端表单的映射关系、类型信息
 */
import * as K from "./setting-keys";

/** 设置值类型 */
export type SettingType = "string" | "boolean" | "number" | "json" | "password" | "code";

/** 单个设置项描述符 */
export interface SettingDescriptor {
  /** 后端存储键 */
  backendKey: string;
  /** 值类型 */
  type: SettingType;
  /** 默认值 */
  defaultValue?: string;
  /** 是否为 PRO 专属 */
  isPro?: boolean;
}

/** 设置分类 ID */
export type SettingCategoryId =
  | "site-basic"
  | "site-icon"
  | "appearance-home"
  | "appearance-sidebar"
  | "appearance-page"
  | "content-post"
  | "content-file"
  | "user-comment"
  | "user-email"
  | "integration-oauth"
  | "integration-seo"
  | "pages-flink"
  | "pages-about"
  | "pages-equipment"
  | "pages-comments"
  | "pages-essay"
  | "pages-moments"
  | "pages-album"
  | "pages-music"
  | "advanced-captcha"
  | "advanced-wechat-share"
  | "advanced-ai"
  | "advanced-payment"
  | "advanced-backup";

/** 与 anheyu-pro 后端 buildApprovedEmailBody 一致的审核通过邮件默认模板（留空时后端使用此模板） */
const DEFAULT_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED = `<div style="background-color:#f4f5f7;padding:30px 0;">
\t<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
\t\t<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;text-align:center;">
\t\t\t<h1 style="color:#fff;margin:0;font-size:24px;">🎉 文章审核通过</h1>
\t\t</div>
\t\t<div style="padding:30px;">
\t\t\t<p style="font-size:16px;line-height:1.8;color:#333;">亲爱的 <strong>{{.Nickname}}</strong>，您好！</p>
\t\t\t<p style="font-size:14px;line-height:1.8;color:#666;">恭喜！您在 <a href="{{.SiteURL}}" style="color:#667eea;text-decoration:none;">{{.SiteName}}</a> 提交的文章已通过审核并发布。</p>
\t\t\t<div style="background:#f8f9fa;padding:20px;border-radius:6px;margin:20px 0;">
\t\t\t\t<h3 style="margin:0 0 15px 0;color:#333;font-size:16px;">文章信息</h3>
\t\t\t\t<p style="margin:8px 0;color:#666;"><strong>文章标题：</strong>{{.ArticleTitle}}</p>
\t\t\t\t{{if .ReviewComment}}<p style="margin:8px 0;color:#666;"><strong>审核意见：</strong>{{.ReviewComment}}</p>{{end}}
\t\t\t</div>
\t\t\t<p style="font-size:14px;line-height:1.8;color:#666;">您的文章现已可以被所有访客阅读，感谢您的精彩创作！</p>
\t\t\t<div style="text-align:center;margin:25px 0;">
\t\t\t\t<a href="{{.SiteURL}}/posts/{{.ArticleID}}" style="display:inline-block;padding:12px 30px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;text-decoration:none;border-radius:25px;font-size:14px;">查看文章</a>
\t\t\t</div>
\t\t</div>
\t\t<div style="background:#f8f9fa;padding:20px;text-align:center;color:#999;font-size:12px;">
\t\t\t<p style="margin:5px 0;">本邮件由系统自动发送，请勿直接回复</p>
\t\t\t<p style="margin:5px 0;">© {{.SiteName}}</p>
\t\t</div>
\t</div>
</div>`;

/** 与 anheyu-pro 后端 buildRejectedEmailBody 一致的审核拒绝邮件默认模板（留空时后端使用此模板） */
const DEFAULT_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED = `<div style="background-color:#f4f5f7;padding:30px 0;">
\t<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
\t\t<div style="background:linear-gradient(135deg,#ff6b6b 0%,#ee5a24 100%);padding:30px;text-align:center;">
\t\t\t<h1 style="color:#fff;margin:0;font-size:24px;">📝 文章审核未通过</h1>
\t\t</div>
\t\t<div style="padding:30px;">
\t\t\t<p style="font-size:16px;line-height:1.8;color:#333;">亲爱的 <strong>{{.Nickname}}</strong>，您好！</p>
\t\t\t<p style="font-size:14px;line-height:1.8;color:#666;">很遗憾，您在 <a href="{{.SiteURL}}" style="color:#667eea;text-decoration:none;">{{.SiteName}}</a> 提交的文章审核未通过。</p>
\t\t\t<div style="background:#fff5f5;padding:20px;border-radius:6px;margin:20px 0;border-left:4px solid #ff6b6b;">
\t\t\t\t<h3 style="margin:0 0 15px 0;color:#333;font-size:16px;">审核详情</h3>
\t\t\t\t<p style="margin:8px 0;color:#666;"><strong>文章标题：</strong>{{.ArticleTitle}}</p>
\t\t\t\t<p style="margin:8px 0;color:#666;"><strong>拒绝原因：</strong>{{.ReviewComment}}</p>
\t\t\t</div>
\t\t\t<p style="font-size:14px;line-height:1.8;color:#666;">请根据审核意见修改后重新提交，我们期待您的优质内容！</p>
\t\t\t<div style="text-align:center;margin:25px 0;">
\t\t\t\t<a href="{{.SiteURL}}/admin/post-management" style="display:inline-block;padding:12px 30px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;text-decoration:none;border-radius:25px;font-size:14px;">前往修改</a>
\t\t\t</div>
\t\t</div>
\t\t<div style="background:#f8f9fa;padding:20px;text-align:center;color:#999;font-size:12px;">
\t\t\t<p style="margin:5px 0;">本邮件由系统自动发送，请勿直接回复</p>
\t\t\t<p style="margin:5px 0;">© {{.SiteName}}</p>
\t\t</div>
\t</div>
</div>`;

/** 文章版权声明默认模板（与前台渲染兜底保持一致） */
const DEFAULT_POST_COPYRIGHT_TEMPLATE_ORIGINAL =
  '本文是原创文章，采用 <a href="{licenseUrl}" target="_blank">{license}</a> 协议，完整转载请注明来自 <a href="{siteUrl}" target="_blank">{author}</a>';

const DEFAULT_POST_COPYRIGHT_TEMPLATE_REPRINT_WITH_URL =
  '本文是转载或翻译文章，版权归 <a href="{originalUrl}" target="_blank">{originalAuthor}</a> 所有。建议访问原文，转载本文请联系原作者。';

const DEFAULT_POST_COPYRIGHT_TEMPLATE_REPRINT_NO_URL =
  "本文是转载或翻译文章，版权归 {originalAuthor} 所有。建议访问原文，转载本文请联系原作者。";

/** 文章订阅通知默认模板 */
const DEFAULT_POST_SUBSCRIBE_MAIL_TEMPLATE = `<p>你好，</p>
<p>你订阅的文章有更新：</p>
<p><strong>{{post_title}}</strong></p>
<p><a href="{{post_link}}" target="_blank">点击查看文章</a></p>
<p>如果你不想再接收通知，可点击：<a href="{{unsubscribe_link}}" target="_blank">取消订阅</a></p>
<p>— {{site_name}}</p>`;

/** AI 默认 Prompt（与 anheyu-pro 默认配置对齐） */
const DEFAULT_AI_SUMMARY_SYSTEM_PROMPT =
  "你是一个专业的内容总结助手。请将用户提供的文章内容总结为 100-200 字的单段中文摘要，语言简洁、客观、准确。";

const DEFAULT_AI_WRITING_SYSTEM_PROMPT =
  "你是一个专业的中文技术博客写作助手。请根据用户主题输出结构清晰、内容准确、可读性高的 Markdown 文章，必要时给出可运行示例。";

const DEFAULT_AI_ASSISTANT_SYSTEM_PROMPT =
  "你是站点 AI 助手。优先基于检索到的站点内容回答，无法确认时明确说明不确定，不要编造事实。";

const DEFAULT_AI_ASSISTANT_USER_PROMPT = `以下是相关的博客文章内容：

{{context}}

用户问：{{question}}

请用简洁友好的方式直接回答用户的问题。`;

const DEFAULT_AI_ASSISTANT_NO_CONTEXT_PROMPT = `你是「{{site_name}}」的博客助手。用户说：{{question}}

请友好简洁地回复用户（1-3 句话），可以用 emoji。`;

const DEFAULT_AI_ASSISTANT_CHAT_SUGGESTIONS = JSON.stringify(["你是谁？", "博客有哪些功能？", "如何配置主题?"]);
const DEFAULT_AI_ASSISTANT_SEARCH_SUGGESTIONS = JSON.stringify(["前端开发", "后端开发", "Anheyu-App使用"]);

/**
 * 后端返回空字符串时，前端需要回显默认值的配置键白名单。
 * 这些字段在后端常以空值表示“使用系统默认模板”。
 */
const EMPTY_STRING_DEFAULT_KEYS = new Set<string>([
  K.KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED,
  K.KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED,
  K.KEY_POST_COPYRIGHT_ORIGINAL,
  K.KEY_POST_COPYRIGHT_REPRINT_WITH_URL,
  K.KEY_POST_COPYRIGHT_REPRINT_NO_URL,
  K.KEY_POST_SUBSCRIBE_MAIL_TEMPLATE,
  K.KEY_AI_SUMMARY_SYSTEM_PROMPT,
  K.KEY_AI_WRITING_SYSTEM_PROMPT,
  K.KEY_AI_ASSISTANT_SYSTEM_PROMPT,
  K.KEY_AI_ASSISTANT_USER_PROMPT,
  K.KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT,
  K.KEY_AI_ASSISTANT_CHAT_SUGGESTIONS,
  K.KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS,
]);

/**
 * 根据分类获取该分类下所有设置项的后端键
 */
export function getKeysByCategory(categoryId: SettingCategoryId): SettingDescriptor[] {
  return categoryDescriptors[categoryId] || [];
}

/**
 * 获取所有后端键列表
 */
export function getAllBackendKeys(descriptors: SettingDescriptor[]): string[] {
  return descriptors.map(d => d.backendKey);
}

/**
 * 将后端 API 返回的嵌套对象还原为扁平的 "dot.key" 键值对。
 *
 * 后端 GetByKeys 会调用 unflatten()，把 "footer.uptime_kuma.enable" 变成
 * { footer: { uptime_kuma: { enable: false } } }，同时还会把值做类型转换
 * （boolean / number / JSON 解析）。
 *
 * 本函数执行逆操作：递归遍历嵌套结构，拼接出原始扁平键，并将值统一转为字符串。
 *
 * @param data      后端返回的嵌套对象
 * @param knownKeys 已知的后端设置键集合。当递归路径匹配某个已知键时，停止递归
 *                  并将该节点的值整体序列化为 JSON 字符串。这可以防止 JSON 对象类型
 *                  的字段（如 HOME_TOP、sidebar.author.social）被错误地拆分成子键。
 */
export function flattenApiResponse(data: Record<string, unknown>, knownKeys?: Set<string>): Record<string, string> {
  const result: Record<string, string> = {};

  function walk(obj: unknown, prefix: string) {
    if (obj === null || obj === undefined) {
      if (prefix) result[prefix] = "";
      return;
    }

    // 如果当前路径是一个已知的设置键，直接将值序列化，不再递归展开
    // 这解决了 JSON 对象类型字段（如 HOME_TOP、sidebar.author.social）
    // 被 unflatten 展开后无法正确还原的问题
    if (prefix && knownKeys?.has(prefix)) {
      if (typeof obj === "object") {
        result[prefix] = JSON.stringify(obj);
      } else {
        result[prefix] = String(obj);
      }
      return;
    }

    // 数组 → JSON 字符串（保留原始结构）
    if (Array.isArray(obj)) {
      result[prefix] = JSON.stringify(obj);
      return;
    }

    // 普通对象 → 递归展开
    if (typeof obj === "object") {
      const entries = Object.entries(obj as Record<string, unknown>);
      for (const [key, val] of entries) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        walk(val, fullKey);
      }
      return;
    }

    // 基本类型 → 转字符串
    result[prefix] = String(obj);
  }

  walk(data, "");
  return result;
}

/**
 * 将后端扁平值映射转为前端表单值
 * 注意：后端可能对 JSON 类型的值返回已解析的对象，需要统一转为字符串
 */
export function parseBackendValues(
  rawData: Record<string, string>,
  descriptors: SettingDescriptor[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const desc of descriptors) {
    const raw = rawData[desc.backendKey];
    if (raw == null) {
      // 布尔类型字段缺省值应为 "false"，避免 Switch 组件产生的 "false" 与空字符串 "" 不匹配
      // 导致 isDirty 始终为 true 的问题
      const fallback = desc.type === "boolean" ? "false" : "";
      result[desc.backendKey] = desc.defaultValue ?? fallback;
    } else if (typeof raw === "string") {
      // string/code 类型做规范化（换行符 + trim），避免与表单回传不一致导致一进页就显示「有未保存的更改」
      const s = raw;
      const normalized = desc.type === "string" || desc.type === "code" ? normalizeStringForCompare(s) : s;
      const shouldUseDefaultValue =
        s.trim() === "" && desc.defaultValue != null && EMPTY_STRING_DEFAULT_KEYS.has(desc.backendKey);
      if (shouldUseDefaultValue) {
        result[desc.backendKey] = desc.defaultValue!;
      } else {
        result[desc.backendKey] = normalized;
      }
    } else {
      // JSON 类型字段，后端可能返回已解析的对象，需要转回字符串
      result[desc.backendKey] = JSON.stringify(raw);
    }
  }
  return result;
}

/**
 * 规范化“空”值：undefined、null、"" 视为同一空值
 */
function isEmptyVal(v: unknown): boolean {
  return v == null || v === "";
}

/**
 * 装备列表 JSON 规范化，用于语义比较。
 * 与 EquipmentListEditor 的 parse+serialize 逻辑一致，避免拖拽还原后因格式差异（如 name vs title）误判 dirty。
 */
function canonicalizeEquipmentListJson(raw: string | undefined): string | null {
  if (!raw || raw.trim() === "") return "[]";
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized = parsed.map((category: unknown) => {
      const c =
        category && typeof category === "object" && !Array.isArray(category)
          ? (category as Record<string, unknown>)
          : {};
      const title = String(c.title ?? c.name ?? "");
      const description = String(c.description ?? "");
      const rawItems = Array.isArray(c.equipment_list) ? c.equipment_list : Array.isArray(c.items) ? c.items : [];
      return {
        title,
        description,
        equipment_list: rawItems.map((item: unknown) => {
          const i = item && typeof item === "object" && !Array.isArray(item) ? (item as Record<string, unknown>) : {};
          return {
            name: String(i.name ?? ""),
            image: String(i.image ?? ""),
            link: String(i.link ?? ""),
            description: String(i.description ?? ""),
            specification: String(i.specification ?? ""),
          };
        }),
      };
    });
    return JSON.stringify(normalized, null, 2);
  } catch {
    return null;
  }
}

/**
 * 规范化字符串再比较：统一换行符为 \n 并 trim，避免后端 \r\n/尾随空格与表单回传不一致导致误判 dirty
 */
function normalizeStringForCompare(s: unknown): string {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

/**
 * 用于「复制声明」类纯文本：去掉所有换行再比较，避免后端存 "…\n原文地址" 而单行输入丢掉 \n 导致误判 dirty
 */
function normalizeCopyDeclarationForCompare(s: unknown): string {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n/g, "")
    .trim();
}

/**
 * 规范化布尔字符串，便于比较
 */
function normalizeBoolean(v: unknown): string {
  if (v == null || v === "") return "false";
  const s = String(v).toLowerCase();
  return s === "true" || s === "1" ? "true" : "false";
}

/**
 * 对比新旧值，仅返回变更的键值对。
 * 传入 descriptors 时：
 * - 空值等价：undefined / null / "" 视为相同，避免一进入就显示「有配置更新」；
 * - boolean 统一按 "true"/"false" 比较；
 * - password：当前值为空不视为变更、也不提交，避免覆盖已有密码。
 */
export function getChangedValues(
  original: Record<string, string>,
  current: Record<string, string>,
  descriptors?: SettingDescriptor[]
): Record<string, string> {
  const changed: Record<string, string> = {};
  const descByKey = descriptors ? new Map(descriptors.map(d => [d.backendKey, d])) : null;

  for (const key of Object.keys(current)) {
    const desc = descByKey?.get(key);
    const cur = current[key];
    const orig = original[key];

    if (desc?.type === "password") {
      if (isEmptyVal(cur)) continue;
      if (cur === orig) continue;
      changed[key] = cur;
      continue;
    }

    if (desc?.type === "boolean") {
      if (normalizeBoolean(cur) === normalizeBoolean(orig)) continue;
      changed[key] = cur;
      continue;
    }

    if (isEmptyVal(cur) && isEmptyVal(orig)) continue;
    if (cur === orig) continue;
    // 兜底：两值均为字符串时，规范化后相等即视为未修改
    const isCopyDeclarationKey = key === "post.copy.copyright_original" || key === "post.copy.copyright_reprint";
    const normForCompare = isCopyDeclarationKey ? normalizeCopyDeclarationForCompare : normalizeStringForCompare;
    const normCurFallback = typeof cur === "string" ? normForCompare(cur) : "";
    const normOrigFallback = typeof orig === "string" ? normForCompare(orig) : "";
    if (typeof cur === "string" && typeof orig === "string" && normCurFallback === normOrigFallback) {
      continue;
    }
    // string/code 比较时按规范化后相等视为未修改（统一 \r\n + trim）
    const isStringOrCode = desc?.type === "string" || desc?.type === "code";
    const normCur = isStringOrCode ? normalizeStringForCompare(cur) : "";
    const normOrig = isStringOrCode ? normalizeStringForCompare(orig) : "";
    if (isStringOrCode && normCur === normOrig) {
      continue;
    }
    // json 类型：装备列表按语义规范化后比较，避免拖拽还原后因格式差异误判 dirty
    if (desc?.type === "json" && key === K.KEY_EQUIPMENT_LIST) {
      const canonCur = canonicalizeEquipmentListJson(cur);
      const canonOrig = canonicalizeEquipmentListJson(orig);
      if (canonCur != null && canonOrig != null && canonCur === canonOrig) continue;
    }
    changed[key] = cur;
  }
  return changed;
}

// ==================== 分类描述符定义 ====================

const categoryDescriptors: Record<SettingCategoryId, SettingDescriptor[]> = {
  "site-basic": [
    { backendKey: K.KEY_APP_NAME, type: "string" },
    { backendKey: K.KEY_SUB_TITLE, type: "string" },
    { backendKey: K.KEY_SITE_DESCRIPTION, type: "string" },
    { backendKey: K.KEY_SITE_KEYWORDS, type: "string" },
    { backendKey: K.KEY_SITE_URL, type: "string" },
    { backendKey: K.KEY_SITE_ANNOUNCEMENT, type: "string" },
    { backendKey: K.KEY_ICP_NUMBER, type: "string" },
    { backendKey: K.KEY_POLICE_RECORD_NUMBER, type: "string" },
    { backendKey: K.KEY_POLICE_RECORD_ICON, type: "string" },
    { backendKey: K.KEY_ENABLE_REGISTRATION, type: "boolean", defaultValue: "false" },
    { backendKey: K.KEY_DEFAULT_THEME_MODE, type: "string", defaultValue: "light" },
    { backendKey: K.KEY_THEME_COLOR, type: "string" },
    { backendKey: K.KEY_ABOUT_LINK, type: "string" },
    { backendKey: K.KEY_DEFAULT_THUMB_PARAM, type: "string" },
    { backendKey: K.KEY_DEFAULT_BIG_PARAM, type: "string" },
  ],
  "site-icon": [
    { backendKey: K.KEY_LOGO_HORIZONTAL_DAY, type: "string" },
    { backendKey: K.KEY_LOGO_HORIZONTAL_NIGHT, type: "string" },
    { backendKey: K.KEY_ICON_URL, type: "string" },
    { backendKey: K.KEY_LOGO_URL, type: "string" },
    { backendKey: K.KEY_LOGO_URL_192, type: "string" },
    { backendKey: K.KEY_LOGO_URL_512, type: "string" },
    { backendKey: K.KEY_USER_AVATAR, type: "string" },
    { backendKey: K.KEY_GRAVATAR_URL, type: "string" },
    { backendKey: K.KEY_DEFAULT_GRAVATAR_TYPE, type: "string", defaultValue: "mp" },
  ],
  "appearance-home": [
    { backendKey: K.KEY_HOME_TOP, type: "json" },
    { backendKey: K.KEY_CREATIVITY, type: "json" },
    { backendKey: K.KEY_HEADER_MENU, type: "json" },
    { backendKey: K.KEY_HEADER_NAV_TRAVELLING, type: "boolean" },
    { backendKey: K.KEY_HEADER_NAV_CLOCK, type: "boolean" },
    { backendKey: K.KEY_HEADER_NAV_MENU, type: "json" },
    { backendKey: K.KEY_FRONT_DESK_SITE_OWNER_NAME, type: "string" },
    { backendKey: K.KEY_FRONT_DESK_SITE_OWNER_EMAIL, type: "string" },
    { backendKey: K.KEY_FOOTER_OWNER_NAME, type: "string" },
    { backendKey: K.KEY_FOOTER_OWNER_SINCE, type: "string" },
    { backendKey: K.KEY_FOOTER_CUSTOM_TEXT, type: "string" },
    { backendKey: K.KEY_FOOTER_RUNTIME_ENABLE, type: "boolean" },
    { backendKey: K.KEY_FOOTER_RUNTIME_LAUNCH_TIME, type: "string" },
    { backendKey: K.KEY_FOOTER_RUNTIME_WORK_IMG, type: "string" },
    { backendKey: K.KEY_FOOTER_RUNTIME_WORK_DESC, type: "string" },
    { backendKey: K.KEY_FOOTER_RUNTIME_OFFDUTY_IMG, type: "string" },
    { backendKey: K.KEY_FOOTER_RUNTIME_OFFDUTY_DESC, type: "string" },
    { backendKey: K.KEY_FOOTER_SOCIALBAR_CENTER_IMG, type: "string" },
    { backendKey: K.KEY_FOOTER_LIST_RANDOM_FRIENDS, type: "number" },
    { backendKey: K.KEY_FOOTER_BAR_AUTHOR_LINK, type: "string" },
    { backendKey: K.KEY_FOOTER_BAR_CC_LINK, type: "string" },
    { backendKey: K.KEY_FOOTER_BADGE_ENABLE, type: "boolean" },
    { backendKey: K.KEY_FOOTER_BADGE_LIST, type: "json" },
    { backendKey: K.KEY_FOOTER_SOCIALBAR_LEFT, type: "json" },
    { backendKey: K.KEY_FOOTER_SOCIALBAR_RIGHT, type: "json" },
    { backendKey: K.KEY_FOOTER_PROJECT_LIST, type: "json" },
    { backendKey: K.KEY_FOOTER_BAR_LINK_LIST, type: "json" },
    { backendKey: K.KEY_FOOTER_UPTIME_KUMA_ENABLE, type: "boolean" },
    { backendKey: K.KEY_FOOTER_UPTIME_KUMA_PAGE_URL, type: "string" },
  ],
  "appearance-sidebar": [
    { backendKey: K.KEY_SIDEBAR_AUTHOR_ENABLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_SIDEBAR_AUTHOR_DESCRIPTION, type: "string" },
    { backendKey: K.KEY_SIDEBAR_AUTHOR_STATUS_IMG, type: "string" },
    { backendKey: K.KEY_SIDEBAR_AUTHOR_SKILLS, type: "json" },
    { backendKey: K.KEY_SIDEBAR_AUTHOR_SOCIAL, type: "json" },
    { backendKey: K.KEY_SIDEBAR_WECHAT_ENABLE, type: "boolean" },
    { backendKey: K.KEY_SIDEBAR_WECHAT_FACE, type: "string" },
    { backendKey: K.KEY_SIDEBAR_WECHAT_BACK_FACE, type: "string" },
    { backendKey: K.KEY_SIDEBAR_WECHAT_BLUR_BG, type: "string" },
    { backendKey: K.KEY_SIDEBAR_WECHAT_LINK, type: "string" },
    { backendKey: K.KEY_SIDEBAR_TAGS_ENABLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_SIDEBAR_TAGS_HIGHLIGHT, type: "json" },
    { backendKey: K.KEY_SIDEBAR_SITEINFO_POST_COUNT, type: "number" },
    { backendKey: K.KEY_SIDEBAR_SITEINFO_RUNTIME, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_SIDEBAR_SITEINFO_WORD_COUNT, type: "number" },
    { backendKey: K.KEY_SIDEBAR_ARCHIVE_MONTHS, type: "number", defaultValue: "12" },
    { backendKey: K.KEY_SIDEBAR_CUSTOM_SHOW_IN_POST, type: "boolean" },
    { backendKey: K.KEY_SIDEBAR_TOC_COLLAPSE_MODE, type: "boolean" },
    { backendKey: K.KEY_SIDEBAR_SERIES_POST_COUNT, type: "number", defaultValue: "5" },
    { backendKey: K.KEY_SIDEBAR_DOC_LINKS, type: "json" },
    { backendKey: K.KEY_CUSTOM_SIDEBAR, type: "json" },
    { backendKey: K.KEY_WEATHER_ENABLE, type: "boolean" },
    { backendKey: K.KEY_WEATHER_ENABLE_PAGE, type: "string", defaultValue: "all" },
    { backendKey: K.KEY_WEATHER_QWEATHER_KEY, type: "password" },
    { backendKey: K.KEY_WEATHER_QWEATHER_API_HOST, type: "string" },
    { backendKey: K.KEY_WEATHER_IP_API_KEY, type: "password" },
    { backendKey: K.KEY_WEATHER_LOADING, type: "string" },
    { backendKey: K.KEY_WEATHER_DEFAULT_RECT, type: "boolean" },
    { backendKey: K.KEY_WEATHER_RECTANGLE, type: "string" },
  ],
  "appearance-page": [
    { backendKey: K.KEY_ENABLE_EXTERNAL_LINK_WARNING, type: "boolean" },
    { backendKey: K.KEY_CUSTOM_HEADER_HTML, type: "code" },
    { backendKey: K.KEY_CUSTOM_FOOTER_HTML, type: "code" },
    { backendKey: K.KEY_CUSTOM_CSS, type: "code" },
    { backendKey: K.KEY_CUSTOM_JS, type: "code" },
    { backendKey: K.KEY_CUSTOM_POST_TOP_HTML, type: "code" },
    { backendKey: K.KEY_CUSTOM_POST_BOTTOM_HTML, type: "code" },
    { backendKey: K.KEY_PAGE_ONE_IMAGE_CONFIG, type: "json" },
    { backendKey: K.KEY_HITOKOTO_API, type: "string" },
    { backendKey: K.KEY_TYPING_SPEED, type: "number", defaultValue: "100" },
  ],
  "content-post": [
    { backendKey: K.KEY_IP_API, type: "string" },
    { backendKey: K.KEY_IP_API_TOKEN, type: "password" },
    { backendKey: K.KEY_POST_EXPIRATION_TIME, type: "number" },
    { backendKey: K.KEY_POST_DEFAULT_COVER, type: "string" },
    { backendKey: K.KEY_POST_DOUBLE_COLUMN, type: "boolean" },
    { backendKey: K.KEY_POST_PAGE_SIZE, type: "number", defaultValue: "12" },
    { backendKey: K.KEY_POST_ENABLE_PRIMARY_COLOR, type: "boolean" },
    { backendKey: K.KEY_POST_404_IMAGE, type: "string" },
    { backendKey: K.KEY_POST_REWARD_ENABLE, type: "boolean" },
    { backendKey: K.KEY_POST_REWARD_WECHAT_QR, type: "string" },
    { backendKey: K.KEY_POST_REWARD_ALIPAY_QR, type: "string" },
    { backendKey: K.KEY_POST_REWARD_WECHAT_ENABLE, type: "boolean" },
    { backendKey: K.KEY_POST_REWARD_ALIPAY_ENABLE, type: "boolean" },
    { backendKey: K.KEY_POST_REWARD_BUTTON_TEXT, type: "string", defaultValue: "打赏" },
    { backendKey: K.KEY_POST_REWARD_TITLE, type: "string" },
    { backendKey: K.KEY_POST_REWARD_WECHAT_LABEL, type: "string", defaultValue: "微信" },
    { backendKey: K.KEY_POST_REWARD_ALIPAY_LABEL, type: "string", defaultValue: "支付宝" },
    { backendKey: K.KEY_POST_REWARD_LIST_BTN_TEXT, type: "string" },
    { backendKey: K.KEY_POST_REWARD_LIST_BTN_DESC, type: "string" },
    { backendKey: K.KEY_POST_CODE_MAX_LINES, type: "number", defaultValue: "-1" },
    { backendKey: K.KEY_POST_CODE_MAC_STYLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_POST_COPY_ENABLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_POST_COPY_COPYRIGHT_ENABLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_POST_COPY_COPYRIGHT_ORIGINAL, type: "string" },
    { backendKey: K.KEY_POST_COPY_COPYRIGHT_REPRINT, type: "string" },
    { backendKey: K.KEY_POST_TOC_HASH_MODE, type: "string", defaultValue: "replace" },
    { backendKey: K.KEY_POST_WAVES_ENABLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_POST_COPYRIGHT_ORIGINAL, type: "code", defaultValue: DEFAULT_POST_COPYRIGHT_TEMPLATE_ORIGINAL },
    {
      backendKey: K.KEY_POST_COPYRIGHT_REPRINT_WITH_URL,
      type: "code",
      defaultValue: DEFAULT_POST_COPYRIGHT_TEMPLATE_REPRINT_WITH_URL,
    },
    {
      backendKey: K.KEY_POST_COPYRIGHT_REPRINT_NO_URL,
      type: "code",
      defaultValue: DEFAULT_POST_COPYRIGHT_TEMPLATE_REPRINT_NO_URL,
    },
    { backendKey: K.KEY_POST_SHOW_REWARD_BTN, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_POST_SHOW_SHARE_BTN, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_POST_SHOW_SUBSCRIBE_BTN, type: "boolean" },
    { backendKey: K.KEY_POST_SUBSCRIBE_ENABLE, type: "boolean" },
    { backendKey: K.KEY_POST_SUBSCRIBE_BTN_TEXT, type: "string" },
    { backendKey: K.KEY_POST_SUBSCRIBE_TITLE, type: "string" },
    { backendKey: K.KEY_POST_SUBSCRIBE_DESC, type: "string" },
    { backendKey: K.KEY_POST_SUBSCRIBE_MAIL_SUBJECT, type: "string" },
    {
      backendKey: K.KEY_POST_SUBSCRIBE_MAIL_TEMPLATE,
      type: "code",
      defaultValue: DEFAULT_POST_SUBSCRIBE_MAIL_TEMPLATE,
    },
    { backendKey: K.KEY_CDN_ENABLE, type: "boolean" },
    { backendKey: K.KEY_CDN_PROVIDER, type: "string" },
    { backendKey: K.KEY_CDN_SECRET_ID, type: "password" },
    { backendKey: K.KEY_CDN_SECRET_KEY, type: "password" },
    { backendKey: K.KEY_CDN_REGION, type: "string" },
    { backendKey: K.KEY_CDN_DOMAIN, type: "string" },
    { backendKey: K.KEY_CDN_ZONE_ID, type: "string" },
    { backendKey: K.KEY_CDN_BASE_URL, type: "string" },
    { backendKey: K.KEY_MULTI_AUTHOR_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_MULTI_AUTHOR_NEED_REVIEW, type: "boolean", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_NOTIFY_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_NOTIFY_EMAIL, type: "boolean", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_NOTIFY_PUSH, type: "boolean", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_PUSH_CHANNEL, type: "string", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_PUSH_URL, type: "string", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_WEBHOOK_BODY, type: "code", isPro: true },
    { backendKey: K.KEY_ARTICLE_REVIEW_WEBHOOK_HEADERS, type: "code", isPro: true },
    {
      backendKey: K.KEY_ARTICLE_REVIEW_MAIL_SUBJECT_APPROVED,
      type: "string",
      defaultValue: "【{{.SiteName}}】您的文章已通过审核",
      isPro: true,
    },
    {
      backendKey: K.KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED,
      type: "code",
      defaultValue: DEFAULT_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED,
      isPro: true,
    },
    {
      backendKey: K.KEY_ARTICLE_REVIEW_MAIL_SUBJECT_REJECTED,
      type: "string",
      defaultValue: "【{{.SiteName}}】您的文章审核未通过",
      isPro: true,
    },
    {
      backendKey: K.KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED,
      type: "code",
      defaultValue: DEFAULT_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED,
      isPro: true,
    },
  ],
  "content-file": [
    { backendKey: K.KEY_UPLOAD_ALLOWED_EXTENSIONS, type: "string" },
    { backendKey: K.KEY_UPLOAD_DENIED_EXTENSIONS, type: "string" },
    { backendKey: K.KEY_ENABLE_VIPS_GENERATOR, type: "boolean" },
    { backendKey: K.KEY_VIPS_PATH, type: "string" },
    { backendKey: K.KEY_VIPS_MAX_FILE_SIZE, type: "number" },
    { backendKey: K.KEY_VIPS_SUPPORTED_EXTS, type: "string" },
    { backendKey: K.KEY_ENABLE_MUSIC_COVER_GENERATOR, type: "boolean" },
    { backendKey: K.KEY_MUSIC_COVER_MAX_FILE_SIZE, type: "number" },
    { backendKey: K.KEY_MUSIC_COVER_SUPPORTED_EXTS, type: "string" },
    { backendKey: K.KEY_ENABLE_FFMPEG_GENERATOR, type: "boolean" },
    { backendKey: K.KEY_FFMPEG_PATH, type: "string" },
    { backendKey: K.KEY_FFMPEG_MAX_FILE_SIZE, type: "number" },
    { backendKey: K.KEY_FFMPEG_SUPPORTED_EXTS, type: "string" },
    { backendKey: K.KEY_FFMPEG_CAPTURE_TIME, type: "string" },
    { backendKey: K.KEY_ENABLE_LIBRAW_GENERATOR, type: "boolean" },
    { backendKey: K.KEY_LIBRAW_PATH, type: "string" },
    { backendKey: K.KEY_LIBRAW_MAX_FILE_SIZE, type: "number" },
    { backendKey: K.KEY_LIBRAW_SUPPORTED_EXTS, type: "string" },
    { backendKey: K.KEY_ENABLE_BUILTIN_GENERATOR, type: "boolean" },
    { backendKey: K.KEY_BUILTIN_MAX_FILE_SIZE, type: "number" },
    { backendKey: K.KEY_BUILTIN_DIRECT_SERVE_EXTS, type: "string" },
    { backendKey: K.KEY_QUEUE_THUMB_CONCURRENCY, type: "number" },
    { backendKey: K.KEY_QUEUE_THUMB_MAX_EXEC_TIME, type: "number" },
    { backendKey: K.KEY_QUEUE_THUMB_BACKOFF_FACTOR, type: "number" },
    { backendKey: K.KEY_QUEUE_THUMB_MAX_BACKOFF, type: "number" },
    { backendKey: K.KEY_QUEUE_THUMB_MAX_RETRIES, type: "number" },
    { backendKey: K.KEY_QUEUE_THUMB_RETRY_DELAY, type: "number" },
    { backendKey: K.KEY_ENABLE_EXIF_EXTRACTOR, type: "boolean" },
    { backendKey: K.KEY_EXIF_MAX_SIZE_LOCAL, type: "number" },
    { backendKey: K.KEY_EXIF_MAX_SIZE_REMOTE, type: "number" },
    { backendKey: K.KEY_EXIF_USE_BRUTE_FORCE, type: "boolean" },
    { backendKey: K.KEY_ENABLE_MUSIC_EXTRACTOR, type: "boolean" },
    { backendKey: K.KEY_MUSIC_MAX_SIZE_LOCAL, type: "number" },
    { backendKey: K.KEY_MUSIC_MAX_SIZE_REMOTE, type: "number" },
  ],
  "user-comment": [
    { backendKey: K.KEY_COMMENT_ENABLE, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_COMMENT_LOGIN_REQUIRED, type: "boolean" },
    { backendKey: K.KEY_COMMENT_PAGE_SIZE, type: "number", defaultValue: "10" },
    { backendKey: K.KEY_COMMENT_MASTER_TAG, type: "string", defaultValue: "博主" },
    { backendKey: K.KEY_COMMENT_PLACEHOLDER, type: "string" },
    { backendKey: K.KEY_COMMENT_EMOJI_CDN, type: "string" },
    { backendKey: K.KEY_COMMENT_BLOGGER_EMAIL, type: "string" },
    { backendKey: K.KEY_COMMENT_ANONYMOUS_EMAIL, type: "string" },
    { backendKey: K.KEY_COMMENT_SHOW_UA, type: "boolean" },
    { backendKey: K.KEY_COMMENT_SHOW_REGION, type: "boolean" },
    { backendKey: K.KEY_COMMENT_ALLOW_IMAGE_UPLOAD, type: "boolean" },
    { backendKey: K.KEY_COMMENT_LIMIT_PER_MINUTE, type: "number", defaultValue: "3" },
    { backendKey: K.KEY_COMMENT_LIMIT_LENGTH, type: "number", defaultValue: "500" },
    { backendKey: K.KEY_COMMENT_FORBIDDEN_WORDS, type: "string" },
    { backendKey: K.KEY_COMMENT_AI_DETECT_ENABLE, type: "boolean" },
    { backendKey: K.KEY_COMMENT_AI_DETECT_API_URL, type: "string" },
    { backendKey: K.KEY_COMMENT_AI_DETECT_ACTION, type: "string" },
    { backendKey: K.KEY_COMMENT_AI_DETECT_RISK_LEVEL, type: "string" },
    { backendKey: K.KEY_COMMENT_QQ_API_URL, type: "string" },
    { backendKey: K.KEY_COMMENT_QQ_API_KEY, type: "password" },
    { backendKey: K.KEY_COMMENT_NOTIFY_ADMIN, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_COMMENT_NOTIFY_REPLY, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_COMMENT_SMTP_SENDER_NAME, type: "string" },
    { backendKey: K.KEY_COMMENT_SMTP_SENDER_EMAIL, type: "string" },
    { backendKey: K.KEY_COMMENT_SMTP_HOST, type: "string" },
    { backendKey: K.KEY_COMMENT_SMTP_PORT, type: "number" },
    { backendKey: K.KEY_COMMENT_SMTP_USER, type: "string" },
    { backendKey: K.KEY_COMMENT_SMTP_PASS, type: "password" },
    { backendKey: K.KEY_COMMENT_SMTP_SECURE, type: "boolean" },
    { backendKey: K.KEY_PUSHOO_CHANNEL, type: "string" },
    { backendKey: K.KEY_PUSHOO_URL, type: "string" },
    { backendKey: K.KEY_WEBHOOK_REQUEST_BODY, type: "code" },
    { backendKey: K.KEY_WEBHOOK_HEADERS, type: "code" },
    { backendKey: K.KEY_SC_MAIL_NOTIFY, type: "boolean" },
    { backendKey: K.KEY_COMMENT_MAIL_SUBJECT, type: "string" },
    { backendKey: K.KEY_COMMENT_MAIL_TEMPLATE, type: "code" },
    { backendKey: K.KEY_COMMENT_MAIL_SUBJECT_ADMIN, type: "string" },
    { backendKey: K.KEY_COMMENT_MAIL_TEMPLATE_ADMIN, type: "code" },
  ],
  "user-email": [
    { backendKey: K.KEY_SMTP_HOST, type: "string" },
    { backendKey: K.KEY_SMTP_PORT, type: "number", defaultValue: "465" },
    { backendKey: K.KEY_SMTP_USERNAME, type: "string" },
    { backendKey: K.KEY_SMTP_PASSWORD, type: "password" },
    { backendKey: K.KEY_SMTP_SENDER_NAME, type: "string" },
    { backendKey: K.KEY_SMTP_SENDER_EMAIL, type: "string" },
    { backendKey: K.KEY_SMTP_REPLY_TO_EMAIL, type: "string" },
    { backendKey: K.KEY_SMTP_FORCE_SSL, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_RESET_PASSWORD_SUBJECT, type: "string" },
    { backendKey: K.KEY_RESET_PASSWORD_TEMPLATE, type: "code" },
    { backendKey: K.KEY_ACTIVATE_ACCOUNT_SUBJECT, type: "string" },
    { backendKey: K.KEY_ACTIVATE_ACCOUNT_TEMPLATE, type: "code" },
    { backendKey: K.KEY_ENABLE_USER_ACTIVATION, type: "boolean" },
  ],
  "integration-oauth": [
    { backendKey: K.KEY_SITE_URL, type: "string" }, // 用于计算回调地址
    { backendKey: K.KEY_QQ_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_QQ_APP_ID, type: "string", isPro: true },
    { backendKey: K.KEY_QQ_APP_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_QQ_AUTO_REGISTER, type: "boolean", isPro: true },
    { backendKey: K.KEY_QQ_CALLBACK_URL, type: "string", isPro: true },
    { backendKey: K.KEY_WECHAT_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_WECHAT_APP_ID, type: "string", isPro: true },
    { backendKey: K.KEY_WECHAT_APP_SECRET, type: "password", isPro: true },
    { backendKey: K.KEY_WECHAT_LOGIN_MODE, type: "string", isPro: true },
    { backendKey: K.KEY_WECHAT_TOKEN, type: "password", isPro: true },
    { backendKey: K.KEY_WECHAT_ENCODING_AES_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_WECHAT_QRCODE_LOGIN_REPLY, type: "string", isPro: true },
    { backendKey: K.KEY_WECHAT_QRCODE_BIND_REPLY, type: "string", isPro: true },
    { backendKey: K.KEY_WECHAT_AUTO_REGISTER, type: "boolean", isPro: true },
    { backendKey: K.KEY_WECHAT_CALLBACK_URL, type: "string", isPro: true },
    { backendKey: K.KEY_LOGTO_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_LOGTO_APP_ID, type: "string", isPro: true },
    { backendKey: K.KEY_LOGTO_APP_SECRET, type: "password", isPro: true },
    { backendKey: K.KEY_LOGTO_ENDPOINT, type: "string", isPro: true },
    { backendKey: K.KEY_LOGTO_DIRECT_CONNECTOR, type: "string", isPro: true },
    { backendKey: K.KEY_LOGTO_DISPLAY_NAME, type: "string", isPro: true },
    { backendKey: K.KEY_LOGTO_AUTO_REGISTER, type: "boolean", isPro: true },
    { backendKey: K.KEY_LOGTO_CALLBACK_URL, type: "string", isPro: true },
    { backendKey: K.KEY_OIDC_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_OIDC_CLIENT_ID, type: "string", isPro: true },
    { backendKey: K.KEY_OIDC_CLIENT_SECRET, type: "password", isPro: true },
    { backendKey: K.KEY_OIDC_SCOPE, type: "string", isPro: true },
    { backendKey: K.KEY_OIDC_WELLKNOWN, type: "string", isPro: true },
    { backendKey: K.KEY_OIDC_DISPLAY_NAME, type: "string", isPro: true },
    { backendKey: K.KEY_OIDC_AUTO_REGISTER, type: "boolean", isPro: true },
    { backendKey: K.KEY_OIDC_CALLBACK_URL, type: "string", isPro: true },
    { backendKey: K.KEY_RAINBOW_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_RAINBOW_API_URL, type: "string", isPro: true },
    { backendKey: K.KEY_RAINBOW_APP_ID, type: "string", isPro: true },
    { backendKey: K.KEY_RAINBOW_APP_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_RAINBOW_LOGIN_METHODS, type: "string", isPro: true },
    { backendKey: K.KEY_RAINBOW_CALLBACK_URL, type: "string", isPro: true },
  ],
  "integration-seo": [
    { backendKey: K.KEY_SEO_AUTO_SUBMIT, type: "boolean", isPro: true },
    { backendKey: K.KEY_SEO_BAIDU_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_SEO_BAIDU_SITE, type: "string", isPro: true },
    { backendKey: K.KEY_SEO_BAIDU_TOKEN, type: "password", isPro: true },
    { backendKey: K.KEY_SEO_BING_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_SEO_BING_API_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_SEO_BING_SITE_URL, type: "string", isPro: true },
    { backendKey: K.KEY_SEO_GOOGLE_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_SEO_GOOGLE_CREDENTIAL, type: "code", isPro: true },
    { backendKey: K.KEY_SEO_RETRY_TIMES, type: "number", defaultValue: "3", isPro: true },
    { backendKey: K.KEY_SEO_RETRY_INTERVAL, type: "number", defaultValue: "5", isPro: true },
  ],
  "pages-flink": [
    { backendKey: K.KEY_FRIEND_LINK_DEFAULT_CATEGORY, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_APPLY_CONDITION, type: "json" },
    { backendKey: K.KEY_FRIEND_LINK_APPLY_CUSTOM_CODE, type: "code" },
    { backendKey: K.KEY_FRIEND_LINK_APPLY_CUSTOM_CODE_HTML, type: "code" },
    { backendKey: K.KEY_FRIEND_LINK_PLACEHOLDER_NAME, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_PLACEHOLDER_URL, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_PLACEHOLDER_LOGO, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_PLACEHOLDER_DESC, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_PLACEHOLDER_SITESHOT, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_NOTIFY_ADMIN, type: "boolean" },
    { backendKey: K.KEY_FRIEND_LINK_SC_MAIL_NOTIFY, type: "boolean" },
    { backendKey: K.KEY_FRIEND_LINK_PUSHOO_CHANNEL, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_PUSHOO_URL, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_WEBHOOK_BODY, type: "code" },
    { backendKey: K.KEY_FRIEND_LINK_WEBHOOK_HEADERS, type: "code" },
    { backendKey: K.KEY_FRIEND_LINK_MAIL_SUBJECT_ADMIN, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_MAIL_TEMPLATE_ADMIN, type: "code" },
    { backendKey: K.KEY_FRIEND_LINK_REVIEW_MAIL_ENABLE, type: "boolean" },
    { backendKey: K.KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_APPROVED, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_APPROVED, type: "code" },
    { backendKey: K.KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_REJECTED, type: "string" },
    { backendKey: K.KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_REJECTED, type: "code" },
  ],
  "pages-about": [
    { backendKey: K.KEY_ABOUT_NAME, type: "string" },
    { backendKey: K.KEY_ABOUT_DESCRIPTION, type: "string" },
    { backendKey: K.KEY_ABOUT_AVATAR_IMG, type: "string" },
    { backendKey: K.KEY_ABOUT_SUBTITLE, type: "string" },
    { backendKey: K.KEY_ABOUT_AVATAR_SKILLS_LEFT, type: "json" },
    { backendKey: K.KEY_ABOUT_AVATAR_SKILLS_RIGHT, type: "json" },
    { backendKey: K.KEY_ABOUT_SITE_TIPS, type: "json" },
    { backendKey: K.KEY_ABOUT_MAP, type: "json" },
    { backendKey: K.KEY_ABOUT_SELF_INFO, type: "json" },
    { backendKey: K.KEY_ABOUT_PERSONALITIES, type: "json" },
    { backendKey: K.KEY_ABOUT_MAXIM, type: "json" },
    { backendKey: K.KEY_ABOUT_BUFF, type: "json" },
    { backendKey: K.KEY_ABOUT_GAME, type: "json" },
    { backendKey: K.KEY_ABOUT_COMIC, type: "json" },
    { backendKey: K.KEY_ABOUT_LIKE, type: "json" },
    { backendKey: K.KEY_ABOUT_MUSIC, type: "json" },
    { backendKey: K.KEY_ABOUT_CAREERS, type: "json" },
    { backendKey: K.KEY_ABOUT_SKILLS_TIPS, type: "json" },
    { backendKey: K.KEY_ABOUT_STATISTICS_BG, type: "string" },
    { backendKey: K.KEY_ABOUT_CUSTOM_CODE, type: "code" },
    { backendKey: K.KEY_ABOUT_CUSTOM_CODE_HTML, type: "code" },
    { backendKey: K.KEY_ABOUT_ENABLE_AUTHOR_BOX, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_PAGE_CONTENT, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_SKILLS, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_CAREERS, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_STATISTIC, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_MAP_INFO, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_PERSONALITY, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_PHOTO, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_MAXIM, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_BUFF, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_GAME, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_COMIC, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_LIKE_TECH, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_MUSIC, type: "boolean", defaultValue: "true" },
    { backendKey: K.KEY_ABOUT_ENABLE_CUSTOM_CODE, type: "boolean" },
    { backendKey: K.KEY_ABOUT_ENABLE_COMMENT, type: "boolean", defaultValue: "true" },
  ],
  "pages-equipment": [
    { backendKey: K.KEY_EQUIPMENT_BANNER_BG, type: "string" },
    { backendKey: K.KEY_EQUIPMENT_BANNER_TITLE, type: "string" },
    { backendKey: K.KEY_EQUIPMENT_BANNER_DESC, type: "string" },
    { backendKey: K.KEY_EQUIPMENT_BANNER_TIP, type: "string" },
    { backendKey: K.KEY_EQUIPMENT_LIST, type: "json" },
  ],
  "pages-comments": [
    { backendKey: K.KEY_RECENT_COMMENTS_BANNER_BG, type: "string" },
    { backendKey: K.KEY_RECENT_COMMENTS_BANNER_TITLE, type: "string" },
    { backendKey: K.KEY_RECENT_COMMENTS_BANNER_DESC, type: "string" },
    { backendKey: K.KEY_RECENT_COMMENTS_BANNER_TIP, type: "string" },
  ],
  "pages-essay": [
    { backendKey: K.KEY_ESSAY_TITLE, type: "string", isPro: true },
    { backendKey: K.KEY_ESSAY_SUBTITLE, type: "string", isPro: true },
    { backendKey: K.KEY_ESSAY_TIPS, type: "string", isPro: true },
    { backendKey: K.KEY_ESSAY_BUTTON_TEXT, type: "string", isPro: true },
    { backendKey: K.KEY_ESSAY_BUTTON_LINK, type: "string", isPro: true },
    { backendKey: K.KEY_ESSAY_LIMIT, type: "number", isPro: true },
    { backendKey: K.KEY_ESSAY_HOME_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_ESSAY_TOP_BACKGROUND, type: "string", isPro: true },
  ],
  "pages-moments": [
    { backendKey: K.KEY_MOMENTS_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_MOMENTS_TITLE, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_SUBTITLE, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_TIPS, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_BUTTON_TEXT, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_BUTTON_LINK, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_TOP_BACKGROUND, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_FETCH_INTERVAL, type: "number", isPro: true },
    { backendKey: K.KEY_MOMENTS_MAX_ITEMS, type: "number", isPro: true },
    { backendKey: K.KEY_MOMENTS_DISPLAY_LIMIT, type: "number", isPro: true },
    { backendKey: K.KEY_MOMENTS_CACHE_DURATION, type: "number", isPro: true },
    { backendKey: K.KEY_MOMENTS_RSS_TIMEOUT, type: "number", isPro: true },
    { backendKey: K.KEY_MOMENTS_MIN_FETCH_INTERVAL, type: "number", isPro: true },
    { backendKey: K.KEY_MOMENTS_NOTIFY_ADMIN, type: "boolean", isPro: true },
    { backendKey: K.KEY_MOMENTS_SC_MAIL_NOTIFY, type: "boolean", isPro: true },
    { backendKey: K.KEY_MOMENTS_PUSHOO_CHANNEL, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_PUSHOO_URL, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_WEBHOOK_BODY, type: "code", isPro: true },
    { backendKey: K.KEY_MOMENTS_WEBHOOK_HEADERS, type: "code", isPro: true },
    { backendKey: K.KEY_MOMENTS_MAIL_SUBJECT_ADMIN, type: "string", isPro: true },
    { backendKey: K.KEY_MOMENTS_MAIL_TEMPLATE_ADMIN, type: "code", isPro: true },
  ],
  "pages-album": [
    { backendKey: K.KEY_ALBUM_BANNER_BG, type: "string" },
    { backendKey: K.KEY_ALBUM_BANNER_TITLE, type: "string" },
    { backendKey: K.KEY_ALBUM_BANNER_DESC, type: "string" },
    { backendKey: K.KEY_ALBUM_BANNER_TIP, type: "string" },
    { backendKey: K.KEY_ALBUM_LAYOUT_MODE, type: "string" },
    { backendKey: K.KEY_ALBUM_WATERFALL_COLUMNS, type: "json" },
    { backendKey: K.KEY_ALBUM_WATERFALL_GAP, type: "number" },
    { backendKey: K.KEY_ALBUM_PAGE_SIZE, type: "number", defaultValue: "20" },
    { backendKey: K.KEY_ALBUM_ENABLE_COMMENT, type: "boolean" },
    { backendKey: K.KEY_ALBUM_API_URL, type: "string" },
    { backendKey: K.KEY_ALBUM_DEFAULT_THUMB_PARAM, type: "string" },
    { backendKey: K.KEY_ALBUM_DEFAULT_BIG_PARAM, type: "string" },
  ],
  "pages-music": [
    { backendKey: K.KEY_MUSIC_PLAYER_ENABLE, type: "boolean" },
    { backendKey: K.KEY_MUSIC_PLAYER_PLAYLIST_ID, type: "string" },
    { backendKey: K.KEY_MUSIC_PLAYER_CUSTOM_PLAYLIST, type: "string" },
    { backendKey: K.KEY_MUSIC_CAPSULE_CUSTOM_PLAYLIST, type: "string" },
    { backendKey: K.KEY_MUSIC_API_BASE_URL, type: "string" },
    { backendKey: K.KEY_MUSIC_VINYL_BACKGROUND, type: "string" },
    { backendKey: K.KEY_MUSIC_VINYL_OUTER, type: "string" },
    { backendKey: K.KEY_MUSIC_VINYL_INNER, type: "string" },
    { backendKey: K.KEY_MUSIC_VINYL_NEEDLE, type: "string" },
    { backendKey: K.KEY_MUSIC_VINYL_GROOVE, type: "string" },
  ],
  "advanced-captcha": [
    { backendKey: K.KEY_CAPTCHA_PROVIDER, type: "string", defaultValue: "none" },
    { backendKey: K.KEY_TURNSTILE_ENABLE, type: "boolean" },
    { backendKey: K.KEY_TURNSTILE_SITE_KEY, type: "string" },
    { backendKey: K.KEY_TURNSTILE_SECRET_KEY, type: "password" },
    { backendKey: K.KEY_GEETEST_CAPTCHA_ID, type: "string" },
    { backendKey: K.KEY_GEETEST_CAPTCHA_KEY, type: "password" },
    { backendKey: K.KEY_IMAGE_CAPTCHA_LENGTH, type: "number", defaultValue: "4" },
    { backendKey: K.KEY_IMAGE_CAPTCHA_EXPIRE, type: "number", defaultValue: "300" },
  ],
  "advanced-wechat-share": [
    { backendKey: K.KEY_WECHAT_SHARE_ENABLE, type: "boolean" },
    { backendKey: K.KEY_WECHAT_SHARE_APP_ID, type: "string" },
    { backendKey: K.KEY_WECHAT_SHARE_APP_SECRET, type: "password" },
  ],
  "advanced-ai": [
    { backendKey: K.KEY_AI_SUMMARY_PROVIDER, type: "string", defaultValue: "glm", isPro: true },
    { backendKey: K.KEY_AI_SUMMARY_API_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_AI_SUMMARY_API_URL, type: "string", isPro: true },
    { backendKey: K.KEY_AI_SUMMARY_MODEL, type: "string", isPro: true },
    {
      backendKey: K.KEY_AI_SUMMARY_SYSTEM_PROMPT,
      type: "code",
      defaultValue: DEFAULT_AI_SUMMARY_SYSTEM_PROMPT,
      isPro: true,
    },
    { backendKey: K.KEY_AI_WRITING_PROVIDER, type: "string", defaultValue: "glm", isPro: true },
    { backendKey: K.KEY_AI_WRITING_API_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_AI_WRITING_API_URL, type: "string", isPro: true },
    { backendKey: K.KEY_AI_WRITING_MODEL, type: "string", isPro: true },
    {
      backendKey: K.KEY_AI_WRITING_SYSTEM_PROMPT,
      type: "code",
      defaultValue: DEFAULT_AI_WRITING_SYSTEM_PROMPT,
      isPro: true,
    },
    { backendKey: K.KEY_AI_WRITING_MAX_TOKENS, type: "number", defaultValue: "4096", isPro: true },
    { backendKey: K.KEY_AI_WRITING_TEMPERATURE, type: "string", defaultValue: "0.7", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_PROVIDER, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_APP_ID, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_ACCESS_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_RESOURCE_ID, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_SPEAKER1, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_SPEAKER2, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_USE_HEAD_MUSIC, type: "boolean", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_USE_TAIL_MUSIC, type: "boolean", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_AUDIO_FORMAT, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_SAMPLE_RATE, type: "number", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_SPEECH_RATE, type: "number", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_BUTTON_TEXT, type: "string", isPro: true },
    { backendKey: K.KEY_AI_PODCAST_BUTTON_ICON, type: "string", isPro: true },
    { backendKey: K.KEY_AI_ASSISTANT_ENABLE, type: "boolean", isPro: true },
    { backendKey: K.KEY_AI_ASSISTANT_NAME, type: "string", defaultValue: "AI 助手", isPro: true },
    { backendKey: K.KEY_AI_ASSISTANT_WELCOME, type: "string", defaultValue: "如果有问题欢迎问我哦！", isPro: true },
    {
      backendKey: K.KEY_AI_ASSISTANT_CHAT_SUGGESTIONS,
      type: "json",
      defaultValue: DEFAULT_AI_ASSISTANT_CHAT_SUGGESTIONS,
      isPro: true,
    },
    {
      backendKey: K.KEY_AI_ASSISTANT_SEARCH_SUGGESTIONS,
      type: "json",
      defaultValue: DEFAULT_AI_ASSISTANT_SEARCH_SUGGESTIONS,
      isPro: true,
    },
    { backendKey: K.KEY_AI_ASSISTANT_EMBEDDING_PROVIDER, type: "string", defaultValue: "siliconflow", isPro: true },
    { backendKey: K.KEY_AI_ASSISTANT_EMBEDDING_API_KEY, type: "password", isPro: true },
    { backendKey: K.KEY_AI_ASSISTANT_EMBEDDING_MODEL, type: "string", defaultValue: "BAAI/bge-m3", isPro: true },
    { backendKey: K.KEY_AI_ASSISTANT_VECTOR_STORE, type: "string", defaultValue: "embedded", isPro: true },
    {
      backendKey: K.KEY_AI_ASSISTANT_SYSTEM_PROMPT,
      type: "code",
      defaultValue: DEFAULT_AI_ASSISTANT_SYSTEM_PROMPT,
      isPro: true,
    },
    {
      backendKey: K.KEY_AI_ASSISTANT_USER_PROMPT,
      type: "code",
      defaultValue: DEFAULT_AI_ASSISTANT_USER_PROMPT,
      isPro: true,
    },
    {
      backendKey: K.KEY_AI_ASSISTANT_NO_CONTEXT_PROMPT,
      type: "code",
      defaultValue: DEFAULT_AI_ASSISTANT_NO_CONTEXT_PROMPT,
      isPro: true,
    },
  ],
  "advanced-payment": [], // 支付配置使用独立 API，不通过 settings 系统管理
  "advanced-backup": [],
};
