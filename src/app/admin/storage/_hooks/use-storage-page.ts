import { useState, useCallback, useMemo } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import { useStoragePolicies, useCreateStoragePolicy, useUpdateStoragePolicy, useDeleteStoragePolicy } from "@/hooks/queries/use-storage-policy";
import type { StoragePolicy, StoragePolicyType } from "@/types/storage-policy";

/** 文件大小单位乘数 */
const SIZE_MULTIPLIERS: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

function bytesToDisplay(bytes: number): { value: string; unit: string } {
  if (bytes <= 0) return { value: "0", unit: "MB" };
  if (bytes >= 1024 * 1024 * 1024) return { value: String(Math.round(bytes / (1024 * 1024 * 1024))), unit: "GB" };
  if (bytes >= 1024 * 1024) return { value: String(Math.round(bytes / (1024 * 1024))), unit: "MB" };
  if (bytes >= 1024) return { value: String(Math.round(bytes / 1024)), unit: "KB" };
  return { value: String(bytes), unit: "B" };
}

export function useStoragePage() {
  // ---- 分页 ----
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ---- 数据 ----
  const queryParams = useMemo(() => ({ page, pageSize }), [page, pageSize]);
  const { data, isLoading, isFetching, refetch } = useStoragePolicies(queryParams);
  const policies = useMemo(() => data?.list ?? [], [data?.list]);
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // ---- Mutations ----
  const createPolicy = useCreateStoragePolicy();
  const updatePolicy = useUpdateStoragePolicy();
  const deletePolicy = useDeleteStoragePolicy();

  // ---- Modal 控制 ----
  const typeSelectorModal = useDisclosure();
  const formModal = useDisclosure();
  const deleteConfirm = useDisclosure();

  // ---- 表单状态 ----
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedType, setSelectedType] = useState<StoragePolicyType>("local");
  const [editTarget, setEditTarget] = useState<StoragePolicy | null>(null);
  const [form, setForm] = useState<Partial<StoragePolicy>>({});
  const [deleteTarget, setDeleteTarget] = useState<StoragePolicy | null>(null);

  // 文件大小显示
  const [sizeValue, setSizeValue] = useState("0");
  const [sizeUnit, setSizeUnit] = useState("MB");

  // ---- 创建流程 ----
  const handleSelectType = useCallback((type: StoragePolicyType) => {
    setSelectedType(type);
    setFormMode("create");
    setEditTarget(null);
    setForm({
      type,
      name: "",
      flag: "",
      is_private: false,
      max_size: 0,
      settings: { chunk_size: 25 * 1024 * 1024 },
    });
    setSizeValue("0");
    setSizeUnit("MB");
    formModal.onOpen();
  }, [formModal]);

  const handleAddClick = useCallback(() => {
    typeSelectorModal.onOpen();
  }, [typeSelectorModal]);

  // ---- 编辑流程 ----
  const handleEdit = useCallback((policy: StoragePolicy) => {
    setFormMode("edit");
    setSelectedType(policy.type);
    setEditTarget(policy);
    setForm({ ...policy });
    const display = bytesToDisplay(policy.max_size ?? 0);
    setSizeValue(display.value);
    setSizeUnit(display.unit);
    formModal.onOpen();
  }, [formModal]);

  // ---- 删除流程 ----
  const handleDeleteClick = useCallback((policy: StoragePolicy) => {
    setDeleteTarget(policy);
    deleteConfirm.onOpen();
  }, [deleteConfirm]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deletePolicy.mutateAsync(deleteTarget.id);
      addToast({ title: "存储策略已删除", color: "success", timeout: 3000 });
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "删除失败", color: "danger", timeout: 3000 });
    }
    deleteConfirm.onClose();
    setDeleteTarget(null);
  }, [deleteTarget, deletePolicy, deleteConfirm]);

  // ---- 表单提交 ----
  const handleFormConfirm = useCallback(async () => {
    if (!form.name?.trim()) {
      addToast({ title: "请填写策略名称", color: "warning", timeout: 3000 });
      return;
    }

    // 将 sizeValue + sizeUnit 转回 bytes
    const maxSizeBytes = (Number(sizeValue) || 0) * (SIZE_MULTIPLIERS[sizeUnit] ?? 1024 * 1024);
    const payload = { ...form, max_size: maxSizeBytes };

    try {
      if (formMode === "create") {
        await createPolicy.mutateAsync(payload);
        addToast({ title: `存储策略「${form.name}」创建成功`, color: "success", timeout: 3000 });
      } else if (editTarget) {
        await updatePolicy.mutateAsync({ id: editTarget.id, data: payload });
        addToast({ title: `存储策略「${form.name}」已更新`, color: "success", timeout: 3000 });
      }
      formModal.onClose();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : (formMode === "create" ? "创建失败" : "更新失败"),
        color: "danger",
        timeout: 3000,
      });
    }
  }, [form, formMode, editTarget, sizeValue, sizeUnit, createPolicy, updatePolicy, formModal]);

  // ---- Size unit/value 变更 ----
  const handleSizeValueChange = useCallback((v: string) => {
    setSizeValue(v);
  }, []);

  const handleSizeUnitChange = useCallback((unit: string) => {
    setSizeUnit(unit);
  }, []);

  return {
    // 分页
    page, setPage, pageSize, setPageSize, totalItems, totalPages,
    // 数据
    policies, isLoading, isFetching, refetch,
    // Modal
    typeSelectorModal, formModal, deleteConfirm,
    // 表单
    formMode, selectedType, form, setForm, editTarget, deleteTarget,
    sizeValue, sizeUnit, handleSizeValueChange, handleSizeUnitChange,
    // 操作
    handleAddClick, handleSelectType, handleEdit,
    handleDeleteClick, handleDeleteConfirm,
    handleFormConfirm,
    // Mutation states
    createPolicy, updatePolicy, deletePolicy,
  };
}
