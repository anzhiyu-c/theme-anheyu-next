"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks";

import styles from "./styles.module.css";
import type { NavConfig } from "../../types";

interface HeaderRightProps {
  navConfig?: NavConfig;
  isTransparent: boolean;
  scrollPercent: number;
  isFooterVisible: boolean;
  isConsoleOpen: boolean;
  onToggleConsole: () => void;
}

export function HeaderRight({
  isTransparent,
  scrollPercent,
  isFooterVisible,
  isConsoleOpen,
  onToggleConsole,
}: HeaderRightProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, roles } = useAuthStore();
  const isMobile = useIsMobile();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // 判断是否显示回到顶部按钮
  const showToTopButton = useMemo(() => !isTransparent, [isTransparent]);

  // 回到顶部文字
  const toTopText = useMemo(() => {
    if (isFooterVisible) return "返回顶部";
    return `${scrollPercent}`;
  }, [isFooterVisible, scrollPercent]);

  // 是否为管理员
  const isAdmin = useMemo(() => {
    return user?.userGroupID === 1 || roles.includes("1");
  }, [user, roles]);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // 打开搜索
  const handleSearchClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("frontend-open-search"));
  }, []);

  // 随机文章
  const handleRandomArticle = useCallback(() => {
    router.push("/posts");
  }, [router]);

  // 切换移动端菜单
  const toggleMobileMenu = useCallback(() => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
  }, []);

  // 处理登出
  const handleLogout = useCallback(() => {
    logout();
    setShowUserDropdown(false);
  }, [logout]);

  // 前往用户中心
  const handleGoToUserCenter = useCallback(() => {
    setShowUserDropdown(false);
    router.push("/user-center");
  }, [router]);

  // 前往后台
  const handleGoToAdmin = useCallback(() => {
    setShowUserDropdown(false);
    router.push("/admin");
  }, [router]);

  return (
    <div className={cn(styles.headerRight, isConsoleOpen && styles.consoleOpen)}>
      {/* 用户中心/登录注册 */}
      {!isAuthenticated ? (
        <div
          className={styles.userDropdownWrapper}
          onMouseEnter={() => setShowUserDropdown(true)}
          onMouseLeave={() => setShowUserDropdown(false)}
        >
          <button className={cn(styles.navButton, "ml-0!")}>
            <Icon icon="ri:user-fill" width="1.3rem" height="1.3rem" />
          </button>
          {/* 桥接区域 */}
          {showUserDropdown && <div className={styles.dropdownBridge} />}
          {/* 下拉菜单 */}
          {showUserDropdown && (
            <div className={cn(styles.userDropdownMenu, styles.dropdownFadeEnter)}>
              <Link href="/login" className={styles.dropdownItem}>
                <Icon icon="ri:login-box-line" width={16} height={16} />
                <span>登录</span>
              </Link>
              <Link href="/register" className={styles.dropdownItem}>
                <Icon icon="ri:user-add-line" width={16} height={16} />
                <span>注册</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div
          className={styles.userDropdownWrapper}
          onMouseEnter={() => setShowUserDropdown(true)}
          onMouseLeave={() => setShowUserDropdown(false)}
        >
          <button className={cn(styles.navButton, styles.userCenterButton)}>
            <Icon icon="ri:user-fill" width="1.3rem" height="1.3rem" />
          </button>
          {/* 桥接区域 */}
          {showUserDropdown && <div className={styles.dropdownBridge} />}
          {/* 下拉菜单 */}
          {showUserDropdown && (
            <div className={cn(styles.userDropdownMenu, styles.dropdownFadeEnter)} style={{ minWidth: "180px" }}>
              <div className={styles.dropdownItem} onClick={handleGoToUserCenter}>
                <Icon icon="ri:user-3-line" width={16} height={16} />
                <span>用户中心</span>
              </div>
              {isAdmin && (
                <>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      setShowUserDropdown(false);
                      router.push("/admin/posts/new");
                    }}
                  >
                    <Icon icon="ri:article-line" width={16} height={16} />
                    <span>发布文章</span>
                  </div>
                  <div className={styles.dropdownItem} onClick={handleGoToAdmin}>
                    <Icon icon="ri:settings-3-line" width={16} height={16} />
                    <span>后台管理</span>
                  </div>
                </>
              )}
              <div className={styles.dropdownItem} onClick={handleLogout}>
                <Icon icon="ri:logout-box-r-line" width={16} height={16} />
                <span>退出登录</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 随机文章 */}
      {!isMobile && (
        <Tooltip content="随机前往一篇文章" side="bottom" delayDuration={300}>
          <button className={styles.navButton} onClick={handleRandomArticle}>
            <Icon icon="fa6-solid:dice" width="1.5rem" height="1.5rem" />
          </button>
        </Tooltip>
      )}

      {/* 搜索 */}
      <Tooltip content="搜索" side="bottom" delayDuration={300}>
        <button className={styles.navButton} onClick={handleSearchClick} aria-label="搜索">
          <Icon icon="ri:search-line" width="1.3rem" height="1.3rem" />
        </button>
      </Tooltip>

      {/* 中控台切换按钮 */}
      <Tooltip content={isConsoleOpen ? "关闭中控台" : "打开中控台"} side="bottom" delayDuration={300}>
        <label
          className={cn(styles.consoleLabel, isConsoleOpen && styles.consoleLabelActive)}
          onClick={onToggleConsole}
        >
          <i className={cn(styles.consoleIcon, styles.left)} />
          <i className={cn(styles.consoleIcon, styles.center)} />
          <i className={cn(styles.consoleIcon, styles.right)} />
        </label>
      </Tooltip>

      {/* 回到顶部 */}
      <div
        className={cn(
          styles.navButton,
          styles.navTotop,
          showToTopButton && styles.isVisible,
          isFooterVisible && styles.long
        )}
        onClick={scrollToTop}
      >
        <div className={styles.totopbtn}>
          <Icon icon="fa6-solid:arrow-up" width={20} height={20} />
          <span className={styles.percent}>{toTopText}</span>
        </div>
      </div>

      {/* 移动端菜单切换 */}
      <div className={styles.toggleMenu} onClick={toggleMobileMenu}>
        <div className={styles.sitePage}>
          <Icon icon="ri:menu-line" width="1.3rem" height="1.3rem" />
        </div>
      </div>
    </div>
  );
}
