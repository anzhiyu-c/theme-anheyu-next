"use client";

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  Suspense,
  lazy,
  Component,
  type ReactNode,
  type ErrorInfo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, Input, Button } from "@heroui/react";
import {
  Globe,
  Image as ImageIcon,
  Home,
  PanelLeft,
  Paintbrush,
  FileText,
  FolderOpen,
  MessageSquare,
  Mail,
  KeyRound,
  Search,
  Link2,
  UserCircle,
  Monitor,
  MessageCircle,
  Newspaper,
  Users,
  Images,
  Music,
  ShieldCheck,
  Share2,
  Bot,
  Wallet,
  DatabaseBackup,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMultiSettings } from "@/hooks/use-settings";
import { FloatingSaveButton } from "@/components/admin/settings/FloatingSaveButton";
import type { SettingCategoryId } from "@/lib/settings/setting-descriptors";

// ==================== 懒加载表单组件 ====================

const SiteBasicForm = lazy(() =>
  import("@/components/admin/settings/SiteBasicForm").then(m => ({ default: m.SiteBasicForm }))
);
const SiteIconForm = lazy(() =>
  import("@/components/admin/settings/SiteIconForm").then(m => ({ default: m.SiteIconForm }))
);
const HomePageForm = lazy(() =>
  import("@/components/admin/settings/HomePageForm").then(m => ({ default: m.HomePageForm }))
);
const SidebarForm = lazy(() =>
  import("@/components/admin/settings/SidebarForm").then(m => ({ default: m.SidebarForm }))
);
const PageStyleForm = lazy(() =>
  import("@/components/admin/settings/PageStyleForm").then(m => ({ default: m.PageStyleForm }))
);
const PostSettingsForm = lazy(() =>
  import("@/components/admin/settings/PostSettingsForm").then(m => ({ default: m.PostSettingsForm }))
);
const FileSettingsForm = lazy(() =>
  import("@/components/admin/settings/FileSettingsForm").then(m => ({ default: m.FileSettingsForm }))
);
const CommentSettingsForm = lazy(() =>
  import("@/components/admin/settings/CommentSettingsForm").then(m => ({ default: m.CommentSettingsForm }))
);
const EmailSettingsForm = lazy(() =>
  import("@/components/admin/settings/EmailSettingsForm").then(m => ({ default: m.EmailSettingsForm }))
);
const OAuthForm = lazy(() => import("@/components/admin/settings/OAuthForm").then(m => ({ default: m.OAuthForm })));
const SeoSettingsForm = lazy(() =>
  import("@/components/admin/settings/SeoSettingsForm").then(m => ({ default: m.SeoSettingsForm }))
);
const FriendLinkSettingsForm = lazy(() =>
  import("@/components/admin/settings/FriendLinkSettingsForm").then(m => ({ default: m.FriendLinkSettingsForm }))
);
const AboutPageForm = lazy(() =>
  import("@/components/admin/settings/AboutPageForm").then(m => ({ default: m.AboutPageForm }))
);
const EquipmentPageForm = lazy(() =>
  import("@/components/admin/settings/EquipmentPageForm").then(m => ({ default: m.EquipmentPageForm }))
);
const RecentCommentsPageForm = lazy(() =>
  import("@/components/admin/settings/RecentCommentsPageForm").then(m => ({ default: m.RecentCommentsPageForm }))
);
const EssayPageForm = lazy(() =>
  import("@/components/admin/settings/EssayPageForm").then(m => ({ default: m.EssayPageForm }))
);
const MomentsPageForm = lazy(() =>
  import("@/components/admin/settings/MomentsPageForm").then(m => ({ default: m.MomentsPageForm }))
);
const AlbumPageForm = lazy(() =>
  import("@/components/admin/settings/AlbumPageForm").then(m => ({ default: m.AlbumPageForm }))
);
const MusicPageForm = lazy(() =>
  import("@/components/admin/settings/MusicPageForm").then(m => ({ default: m.MusicPageForm }))
);
const CaptchaSettingsForm = lazy(() =>
  import("@/components/admin/settings/CaptchaSettingsForm").then(m => ({ default: m.CaptchaSettingsForm }))
);
const WechatShareForm = lazy(() =>
  import("@/components/admin/settings/WechatShareForm").then(m => ({ default: m.WechatShareForm }))
);
const AISettingsForm = lazy(() =>
  import("@/components/admin/settings/AISettingsForm").then(m => ({ default: m.AISettingsForm }))
);
const PaymentSettingsForm = lazy(() =>
  import("@/components/admin/settings/PaymentSettingsForm").then(m => ({ default: m.PaymentSettingsForm }))
);
const BackupImportForm = lazy(() =>
  import("@/components/admin/settings/BackupImportForm").then(m => ({ default: m.BackupImportForm }))
);

