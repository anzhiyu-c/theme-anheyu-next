"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { Server, Cloud, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORAGE_TYPES, STORAGE_TYPE_LABELS, type StoragePolicyType } from "@/types/storage-policy";

const TYPE_ICONS: Record<StoragePolicyType, typeof Server> = {
  local: Server,
  onedrive: Cloud,
  tencent_cos: Database,
  aliyun_oss: Database,
  aws_s3: Database,
  qiniu_kodo: Database,
};

const TYPE_DESCRIPTIONS: Record<StoragePolicyType, string> = {
  local: "存储到服务器本地磁盘",
  onedrive: "Microsoft OneDrive 云存储",
  tencent_cos: "腾讯云对象存储",
  aliyun_oss: "阿里云对象存储",
  aws_s3: "AWS S3 兼容存储",
  qiniu_kodo: "七牛云对象存储",
};

interface StorageTypeSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: StoragePolicyType) => void;
}

export function StorageTypeSelector({ isOpen, onOpenChange, onSelect }: StorageTypeSelectorProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center" size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-2">
              <span className="text-lg font-semibold">选择存储方式</span>
              <span className="text-xs text-muted-foreground font-normal">请选择要添加的存储策略类型</span>
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STORAGE_TYPES.map((type) => {
                  const Icon = TYPE_ICONS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        onSelect(type);
                        onClose();
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border/60",
                        "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                        "group text-center"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted/40 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {STORAGE_TYPE_LABELS[type]}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                          {TYPE_DESCRIPTIONS[type]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
