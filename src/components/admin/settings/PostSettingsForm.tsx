"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_IP_API,
  KEY_IP_API_TOKEN,
  KEY_POST_EXPIRATION_TIME,
  KEY_POST_DEFAULT_COVER,
  KEY_POST_DOUBLE_COLUMN,
  KEY_POST_PAGE_SIZE,
  KEY_POST_ENABLE_PRIMARY_COLOR,
  KEY_POST_404_IMAGE,
  KEY_POST_REWARD_ENABLE,
  KEY_POST_REWARD_WECHAT_QR,
  KEY_POST_REWARD_ALIPAY_QR,
  KEY_POST_REWARD_WECHAT_ENABLE,
  KEY_POST_REWARD_ALIPAY_ENABLE,
  KEY_POST_REWARD_BUTTON_TEXT,
  KEY_POST_REWARD_TITLE,
  KEY_POST_REWARD_WECHAT_LABEL,
  KEY_POST_REWARD_ALIPAY_LABEL,
  KEY_POST_REWARD_LIST_BTN_TEXT,
  KEY_POST_REWARD_LIST_BTN_DESC,
  KEY_POST_CODE_MAX_LINES,
  KEY_POST_CODE_MAC_STYLE,
  KEY_POST_COPY_ENABLE,
  KEY_POST_COPY_COPYRIGHT_ENABLE,
  KEY_POST_COPY_COPYRIGHT_ORIGINAL,
  KEY_POST_COPY_COPYRIGHT_REPRINT,
  KEY_POST_TOC_HASH_MODE,
  KEY_POST_WAVES_ENABLE,
  KEY_POST_COPYRIGHT_ORIGINAL,
  KEY_POST_COPYRIGHT_REPRINT_WITH_URL,
  KEY_POST_COPYRIGHT_REPRINT_NO_URL,
  KEY_POST_SHOW_REWARD_BTN,
  KEY_POST_SHOW_SHARE_BTN,
  KEY_POST_SHOW_SUBSCRIBE_BTN,
  KEY_POST_SUBSCRIBE_ENABLE,
  KEY_POST_SUBSCRIBE_BTN_TEXT,
  KEY_POST_SUBSCRIBE_TITLE,
  KEY_POST_SUBSCRIBE_DESC,
  KEY_POST_SUBSCRIBE_MAIL_SUBJECT,
  KEY_POST_SUBSCRIBE_MAIL_TEMPLATE,
  KEY_CDN_ENABLE,
  KEY_CDN_PROVIDER,
  KEY_CDN_SECRET_ID,
  KEY_CDN_SECRET_KEY,
  KEY_CDN_REGION,
  KEY_CDN_DOMAIN,
  KEY_CDN_ZONE_ID,
  KEY_CDN_BASE_URL,
  KEY_MULTI_AUTHOR_ENABLE,
  KEY_MULTI_AUTHOR_NEED_REVIEW,
  KEY_ARTICLE_REVIEW_NOTIFY_ENABLE,
  KEY_ARTICLE_REVIEW_NOTIFY_EMAIL,
  KEY_ARTICLE_REVIEW_NOTIFY_PUSH,
  KEY_ARTICLE_REVIEW_PUSH_CHANNEL,
  KEY_ARTICLE_REVIEW_PUSH_URL,
  KEY_ARTICLE_REVIEW_WEBHOOK_BODY,
  KEY_ARTICLE_REVIEW_WEBHOOK_HEADERS,
  KEY_ARTICLE_REVIEW_MAIL_SUBJECT_APPROVED,
  KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED,
  KEY_ARTICLE_REVIEW_MAIL_SUBJECT_REJECTED,
  KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED,
} from "@/lib/settings/setting-keys";