// ==================== ErrorBoundary 组件 ====================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SettingsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Settings form load error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-danger" />
            <div>
              <p className="text-sm font-medium text-foreground">加载失败</p>
              <p className="text-xs text-default-400 mt-1">表单组件加载出错，请刷新页面重试</p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
            >
              重试
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// ==================== 导航结构定义 ====================

interface SubSection {
  id: SettingCategoryId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
}

interface CategorySection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: SubSection[];
}

const categories: CategorySection[] = [
  {
    id: "site",
    label: "站点信息",
    icon: Globe,
    children: [
      { id: "site-basic", label: "基本信息", icon: Globe, keywords: ["站点名称", "描述", "URL", "备案", "公告"] },
      { id: "site-icon", label: "Logo 与图标", icon: ImageIcon, keywords: ["favicon", "logo", "图标", "PWA"] },
    ],
  },
  {
    id: "appearance",
    label: "外观配置",
    icon: Paintbrush,
    children: [
      {
        id: "appearance-home",
        label: "首页设置",
        icon: Home,
        keywords: ["首页", "顶部", "banner", "分类", "页脚", "导航"],
      },
      { id: "appearance-sidebar", label: "侧边栏", icon: PanelLeft, keywords: ["侧边栏", "作者", "标签", "天气"] },
      { id: "appearance-page", label: "页面样式", icon: Paintbrush, keywords: ["外链", "图片", "一图流", "CSS", "JS"] },
    ],
  },
  {
    id: "content",
    label: "内容管理",
    icon: FileText,
    children: [
      { id: "content-post", label: "文章配置", icon: FileText, keywords: ["文章", "封面", "打赏", "代码块", "复制"] },
      { id: "content-file", label: "文件处理", icon: FolderOpen, keywords: ["上传", "缩略图", "EXIF", "视频"] },
    ],
  },
  {
    id: "user",
    label: "用户通知",
    icon: MessageSquare,
    children: [
      { id: "user-comment", label: "评论系统", icon: MessageSquare, keywords: ["评论", "敏感词", "通知", "审核"] },
      { id: "user-email", label: "邮件服务", icon: Mail, keywords: ["SMTP", "邮件", "模板", "激活"] },
    ],
  },
  {
    id: "integration",
    label: "三方服务",
    icon: KeyRound,
    children: [
      {
        id: "integration-oauth",
        label: "第三方登录",
        icon: KeyRound,
        keywords: ["QQ", "微信", "Logto", "OIDC", "彩虹"],
      },
      { id: "integration-seo", label: "SEO 推送", icon: Search, keywords: ["百度", "Bing", "Google", "收录"] },
    ],
  },
  {
    id: "pages",
    label: "页面显示",
    icon: Monitor,
    children: [
      { id: "pages-flink", label: "友链管理", icon: Link2, keywords: ["友链", "申请", "审核"] },
      { id: "pages-about", label: "关于页面", icon: UserCircle, keywords: ["关于", "技能", "生涯"] },
      { id: "pages-equipment", label: "装备页面", icon: Monitor, keywords: ["装备", "好物"] },
      { id: "pages-comments", label: "评论页面", icon: MessageCircle, keywords: ["最近评论"] },
      { id: "pages-essay", label: "即刻页面", icon: Newspaper, keywords: ["即刻", "说说"] },
      { id: "pages-moments", label: "朋友圈页", icon: Users, keywords: ["朋友圈", "RSS"] },
      { id: "pages-album", label: "相册页面", icon: Images, keywords: ["相册", "图片", "瀑布流", "画廊"] },
      { id: "pages-music", label: "音乐页面", icon: Music, keywords: ["音乐", "播放器", "歌单", "胶囊", "唱片"] },
    ],
  },
  {
    id: "advanced",
    label: "高级功能",
    icon: ShieldCheck,
    children: [
      {
        id: "advanced-captcha",
        label: "人机验证",
        icon: ShieldCheck,
        keywords: ["Turnstile", "Cloudflare", "极验", "图片验证码", "captcha"],
      },
      { id: "advanced-wechat-share", label: "微信分享", icon: Share2, keywords: ["微信", "分享", "JS-SDK", "公众号"] },
      { id: "advanced-ai", label: "AI 功能", icon: Bot, keywords: ["AI", "摘要", "写作", "播客", "助手"] },
      {
        id: "advanced-payment",
        label: "支付配置",
        icon: Wallet,
        keywords: ["支付", "支付宝", "微信", "易支付", "虎皮椒", "付费", "PRO"],
      },
      {
        id: "advanced-backup",
        label: "备份导入",
        icon: DatabaseBackup,
        keywords: ["备份", "导入", "导出", "恢复", "配置"],
      },
    ],
  },
];

