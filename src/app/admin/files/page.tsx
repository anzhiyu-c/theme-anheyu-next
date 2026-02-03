"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button, Input } from "@/components/ui";
import {
  FolderOpen,
  Upload,
  Grid,
  List,
  Image,
  File,
  FileText,
  Film,
  Music,
  Archive,
  Download,
  Trash2,
  Eye,
  Copy,
  FolderPlus,
} from "lucide-react";
import { cn, formatBytes, formatDate } from "@/lib/utils";

// 模拟文件数据
const mockFiles = [
  {
    id: 1,
    name: "hero-banner.jpg",
    type: "image",
    size: 245000,
    url: "/uploads/hero-banner.jpg",
    createdAt: "2026-01-30",
  },
  {
    id: 2,
    name: "article-cover.png",
    type: "image",
    size: 189000,
    url: "/uploads/article-cover.png",
    createdAt: "2026-01-29",
  },
  {
    id: 3,
    name: "document.pdf",
    type: "document",
    size: 1245000,
    url: "/uploads/document.pdf",
    createdAt: "2026-01-28",
  },
  {
    id: 4,
    name: "video-intro.mp4",
    type: "video",
    size: 52450000,
    url: "/uploads/video-intro.mp4",
    createdAt: "2026-01-27",
  },
  {
    id: 5,
    name: "background-music.mp3",
    type: "audio",
    size: 4520000,
    url: "/uploads/background-music.mp3",
    createdAt: "2026-01-26",
  },
  { id: 6, name: "archive.zip", type: "archive", size: 12450000, url: "/uploads/archive.zip", createdAt: "2026-01-25" },
  { id: 7, name: "avatar.webp", type: "image", size: 45000, url: "/uploads/avatar.webp", createdAt: "2026-01-24" },
  { id: 8, name: "readme.md", type: "document", size: 12000, url: "/uploads/readme.md", createdAt: "2026-01-23" },
];

type FileItem = (typeof mockFiles)[number];

const fileTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  image: Image,
  document: FileText,
  video: Film,
  audio: Music,
  archive: Archive,
  default: File,
};

const fileTypeColors: Record<string, string> = {
  image: "text-green bg-green/10",
  document: "text-blue bg-blue/10",
  video: "text-purple bg-purple/10",
  audio: "text-orange bg-orange/10",
  archive: "text-yellow bg-yellow/10",
  default: "text-muted-foreground bg-muted",
};

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [files] = useState(mockFiles);

  const columns: Column<FileItem>[] = [
    {
      key: "name",
      header: "文件名",
      render: file => {
        const Icon = fileTypeIcons[file.type] || fileTypeIcons.default;
        const colorClass = fileTypeColors[file.type] || fileTypeColors.default;
        return (
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colorClass)}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-medium">{file.name}</span>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "类型",
      render: file => <span className="capitalize text-muted-foreground">{file.type}</span>,
    },
    {
      key: "size",
      header: "大小",
      sortable: true,
      render: file => <span className="text-muted-foreground">{formatBytes(file.size)}</span>,
    },
    {
      key: "createdAt",
      header: "上传时间",
      sortable: true,
      render: file => <span className="text-muted-foreground">{formatDate(file.createdAt)}</span>,
    },
  ];

  const FileCard = ({ file }: { file: FileItem }) => {
    const Icon = fileTypeIcons[file.type] || fileTypeIcons.default;
    const colorClass = fileTypeColors[file.type] || fileTypeColors.default;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
      >
        {/* 文件图标/预览 */}
        <div
          className={cn(
            "aspect-square rounded-lg flex items-center justify-center mb-3",
            colorClass.replace("text-", "bg-").split(" ")[0] + "/10"
          )}
        >
          {file.type === "image" ? (
            <div className="w-full h-full rounded-lg bg-linear-to-br from-muted to-muted/50 flex items-center justify-center">
              <Icon className={cn("w-12 h-12", colorClass.split(" ")[0])} />
            </div>
          ) : (
            <Icon className={cn("w-12 h-12", colorClass.split(" ")[0])} />
          )}
        </div>

        {/* 文件信息 */}
        <div className="space-y-1">
          <p className="font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatBytes(file.size)}</span>
            <span>{formatDate(file.createdAt)}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-8 flex-1 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" />
            预览
          </Button>
          <Button variant="ghost" size="sm" className="h-8 flex-1 text-xs">
            <Copy className="w-3.5 h-3.5 mr-1" />
            复制
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="文件管理"
        description="管理您的媒体文件和附件"
        icon={FolderOpen}
        primaryAction={{
          label: "上传文件",
          icon: Upload,
          onClick: () => console.log("Upload"),
        }}
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <FolderPlus className="w-4 h-4" />
              新建文件夹
            </Button>
          </>
        }
      />

      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input placeholder="搜索文件..." className="w-64" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 文件列表 */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <AdminCard noPadding>
          <AdminDataTable
            data={files}
            columns={columns}
            searchable={false}
            rowActions={() => (
              <div className="flex items-center gap-1 justify-end">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          />
        </AdminCard>
      )}
    </div>
  );
}
