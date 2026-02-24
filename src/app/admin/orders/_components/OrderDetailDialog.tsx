"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@heroui/react";
import { formatDateTime } from "@/utils/date";
import type { AdminOrder } from "@/types/order";

interface OrderDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
  onDelete?: (order: AdminOrder) => void;
}

const orderTypeLabelMap: Record<string, string> = {
  ARTICLE: "文章购买",
  SHARE: "分享购买",
  PRODUCT: "商品购买",
  MEMBERSHIP: "会员订阅",
};

const statusLabelMap: Record<string, string> = {
  PENDING: "待支付",
  SUCCESS: "支付成功",
  FAILED: "支付失败",
  CANCELLED: "已取消",
  EXPIRED: "已过期",
};

const providerLabelMap: Record<string, string> = {
  ALIPAY: "支付宝",
  WECHAT: "微信支付",
  EPAY: "易支付",
  HUPIJIAO: "虎皮椒V3",
};

const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
  PENDING: "warning",
  SUCCESS: "success",
  FAILED: "danger",
  CANCELLED: "default",
  EXPIRED: "danger",
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
      <div className="text-sm text-default-500">{label}</div>
      <div className="text-sm break-all">{value || "-"}</div>
    </div>
  );
}

export function OrderDetailDialog({ isOpen, onOpenChange, order, onDelete }: OrderDetailDialogProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span>订单详情</span>
              <span className="text-xs text-default-500 font-normal">{order?.order_no || "-"}</span>
            </ModalHeader>
            <ModalBody>
              {!order ? (
                <div className="text-sm text-default-500">暂无订单数据</div>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-default-50 dark:bg-default-100/40">
                    <div>
                      <p className="text-xs text-default-500 mb-1">订单类型</p>
                      <Chip size="sm" variant="flat" color="primary">
                        {orderTypeLabelMap[order.order_type] || order.order_type}
                      </Chip>
                    </div>
                    <div>
                      <p className="text-xs text-default-500 mb-1">支付状态</p>
                      <Chip size="sm" variant="flat" color={statusColorMap[order.payment_status] || "default"}>
                        {statusLabelMap[order.payment_status] || order.payment_status}
                      </Chip>
                    </div>
                    <div>
                      <p className="text-xs text-default-500 mb-1">支付方式</p>
                      <Chip size="sm" variant="flat" color="secondary">
                        {providerLabelMap[order.payment_provider] || order.payment_provider}
                      </Chip>
                    </div>
                  </div>

                  <InfoItem label="订单号" value={order.order_no} />
                  <InfoItem label="交易号" value={order.trade_no || "-"} />
                  <InfoItem label="用户邮箱" value={order.user_email || "匿名用户"} />
                  <InfoItem label="用户ID" value={order.user_id || "-"} />
                  <InfoItem
                    label="订单金额"
                    value={`¥${Number(order.amount || 0).toFixed(2)} ${order.currency || "CNY"}`}
                  />
                  <InfoItem label="创建时间" value={order.created_at ? formatDateTime(order.created_at) : "-"} />
                  <InfoItem label="支付时间" value={order.pay_time ? formatDateTime(order.pay_time) : "未支付"} />
                  <InfoItem label="过期时间" value={order.expire_time ? formatDateTime(order.expire_time) : "-"} />
                  <InfoItem label="IP 地址" value={order.client_ip || "-"} />
                  <InfoItem label="User Agent" value={order.user_agent || "-"} />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                关闭
              </Button>
              {order && onDelete ? (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => {
                    onDelete(order);
                    onClose();
                  }}
                >
                  删除订单
                </Button>
              ) : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
