/**
 * 站点配置类型（与 anheyu-pro 后端 API 保持一致）
 */
export interface SiteConfigData {
  // 基础配置
  APP_NAME?: string;
  APP_VERSION?: string;
  SUB_TITLE?: string;
  ICP_NUMBER?: string;
  USER_AVATAR?: string;
  ABOUT_LINK?: string;
  API_URL?: string;
  SITE_URL?: string;
  ICON_URL?: string;
  /** 白天模式横向 Logo */
  LOGO_HORIZONTAL_DAY?: string;
  /** 深色模式横向 Logo */
  LOGO_HORIZONTAL_NIGHT?: string;
  LOGO_URL?: string;
  LOGO_URL_192x192?: string;
  LOGO_URL_512x512?: string;
  DEFAULT_THUMB_PARAM?: string;
  DEFAULT_BIG_PARAM?: string;
  SITE_ANNOUNCEMENT?: string;
  GRAVATAR_URL?: string;
  DEFAULT_GRAVATAR_TYPE?: string;
  ENABLE_REGISTRATION?: boolean | string;
  POLICE_RECORD_NUMBER?: string;
  POLICE_RECORD_ICON?: string;

  // 前台配置
  frontDesk?: {
    siteOwner?: {
      name?: string;
      email?: string;
    };
  };

  // Header 配置
  header?: {
    nav?: {
      enable?: boolean;
      travelling?: boolean;
      menu?: Array<{
        title: string;
        items: Array<{
          name: string;
          link: string;
          icon: string;
        }>;
      }>;
    };
    menu?: Array<{
      title: string;
      type?: "direct" | "dropdown";
      path?: string;
      icon?: string;
      isExternal?: boolean;
      items?: Array<{
        title: string;
        path: string;
        icon?: string;
        isExternal?: boolean;
      }>;
    }>;
  };

  // Footer 配置
  footer?: {
    uptime_kuma?: {
      enable?: boolean;
      url?: string;
    };
    runtime?: {
      enable?: boolean;
      launch_time?: string;
    };
  };

  // OAuth 配置
  oauth?: {
    qq?: { enable?: boolean };
    wechat?: { enable?: boolean };
    github?: { enable?: boolean };
    logto?: { enable?: boolean; display_name?: string };
    oidc?: { enable?: boolean; display_name?: string };
  };

  // 任意其他配置
  [key: string]: unknown;
}
