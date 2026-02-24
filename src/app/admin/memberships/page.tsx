"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Crown, Plus, Edit, Trash2, GripVertical, Power, PowerOff, ShieldAlert } from "lucide-react";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { formatDateTime } from "@/utils/date";
import { ConfirmDialog } from "@/components/admin";
import { PlanEditDialog } from "./_components/PlanEditDialog";
import { useMembershipsPage } from "./_hooks/use-memberships-page";
import { addToast } from "@heroui/react";

export default function MembershipsPage() {
  const mm = useMembershipsPage();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8"
      variants={adminContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={adminItemVariants} className="flex-1 min-h-0 mx-6 mt-5 mb-2 overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4 h-full">
          <Card className="border border-border/60 shadow-sm overflow-hidden">
            <CardBody className="p-0 h-full flex flex-col">
              <div className="px-5 pt-4 pb-3 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                    <Crown className="w-5 h-5 text-warning" />
                    会员套餐
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">拖拽卡片可调整展示顺序</p>
                </div>
                <div className="flex items-center gap-2">
                  {mm.isSorting ? (
                    <Chip size="sm" variant="flat" color="secondary">
                      排序保存中...
                    </Chip>
                  ) : null}
                  <Button
                    size="sm"
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={mm.handleCreateOpen}
                  >
                    创建套餐
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                {mm.isPlansLoading ? (
                  <div className="py-12 flex justify-center">
                    <Spinner label="加载套餐中..." size="sm" />
                  </div>
                ) : mm.plans.length === 0 ? (
                  <div className="py-12 text-center text-sm text-default-500">暂无会员套餐，点击右上角创建</div>
                ) : (
                  mm.plans.map((plan, index) => (
                    <div
                      key={plan.id}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={event => event.preventDefault()}
                      onDrop={async () => {
                        if (dragIndex === null) return;
                        await mm.reorderPlans(dragIndex, index);
                        setDragIndex(null);
                      }}
                      className="rounded-xl border border-default-200 p-3 bg-default-50/40 dark:bg-default-100/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <button
                            className="mt-1 cursor-grab text-default-400 hover:text-default-600"
                            aria-label="拖拽排序"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{plan.name}</p>
                              <Chip size="sm" variant="flat" color={plan.status === 1 ? "success" : "default"}>
                                {plan.status === 1 ? "启用" : "停用"}
                              </Chip>
                            </div>
                            <p className="text-sm mt-1">
                              <span className="text-primary font-semibold">¥{(plan.price / 100).toFixed(2)}</span>
                              {plan.original_price ? (
                                <span className="ml-2 text-xs line-through text-default-400">
                                  ¥{(plan.original_price / 100).toFixed(2)}
                                </span>
                              ) : null}
                              <span className="ml-2 text-xs text-default-500">/ {plan.duration_days} 天</span>
                            </p>
                            {plan.description ? (
                              <p className="text-xs text-default-500 mt-1">{plan.description}</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="light" isIconOnly onPress={() => mm.handleEditOpen(plan)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            color={plan.status === 1 ? "warning" : "success"}
                            onPress={async () => {
                              try {
                                await mm.handleTogglePlanStatus(plan);
                              } catch (error) {
                                addToast({
                                  title: error instanceof Error ? error.message : "切换状态失败",
                                  color: "danger",
                                  timeout: 3000,
                                });
                              }
                            }}
                          >
                            {plan.status === 1 ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            color="danger"
                            onPress={() => mm.handleDeleteClick(plan)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="border border-border/60 shadow-sm overflow-hidden">
            <CardBody className="p-0 h-full flex flex-col">
              <div className="px-5 pt-4 pb-3 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">会员用户</h2>
                  <p className="text-xs text-muted-foreground mt-1">查看已订阅用户及到期状态</p>
                </div>
                <Select
                  aria-label="会员状态筛选"
                  className="max-w-[140px]"
                  placeholder="全部"
                  selectedKeys={mm.memberStatusFilter ? [mm.memberStatusFilter] : []}
                  isClearable
                  size="sm"
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0];
                    mm.setMemberStatusFilter(key ? (String(key) as "active" | "expired") : "");
                    mm.setPage(1);
                  }}
                  onClear={() => {
                    mm.setMemberStatusFilter("");
                    mm.setPage(1);
                  }}
                >
                  <SelectItem key="active">有效</SelectItem>
                  <SelectItem key="expired">已过期</SelectItem>
                </Select>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden px-3 py-2">
                <Table aria-label="会员用户列表" removeWrapper>
                  <TableHeader>
                    <TableColumn key="user_id">用户ID</TableColumn>
                    <TableColumn key="plan_name">套餐</TableColumn>
                    <TableColumn key="start_time">开始时间</TableColumn>
                    <TableColumn key="expire_time">到期时间</TableColumn>
                    <TableColumn key="status">状态</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={mm.members}
                    isLoading={mm.isMembersLoading}
                    loadingContent={<Spinner size="sm" label="加载中..." />}
                    emptyContent="暂无会员用户"
                  >
                    {member => (
                      <TableRow key={String(member.id)}>
                        <TableCell>{member.user_id}</TableCell>
                        <TableCell>{member.plan_name || "-"}</TableCell>
                        <TableCell>{formatDateTime(member.start_time)}</TableCell>
                        <TableCell>{formatDateTime(member.expire_time)}</TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat" color={member.is_expired ? "default" : "success"}>
                            {member.is_expired ? "已过期" : "有效"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="px-4 pb-3 flex items-center justify-between">
                <span className="text-xs text-default-500">共 {mm.membersTotal} 位会员</span>
                <Pagination isCompact showControls page={mm.page} total={mm.totalPages} onChange={mm.setPage} />
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={mm.deleteModal.isOpen}
        onOpenChange={mm.deleteModal.onOpenChange}
        title="删除会员套餐"
        description={`确定要删除套餐「${mm.deleteTarget?.name || ""}」吗？已购买会员不受影响。`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={mm.handleDeleteConfirm}
      />

      <PlanEditDialog
        key={`${mm.editingPlan?.id ?? "new"}-${mm.editModal.isOpen ? "open" : "closed"}`}
        isOpen={mm.editModal.isOpen}
        onOpenChange={mm.editModal.onOpenChange}
        plan={mm.editingPlan}
        onSubmit={mm.handleSavePlan}
        isSubmitting={mm.isSubmitting}
      />
    </motion.div>
  );
}
