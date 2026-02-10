"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tooltip, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useIsMobile } from "@/hooks/use-media-query";

import styles from "./styles.module.css";
import type { NavConfig } from "../../types";
import { Console } from "../Console";

interface HeaderRightProps {
  navConfig?: NavConfig;
  isTransparent: boolean;
  isTextWhite?: boolean;
  scrollPercent: number;
  isFooterVisible: boolean;
  isConsoleOpen: boolean;
  onToggleConsole: () => void;
}

export function HeaderRight({
  isTransparent,
  isTextWhite = false,
  scrollPercent,
  isFooterVisible,
  isConsoleOpen,
  onToggleConsole,
}: HeaderRightProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, roles } = useAuthStore();
  const isMobile = useIsMobile();

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
  }, [logout]);

  // 前往用户中心
  const handleGoToUserCenter = useCallback(() => {
    router.push("/user-center");
  }, [router]);

  // 前往后台
  const handleGoToAdmin = useCallback(() => {
    router.push("/admin");
  }, [router]);

  return (
    <div className={cn(styles.headerRight, isTextWhite && styles.textIsWhite)}>
      {/* 用户中心/登录注册 */}
      {!isAuthenticated ? (
        <Popover
          placement="bottom-end"
          offset={8}
          showArrow={false}
          classNames={{
            content: "p-0 bg-card border border-border rounded-xl shadow-lg",
          }}
        >
          <PopoverTrigger>
            <button className={cn(styles.navButton, "ml-0!")}>
              <Icon icon="ri:user-fill" width="1.3rem" height="1.3rem" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className={styles.loginPanel}>
              <div className={styles.loginHeader}>
                <Icon icon="ri:user-3-line" width={32} height={32} className={styles.loginIcon} />
                <div className={styles.loginTitle}>欢迎访问</div>
                <div className={styles.loginDesc}>登录后解锁更多功能</div>
              </div>
              <div className={styles.loginActions}>
                <Link href="/login" className={styles.loginBtn}>
                  <Icon icon="ri:login-box-line" width={16} height={16} />
                  <span>登录</span>
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  <Icon icon="ri:user-add-line" width={16} height={16} />
                  <span>注册</span>
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover
          placement="bottom-end"
          offset={8}
          showArrow={false}
          classNames={{
            content: "p-0 bg-card border border-border rounded-xl shadow-lg",
          }}
        >
          <PopoverTrigger>
            <button className={cn(styles.navButton, styles.userCenterButton, "ml-0!")}>
              <Icon icon="ri:user-fill" width="1.3rem" height="1.3rem" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className={styles.userPanel}>
              {/* 用户信息头部 */}
              <div className={styles.panelHeader}>
                <Image
                  src={user?.avatar || `https://cravatar.cn/avatar/${user?.email}?s=200&d=mp`}
                  className={styles.userAvatar}
                  alt="头像"
                  width={48}
                  height={48}
                  unoptimized
                />
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user?.nickname || user?.username}</div>
                  <div className={styles.userDesc}>{user?.email}</div>
                </div>
              </div>

              {/* 功能网格 */}
              <div className={styles.panelGrid}>
                <div className={styles.gridItem} onClick={handleGoToUserCenter}>
                  <div className={styles.gridIcon} style={{ background: "#e8f4ff", color: "#409eff" }}>
                    <Icon icon="ri:user-3-line" width={20} height={20} />
                  </div>
                  <span>用户中心</span>
                </div>
                <div
                  className={styles.gridItem}
                  onClick={() => {
                    window.open("/notifications", "_blank");
                  }}
                >
                  <div className={styles.gridIcon} style={{ background: "#fff8e8", color: "#e6a23c" }}>
                    <Icon icon="ri:notification-2-line" width={20} height={20} />
                  </div>
                  <span>全部通知</span>
                </div>
                {isAdmin && (
                  <>
                    <div
                      className={styles.gridItem}
                      onClick={() => {
                        window.open("/admin/post-management", "_blank");
                      }}
                    >
                      <div className={styles.gridIcon} style={{ background: "#e8fff0", color: "#67c23a" }}>
                        <Icon icon="ri:article-line" width={20} height={20} />
                      </div>
                      <span>发布文章</span>
                    </div>
                    <div className={styles.gridItem} onClick={handleGoToAdmin}>
                      <div className={styles.gridIcon} style={{ background: "#f0e8ff", color: "#9c27b0" }}>
                        <Icon icon="ri:settings-3-line" width={20} height={20} />
                      </div>
                      <span>后台管理</span>
                    </div>
                  </>
                )}
                <div className={styles.gridItem} onClick={handleLogout}>
                  <div className={styles.gridIcon} style={{ background: "#ffebee", color: "#f44336" }}>
                    <Icon icon="ri:logout-box-r-line" width={20} height={20} />
                  </div>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* 随机文章 */}
      {!isMobile && (
        <Tooltip
          content="随机前往一篇文章"
          placement="bottom"
          delay={300}
          closeDelay={0}
          classNames={{ content: "custom-tooltip-content" }}
        >
          <button className={styles.navButton} onClick={handleRandomArticle}>
            <Icon icon="fa6-solid:dice" width="1.5rem" height="1.5rem" />
          </button>
        </Tooltip>
      )}

      {/* 搜索 */}
      <Tooltip
        content="搜索"
        placement="bottom"
        delay={300}
        closeDelay={0}
        classNames={{ content: "custom-tooltip-content" }}
      >
        <button className={styles.navButton} onClick={handleSearchClick} aria-label="搜索">
          <Icon icon="iconamoon:search-bold" width="1.5rem" height="1.5rem" />
        </button>
      </Tooltip>

      {/* 中控台切换按钮 */}
      <Tooltip
        content={isConsoleOpen ? "关闭中控台" : "打开中控台"}
        placement="bottom"
        delay={300}
        closeDelay={0}
        classNames={{ content: "custom-tooltip-content" }}
      >
        <label
          className={cn(styles.consoleLabel, isConsoleOpen && styles.consoleLabelActive)}
          onClick={onToggleConsole}
        >
          <i className={cn(styles.consoleIcon, styles.left)} />
          <i className={cn(styles.consoleIcon, styles.center)} />
          <i className={cn(styles.consoleIcon, styles.right)} />
        </label>
      </Tooltip>

      {/* 中控台面板（保持在 HeaderRight 内，确保关闭按钮层级更高） */}
      <Console isOpen={isConsoleOpen} onClose={onToggleConsole} />

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