interface PostSettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function PostSettingsForm({ values, onChange, loading }: PostSettingsFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 基本配置 */}
      <SettingsSection title="基本配置">
        <FormImageUpload
          label="默认封面"
          value={values[KEY_POST_DEFAULT_COVER]}
          onValueChange={v => onChange(KEY_POST_DEFAULT_COVER, v)}
          description="文章没有设置封面时使用的默认封面图"
        />

        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="双栏布局"
            description="文章列表是否使用双栏布局"
            checked={values[KEY_POST_DOUBLE_COLUMN] === "true"}
            onCheckedChange={v => onChange(KEY_POST_DOUBLE_COLUMN, String(v))}
          />
          <FormSwitch
            label="启用主色调标签"
            description="文章列表封面启用主色调标签"
            checked={values[KEY_POST_ENABLE_PRIMARY_COLOR] === "true"}
            onCheckedChange={v => onChange(KEY_POST_ENABLE_PRIMARY_COLOR, String(v))}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="每页文章数"
            placeholder="10"
            value={values[KEY_POST_PAGE_SIZE]}
            onValueChange={v => onChange(KEY_POST_PAGE_SIZE, v)}
          />
          <FormInput
            label="文章过期提示时间（天）"
            placeholder="30"
            value={values[KEY_POST_EXPIRATION_TIME]}
            onValueChange={v => onChange(KEY_POST_EXPIRATION_TIME, v)}
            description="文章超过该天数显示过期提示，0 为不提示"
          />
        </SettingsFieldGroup>

        <FormImageUpload
          label="404 页面图片"
          value={values[KEY_POST_404_IMAGE]}
          onValueChange={v => onChange(KEY_POST_404_IMAGE, v)}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="IP 查询 API"
            placeholder="https://api.example.com/ip"
            value={values[KEY_IP_API]}
            onValueChange={v => onChange(KEY_IP_API, v)}
          />
          <FormInput
            label="IP API Token"
            placeholder="请输入 Token"
            type="password"
            value={values[KEY_IP_API_TOKEN]}
            onValueChange={v => onChange(KEY_IP_API_TOKEN, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 代码块 */}
      <SettingsSection title="代码块">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="代码最大显示行数"
            placeholder="留空则不限制"
            value={values[KEY_POST_CODE_MAX_LINES]}
            onValueChange={v => onChange(KEY_POST_CODE_MAX_LINES, v)}
            description="超过该行数后折叠显示"
          />
          <FormSwitch
            label="Mac 风格代码块"
            description="代码块顶部显示 Mac 风格的三色圆点"
            checked={values[KEY_POST_CODE_MAC_STYLE] === "true"}
            onCheckedChange={v => onChange(KEY_POST_CODE_MAC_STYLE, String(v))}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 复制版权 */}
      <SettingsSection title="复制版权">
        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="启用复制功能"
            description="是否允许用户复制文章内容"
            checked={values[KEY_POST_COPY_ENABLE] === "true"}
            onCheckedChange={v => onChange(KEY_POST_COPY_ENABLE, String(v))}
          />
          <FormSwitch
            label="复制追加版权信息"
            description="复制时自动在内容末尾追加版权声明"
            checked={values[KEY_POST_COPY_COPYRIGHT_ENABLE] === "true"}
            onCheckedChange={v => onChange(KEY_POST_COPY_COPYRIGHT_ENABLE, String(v))}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="原创版权文本"
            placeholder="版权声明：本文为原创..."
            value={values[KEY_POST_COPY_COPYRIGHT_ORIGINAL]}
            onValueChange={v => onChange(KEY_POST_COPY_COPYRIGHT_ORIGINAL, v)}
          />
          <FormInput
            label="转载版权文本"
            placeholder="版权声明：本文为转载..."
            value={values[KEY_POST_COPY_COPYRIGHT_REPRINT]}
            onValueChange={v => onChange(KEY_POST_COPY_COPYRIGHT_REPRINT, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 目录与波浪 */}
      <SettingsSection title="目录与波浪">
        <FormSelect
          label="目录哈希模式"
          value={values[KEY_POST_TOC_HASH_MODE]}
          onValueChange={v => onChange(KEY_POST_TOC_HASH_MODE, v)}
          placeholder="请选择模式"
          description="点击目录时 URL 哈希的更新方式"
        >
          <FormSelectItem key="scroll">scroll（滚动更新）</FormSelectItem>
          <FormSelectItem key="click">click（点击更新）</FormSelectItem>
          <FormSelectItem key="none">none（不更新）</FormSelectItem>
        </FormSelect>

        <FormSwitch
          label="启用波浪效果"
          description="文章页面底部显示波浪动画效果"
          checked={values[KEY_POST_WAVES_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_POST_WAVES_ENABLE, String(v))}
        />
      </SettingsSection>

      {/* 打赏配置 */}
      <SettingsSection title="打赏配置">
        <FormSwitch
          label="启用打赏"
          description="是否在文章底部显示打赏按钮"
          checked={values[KEY_POST_REWARD_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_POST_REWARD_ENABLE, String(v))}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="打赏按钮文本"
            placeholder="打赏"
            value={values[KEY_POST_REWARD_BUTTON_TEXT]}
            onValueChange={v => onChange(KEY_POST_REWARD_BUTTON_TEXT, v)}
          />
          <FormInput
            label="打赏弹窗标题"
            placeholder="感谢您的支持"
            value={values[KEY_POST_REWARD_TITLE]}
            onValueChange={v => onChange(KEY_POST_REWARD_TITLE, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="启用微信打赏"
            checked={values[KEY_POST_REWARD_WECHAT_ENABLE] === "true"}
            onCheckedChange={v => onChange(KEY_POST_REWARD_WECHAT_ENABLE, String(v))}
          />
          <FormSwitch
            label="启用支付宝打赏"
            checked={values[KEY_POST_REWARD_ALIPAY_ENABLE] === "true"}
            onCheckedChange={v => onChange(KEY_POST_REWARD_ALIPAY_ENABLE, String(v))}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormImageUpload
            label="微信收款码"
            value={values[KEY_POST_REWARD_WECHAT_QR]}
            onValueChange={v => onChange(KEY_POST_REWARD_WECHAT_QR, v)}
          />
          <FormImageUpload
            label="支付宝收款码"
            value={values[KEY_POST_REWARD_ALIPAY_QR]}
            onValueChange={v => onChange(KEY_POST_REWARD_ALIPAY_QR, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="微信标签"
            placeholder="微信"
            value={values[KEY_POST_REWARD_WECHAT_LABEL]}
            onValueChange={v => onChange(KEY_POST_REWARD_WECHAT_LABEL, v)}
          />
          <FormInput
            label="支付宝标签"
            placeholder="支付宝"
            value={values[KEY_POST_REWARD_ALIPAY_LABEL]}
            onValueChange={v => onChange(KEY_POST_REWARD_ALIPAY_LABEL, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="打赏列表按钮文本"
            placeholder="查看打赏列表"
            value={values[KEY_POST_REWARD_LIST_BTN_TEXT]}
            onValueChange={v => onChange(KEY_POST_REWARD_LIST_BTN_TEXT, v)}
          />
          <FormInput
            label="打赏列表按钮描述"
            placeholder="感谢以下小伙伴的支持"
            value={values[KEY_POST_REWARD_LIST_BTN_DESC]}
            onValueChange={v => onChange(KEY_POST_REWARD_LIST_BTN_DESC, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 版权区域 */}
      <SettingsSection title="版权区域">
        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="显示打赏按钮"
            checked={values[KEY_POST_SHOW_REWARD_BTN] === "true"}
            onCheckedChange={v => onChange(KEY_POST_SHOW_REWARD_BTN, String(v))}
          />
          <FormSwitch
            label="显示分享按钮"
            checked={values[KEY_POST_SHOW_SHARE_BTN] === "true"}
            onCheckedChange={v => onChange(KEY_POST_SHOW_SHARE_BTN, String(v))}
          />
        </SettingsFieldGroup>

        <FormSwitch
          label="显示订阅按钮"
          checked={values[KEY_POST_SHOW_SUBSCRIBE_BTN] === "true"}
          onCheckedChange={v => onChange(KEY_POST_SHOW_SUBSCRIBE_BTN, String(v))}
        />

        <FormCodeEditor
          label="原创版权模板"
          language="html"
          value={values[KEY_POST_COPYRIGHT_ORIGINAL]}
          onValueChange={v => onChange(KEY_POST_COPYRIGHT_ORIGINAL, v)}
          minRows={6}
        />

        <FormCodeEditor
          label="转载版权模板（有来源链接）"
          language="html"
          value={values[KEY_POST_COPYRIGHT_REPRINT_WITH_URL]}
          onValueChange={v => onChange(KEY_POST_COPYRIGHT_REPRINT_WITH_URL, v)}
          minRows={6}
        />

        <FormCodeEditor
          label="转载版权模板（无来源链接）"
          language="html"
          value={values[KEY_POST_COPYRIGHT_REPRINT_NO_URL]}
          onValueChange={v => onChange(KEY_POST_COPYRIGHT_REPRINT_NO_URL, v)}
          minRows={6}
        />
      </SettingsSection>

      {/* 订阅配置 */}
      <SettingsSection title="订阅配置">
        <FormSwitch
          label="启用订阅"
          description="是否允许用户订阅文章更新通知"
          checked={values[KEY_POST_SUBSCRIBE_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_POST_SUBSCRIBE_ENABLE, String(v))}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="订阅按钮文本"
            placeholder="订阅"
            value={values[KEY_POST_SUBSCRIBE_BTN_TEXT]}
            onValueChange={v => onChange(KEY_POST_SUBSCRIBE_BTN_TEXT, v)}
          />
          <FormInput
            label="订阅弹窗标题"
            placeholder="订阅更新"
            value={values[KEY_POST_SUBSCRIBE_TITLE]}
            onValueChange={v => onChange(KEY_POST_SUBSCRIBE_TITLE, v)}
          />
        </SettingsFieldGroup>

        <FormInput
          label="订阅弹窗描述"
          placeholder="输入邮箱，获取文章更新通知"
          value={values[KEY_POST_SUBSCRIBE_DESC]}
          onValueChange={v => onChange(KEY_POST_SUBSCRIBE_DESC, v)}
        />

        <FormInput
          label="订阅邮件主题"
          placeholder="您订阅的文章有更新"
          value={values[KEY_POST_SUBSCRIBE_MAIL_SUBJECT]}
          onValueChange={v => onChange(KEY_POST_SUBSCRIBE_MAIL_SUBJECT, v)}
        />

        <FormCodeEditor
          label="订阅邮件模板"
          language="html"
          value={values[KEY_POST_SUBSCRIBE_MAIL_TEMPLATE]}
          onValueChange={v => onChange(KEY_POST_SUBSCRIBE_MAIL_TEMPLATE, v)}
          minRows={8}
        />
      </SettingsSection>

      {/* CDN 缓存清除 */}
      <SettingsSection title="CDN 缓存清除">
        <FormSwitch
          label="启用 CDN 缓存清除"
          description="文章发布/更新时自动清除 CDN 缓存"
          checked={values[KEY_CDN_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_CDN_ENABLE, String(v))}
        />

        <FormSelect
          label="CDN 服务商"
          value={values[KEY_CDN_PROVIDER]}
          onValueChange={v => onChange(KEY_CDN_PROVIDER, v)}
          placeholder="请选择 CDN 服务商"
        >
          <FormSelectItem key="tencent">腾讯云 CDN</FormSelectItem>
          <FormSelectItem key="cloudflare">Cloudflare</FormSelectItem>
        </FormSelect>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Secret ID"
            type="password"
            placeholder="请输入 Secret ID"
            value={values[KEY_CDN_SECRET_ID]}
            onValueChange={v => onChange(KEY_CDN_SECRET_ID, v)}
          />
          <FormInput
            label="Secret Key"
            type="password"
            placeholder="请输入 Secret Key"
            value={values[KEY_CDN_SECRET_KEY]}
            onValueChange={v => onChange(KEY_CDN_SECRET_KEY, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="区域"
            placeholder="ap-guangzhou"
            value={values[KEY_CDN_REGION]}
            onValueChange={v => onChange(KEY_CDN_REGION, v)}
          />
          <FormInput
            label="域名"
            placeholder="example.com"
            value={values[KEY_CDN_DOMAIN]}
            onValueChange={v => onChange(KEY_CDN_DOMAIN, v)}
          />
        </SettingsFieldGroup>

        <FormInput
          label="Base URL"
          placeholder="https://api.example.com"
          value={values[KEY_CDN_BASE_URL]}
          onValueChange={v => onChange(KEY_CDN_BASE_URL, v)}
          description="可选，CDN API 自定义地址"
        />

        <FormInput
          label="Zone ID"
          placeholder="Cloudflare Zone ID"
          value={values[KEY_CDN_ZONE_ID]}
          onValueChange={v => onChange(KEY_CDN_ZONE_ID, v)}
          description="仅 Cloudflare 需要填写"
        />
      </SettingsSection>

      {/* 多人共创 */}
      <SettingsSection title="多人共创" description="PRO 功能">
        <FormSwitch
          label="启用多人共创"
          description="允许多位作者协作创作文章"
          isPro
          checked={values[KEY_MULTI_AUTHOR_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_MULTI_AUTHOR_ENABLE, String(v))}
        />
        <FormSwitch
          label="投稿需要审核"
          description="其他作者提交的文章需要管理员审核后才能发布"
          isPro
          checked={values[KEY_MULTI_AUTHOR_NEED_REVIEW] === "true"}
          onCheckedChange={v => onChange(KEY_MULTI_AUTHOR_NEED_REVIEW, String(v))}
        />
      </SettingsSection>

      {/* 审核通知 */}
      <SettingsSection title="审核通知" description="PRO 功能 - 文章审核结果通知配置">
        <FormSwitch
          label="启用审核通知"
          description="文章审核完成后通知作者"
          isPro
          checked={values[KEY_ARTICLE_REVIEW_NOTIFY_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_ARTICLE_REVIEW_NOTIFY_ENABLE, String(v))}
        />
        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="邮件通知"
            description="通过邮件通知审核结果"
            isPro
            checked={values[KEY_ARTICLE_REVIEW_NOTIFY_EMAIL] === "true"}
            onCheckedChange={v => onChange(KEY_ARTICLE_REVIEW_NOTIFY_EMAIL, String(v))}
          />
          <FormSwitch
            label="推送通知"
            description="通过推送渠道通知审核结果"
            isPro
            checked={values[KEY_ARTICLE_REVIEW_NOTIFY_PUSH] === "true"}
            onCheckedChange={v => onChange(KEY_ARTICLE_REVIEW_NOTIFY_PUSH, String(v))}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Pushoo Channel"
            placeholder="请输入推送渠道"
            value={values[KEY_ARTICLE_REVIEW_PUSH_CHANNEL]}
            onValueChange={v => onChange(KEY_ARTICLE_REVIEW_PUSH_CHANNEL, v)}
          />
          <FormInput
            label="Pushoo URL"
            placeholder="请输入推送地址"
            value={values[KEY_ARTICLE_REVIEW_PUSH_URL]}
            onValueChange={v => onChange(KEY_ARTICLE_REVIEW_PUSH_URL, v)}
          />
        </SettingsFieldGroup>

        <FormCodeEditor
          label="Webhook Body"
          language="json"
          value={values[KEY_ARTICLE_REVIEW_WEBHOOK_BODY]}
          onValueChange={v => onChange(KEY_ARTICLE_REVIEW_WEBHOOK_BODY, v)}
          description="审核通知 Webhook 请求体模板"
          minRows={4}
        />
        <FormCodeEditor
          label="Webhook Headers"
          language="json"
          value={values[KEY_ARTICLE_REVIEW_WEBHOOK_HEADERS]}
          onValueChange={v => onChange(KEY_ARTICLE_REVIEW_WEBHOOK_HEADERS, v)}
          description="审核通知 Webhook 请求头"
          minRows={3}
        />

        <FormInput
          label="审核通过邮件主题"
          placeholder="您的文章已通过审核"
          value={values[KEY_ARTICLE_REVIEW_MAIL_SUBJECT_APPROVED]}
          onValueChange={v => onChange(KEY_ARTICLE_REVIEW_MAIL_SUBJECT_APPROVED, v)}
        />
        <FormCodeEditor
          label="审核通过邮件模板"
          language="html"
          value={values[KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED]}
          onValueChange={v => onChange(KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_APPROVED, v)}
          minRows={6}
        />

        <FormInput
          label="审核拒绝邮件主题"
          placeholder="您的文章未通过审核"
          value={values[KEY_ARTICLE_REVIEW_MAIL_SUBJECT_REJECTED]}
          onValueChange={v => onChange(KEY_ARTICLE_REVIEW_MAIL_SUBJECT_REJECTED, v)}
        />
        <FormCodeEditor
          label="审核拒绝邮件模板"
          language="html"
          value={values[KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED]}
          onValueChange={v => onChange(KEY_ARTICLE_REVIEW_MAIL_TEMPLATE_REJECTED, v)}
          minRows={6}
        />
      </SettingsSection>
    </div>
  );
}
