"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import { membershipApi } from "@/lib/api/membership";
import type {
  MembershipPlan,
  UserMembership,
  ListMembersRequest,
  CreatePlanRequest,
  UpdatePlanRequest,
} from "@/types/membership";

export function useMembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [members, setMembers] = useState<UserMembership[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [memberStatusFilter, setMemberStatusFilter] = useState<"active" | "expired" | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MembershipPlan | null>(null);

  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const totalPages = Math.max(1, Math.ceil(membersTotal / pageSize));

  const sortedPlans = useMemo(() => [...plans].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)), [plans]);

  const fetchPlans = useCallback(async () => {
    try {
      setIsPlansLoading(true);
      const response = await membershipApi.getPlans();
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取套餐列表失败");
      }
      setPlans(response.data.list || []);
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取套餐列表失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsPlansLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    const params: ListMembersRequest = {
      page,
      page_size: pageSize,
      status: memberStatusFilter || undefined,
    };

    try {
      setIsMembersLoading(true);
      const response = await membershipApi.getMembers(params);
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取会员列表失败");
      }
      setMembers(response.data.list || []);
      setMembersTotal(response.data.total || 0);
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取会员列表失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsMembersLoading(false);
    }
  }, [page, pageSize, memberStatusFilter]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCreateOpen = useCallback(() => {
    setEditingPlan(null);
    editModal.onOpen();
  }, [editModal]);

  const handleEditOpen = useCallback(
    (plan: MembershipPlan) => {
      setEditingPlan(plan);
      editModal.onOpen();
    },
    [editModal]
  );

  const handleSavePlan = useCallback(
    async (payload: CreatePlanRequest | UpdatePlanRequest) => {
      try {
        setIsSubmitting(true);
        if (editingPlan) {
          const response = await membershipApi.updatePlan(editingPlan.id, payload as UpdatePlanRequest);
          if (response.code !== 200) {
            throw new Error(response.message || "更新套餐失败");
          }
          addToast({ title: "套餐已更新", color: "success", timeout: 2500 });
        } else {
          const maxSortOrder = sortedPlans.reduce((max, plan) => Math.max(max, plan.sort_order || 0), 0);
          const response = await membershipApi.createPlan({
            ...(payload as CreatePlanRequest),
            sort_order: maxSortOrder + 1,
          });
          if (response.code !== 200) {
            throw new Error(response.message || "创建套餐失败");
          }
          addToast({ title: "套餐已创建", color: "success", timeout: 2500 });
        }
        editModal.onClose();
        setEditingPlan(null);
        await fetchPlans();
      } catch (error) {
        addToast({
          title: error instanceof Error ? error.message : "保存套餐失败",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingPlan, sortedPlans, editModal, fetchPlans]
  );

  const handleDeleteClick = useCallback(
    (plan: MembershipPlan) => {
      setDeleteTarget(plan);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const response = await membershipApi.deletePlan(deleteTarget.id);
      if (response.code !== 200) {
        throw new Error(response.message || "删除套餐失败");
      }
      addToast({ title: "套餐已删除", color: "success", timeout: 2500 });
      await fetchPlans();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "删除套餐失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      deleteModal.onClose();
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteModal, fetchPlans]);

  const handleTogglePlanStatus = useCallback(async (plan: MembershipPlan) => {
    const nextStatus = plan.status === 1 ? 2 : 1;
    const response = await membershipApi.updatePlan(plan.id, { status: nextStatus });
    if (response.code !== 200) {
      throw new Error(response.message || "切换套餐状态失败");
    }
    setPlans(prev => prev.map(item => (item.id === plan.id ? { ...item, status: nextStatus } : item)));
    addToast({
      title: nextStatus === 1 ? "套餐已启用" : "套餐已停用",
      color: "success",
      timeout: 2500,
    });
  }, []);

  const reorderPlans = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const next = [...sortedPlans];
      const moved = next.splice(fromIndex, 1)[0];
      next.splice(toIndex, 0, moved);
      setPlans(next);

      try {
        setIsSorting(true);
        await Promise.all(
          next.map((plan, index) =>
            membershipApi.updatePlan(plan.id, {
              sort_order: index,
            })
          )
        );
        addToast({ title: "排序已保存", color: "success", timeout: 2500 });
      } catch (error) {
        addToast({
          title: error instanceof Error ? error.message : "保存排序失败",
          color: "danger",
          timeout: 3000,
        });
        await fetchPlans();
      } finally {
        setIsSorting(false);
      }
    },
    [sortedPlans, fetchPlans]
  );

  return {
    plans: sortedPlans,
    members,
    membersTotal,
    totalPages,
    page,
    setPage,
    pageSize,
    setPageSize,
    memberStatusFilter,
    setMemberStatusFilter,
    isPlansLoading,
    isMembersLoading,
    isSubmitting,
    isSorting,
    editingPlan,
    deleteTarget,
    editModal,
    deleteModal,
    fetchPlans,
    fetchMembers,
    handleCreateOpen,
    handleEditOpen,
    handleSavePlan,
    handleDeleteClick,
    handleDeleteConfirm,
    handleTogglePlanStatus,
    reorderPlans,
  };
}

export type MembershipsPageState = ReturnType<typeof useMembershipsPage>;
