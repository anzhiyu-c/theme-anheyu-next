import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import type { SettingCategoryId } from "@/lib/settings/setting-descriptors";

interface SettingsFormProps {
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  loading: boolean;
}

type LazyForm = LazyExoticComponent<ComponentType<SettingsFormProps>>;

export const settingsFormRegistry: Record<SettingCategoryId, LazyForm> = {
  "site-basic": lazy(() =>
    import("@/components/admin/settings/SiteBasicForm").then(m => ({ default: m.SiteBasicForm }))
  ) as LazyForm,
  "site-icon": lazy(() =>
    import("@/components/admin/settings/SiteIconForm").then(m => ({ default: m.SiteIconForm }))
  ) as LazyForm,
  "appearance-home": lazy(() =>
    import("@/components/admin/settings/HomePageForm").then(m => ({ default: m.HomePageForm }))
  ) as LazyForm,
  "appearance-sidebar": lazy(() =>
    import("@/components/admin/settings/SidebarForm").then(m => ({ default: m.SidebarForm }))
  ) as LazyForm,
  "appearance-page": lazy(() =>
    import("@/components/admin/settings/PageStyleForm").then(m => ({ default: m.PageStyleForm }))
  ) as LazyForm,
  "content-post": lazy(() =>
    import("@/components/admin/settings/PostSettingsForm").then(m => ({ default: m.PostSettingsForm }))
  ) as LazyForm,
  "content-file": lazy(() =>
    import("@/components/admin/settings/FileSettingsForm").then(m => ({ default: m.FileSettingsForm }))
  ) as LazyForm,
  "user-comment": lazy(() =>
    import("@/components/admin/settings/CommentSettingsForm").then(m => ({ default: m.CommentSettingsForm }))
  ) as LazyForm,
  "user-email": lazy(() =>
    import("@/components/admin/settings/EmailSettingsForm").then(m => ({ default: m.EmailSettingsForm }))
  ) as LazyForm,
  "integration-oauth": lazy(() =>
    import("@/components/admin/settings/OAuthForm").then(m => ({ default: m.OAuthForm }))
  ) as LazyForm,
  "integration-seo": lazy(() =>
    import("@/components/admin/settings/SeoSettingsForm").then(m => ({ default: m.SeoSettingsForm }))
  ) as LazyForm,
  "pages-flink": lazy(() =>
    import("@/components/admin/settings/FriendLinkSettingsForm").then(m => ({ default: m.FriendLinkSettingsForm }))
  ) as LazyForm,
  "pages-about": lazy(() =>
    import("@/components/admin/settings/AboutPageForm").then(m => ({ default: m.AboutPageForm }))
  ) as LazyForm,
  "pages-equipment": lazy(() =>
    import("@/components/admin/settings/EquipmentPageForm").then(m => ({ default: m.EquipmentPageForm }))
  ) as LazyForm,
  "pages-comments": lazy(() =>
    import("@/components/admin/settings/RecentCommentsPageForm").then(m => ({ default: m.RecentCommentsPageForm }))
  ) as LazyForm,
  "pages-essay": lazy(() =>
    import("@/components/admin/settings/EssayPageForm").then(m => ({ default: m.EssayPageForm }))
  ) as LazyForm,
  "pages-moments": lazy(() =>
    import("@/components/admin/settings/MomentsPageForm").then(m => ({ default: m.MomentsPageForm }))
  ) as LazyForm,
  "pages-album": lazy(() =>
    import("@/components/admin/settings/AlbumPageForm").then(m => ({ default: m.AlbumPageForm }))
  ) as LazyForm,
  "pages-music": lazy(() =>
    import("@/components/admin/settings/MusicPageForm").then(m => ({ default: m.MusicPageForm }))
  ) as LazyForm,
  "advanced-captcha": lazy(() =>
    import("@/components/admin/settings/CaptchaSettingsForm").then(m => ({ default: m.CaptchaSettingsForm }))
  ) as LazyForm,
  "advanced-wechat-share": lazy(() =>
    import("@/components/admin/settings/WechatShareForm").then(m => ({ default: m.WechatShareForm }))
  ) as LazyForm,
  "advanced-ai": lazy(() =>
    import("@/components/admin/settings/AISettingsForm").then(m => ({ default: m.AISettingsForm }))
  ) as LazyForm,
  "advanced-payment": lazy(() =>
    import("@/components/admin/settings/PaymentSettingsForm").then(m => ({ default: m.PaymentSettingsForm }))
  ) as LazyForm,
  "advanced-backup": lazy(() =>
    import("@/components/admin/settings/BackupImportForm").then(m => ({ default: m.BackupImportForm }))
  ) as LazyForm,
};
