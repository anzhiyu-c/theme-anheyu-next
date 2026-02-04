"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type CommentStatus = "pending" | "approved" | "spam";

interface RecentComment {
  id: string | number;
  author: string;
  avatar?: string;
  content: string;
  article_title: string;
  article_id: string | number;
  created_at: string;
  status: CommentStatus;
}

interface RecentCommentsProps {
  comments: RecentComment[];
  onApprove?: (id: string | number) => void;
  onReject?: (id: string | number) => void;
  className?: string;
}

const statusConfig: Record<CommentStatus, { label: string; className: string }> = {
  pending: { label: "待审核", className: "bg-yellow-500/10 text-yellow-600" },
  approved: { label: "已通过", className: "bg-green-500/10 text-green-600" },
  spam: { label: "垃圾", className: "bg-red-500/10 text-red-500" },
};

// 格式化相对时间
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export function RecentComments({ comments, onApprove, onReject, className }: RecentCommentsProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="text-base font-semibold">最近评论</h3>
          <p className="text-sm text-muted-foreground mt-0.5">最新的用户评论</p>
        </div>
        <Link
          href="/admin/comments"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          查看全部
          <Icon icon="ri:arrow-right-s-line" className="w-4 h-4" />
        </Link>
      </div>

      {/* 列表 */}
      <div className="p-5 pt-4">
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="group">
                <div className="flex gap-3">
                  {/* 头像 */}
                  <div className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {comment.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="ri:user-line" className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded", statusConfig[comment.status].className)}>
                        {statusConfig[comment.status].label}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>

                    {/* 评论内容 */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1.5">{comment.content}</p>

                    {/* 来源文章 */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/admin/posts/${comment.article_id}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 truncate max-w-[200px]"
                      >
                        <Icon icon="ri:article-line" className="w-3 h-3 shrink-0" />
                        <span className="truncate">{comment.article_title}</span>
                      </Link>

                      {/* 快速操作 */}
                      {comment.status === "pending" && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onApprove?.(comment.id)}
                            className="p-1.5 rounded-md hover:bg-green-500/10 text-muted-foreground hover:text-green-600 transition-colors"
                            title="通过"
                          >
                            <Icon icon="ri:check-line" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onReject?.(comment.id)}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                            title="拒绝"
                          >
                            <Icon icon="ri:close-line" className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">暂无评论</div>
        )}
      </div>
    </div>
  );
}
