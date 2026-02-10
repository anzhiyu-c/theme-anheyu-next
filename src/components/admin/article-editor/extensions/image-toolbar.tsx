/**
 * ImageToolbar - 图片浮动工具栏
 * 选中图片时在图片上方显示，提供旋转、裁剪、尺寸、链接、描述、对齐、样式、批量应用、复原等功能
 */
"use client";

import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/core";
import { Tooltip, Popover, PopoverTrigger, PopoverContent, Input, Button, ButtonGroup } from "@heroui/react";
import {
  RotateCw,
  Crop,
  Scaling,
  Link2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  CopyCheck,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";

// ---- 类型 ----

interface ImageToolbarProps {
  editor: Editor;
  attrs: Record<string, unknown>;
  updateAttributes: (attrs: Record<string, unknown>) => void;
  onCropClick: () => void;
  onCaptionFocus: () => void;
}

// ---- 工具栏按钮 ----

function TBtn({
  onClick,
  tip,
  isActive,
  children,
}: {
  onClick: () => void;
  tip: string;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip content={tip} size="sm" delay={300} closeDelay={0} placement="bottom">
      <button
        type="button"
        className={`image-toolbar-btn${isActive ? " is-active" : ""}`}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        onMouseDown={e => e.preventDefault()}
      >
        {children}
      </button>
    </Tooltip>
  );
}

function TDivider() {
  return <div className="image-toolbar-divider" />;
}

// ---- 主组件 ----

export function ImageToolbar({ editor, attrs, updateAttributes, onCropClick, onCaptionFocus }: ImageToolbarProps) {
  const align = (attrs.align as string) || "center";
  const imageStyle = (attrs.imageStyle as string) || "none";
  const rotation = (attrs.rotation as number) || 0;
  const link = (attrs.link as string) || "";
  const linkTarget = (attrs.linkTarget as string) || "_blank";
  const width = attrs.width as number | null;
  const height = attrs.height as number | null;

  // ---- Popover 状态 ----
  const [sizeOpen, setSizeOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [alignOpen, setAlignOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);

  // ---- 尺寸 ----
  const [sizeW, setSizeW] = useState<string>(width ? String(width) : "");
  const [sizeH, setSizeH] = useState<string>(height ? String(height) : "");

  // ---- 链接 ----
  const [linkUrl, setLinkUrl] = useState(link);
  const [linkInCurrent, setLinkInCurrent] = useState(linkTarget === "_self");

  // ---- 旋转 ----
  const handleRotate = useCallback(() => {
    const next = ((rotation + 90) % 360) as 0 | 90 | 180 | 270;
    updateAttributes({ rotation: next });
  }, [rotation, updateAttributes]);

  // ---- 尺寸确认 ----
  const handleSizeConfirm = useCallback(() => {
    const w = sizeW ? parseInt(sizeW, 10) : null;
    const h = sizeH ? parseInt(sizeH, 10) : null;
    updateAttributes({
      width: w && w > 0 ? w : null,
      height: h && h > 0 ? h : null,
    });
    setSizeOpen(false);
  }, [sizeW, sizeH, updateAttributes]);

  // ---- 百分比预设 ----
  const handleSizePercent = useCallback(
    (percent: number) => {
      // 基于编辑器内容区宽度计算（减去左右 padding 64px）
      const editorWidth = editor.view.dom.clientWidth - 64;
      const newWidth = Math.round((editorWidth * percent) / 100);
      const aspectRatio = width && height ? height / width : null;
      const newHeight = aspectRatio ? Math.round(newWidth * aspectRatio) : null;
      updateAttributes({ width: newWidth, height: newHeight });
      setSizeW(String(newWidth));
      setSizeH(newHeight ? String(newHeight) : "");
    },
    [editor, width, height, updateAttributes]
  );

  // ---- 链接确认 ----
  const handleLinkConfirm = useCallback(() => {
    const url = linkUrl.trim();
    updateAttributes({
      link: url || null,
      linkTarget: url ? (linkInCurrent ? "_self" : "_blank") : null,
    });
    setLinkOpen(false);
  }, [linkUrl, linkInCurrent, updateAttributes]);

  // ---- 对齐 ----
  const handleAlign = useCallback(
    (a: string) => {
      updateAttributes({ align: a });
      setAlignOpen(false);
    },
    [updateAttributes]
  );

  // ---- 样式 ----
  const handleStyle = useCallback(
    (s: string) => {
      updateAttributes({ imageStyle: s });
      setStyleOpen(false);
    },
    [updateAttributes]
  );

  // ---- 批量应用 ----
  const applyToAll = useCallback(
    (type: "style" | "width") => {
      const { doc, tr } = editor.state;
      doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          if (type === "style") {
            tr.setNodeMarkup(pos, null, { ...node.attrs, imageStyle });
          } else {
            tr.setNodeMarkup(pos, null, { ...node.attrs, width, height });
          }
        }
      });
      editor.view.dispatch(tr);
      setBatchOpen(false);
    },
    [editor, imageStyle, width, height]
  );

  // ---- 复原 ----
  const handleReset = useCallback(() => {
    updateAttributes({
      align: "center",
      imageStyle: "none",
      rotation: 0,
      width: null,
      height: null,
      link: null,
      linkTarget: null,
    });
  }, [updateAttributes]);

  return (
    <div className="image-floating-toolbar" contentEditable={false} onMouseDown={e => e.preventDefault()}>
      {/* 旋转 */}
      <TBtn onClick={handleRotate} tip="旋转">
        <RotateCw />
      </TBtn>

      {/* 裁剪 */}
      <TBtn onClick={onCropClick} tip="裁剪">
        <Crop />
      </TBtn>

      {/* 宽高 */}
      <Popover
        placement="bottom"
        isOpen={sizeOpen}
        onOpenChange={open => {
          setSizeOpen(open);
          if (open) {
            setSizeW(width ? String(width) : "");
            setSizeH(height ? String(height) : "");
          }
        }}
      >
        <PopoverTrigger>
          <div>
            <Tooltip content="设置图片尺寸" size="sm" delay={300} closeDelay={0} placement="bottom">
              <button
                type="button"
                className="image-toolbar-btn"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSizeOpen(!sizeOpen);
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <Scaling />
                <span>宽高</span>
              </button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                label="宽"
                labelPlacement="outside-left"
                size="sm"
                placeholder="宽度"
                value={sizeW}
                onValueChange={setSizeW}
                min={1}
                classNames={{ base: "max-w-[140px]", input: "text-center", label: "text-sm font-medium" }}
                onKeyDown={e => {
                  if (e.key === "Enter") handleSizeConfirm();
                }}
              />
              <Input
                type="number"
                label="高"
                labelPlacement="outside-left"
                size="sm"
                placeholder="高度"
                value={sizeH}
                onValueChange={setSizeH}
                min={1}
                classNames={{ base: "max-w-[140px]", input: "text-center", label: "text-sm font-medium" }}
                onKeyDown={e => {
                  if (e.key === "Enter") handleSizeConfirm();
                }}
              />
            </div>
            <ButtonGroup size="sm" variant="flat" fullWidth>
              {([25, 50, 75, 100] as const).map(p => (
                <Button key={p} onPress={() => handleSizePercent(p)}>
                  {p}%
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </PopoverContent>
      </Popover>

      <TDivider />

      {/* 链接 */}
      <Popover
        placement="bottom"
        isOpen={linkOpen}
        onOpenChange={open => {
          setLinkOpen(open);
          if (open) {
            setLinkUrl(link);
            setLinkInCurrent(linkTarget === "_self");
          }
        }}
      >
        <PopoverTrigger>
          <div>
            <Tooltip content="设置图片链接" size="sm" delay={300} closeDelay={0} placement="bottom">
              <button
                type="button"
                className={`image-toolbar-btn${link ? " is-active" : ""}`}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLinkOpen(!linkOpen);
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <Link2 />
                <span>链接</span>
              </button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2 p-2 min-w-[220px]">
            <Input
              size="sm"
              placeholder="请输入网址"
              value={linkUrl}
              onValueChange={setLinkUrl}
              onKeyDown={e => {
                if (e.key === "Enter") handleLinkConfirm();
              }}
              autoFocus
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={linkInCurrent}
                onChange={e => setLinkInCurrent(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              在当前页面打开
            </label>
            <div className="flex justify-end gap-2">
              {link && (
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => {
                    updateAttributes({ link: null, linkTarget: null });
                    setLinkOpen(false);
                  }}
                >
                  移除
                </Button>
              )}
              <Button size="sm" color="primary" onPress={handleLinkConfirm}>
                确定
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 描述 */}
      <TBtn
        onClick={onCaptionFocus}
        tip={attrs.caption !== null ? "隐藏图片描述" : "添加图片描述"}
        isActive={attrs.caption !== null}
      >
        <Type />
        <span>描述</span>
      </TBtn>

      <TDivider />

      {/* 对齐 */}
      <Popover placement="bottom" isOpen={alignOpen} onOpenChange={setAlignOpen}>
        <PopoverTrigger>
          <div>
            <Tooltip content="对齐方式" size="sm" delay={300} closeDelay={0} placement="bottom">
              <button
                type="button"
                className="image-toolbar-btn"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAlignOpen(!alignOpen);
                }}
                onMouseDown={e => e.preventDefault()}
              >
                {align === "left" ? <AlignLeft /> : align === "right" ? <AlignRight /> : <AlignCenter />}
                <ChevronDown style={{ width: 10, height: 10 }} />
              </button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: "flex", flexDirection: "column", padding: 4, minWidth: 130 }}>
            {(
              [
                { key: "left", label: "左对齐", icon: <AlignLeft style={{ width: 14, height: 14 }} /> },
                { key: "center", label: "居中对齐", icon: <AlignCenter style={{ width: 14, height: 14 }} /> },
                { key: "right", label: "右对齐", icon: <AlignRight style={{ width: 14, height: 14 }} /> },
              ] as const
            ).map(item => (
              <button
                key={item.key}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "6px 10px",
                  border: "none",
                  background: "transparent",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
                className="hover:bg-default-100 transition-colors"
                onClick={() => handleAlign(item.key)}
              >
                {align === item.key ? (
                  <Check style={{ width: 14, height: 14, color: "var(--anzhiyu-theme, #4259ef)" }} />
                ) : (
                  <span style={{ width: 14 }} />
                )}
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* 样式 */}
      <Popover placement="bottom" isOpen={styleOpen} onOpenChange={setStyleOpen}>
        <PopoverTrigger>
          <div>
            <Tooltip content="图片样式" size="sm" delay={300} closeDelay={0} placement="bottom">
              <button
                type="button"
                className="image-toolbar-btn"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStyleOpen(!styleOpen);
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <ImageIcon />
                <span>样式</span>
                <ChevronDown style={{ width: 10, height: 10 }} />
              </button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: "flex", flexDirection: "column", padding: 4, minWidth: 120 }}>
            {(
              [
                { key: "none", label: "无样式" },
                { key: "border", label: "图片描边" },
                { key: "shadow", label: "图片阴影" },
              ] as const
            ).map(item => (
              <button
                key={item.key}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "6px 10px",
                  border: "none",
                  background: "transparent",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
                className="hover:bg-default-100 transition-colors"
                onClick={() => handleStyle(item.key)}
              >
                {imageStyle === item.key ? (
                  <Check style={{ width: 14, height: 14, color: "var(--anzhiyu-theme, #4259ef)" }} />
                ) : (
                  <span style={{ width: 14 }} />
                )}
                {item.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* 批量应用 */}
      <Popover placement="bottom" isOpen={batchOpen} onOpenChange={setBatchOpen}>
        <PopoverTrigger>
          <div>
            <Tooltip
              content={
                <span>
                  批量应用格式：
                  <br />
                  对本文档的图片一键应用样式和宽度
                </span>
              }
              size="sm"
              delay={300}
              closeDelay={0}
              placement="bottom"
            >
              <button
                type="button"
                className="image-toolbar-btn"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setBatchOpen(!batchOpen);
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <CopyCheck />
                <ChevronDown style={{ width: 10, height: 10 }} />
              </button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: "flex", flexDirection: "column", padding: 4, minWidth: 160 }}>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "6px 10px",
                border: "none",
                background: "transparent",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
              }}
              className="hover:bg-default-100 transition-colors"
              onClick={() => applyToAll("style")}
            >
              同步图片样式到全文
            </button>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "6px 10px",
                border: "none",
                background: "transparent",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
              }}
              className="hover:bg-default-100 transition-colors"
              onClick={() => applyToAll("width")}
            >
              同步图片宽度到全文
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <TDivider />

      {/* 复原 */}
      <TBtn onClick={handleReset} tip="复原">
        <RotateCcw />
      </TBtn>
    </div>
  );
}
