/**
 * 后台管理菜单配置
 * 使用 Iconify 图标格式
 */

export interface AdminMenuItem {
  id: string;
  label: string;
  href?: string;
  icon: string;
  children?: AdminMenuItem[];
  badge?: string | number;
  roles?: string[];
  isProFeature?: boolean;
}

export interface AdminMenuGroup {
  id: string;
  label: string;
  icon: string;
  items: AdminMenuItem[];
  rank: number;
}

export const adminMenuConfig: AdminMenuGroup[] = [
  {
    id: "overview",
    label: "概览",
    icon: "ri:dashboard-line",
    rank: 0,
    items: [
      {
        id: "dashboard",
        label: "首页",
        href: "/admin/dashboard",
        icon: "ri:home-4-line",
        roles: ["admin", "user"],
      },
      {
        id: "files",
        label: "文件管理",
        href: "/admin/files",
        icon: "ri:folder-open-line",
        roles: ["admin"],
      },
    ],
  },
  {
    id: "content",
    label: "内容管理",
    icon: "ri:newspaper-line",
    rank: 2,
    items: [
      {
        id: "posts",
        label: "文章管理",
        href: "/admin/posts",
        icon: "ri:file-text-line",
        roles: ["admin", "user"],
      },
      {
        id: "doc-series",
        label: "文档系列",
        href: "/admin/doc-series",
        icon: "ri:book-open-line",
        roles: ["admin"],
      },
      {
        id: "essays",
        label: "说说管理",
        href: "/admin/essays",
        icon: "ri:chat-smile-2-line",
        roles: ["admin"],
      },
      {
        id: "comments",
        label: "评论管理",
        href: "/admin/comments",
        icon: "ri:chat-3-line",
        roles: ["admin"],
      },
      {
        id: "albums",
        label: "相册管理",
        href: "/admin/albums",
        icon: "ri:image-line",
        roles: ["admin"],
      },
    ],
  },
  {
    id: "interaction",
    label: "互动管理",
    icon: "ri:links-line",
    rank: 4,
    items: [
      {
        id: "friends",
        label: "友链管理",
        href: "/admin/friends",
        icon: "ri:link",
        roles: ["admin"],
      },
      {
        id: "users",
        label: "用户管理",
        href: "/admin/users",
        icon: "ri:user-line",
        roles: ["admin"],
      },
    ],
  },
  {
    id: "business",
    label: "运营管理",
    icon: "ri:shopping-cart-line",
    rank: 5,
    items: [
      {
        id: "orders",
        label: "订单管理",
        href: "/admin/orders",
        icon: "ri:shopping-cart-2-line",
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "donations",
        label: "打赏管理",
        href: "/admin/donations",
        icon: "ri:gift-line",
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "products",
        label: "商品管理",
        href: "/admin/products",
        icon: "ri:box-3-line",
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "memberships",
        label: "会员管理",
        href: "/admin/memberships",
        icon: "ri:vip-crown-line",
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "supports",
        label: "售后工单",
        href: "/admin/supports",
        icon: "ri:headphone-line",
        roles: ["admin"],
        isProFeature: true,
      },
    ],
  },
  {
    id: "system",
    label: "系统管理",
    icon: "ri:settings-3-line",
    rank: 6,
    items: [
      {
        id: "settings",
        label: "系统设置",
        href: "/admin/settings",
        icon: "ri:settings-4-line",
        roles: ["admin"],
      },
      {
        id: "storage",
        label: "存储策略",
        href: "/admin/storage",
        icon: "ri:hard-drive-2-line",
        roles: ["admin"],
      },
      {
        id: "themes",
        label: "主题商城",
        href: "/admin/themes",
        icon: "ri:palette-line",
        roles: ["admin"],
      },
      {
        id: "knowledge",
        label: "知识库管理",
        href: "/admin/knowledge",
        icon: "ri:brain-line",
        roles: ["admin"],
      },
    ],
  },
];
