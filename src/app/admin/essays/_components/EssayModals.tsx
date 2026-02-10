"use client";

import { AnimatePresence } from "framer-motion";
import { Download, Trash2, ShieldAlert } from "lucide-react";
import EssayEditDialog from "@/components/admin/essays/EssayEditDialog";
import EssayViewDialog from "@/components/admin/essays/EssayViewDialog";
import ImportDialog from "@/components/admin/essays/ImportDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FloatingSelectionBar } from "@/components/admin/FloatingSelectionBar";
import type { EssaysPageState } from "../_hooks/use-essays-page";

export function EssayModals({ cm }: { cm: EssaysPageState }) {
  return (
    <>
      {/* ===== 浮动选择操作栏 ===== */}
      <AnimatePresence>
        {cm.isSomeSelected && (
          <FloatingSelectionBar
            count={cm.selectedIds.size}
            actions={[
              {
                key: "export",
                label: "导出",
                icon: <Download className="w-3.5 h-3.5" />,
                onClick: cm.handleExport,
                disabled: cm.exportPending,
              },
              {
                key: "delete",
                label: "删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: cm.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => cm.setSelectedIds(new Set())}
          />
        )}
      </AnimatePresence>

      {/* ===== 弹窗 ===== */}
      <EssayEditDialog isOpen={cm.editModal.isOpen} onClose={cm.handleEditClose} editItem={cm.editItem} />
      <EssayViewDialog isOpen={cm.viewModal.isOpen} onClose={cm.handleViewClose} essay={cm.viewItem} />
      <ImportDialog isOpen={cm.importModal.isOpen} onClose={cm.importModal.onClose} />

      <ConfirmDialog
        isOpen={cm.deleteModal.isOpen}
        onOpenChange={cm.deleteModal.onOpenChange}
        title="删除说说"
        description="确定要删除这条说说吗？此操作不可撤销。"
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={cm.deleteEssayPending}
        onConfirm={cm.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={cm.batchDeleteModal.isOpen}
        onOpenChange={cm.batchDeleteModal.onOpenChange}
        title="批量删除"
        description={`确定要删除选中的 ${cm.selectedIds.size} 条说说吗？此操作不可撤销。`}
        confirmText={`删除 ${cm.selectedIds.size} 条`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={cm.batchDeletePending}
        onConfirm={cm.handleBatchDeleteConfirm}
      />
    </>
  );
}
