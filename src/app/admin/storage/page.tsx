"use client";

import { motion } from "framer-motion";
import { Button, Chip, Spinner, Tooltip, Pagination } from "@heroui/react";
import { HardDrive, Plus, Edit, Trash2, Server, Cloud, Database, ShieldAlert, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { AdminPageHeader, AdminCard } from "@/components/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StorageTypeSelector } from "@/components/admin/storage/StorageTypeSelector";
import { PolicyFormModal } from "@/components/admin/storage/PolicyFormModal";
import { useStoragePage } from "./_hooks/use-storage-page";
import {
  STORAGE_TYPE_LABELS,
  POLICY_FLAG_LABELS,
  type StoragePolicy,
  type StoragePolicyType,
} from "@/types/storage-policy";

/** 存储类型图标映射 */
const TYPE_ICONS: Record<StoragePolicyType, typeof Server> = {
  local: Server,
  onedrive: Cloud,
  tencent_cos: Database,
  aliyun_oss: Database,
  aws_s3: Database,
  qiniu_kodo: Database,
};

/** 策略卡片 */
function PolicyCard({
  policy,
  index,
  onEdit,
  onDelete,
}: {
  policy: StoragePolicy;
  index: number;
  onEdit: (p: StoragePolicy) => void;
  onDelete: (p: StoragePolicy) => void;
}) {
  const Icon = TYPE_ICONS[policy.type] ?? Database;
  const isCloud = policy.type !== "local";
  const isConfigured = isCloud ? !!(policy.access_key && policy.secret_key) : true;
  const isOneDriveAuthorized = policy.type === "onedrive" ? !!policy.access_key : null;
  const canDelete = !policy.flag && !(policy.type === "local" && policy.virtual_path === "/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative bg-card border border-border/50 rounded-xl p-5",
        "hover:shadow-lg hover:border-border transition-all duration-200",
        "group overflow-hidden"
      )}
    >
      {/* 内容区 */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/8 shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold truncate">{policy.name}</h3>
            {policy.flag && (
              <Chip size="sm" color="warning" variant="flat" className="text-[11px] h-5">
                {POLICY_FLAG_LABELS[policy.flag] ?? policy.flag}
              </Chip>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* 配置状态 */}
            {policy.type === "onedrive" && (
              <Chip
                size="sm"
                color={isOneDriveAuthorized ? "success" : "warning"}
                variant="flat"
                className="text-[11px] h-5"
              >
                {isOneDriveAuthorized ? "已授权" : "未授权"}
              </Chip>
            )}
            {isCloud && policy.type !== "onedrive" && (
              <Chip size="sm" color={isConfigured ? "success" : "warning"} variant="flat" className="text-[11px] h-5">
                {isConfigured ? "已配置" : "未配置"}
              </Chip>
            )}
            {/* 类型标签 */}
            <Chip size="sm" variant="flat" className="text-[11px] h-5">
              {STORAGE_TYPE_LABELS[policy.type]}
            </Chip>
          </div>
        </div>
      </div>

      {/* Hover 操作层 */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
        <Tooltip content="编辑" size="sm">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            className="w-9 h-9 text-primary bg-primary/10 hover:bg-primary/20"
            onPress={() => onEdit(policy)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </Tooltip>
        {canDelete && (
          <Tooltip content="删除" size="sm" color="danger">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              className="w-9 h-9 text-danger bg-danger/10 hover:bg-danger/20"
              onPress={() => onDelete(policy)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Tooltip>
        )}
      </div>
    </motion.div>
  );
}

/** 添加卡片 */
function AddCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-5 rounded-xl",
        "border-2 border-dashed border-border/60 hover:border-primary",
        "text-muted-foreground hover:text-primary transition-all duration-200",
        "cursor-pointer min-h-[120px]"
      )}
    >
      <Plus className="w-8 h-8" />
      <span className="text-sm font-medium">添加存储策略</span>
    </motion.button>
  );
}

