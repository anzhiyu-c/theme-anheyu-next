"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { Icon } from "@iconify/react";
import { Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSiteConfigStore } from "@/store/siteConfigStore";
import { useHeader, useIsMobile } from "@/hooks";

// 子组件
import { HeaderRight } from "./components/HeaderRight";
import { MobileMenu } from "./components/MobileMenu";
import { SearchModal } from "./components/SearchModal";
import { Console } from "./components/Console";
import { BackMenuListGroups } from "./components/BackMenuListGroups";

// 类型和样式
import type { MenuItem, NavConfig, HeaderConfig } from "./types";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const siteConfig = useSiteConfigStore(state => state.siteConfig);
  const isMobile = useIsMobile();

  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 判断是否是文章详情页
  const isPostDetailPage = useMemo(() => {
    return pathname?.startsWith("/posts/");
  }, [pathname]);

  // 判断是否是音乐页
  const isMusicPage = useMemo(() => {
    return pathname === "/music";
  }, [pathname]);

  const { isHeaderTransparent, isScrolled, scrollPercent, isFooterVisible } = useHeader();

  // 是否应该显示白色文字
  const shouldShowTextWhite = useMemo(() => {
    return isHeaderTransparent && (isPostDetailPage || isMusicPage);
  }, [isHeaderTransparent, isPostDetailPage, isMusicPage]);

  // 获取配置
  const headerConfig = useMemo<HeaderConfig | undefined>(() => {
    return siteConfig?.header as HeaderConfig | undefined;
  }, [siteConfig]);

  const navConfig = useMemo<NavConfig | undefined>(() => {
    return headerConfig?.nav;
  }, [headerConfig]);

  const menuConfig = useMemo<MenuItem[]>(() => {
    const menu = headerConfig?.menu;
    return Array.isArray(menu) ? menu : [];
  }, [headerConfig]);

  const siteName = useMemo(() => {
    return siteConfig?.APP_NAME || "AnHeYu";
  }, [siteConfig]);

  const subTitle = useMemo(() => {
    return siteConfig?.SUB_TITLE || "";
  }, [siteConfig]);

  // 完整站点标题（站点名称 - 副标题）
  const fullSiteTitle = useMemo(() => {
    return subTitle ? `${siteName} - ${subTitle}` : siteName;
  }, [siteName, subTitle]);

  // 当前页面标题
  const currentPageTitle = useMemo(() => {
    // 根据路由获取页面标题
    if (pathname === "/") return fullSiteTitle;
    if (pathname?.startsWith("/posts/")) return "文章详情";
    if (pathname === "/archives") return "归档";
    if (pathname === "/categories") return "分类";
    if (pathname === "/tags") return "标签";
    if (pathname === "/about") return "关于";
    if (pathname === "/music") return "音乐";
    if (pathname === "/links") return "友链";
    return fullSiteTitle;
  }, [pathname, fullSiteTitle]);

  // 监听路由变化
  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => {
      setIsRouteChanging(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  // 监听搜索快捷键
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsSearchOpen(true);
    };

    window.addEventListener("frontend-open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("frontend-open-search", handleOpenSearch);
    };
  }, []);

  // 监听移动端菜单切换
  useEffect(() => {
    const handleToggleMobileMenu = () => {
      setIsMobileMenuOpen(prev => !prev);
    };

    window.addEventListener("toggle-mobile-menu", handleToggleMobileMenu);
    return () => {
      window.removeEventListener("toggle-mobile-menu", handleToggleMobileMenu);
    };
  }, []);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // 切换控制台
  const toggleConsole = useCallback(() => {
    setIsConsoleOpen(prev => !prev);
  }, []);

  // 判断菜单类型
  const getMenuType = (menuItem: MenuItem): "direct" | "dropdown" => {
    if (menuItem.type) return menuItem.type;
    return menuItem.items && menuItem.items.length > 0 ? "dropdown" : "direct";
  };

  // 判断是否为图片 URL
  const isImageUrl = (icon?: string) => {
    return icon && (icon.startsWith("http://") || icon.startsWith("https://"));
  };

  // 判断是否为 Iconify 图标（包含 ":"）
  const isIconifyIcon = (icon?: string) => {
    return icon && icon.includes(":");
  };

  // 渲染图标
  const renderIcon = (icon?: string) => {
    if (!icon) return null;

    // 图片 URL
    if (isImageUrl(icon)) {
      return <img src={icon} alt="" className={cn(styles.menuIcon, styles.menuIconImg)} />;
    }

    // Iconify 图标（如 "ri:home-fill"）
    if (isIconifyIcon(icon)) {
      return <Icon icon={icon} width="1em" height="1em" className={cn(styles.menuIcon, styles.menuIconIconify)} />;
    }

    return null;
  };

  return (
    <>
      <header className={styles.frontendHeader}>
        <div
          className={cn(
            styles.headerWrapper,
            isHeaderTransparent && styles.isTransparent,
            shouldShowTextWhite && styles.textIsWhite,
            isScrolled && styles.isScrolled,
            isRouteChanging && styles.isRouteChanging,
            isConsoleOpen && styles.consoleOpen
          )}
        >
          <div className={styles.headerContent}>
            {/* 左侧区域 */}
            <div className={styles.headerLeft}>
              {/* 快捷菜单按钮 - 桌面端显示 */}
              {!isMobile && <BackMenuListGroups navConfig={navConfig} />}

              {/* 站点名称 */}
              <Link href="/" className={styles.siteNameLink} accessKey="h">
                {!isMobile ? (
                  <Tooltip content="返回主页" side="bottom" delayDuration={300}>
                    <div>
                      <span className={styles.siteTitle}>{siteName}</span>
                      <Home size={22} />
                    </div>
                  </Tooltip>
                ) : (
                  <div>
                    <span className={styles.siteTitle}>{siteName}</span>
                    <Home size={22} />
                  </div>
                )}
              </Link>
            </div>

            {/* 页面名称（滚动后显示） */}
            <div className={styles.pageNameMask}>
              {!isMobile ? (
                <Tooltip content="返回顶部" side="bottom" delayDuration={300}>
                  <div className={styles.pageNameContainer} onClick={scrollToTop}>
                    <span className={styles.pageName}>{currentPageTitle}</span>
                  </div>
                </Tooltip>
              ) : (
                <div className={styles.pageNameContainer} onClick={scrollToTop}>
                  <span className={styles.pageName}>{currentPageTitle}</span>
                </div>
              )}
            </div>

            {/* 主导航 */}
            <nav className={styles.mainNav}>
              <div className={styles.menusItems}>
                {menuConfig.map(menuItem => (
                  <div key={menuItem.title} className={styles.menusItem}>
                    {/* 一级菜单：直接跳转 */}
                    {getMenuType(menuItem) === "direct" ? (
                      <Link
                        href={menuItem.path || "#"}
                        target={menuItem.isExternal ? "_blank" : "_self"}
                        rel={menuItem.isExternal ? "noopener noreferrer" : undefined}
                        className={cn(styles.menuTitle, styles.directLink, styles.sitePage)}
                      >
                        {renderIcon(menuItem.icon)}
                        <span>{menuItem.title}</span>
                      </Link>
                    ) : (
                      /* 二级菜单：下拉菜单 */
                      <>
                        <div className={styles.menuTitle}>
                          <span>{menuItem.title}</span>
                        </div>
                        <ul className={styles.menusItemChild}>
                          {menuItem.items?.map(item => (
                            <li key={item.path}>
                              {item.isExternal ||
                              item.path?.startsWith("http://") ||
                              item.path?.startsWith("https://") ? (
                                <a
                                  href={item.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.sitePage}
                                >
                                  {renderIcon(item.icon)}
                                  <span>{item.title}</span>
                                </a>
                              ) : (
                                <Link href={item.path} className={styles.sitePage}>
                                  {renderIcon(item.icon)}
                                  <span>{item.title}</span>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* 右侧操作区 */}
            <HeaderRight
              navConfig={navConfig}
              isTransparent={isHeaderTransparent}
              scrollPercent={scrollPercent}
              isFooterVisible={isFooterVisible}
              isConsoleOpen={isConsoleOpen}
              onToggleConsole={toggleConsole}
            />
          </div>
        </div>
      </header>

      {/* 中控台 */}
      <Console isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />

      {/* 移动端菜单 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navConfig={navConfig}
        menuConfig={menuConfig}
      />

      {/* 搜索弹窗 */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Header;