// 获取所有需要加载的分类 ID（排除使用独立 API 的模块）
const independentApiSections: SettingCategoryId[] = ["advanced-backup", "advanced-payment"];
const allCategoryIds: SettingCategoryId[] = categories.flatMap(c =>
  c.children.map(s => s.id).filter(id => !independentApiSections.includes(id))
);

// ==================== 搜索结果类型 ====================

interface SearchResult {
  sectionId: SettingCategoryId;
  sectionLabel: string;
  categoryId: string;
  categoryLabel: string;
}

// ==================== 表单加载占位 ====================

function FormFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}

// ==================== 主页面 ====================

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string>("site-basic");

  // 搜索相关状态
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 移动端侧边栏
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // 内容区 ref，用于切换时滚动到顶部
  const contentRef = useRef<HTMLDivElement>(null);

  const { values, loading, saving, isDirty, setValue, save, reset, resetCategory, isCategoryDirty } =
    useMultiSettings(allCategoryIds);

  // 获取当前激活的子区域信息
  const currentSection = useMemo(() => {
    for (const cat of categories) {
      const found = cat.children.find(s => s.id === activeSection);
      if (found) return found;
    }
    return null;
  }, [activeSection]);

  // 获取当前 section 所属的 category
  const parentCategory = useMemo(() => {
    for (const cat of categories) {
      if (cat.children.some(s => s.id === activeSection)) {
        return cat;
      }
    }
    return null;
  }, [activeSection]);

  // 获取当前 section 所属的 category 中所有 section ids
  const currentCategorySectionIds = useMemo(() => parentCategory?.children.map(s => s.id) ?? [], [parentCategory]);

  // ==================== 搜索功能 ====================

  const searchIndex = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];
    for (const category of categories) {
      for (const child of category.children) {
        results.push({
          sectionId: child.id,
          sectionLabel: child.label,
          categoryId: category.id,
          categoryLabel: category.label,
        });
      }
    }
    return results;
  }, []);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchKeyword.trim()) return [];
    const keyword = searchKeyword.toLowerCase();

    return searchIndex.filter(item => {
      if (item.sectionLabel.toLowerCase().includes(keyword)) return true;
      if (item.categoryLabel.toLowerCase().includes(keyword)) return true;
      const section = categories.find(c => c.id === item.categoryId)?.children.find(s => s.id === item.sectionId);
      if (section?.keywords?.some(k => k.toLowerCase().includes(keyword))) return true;
      return false;
    });
  }, [searchKeyword, searchIndex]);

  const showSearchResults = isSearchFocused && searchKeyword.trim().length > 0;

  const handleSearchNavigate = useCallback((result: SearchResult) => {
    setActiveSection(result.sectionId);
    setSearchKeyword("");
    setIsSearchFocused(false);
    setShowMobileSidebar(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ==================== 导航功能 ====================

  const selectSection = useCallback((_categoryId: string, sectionId: string) => {
    setActiveSection(sectionId);
    setShowMobileSidebar(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ==================== 重置功能 ====================

  const handleResetCurrent = useCallback(() => {
    if (currentCategorySectionIds.length > 0) {
      resetCategory(currentCategorySectionIds);
    }
  }, [currentCategorySectionIds, resetCategory]);

  const handleResetAll = useCallback(() => {
    reset();
  }, [reset]);

  const isCurrentDirty = useMemo(() => {
    if (currentCategorySectionIds.length === 0) return false;
    return isCategoryDirty(currentCategorySectionIds);
  }, [currentCategorySectionIds, isCategoryDirty]);

  // 表单 props
  const formProps = useMemo(() => ({ values, onChange: setValue, loading }), [values, setValue, loading]);

  // 渲染对应的表单组件
  const renderForm = () => {
    return (
      <SettingsErrorBoundary>
        <Suspense key={activeSection} fallback={<FormFallback />}>
          {activeSection === "site-basic" && <SiteBasicForm {...formProps} />}
          {activeSection === "site-icon" && <SiteIconForm {...formProps} />}
          {activeSection === "appearance-home" && <HomePageForm {...formProps} />}
          {activeSection === "appearance-sidebar" && <SidebarForm {...formProps} />}
          {activeSection === "appearance-page" && <PageStyleForm {...formProps} />}
          {activeSection === "content-post" && <PostSettingsForm {...formProps} />}
          {activeSection === "content-file" && <FileSettingsForm {...formProps} />}
          {activeSection === "user-comment" && <CommentSettingsForm {...formProps} />}
          {activeSection === "user-email" && <EmailSettingsForm {...formProps} />}
          {activeSection === "integration-oauth" && <OAuthForm {...formProps} />}
          {activeSection === "integration-seo" && <SeoSettingsForm {...formProps} />}
          {activeSection === "pages-flink" && <FriendLinkSettingsForm {...formProps} />}
          {activeSection === "pages-about" && <AboutPageForm {...formProps} />}
          {activeSection === "pages-equipment" && <EquipmentPageForm {...formProps} />}
          {activeSection === "pages-comments" && <RecentCommentsPageForm {...formProps} />}
          {activeSection === "pages-essay" && <EssayPageForm {...formProps} />}
          {activeSection === "pages-moments" && <MomentsPageForm {...formProps} />}
          {activeSection === "pages-album" && <AlbumPageForm {...formProps} />}
          {activeSection === "pages-music" && <MusicPageForm {...formProps} />}
          {activeSection === "advanced-captcha" && <CaptchaSettingsForm {...formProps} />}
          {activeSection === "advanced-wechat-share" && <WechatShareForm {...formProps} />}
          {activeSection === "advanced-ai" && <AISettingsForm {...formProps} />}
          {activeSection === "advanced-payment" && <PaymentSettingsForm {...formProps} />}
          {activeSection === "advanced-backup" && <BackupImportForm {...formProps} />}
        </Suspense>
      </SettingsErrorBoundary>
    );
  };

  // ==================== 扁平分组式导航 ====================

  const renderNavigation = () => (
    <nav className="space-y-6" aria-label="设置导航">
      {categories.map(category => (
        <div key={category.id}>
          {/* 分类标签 */}
          <div className="px-3 mb-1">
            <span className="text-[11px] font-semibold text-default-400 uppercase tracking-wider">
              {category.label}
            </span>
          </div>

          {/* 子项列表 */}
          <div className="space-y-0.5">
            {category.children.map(sub => {
              const SubIcon = sub.icon;
              const isActive = activeSection === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => selectSection(category.id, sub.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group w-full flex items-center gap-2.5 px-3 py-[7px] rounded-full text-[13px] transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-default-500 hover:text-foreground hover:bg-default-100/60"
                  )}
                >
                  <SubIcon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-primary" : "text-default-400 group-hover:text-default-500"
                    )}
                  />
                  <span className="truncate">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  // ==================== 搜索组件 ====================

  const renderSearch = () => (
    <div className="relative">
      <Input
        ref={searchInputRef}
        size="sm"
        value={searchKeyword}
        onValueChange={setSearchKeyword}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        placeholder="搜索设置..."
        startContent={<Search className="w-3.5 h-3.5 text-default-400" />}
        classNames={{
          inputWrapper: cn(
            "bg-default-100/40 border border-default-200/50 rounded-full shadow-none! h-9 min-h-9",
            "data-[hover=true]:bg-default-100/60 data-[hover=true]:border-default-300/60",
            "group-data-[focus=true]:border-primary/40 group-data-[focus=true]:bg-white! group-data-[focus=true]:dark:bg-default-50! group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-primary/15",
            "transition-all duration-200"
          ),
          input: "text-[13px] placeholder:text-default-400",
        }}
      />

      {/* 搜索结果下拉 */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1.5 left-0 right-0 bg-background border border-default-200/60 rounded-xl shadow-sm z-50 overflow-hidden"
          >
            {searchResults.length > 0 ? (
              <div className="max-h-[320px] overflow-y-auto p-1">
                {searchResults.map(result => (
                  <button
                    key={result.sectionId}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-default-100 transition-colors"
                    onMouseDown={e => {
                      e.preventDefault();
                      handleSearchNavigate(result);
                    }}
                  >
                    <div className="text-[11px] text-default-400">{result.categoryLabel}</div>
                    <div className="text-[13px] font-medium text-foreground">{result.sectionLabel}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-[13px] text-default-400">
                <Search className="w-5 h-5 mb-1.5 text-default-300" />
                未找到相关设置
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex h-full bg-card rounded-xl border border-default-200/60 overflow-hidden">
      {/* ==================== 左侧导航面板 - 桌面端 ==================== */}
      <aside className="w-[260px] shrink-0 border-r border-default-200/60 bg-default-50/30 flex flex-col max-lg:hidden">
        {/* 搜索框 */}
        <div className="p-3 pb-2">{renderSearch()}</div>

        {/* 导航列表 */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">{renderNavigation()}</div>
      </aside>

      {/* ==================== 右侧内容区 ==================== */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto [scrollbar-gutter:stable] bg-default-50/40 dark:bg-transparent"
      >
        <div className="max-w-3xl mx-auto px-8 py-6 max-md:px-4 max-md:py-4">
          {/* 内容区头部 */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start justify-between mb-8 max-md:mb-6"
          >
            <div>
              {/* 面包屑 */}
              <div className="flex items-center gap-1.5 mb-1.5">
                {/* 移动端菜单触发 */}
                <button
                  className="hidden max-lg:flex items-center justify-center w-6 h-6 -ml-1 mr-0.5 rounded-md hover:bg-default-100 transition-colors"
                  onClick={() => setShowMobileSidebar(true)}
                  aria-label="打开导航菜单"
                >
                  <Menu className="w-4 h-4 text-default-400" />
                </button>
                <span className="text-xs text-default-400">{parentCategory?.label}</span>
                <ChevronRight className="w-3 h-3 text-default-300" />
                <span className="text-xs text-default-600 font-medium">{currentSection?.label}</span>
              </div>

              {/* 页面标题 */}
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{currentSection?.label}</h1>
            </div>

            {/* 重置按钮 */}
            <div className="flex items-center gap-2 mt-1">
              <Tooltip
                content={
                  <div className="px-1 py-0.5">
                    <p className="text-xs font-medium">重置当前分类</p>
                    <p className="text-[11px] text-default-400">撤销当前页面的未保存更改</p>
                  </div>
                }
                placement="bottom"
                delay={400}
              >
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={!isCurrentDirty}
                  onPress={handleResetCurrent}
                  startContent={<RotateCcw className="w-3.5 h-3.5" />}
                  className="h-8 px-3 min-w-0 bg-default-100 text-default-600 hover:bg-default-200 hover:text-default-700 text-xs font-medium"
                >
                  重置当前
                </Button>
              </Tooltip>

              <Tooltip
                content={
                  <div className="px-1 py-0.5">
                    <p className="text-xs font-medium">重置全部更改</p>
                    <p className="text-[11px] text-default-400">撤销所有分类的未保存更改</p>
                  </div>
                }
                placement="bottom"
                delay={400}
              >
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={!isDirty}
                  onPress={handleResetAll}
                  startContent={<RotateCcw className="w-3.5 h-3.5" />}
                  className="h-8 px-3 min-w-0 bg-danger-50 text-danger hover:bg-danger-100 hover:text-danger-600 text-xs font-medium"
                >
                  重置全部
                </Button>
              </Tooltip>
            </div>
          </motion.div>

          {/* 表单内容 */}
          {renderForm()}
        </div>
      </div>

      {/* ==================== 移动端侧边栏抽屉 ==================== */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setShowMobileSidebar(false)}
            />
            {/* 抽屉 */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-default-200/60 shadow-lg flex flex-col"
            >
              {/* 抽屉头部 */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-default-100">
                <span className="text-sm font-semibold text-foreground">设置导航</span>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-default-100 transition-colors"
                  onClick={() => setShowMobileSidebar(false)}
                  aria-label="关闭导航菜单"
                >
                  <X className="w-4 h-4 text-default-500" />
                </button>
              </div>

              {/* 搜索 */}
              <div className="px-3 py-3">{renderSearch()}</div>

              {/* 导航列表 */}
              <div className="flex-1 overflow-y-auto px-2 pb-4">{renderNavigation()}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 悬浮保存按钮 */}
      <FloatingSaveButton hasChanges={isDirty} loading={saving} onSave={save} />
    </div>
  );
}