export default function StoragePage() {
  const sp = useStoragePage();

  if (sp.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner color="primary" label="加载中..." />
      </div>
    );
  }

  // 统计数据
  const configuredCount = sp.policies.filter(p => {
    if (p.type === "local") return true;
    if (p.type === "onedrive") return !!p.access_key;
    return !!(p.access_key && p.secret_key);
  }).length;

  const flaggedCount = sp.policies.filter(p => !!p.flag).length;

  return (
    <motion.div className="space-y-6" variants={adminContainerVariants} initial="hidden" animate="visible">
      <motion.div variants={adminItemVariants}>
        <AdminPageHeader
          title="存储策略"
          description="配置文件存储服务，支持本地存储和多种云存储"
          icon={HardDrive}
          actions={
            <Button
              size="sm"
              variant="light"
              isIconOnly
              aria-label="刷新"
              onPress={() => sp.refetch()}
              isDisabled={sp.isFetching}
            >
              <RotateCw className={cn("w-3.5 h-3.5", sp.isFetching && "animate-spin")} />
            </Button>
          }
          primaryAction={{
            label: "添加策略",
            icon: Plus,
            onClick: sp.handleAddClick,
          }}
        />
      </motion.div>

      {/* 概览统计 */}
      <motion.div variants={adminItemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{sp.totalItems}</p>
          <p className="text-sm text-muted-foreground mt-1">存储策略</p>
        </AdminCard>
        <AdminCard delay={0.04}>
          <p className="text-3xl font-bold text-success">{configuredCount}</p>
          <p className="text-sm text-muted-foreground mt-1">已配置</p>
        </AdminCard>
        <AdminCard delay={0.08}>
          <p className="text-3xl font-bold text-warning">{flaggedCount}</p>
          <p className="text-sm text-muted-foreground mt-1">默认策略</p>
        </AdminCard>
        <AdminCard delay={0.12}>
          <p className="text-3xl font-bold text-primary">{sp.policies.length}</p>
          <p className="text-sm text-muted-foreground mt-1">当前页</p>
        </AdminCard>
      </motion.div>

      {/* 策略卡片列表 */}
      <motion.div variants={adminItemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AddCard onClick={sp.handleAddClick} />
          {sp.policies.map((policy, index) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              index={index}
              onEdit={sp.handleEdit}
              onDelete={sp.handleDeleteClick}
            />
          ))}
        </div>

        {/* 加载中遮罩 */}
        {sp.isFetching && !sp.isLoading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg shadow border border-border/50">
              <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">加载中</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 分页 */}
      {sp.totalPages > 1 && (
        <motion.div variants={adminItemVariants} className="flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={sp.page}
            total={sp.totalPages}
            onChange={sp.setPage}
          />
        </motion.div>
      )}

      {/* 选择存储类型 Modal */}
      <StorageTypeSelector
        isOpen={sp.typeSelectorModal.isOpen}
        onOpenChange={sp.typeSelectorModal.onOpenChange}
        onSelect={sp.handleSelectType}
      />

      {/* 创建/编辑表单 Modal */}
      <PolicyFormModal
        isOpen={sp.formModal.isOpen}
        onOpenChange={sp.formModal.onOpenChange}
        mode={sp.formMode}
        storageType={sp.selectedType}
        form={sp.form}
        onFormChange={sp.setForm}
        onConfirm={sp.handleFormConfirm}
        isLoading={sp.createPolicy.isPending || sp.updatePolicy.isPending}
        sizeUnit={sp.sizeUnit}
        onSizeUnitChange={sp.handleSizeUnitChange}
        sizeValue={sp.sizeValue}
        onSizeValueChange={sp.handleSizeValueChange}
      />

      {/* 删除确认 */}
      <ConfirmDialog
        isOpen={sp.deleteConfirm.isOpen}
        onOpenChange={sp.deleteConfirm.onOpenChange}
        title="删除存储策略"
        description={`确定要删除存储策略「${sp.deleteTarget?.name}」吗？此操作不可撤销。`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={sp.deletePolicy.isPending}
        onConfirm={sp.handleDeleteConfirm}
      />
    </motion.div>
  );
}
