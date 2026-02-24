"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Textarea,
  Spinner,
} from "@heroui/react";
import type { Ticket, TicketDetail } from "@/types/support";
import { formatDateTime } from "@/utils/date";

interface TicketDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TicketDetail | null;
  isLoading?: boolean;
  replyContent: string;
  onReplyContentChange: (value: string) => void;
  onReply: () => Promise<void>;
  isReplying?: boolean;
  onCloseTicket: (ticket: Ticket) => Promise<void>;
}

const statusMap: Record<string, { label: string; color: "warning" | "success" | "default" }> = {
  OPEN: { label: "待处理", color: "warning" },
  REPLIED: { label: "已回复", color: "success" },
  CLOSED: { label: "已关闭", color: "default" },
};

export function TicketDetailDrawer({
  isOpen,
  onOpenChange,
  ticket,
  isLoading = false,
  replyContent,
  onReplyContentChange,
  onReply,
  isReplying = false,
  onCloseTicket,
}: TicketDetailDrawerProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <span>工单详情</span>
                {ticket ? (
                  <Chip size="sm" variant="flat" color={statusMap[ticket.status]?.color || "default"}>
                    {statusMap[ticket.status]?.label || ticket.status}
                  </Chip>
                ) : null}
              </div>
            </ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="py-16 flex justify-center">
                  <Spinner label="加载工单详情..." size="sm" />
                </div>
              ) : !ticket ? (
                <div className="text-sm text-default-500">暂无工单详情</div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-default-200 p-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-default-500">工单号：</span>
                      <span className="font-mono">{ticket.ticket_no}</span>
                    </div>
                    <div>
                      <span className="text-default-500">关联订单：</span>
                      <span className="font-mono">{ticket.trade_no}</span>
                    </div>
                    <div>
                      <span className="text-default-500">用户邮箱：</span>
                      <span>{ticket.user_email || "-"}</span>
                    </div>
                    <div>
                      <span className="text-default-500">创建时间：</span>
                      <span>{formatDateTime(ticket.created_at)}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-default-500">主题：</span>
                      <span>{ticket.subject}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">对话记录</p>
                    <div className="space-y-2 max-h-[360px] overflow-y-auto rounded-xl border border-default-200 p-3">
                      {ticket.messages && ticket.messages.length > 0 ? (
                        ticket.messages.map(message => (
                          <div
                            key={message.id}
                            className={`rounded-lg p-2.5 ${
                              message.sender_type === "ADMIN" ? "bg-primary-50 dark:bg-primary/10" : "bg-default-100/70"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">
                                {message.sender_type === "ADMIN" ? "客服" : "用户"}
                              </span>
                              <span className="text-[11px] text-default-500">{formatDateTime(message.created_at)}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-default-500">暂无消息记录</p>
                      )}
                    </div>
                  </div>

                  {ticket.status !== "CLOSED" ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">回复用户</p>
                      <Textarea
                        value={replyContent}
                        onValueChange={onReplyContentChange}
                        placeholder="请输入回复内容..."
                        minRows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="flat"
                          color="warning"
                          onPress={async () => {
                            await onCloseTicket(ticket);
                          }}
                        >
                          关闭工单
                        </Button>
                        <Button
                          color="primary"
                          isLoading={isReplying}
                          onPress={async () => {
                            await onReply();
                          }}
                        >
                          发送回复
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-default-100/70 p-3 text-sm text-default-500">
                      该工单已关闭，如需继续沟通请让用户重新创建工单。
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
