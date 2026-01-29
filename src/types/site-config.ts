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
  LOGO_HORIZONTAL_DAY?: string;
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

  // Sidebar 配置
  sidebar?: {
    author?: {
      enable?: boolean;
      description?: string;
      statusImg?: string;
      skills?: string[];
      social?: Record<string, { icon: string; link: string }>;
    };
    weather?: {
      enable?: boolean;
      qweather_key?: string;
    };
    tags?: {
      enable?: boolean;
      highlight?: string[];
    };
    siteinfo?: {
      totalPostCount?: number;
      runtimeEnable?: boolean;
      totalWordCount?: number;
    };
    series?: {
      postCount?: number;
    };
  };

  // 页面配置
  page?: {
    one_image?: {
      config?: unknown;
      hitokoto_api?: string;
      typing_speed?: number;
    };
    oneImageConfig?: unknown;
  };

  // 文章配置
  post?: {
    waves?: {
      enable?: boolean;
    };
    default?: {
      cover?: string;
    };
    copyright?: {
      enable?: boolean;
      license?: string;
      license_url?: string;
    };
    copy?: {
      enable?: boolean;
      min_length?: number;
    };
    code_block?: {
      code_max_lines?: number;
    };
    reward?: {
      enable?: boolean;
      button_text?: string;
      title?: string;
      wechat_label?: string;
      alipay_label?: string;
      wechat_qr?: string;
      alipay_qr?: string;
      list_button_text?: string;
      list_button_desc?: string;
    };
    subscribe?: {
      enable?: boolean;
      buttonText?: string;
      dialogTitle?: string;
      dialogDesc?: string;
    };
    page404?: {
      default_image?: string;
    };
  };

  // 评论配置
  comment?: {
    enable?: boolean;
  };

  // 音乐配置
  music?: {
    player?: {
      enable?: boolean;
    };
  };

  // 版权配置
  copyright?: {
    license?: string;
    license_url?: string;
  };

  // 站点配置
  site?: {
    url?: string;
  };

  // 文章多人共创配置
  article?: {
    multi_author?: {
      enable?: boolean | string;
      need_review?: boolean | string;
    };
  };

  // AI 播客配置
  ai_podcast?: {
    button_text?: string;
    button_icon?: string;
  };

  // 验证码配置
  captcha?: {
    provider?: string;
  };

  turnstile?: {
    site_key?: string;
  };

  geetest?: {
    captcha_id?: string;
  };

  // OAuth 配置
  oauth?: {
    qq?: { enable?: boolean };
    wechat?: { enable?: boolean };
    logto?: { enable?: boolean; display_name?: string };
    oidc?: { enable?: boolean; display_name?: string };
    rainbow?: {
      enable?: boolean;
      api_url?: string;
      app_id?: string;
      login_methods?: string;
      callback_url?: string;
    };
  };

  // 即刻配置
  essay?: {
    title?: string;
    subtitle?: string;
    tips?: string;
    button_text?: string;
    button_link?: string;
    limit?: number;
    home_enable?: boolean;
    top_background?: string;
  };

  // 朋友圈配置
  moments?: {
    enable?: boolean;
    title?: string;
    subtitle?: string;
    tips?: string;
    button_text?: string;
    button_link?: string;
    top_background?: string;
  };

  // 最近评论配置
  recent_comments?: {
    enable?: boolean;
    limit?: number;
  };

  // 任意其他配置
  [key: string]: unknown;
}
