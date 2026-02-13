/**
 * 站点配置类型（与 anheyu-pro 后端 API 保持一致）
 */
export interface PageOneImageItem {
  enable?: boolean;
  background?: string;
  mediaType?: "image" | "video";
  mainTitle?: string;
  subTitle?: string;
  typingEffect?: boolean;
  hitokoto?: boolean;
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
  mobileBackground?: string;
  mobileMediaType?: "image" | "video";
  mobileVideoAutoplay?: boolean;
  mobileVideoLoop?: boolean;
  mobileVideoMuted?: boolean;
}

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

  // 页面配置
  page?: {
    one_image?: {
      config?: {
        home?: PageOneImageItem;
        categories?: PageOneImageItem;
        tags?: PageOneImageItem;
        archives?: PageOneImageItem;
      };
      hitokoto_api?: string;
      typing_speed?: number;
    };
    oneImageConfig?: {
      home?: PageOneImageItem;
      categories?: PageOneImageItem;
      tags?: PageOneImageItem;
      archives?: PageOneImageItem;
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

  // 即刻配置
  essay?: {
    home_enable?: boolean;
  };

  // 朋友圈配置
  moments?: {
    title?: string;
    subtitle?: string;
    tips?: string;
    button_text?: string;
    button_link?: string;
    top_background?: string;
    display_limit?: number;
  };

  // 首页顶部配置
  HOME_TOP?: {
    title?: string;
    subTitle?: string;
    siteText?: string;
    category?: Array<{
      name: string;
      path: string;
      icon?: string;
      background?: string;
      isExternal?: boolean;
    }>;
    banner?: {
      tips?: string;
      title?: string;
      image?: string;
      link?: string;
    };
  };

  // 外部链接跳转提醒
  ENABLE_EXTERNAL_LINK_WARNING?: boolean;

  // 创意图标配置
  CREATIVITY?: {
    creativity_list?: Array<{
      name: string;
      icon: string;
      color: string;
    }>;
  };

  // Footer 配置
  footer?: {
    uptime_kuma?: {
      enable?: boolean | string;
      page_url?: string;
    };
    runtime?: {
      enable?: boolean;
      launch_time?: string;
    };
    socialBar?: {
      left?: Array<{ title: string; icon: string; link: string }>;
      right?: Array<{ title: string; icon: string; link: string }>;
      centerImg?: string;
    };
    project?: {
      list?: Array<{
        title: string;
        links: Array<{ title: string; link: string; external?: boolean }>;
      }>;
    };
    list?: {
      randomFriends?: number;
    };
    owner?: {
      name?: string;
      since?: string | number;
    };
    bar?: {
      authorLink?: string;
      linkList?: Array<{ text: string; link: string; external?: boolean }>;
      cc?: {
        link?: string;
      };
    };
  };

  // OAuth 配置
  oauth?: {
    qq?: { enable?: boolean };
    wechat?: { enable?: boolean };
    logto?: { enable?: boolean; display_name?: string };
    oidc?: { enable?: boolean; display_name?: string };
    rainbow?: { enable?: boolean; api_url?: string; app_id?: string; login_methods?: string; callback_url?: string };
  };

  // 侧边栏配置
  sidebar?: {
    author?: {
      enable?: boolean;
      description?: string;
      statusImg?: string;
      skills?: string[];
      social?: Record<string, { icon: string; link: string }>;
    };
    wechat?: {
      enable?: boolean;
      face?: string;
      backFace?: string;
      blurBackground?: string;
      link?: string;
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
    weather?: {
      enable?: boolean;
      enable_page?: string;
      qweather_key?: string;
      qweather_api_host?: string;
      ip_api_key?: string;
      loading?: string;
      default_rectangle?: boolean;
      rectangle?: string;
    };
  };

  // 文章配置
  post?: {
    default?: {
      enable_primary_color_tag?: boolean | string;
      default_cover?: string;
      double_column?: boolean | string;
      page_size?: number;
    };
    // 复制版权配置
    copy?: {
      enable?: boolean;
      copyrightEnable?: boolean;
      copyright_enable?: boolean;
      copyrightOriginal?: string;
      copyright_original?: string;
      copyrightReprint?: string;
      copyright_reprint?: string;
    };
    code_block?: {
      /** 代码块最大显示行数，超过则折叠。-1 表示不折叠 */
      code_max_lines?: number;
      /** 是否启用 Mac 风格 */
      mac_style?: boolean;
    };
    // 打赏配置
    reward?: {
      enable?: boolean;
      button_text?: string;
      title?: string;
      wechat_enable?: boolean;
      wechat_qr?: string;
      wechat_label?: string;
      alipay_enable?: boolean;
      alipay_qr?: string;
      alipay_label?: string;
      list_button_text?: string;
      list_button_desc?: string;
    };
    // 订阅配置
    subscribe?: {
      enable?: boolean;
      buttonText?: string;
      dialogTitle?: string;
      dialogDesc?: string;
    };
    // 版权区域按钮全局开关
    copyright?: {
      showRewardButton?: boolean;
      show_reward_button?: boolean;
      showShareButton?: boolean;
      show_share_button?: boolean;
      showSubscribeButton?: boolean;
      show_subscribe_button?: boolean;
      // 版权声明模板
      originalTemplate?: string;
      original_template?: string;
      reprintTemplateWithUrl?: string;
      reprint_template_with_url?: string;
      reprintTemplateWithoutUrl?: string;
      reprint_template_without_url?: string;
    };
    // 404 页面配置
    page404?: {
      default_image?: string;
    };
  };

  // 评论配置
  comment?: {
    enable?: boolean | string;
    page_size?: number | string;
    placeholder?: string;
    emoji_cdn?: string;
    limit_length?: number | string;
    login_required?: boolean | string;
    anonymous_email?: string;
    allow_image_upload?: boolean | string;
    master_tag?: string;
    show_ua?: boolean | string;
    show_region?: boolean | string;
  };

  // 最近评论页面配置
  recent_comments?: {
    banner?: {
      background?: string;
      title?: string;
      description?: string;
      tip?: string;
    };
  };

  // 友链页面配置
  friend_link?: {
    banner?: {
      background?: string;
      title?: string;
      description?: string;
      tip?: string;
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

  // 任意其他配置
  [key: string]: unknown;
}
