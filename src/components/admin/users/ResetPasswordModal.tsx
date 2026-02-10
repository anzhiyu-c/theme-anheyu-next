/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-02-06 23:13:22
 * @LastEditTime: 2026-02-07 21:49:08
 * @LastEditors: 安知鱼
 */
"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { FormInput } from "@/components/ui/form-input";
import { KeyRound } from "lucide-react";
import type { AdminUser } from "@/types/user-management";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  target: AdminUser | null;
  newPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ResetPasswordModal({
  isOpen,
  onOpenChange,
  target,
  newPassword,
  onPasswordChange,
  onConfirm,
  isLoading,
}: ResetPasswordModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-warning-50">
                  <KeyRound className="w-5 h-5 text-warning" />
                </div>
                <span>重置密码</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-500 mb-3">
                为用户「<strong>{target?.nickname || target?.username}</strong>」设置新密码
              </p>
              <FormInput
                label="新密码"
                placeholder="至少 6 位"
                type="password"
                isRequired
                value={newPassword}
                onValueChange={onPasswordChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                取消
              </Button>
              <Button
                color="warning"
                onPress={onConfirm}
                isLoading={isLoading}
                isDisabled={!newPassword.trim() || newPassword.length < 6}
              >
                确认重置
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
