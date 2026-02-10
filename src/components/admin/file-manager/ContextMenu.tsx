"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiUpload2Line,
  RiFolderAddLine,
  RiFolderOpenLine,
  RiFileAddLine,
  RiRefreshLine,
  RiEdit2Line,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiShareLine,
  RiFileCopyLine,
  RiFolderTransferLine,
  RiInformationLine,
  RiLinkM,
  RiRestartLine,
} from "react-icons/ri";
import type { ContextMenuTrigger } from "@/hooks/file-manager/use-file-manager";
import { contextMenuVariants, menuItemVariants, springTransition } from "@/lib/motion";
import styles from "./ContextMenu.module.css";

interface MenuItem {
  label?: string;
  icon?: React.ReactNode;
  action?: string;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  trigger: ContextMenuTrigger | null;
  selectedFileIds: Set<string>;
  onSelect: (action: string, context?: MenuContext) => void;
  onClosed: () => void;
}

interface MenuContext {
  selectedIds?: string[];
}

export function ContextMenu({ trigger, selectedFileIds, onSelect, onClosed }: ContextMenuProps) {
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [transformOrigin, setTransformOrigin] = useState("top left");
  const visible = !!trigger;

  const blankMenu = useMemo<MenuItem[]>(
    () => [
      { label: "上传文件", action: "upload-file", icon: <RiUpload2Line /> },
      { label: "上传目录", action: "upload-dir", icon: <RiFolderAddLine /> },
      { divider: true },
      { label: "创建文件夹", action: "create-folder", icon: <RiFolderOpenLine /> },
      { label: "创建 Markdown (.md)", action: "create-md", icon: <RiFileAddLine /> },
      { label: "创建 文本 (.txt)", action: "create-txt", icon: <RiFileAddLine /> },
      { divider: true },
      { label: "刷新", action: "refresh", icon: <RiRefreshLine /> },
    ],
    []
  );

  const itemMenu = useMemo<MenuItem[]>(
    () => [
      { label: "重命名", action: "rename", icon: <RiEdit2Line /> },
      { label: "移动到", action: "move", icon: <RiFolderTransferLine /> },
      { label: "下载", action: "download", icon: <RiDownload2Line /> },
      { label: "分享", action: "share", icon: <RiShareLine /> },
      { label: "获取直链", action: "get-link", icon: <RiLinkM /> },
      { label: "复制", action: "copy", icon: <RiFileCopyLine /> },
      { label: "详细信息", action: "info", icon: <RiInformationLine /> },
      { divider: true },
      { label: "删除", action: "delete", icon: <RiDeleteBin6Line />, danger: true },
    ],
    []
  );

  const { items, menuContext } = useMemo(() => {
    if (!trigger) return { items: [], menuContext: null };
    const file = trigger.file;
    if (!file) {
      return { items: blankMenu, menuContext: null };
    }
    const nextItems = [...itemMenu];
    const isThumbnailFailed = file.metadata?.thumb_status === "failed";
    if (isThumbnailFailed) {
      nextItems.unshift(
        { label: "重新生成缩略图", action: "regenerate-thumbnail", icon: <RiRestartLine /> },
        { divider: true }
      );
    }
    return { items: nextItems, menuContext: { selectedIds: [...selectedFileIds] } };
  }, [trigger, blankMenu, itemMenu, selectedFileIds]);

  useEffect(() => {
    if (!trigger) return;
    const { event } = trigger;
    event.preventDefault();
    const initialX = event.clientX;
    const initialY = event.clientY;

    requestAnimationFrame(() => {
      const menuEl = contextMenuRef.current;
      if (!menuEl) return;
      const menuWidth = menuEl.offsetWidth;
      const menuHeight = menuEl.offsetHeight;
      const { innerWidth, innerHeight } = window;
      let finalX = initialX;
      let finalY = initialY;
      let originX = "left";
      let originY = "top";

      if (initialX + menuWidth > innerWidth) {
        finalX = initialX - menuWidth;
        originX = "right";
      }
      if (initialY + menuHeight > innerHeight) {
        finalY = initialY - menuHeight;
        originY = "bottom";
      }
      setPosition({ x: Math.max(5, finalX), y: Math.max(5, finalY) });
      setTransformOrigin(`${originY} ${originX}`);
    });
  }, [trigger]);

  const closeMenu = () => {
    onClosed();
  };

  const handleOverlayRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onItemClick = (item: MenuItem) => {
    if (item.action) {
      onSelect(item.action, menuContext || undefined);
    }
    closeMenu();
  };

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <>
          <div className={styles["context-menu-overlay"]} onClick={closeMenu} onContextMenu={handleOverlayRightClick} />
          <motion.div
            ref={contextMenuRef}
            className={styles["context-menu"]}
            style={{ left: position.x, top: position.y, transformOrigin }}
            variants={contextMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springTransition}
            onContextMenu={event => event.preventDefault()}
          >
            {items.map((item, index) =>
              item.divider ? (
                <div key={`divider-${index}`} className={styles.divider} />
              ) : (
                <motion.div
                  key={`${item.label}-${index}`}
                  className={`${styles["menu-item"]} ${item.danger ? styles.danger : ""}`}
                  variants={menuItemVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ ...springTransition, delay: index * 0.015 }}
                  onClick={() => onItemClick(item)}
                  whileHover={{ x: 2, backgroundColor: "var(--anzhiyu-theme-op)" }}
                >
                  <span className={styles["menu-icon"]}>{item.icon}</span>
                  <span>{item.label}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
