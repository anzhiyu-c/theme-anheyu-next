"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Eye, MapPin, User, Link as LinkIcon, Music, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/date";
import { ESSAY_STATUS_CONFIG } from "@/lib/constants/essay";
import type { Essay } from "@/lib/api/essay";

interface EssayViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  essay: Essay | null;
}

/**
 * 即刻详情查看弹窗
 * 始终渲染 Modal wrapper，确保关闭动画不被打断
 */
export default function EssayViewDialog({ isOpen, onClose, essay }: EssayViewDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>{essay ? <EssayViewContent essay={essay} onClose={onClose} /> : null}</ModalContent>
    </Modal>
  );
}

function EssayViewContent({ essay, onClose }: { essay: Essay; onClose: () => void }) {
  const statusInfo = ESSAY_STATUS_CONFIG[essay.status] ?? { label: "未知", className: "bg-zinc-100 text-zinc-600" };

  return (
    <>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-success-50">
            <Eye className="w-5 h-5 text-success" />
          </div>
          <span className="text-lg font-semibold">说说详情</span>
        </div>
      </ModalHeader>

      <ModalBody className="gap-5">
        {/* 基本信息行 */}
        <div className="flex flex-wrap gap-4 text-sm">
          {essay.sort_order > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-medium text-foreground">序号：</span>
              {essay.sort_order}
            </div>
          )}
          {essay.address && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {essay.address}
            </div>
          )}
          {essay.from && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              {essay.from}
            </div>
          )}
          <div>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                statusInfo.className
              )}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* 链接 */}
        {essay.link && (
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <a
              href={essay.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {essay.link}
            </a>
          </div>
        )}

        {/* 内容 */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">内容</p>
          <div className="p-4 bg-muted/30 rounded-xl text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {essay.content}
          </div>
        </div>

        {/* 图片 */}
        {essay.image && essay.image.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">图片</p>
            <div className="grid grid-cols-3 gap-2">
              {essay.image.map((img, index) => (
                <a
                  key={img}
                  href={img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-lg overflow-hidden aspect-video bg-muted border border-border/50 hover:border-primary/30 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`图片 ${index + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 音乐 */}
        {essay.aplayer && essay.aplayer.id && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">音乐</p>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Music className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">网易云音乐</p>
                <p className="text-foreground font-medium">歌曲 ID: {essay.aplayer.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* 时间 */}
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            创建时间：{formatDateTime(essay.created_at)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            更新时间：{formatDateTime(essay.updated_at)}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="light" onPress={onClose}>
          关闭
        </Button>
      </ModalFooter>
    </>
  );
}
