"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard } from "@/components/admin";
import { Button, Input } from "@/components/ui";
import {
  Settings,
  Save,
  Globe,
  User,
  Mail,
  Image as ImageIcon,
  FileText,
  Bell,
  Shield,
  Palette,
  Code,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const settingSections: SettingSection[] = [
  { id: "basic", label: "基本设置", icon: Globe, description: "网站名称、描述、Logo 等基本信息" },
  { id: "author", label: "作者信息", icon: User, description: "博主个人资料和社交链接" },
  { id: "seo", label: "SEO 设置", icon: FileText, description: "搜索引擎优化相关配置" },
  { id: "email", label: "邮件服务", icon: Mail, description: "SMTP 邮件发送配置" },
  { id: "comment", label: "评论设置", icon: MessageSquare, description: "评论系统配置和审核规则" },
  { id: "notification", label: "通知设置", icon: Bell, description: "系统通知和提醒配置" },
  { id: "security", label: "安全设置", icon: Shield, description: "登录安全和访问控制" },
  { id: "appearance", label: "外观定制", icon: Palette, description: "主题颜色和样式设置" },
  { id: "advanced", label: "高级设置", icon: Code, description: "自定义代码和高级选项" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("basic");
  const [saving, setSaving] = useState(false);

  // 模拟保存
  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">网站名称</label>
          <Input defaultValue="AnHeYu" placeholder="请输入网站名称" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">网站副标题</label>
          <Input defaultValue="记录生活，分享技术" placeholder="请输入网站副标题" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">网站描述</label>
        <textarea
          className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          defaultValue="一个专注于技术分享和生活记录的个人博客"
          placeholder="请输入网站描述"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">网站地址</label>
          <Input defaultValue="https://anheyu.com" placeholder="https://example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">备案号</label>
          <Input defaultValue="京ICP备xxxxxxxx号" placeholder="请输入备案号" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">网站 Logo</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <Button variant="outline">上传 Logo</Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">网站 Favicon</label>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <Button variant="outline">上传 Favicon</Button>
        </div>
      </div>
    </div>
  );

  const renderAuthorSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">昵称</label>
          <Input defaultValue="安知鱼" placeholder="请输入昵称" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">邮箱</label>
          <Input defaultValue="contact@anheyu.com" placeholder="请输入邮箱" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">个人简介</label>
        <textarea
          className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          defaultValue="一个热爱技术的全栈开发者"
          placeholder="请输入个人简介"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">头像</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary text-2xl font-bold">
            安
          </div>
          <Button variant="outline">上传头像</Button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">社交链接</label>
        <div className="space-y-3">
          {["GitHub", "Twitter", "微博", "Bilibili"].map(platform => (
            <div key={platform} className="flex items-center gap-3">
              <span className="w-20 text-sm text-muted-foreground">{platform}</span>
              <Input placeholder={`请输入 ${platform} 链接`} className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (section: SettingSection) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        <section.icon className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{section.label}</h3>
      <p className="text-muted-foreground max-w-sm">{section.description}</p>
      <p className="text-sm text-muted-foreground/60 mt-4">功能开发中...</p>
    </div>
  );

  const activeConfig = settingSections.find(s => s.id === activeSection);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="系统设置"
        description="配置您的网站各项参数"
        icon={Settings}
        primaryAction={{
          label: saving ? "保存中..." : "保存设置",
          icon: Save,
          onClick: handleSave,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧菜单 */}
        <AdminCard noPadding className="lg:col-span-1 h-fit">
          <nav className="p-2">
            {settingSections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronRight className={cn("w-4 h-4 transition-transform", isActive && "rotate-90")} />
                </motion.button>
              );
            })}
          </nav>
        </AdminCard>

        {/* 右侧内容 */}
        <AdminCard className="lg:col-span-3" title={activeConfig?.label} description={activeConfig?.description}>
          {activeSection === "basic" && renderBasicSettings()}
          {activeSection === "author" && renderAuthorSettings()}
          {activeSection !== "basic" && activeSection !== "author" && activeConfig && renderPlaceholder(activeConfig)}
        </AdminCard>
      </div>
    </div>
  );
}
