import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  BookOpen,
  MessageCircle,
  MessageSquare,
  Image,
  Link2,
  Users,
  ShoppingCart,
  Gift,
  Package,
  Crown,
  HeadphonesIcon,
  Settings,
  HardDrive,
  Palette,
  Brain,
  ChevronRight,
  Home,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export interface AdminMenuItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: AdminMenuItem[];
  badge?: string | number;
  roles?: string[];
  isProFeature?: boolean;
}

export interface AdminMenuGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: AdminMenuItem[];
  rank: number;
}

export const adminMenuConfig: AdminMenuGroup[] = [
  {
    id: "overview",
    label: "概览",
    icon: LayoutDashboard,
    rank: 0,
    items: [
      {
        id: "dashboard",
        label: "首页",
        href: "/admin/dashboard",
        icon: Home,
        roles: ["admin", "user"],
      },
      {
        id: "files",
        label: "文件管理",
        href: "/admin/files",
        icon: FolderOpen,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "content",
    label: "内容管理",
    icon: Newspaper,
    rank: 2,
    items: [
      {
        id: "posts",
        label: "文章管理",
        href: "/admin/posts",
        icon: FileText,
        roles: ["admin", "user"],
      },
      {
        id: "doc-series",
        label: "文档系列",
        href: "/admin/doc-series",
        icon: BookOpen,
        roles: ["admin"],
      },
      {
        id: "essays",
        label: "说说管理",
        href: "/admin/essays",
        icon: MessageCircle,
        roles: ["admin"],
      },
      {
        id: "comments",
        label: "评论管理",
        href: "/admin/comments",
        icon: MessageSquare,
        roles: ["admin"],
      },
      {
        id: "albums",
        label: "相册管理",
        href: "/admin/albums",
        icon: Image,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "interaction",
    label: "互动管理",
    icon: Link2,
    rank: 4,
    items: [
      {
        id: "friends",
        label: "友链管理",
        href: "/admin/friends",
        icon: Link2,
        roles: ["admin"],
      },
      {
        id: "users",
        label: "用户管理",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "business",
    label: "运营管理",
    icon: ShoppingCart,
    rank: 5,
    items: [
      {
        id: "orders",
        label: "订单管理",
        href: "/admin/orders",
        icon: ShoppingCart,
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "donations",
        label: "打赏管理",
        href: "/admin/donations",
        icon: Gift,
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "products",
        label: "商品管理",
        href: "/admin/products",
        icon: Package,
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "memberships",
        label: "会员管理",
        href: "/admin/memberships",
        icon: Crown,
        roles: ["admin"],
        isProFeature: true,
      },
      {
        id: "supports",
        label: "售后工单",
        href: "/admin/supports",
        icon: HeadphonesIcon,
        roles: ["admin"],
        isProFeature: true,
      },
    ],
  },
  {
    id: "system",
    label: "系统管理",
    icon: Settings,
    rank: 6,
    items: [
      {
        id: "settings",
        label: "系统设置",
        href: "/admin/settings",
        icon: Settings,
        roles: ["admin"],
      },
      {
        id: "storage",
        label: "存储策略",
        href: "/admin/storage",
        icon: HardDrive,
        roles: ["admin"],
      },
      {
        id: "themes",
        label: "主题商城",
        href: "/admin/themes",
        icon: Palette,
        roles: ["admin"],
      },
      {
        id: "knowledge",
        label: "知识库管理",
        href: "/admin/knowledge",
        icon: Brain,
        roles: ["admin"],
      },
    ],
  },
];

export { ChevronRight };
