"use client";

import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { FormTextarea } from "@/components/ui/form-textarea";
import FriendFormModal from "@/components/admin/friends/FriendFormModal";
import CategoryTagManager from "@/components/admin/friends/CategoryTagManager";
import ImportDialog from "@/components/admin/friends/ImportDialog";
import HealthCheckPanel from "@/components/admin/friends/HealthCheckPanel";
import type { FriendsPageState } from "../_hooks/use-friends-page";

interface FriendModalsProps {
  cm: FriendsPageState;
}

export function FriendModals({ cm }: FriendModalsProps) {
  return (
    <>
      {/* 新建/编辑友链 */}
      <FriendFormModal isOpen={cm.formModal.isOpen} onClose={cm.formModal.onClose} editItem={cm.editItem} />

      {/* 分类标签管理 */}
      <CategoryTagManager isOpen={cm.categoryTagModal.isOpen} onClose={cm.categoryTagModal.onClose} />

      {/* 导入 */}
      <ImportDialog isOpen={cm.importModal.isOpen} onClose={cm.importModal.onClose} />

      {/* 健康检查 */}
      <HealthCheckPanel isOpen={cm.healthCheckModal.isOpen} onClose={cm.healthCheckModal.onClose} />

      {/* 删除确认弹窗 */}
      <Modal isOpen={cm.deleteModal.isOpen} onClose={cm.deleteModal.onClose} size="sm">
        <ModalContent>
          <ModalHeader>确认删除</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              确定要删除友链 <strong>{cm.deleteTarget?.name}</strong> 吗？此操作不可撤销。
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={cm.deleteModal.onClose}>
              取消
            </Button>
            <Button color="danger" onPress={cm.handleDeleteConfirm} isLoading={cm.deleteLink.isPending}>
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 审核弹窗 */}
      <Modal isOpen={cm.reviewModal.isOpen} onClose={cm.reviewModal.onClose} size="sm">
        <ModalContent>
          <ModalHeader>{cm.reviewTarget?.action === "APPROVED" ? "通过审核" : "拒绝友链"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              {cm.reviewTarget?.action === "APPROVED"
                ? `确定通过 "${cm.reviewTarget?.item.name}" 的友链申请吗？`
                : `确定拒绝 "${cm.reviewTarget?.item.name}" 的友链申请吗？`}
            </p>
            {cm.reviewTarget?.action === "REJECTED" && (
              <FormTextarea
                label="拒绝原因"
                placeholder="请输入拒绝原因"
                value={cm.rejectReason}
                onValueChange={cm.setRejectReason}
                isRequired
                minRows={2}
                maxRows={4}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={cm.reviewModal.onClose}>
              取消
            </Button>
            <Button
              color={cm.reviewTarget?.action === "APPROVED" ? "success" : "danger"}
              onPress={cm.handleReviewConfirm}
              isLoading={cm.reviewLink.isPending}
            >
              {cm.reviewTarget?.action === "APPROVED" ? "通过" : "拒绝"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
