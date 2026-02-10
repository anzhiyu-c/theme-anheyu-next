"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { Edit } from "lucide-react";

interface UserGroup {
  id: string;
  name: string;
}

interface EditUserForm {
  username: string;
  email: string;
  nickname: string;
  userGroupID: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: EditUserForm;
  onFormChange: (updater: (prev: EditUserForm) => EditUserForm) => void;
  userGroups: UserGroup[];
  onConfirm: () => void;
  isLoading: boolean;
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  userGroups,
  onConfirm,
  isLoading,
}: EditUserModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center" size="lg">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50">
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <span>修改用户</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="用户名"
                  value={form.username}
                  onValueChange={v => onFormChange(f => ({ ...f, username: v }))}
                />
                <FormInput
                  label="邮箱"
                  type="email"
                  value={form.email}
                  onValueChange={v => onFormChange(f => ({ ...f, email: v }))}
                />
                <FormInput
                  label="昵称"
                  value={form.nickname}
                  onValueChange={v => onFormChange(f => ({ ...f, nickname: v }))}
                />
                <FormSelect
                  label="用户组"
                  value={form.userGroupID}
                  onValueChange={(v: string) => onFormChange(f => ({ ...f, userGroupID: v }))}
                >
                  {userGroups.map(group => (
                    <FormSelectItem key={group.id}>{group.name}</FormSelectItem>
                  ))}
                </FormSelect>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                取消
              </Button>
              <Button color="primary" onPress={onConfirm} isLoading={isLoading}>
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
