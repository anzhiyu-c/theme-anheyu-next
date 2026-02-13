"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { X, QrCode, Check, Clock, RefreshCw, Smartphone, AlertTriangle } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import type { WechatQRCodeData } from "@/types/auth";

interface WechatLoginDialogProps {
  open: boolean;
  onClose: () => void;
  redirectUrl?: string;
}

export function WechatLoginDialog({ open, onClose, redirectUrl = "/admin" }: WechatLoginDialogProps) {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrcodeData, setQrcodeData] = useState<WechatQRCodeData | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopPolling();
    setQrcodeData(null);
    setStatus("pending");
    setError("");
    onClose();
  }, [stopPolling, onClose]);

  const startPolling = useCallback(
    (sceneId: string) => {
      stopPolling();

      pollingRef.current = setInterval(async () => {
        try {
          const res = await authApi.getWechatQRCodeStatus(sceneId);
          if (res.code === 200 && res.data) {
            const newStatus = res.data.status;
            setStatus(newStatus);

            if (newStatus === "confirmed") {
              stopPolling();
              const data = res.data;
              if (data.token) {
                const userInfo = (data.user_info || {}) as Record<string, string>;
                setAuth({
                  accessToken: data.token,
                  refreshToken: data.refresh_token || "",
                  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  userInfo: {
                    id: userInfo.id || "",
                    created_at: userInfo.created_at || "",
                    updated_at: userInfo.updated_at || "",
                    username: userInfo.username || userInfo.nickname || "",
                    nickname: userInfo.nickname || "",
                    avatar: userInfo.avatar || "",
                    email: userInfo.email || "",
                    lastLoginAt: null,
                    userGroupID: Number(userInfo.userGroupID) || 0,
                    userGroup: { id: "", name: "", description: "" },
                    status: 1,
                  },
                  roles: data.roles || [],
                });
                addToast({
                  title: "登录成功！",
                  color: "success",
                  timeout: 2000,
                });
                setTimeout(() => {
                  handleClose();
                  router.push(redirectUrl);
                }, 1000);
              }
            } else if (newStatus === "expired") {
              stopPolling();
            }
          }
        } catch {
          setError("查询二维码状态失败");
          stopPolling();
        }
      }, 2000);
    },
    [stopPolling, setAuth, router, redirectUrl, handleClose]
  );

  const loadQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setStatus("pending");

      const res = await authApi.createWechatLoginQRCode();
      if (res.code === 200 && res.data) {
        setQrcodeData(res.data);
        startPolling(res.data.scene_id);
      } else {
        setError(res.message || "生成二维码失败");
      }
    } catch {
      setError("生成二维码失败");
    } finally {
      setLoading(false);
    }
  }, [startPolling]);

  useEffect(() => {
    if (open) {
      loadQRCode();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [open, loadQRCode, stopPolling]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">微信扫码登录</h3>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 flex flex-col items-center min-h-[380px]">
          {loading && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <RefreshCw size={32} className="animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">正在生成二维码...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <AlertTriangle size={40} className="text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={loadQRCode}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                重新加载
              </button>
            </div>
          )}

          {!loading && !error && qrcodeData && (
            <div className="flex flex-col items-center gap-6 w-full">
              {/* QR Code */}
              <div className="relative p-3 bg-white rounded-2xl shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrcodeData.qrcode_url} alt="微信二维码" className="w-56 h-56 block" />

                {/* Expired overlay */}
                {status === "expired" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <Clock size={32} className="text-amber-500" />
                      <p className="text-sm font-semibold text-foreground">二维码已过期</p>
                      <button
                        onClick={loadQRCode}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        刷新二维码
                      </button>
                    </div>
                  </div>
                )}

                {/* Scanned overlay */}
                {status === "scanned" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-2xl">
                    <div className="flex flex-col items-center gap-2">
                      <Check size={32} className="text-green-500" />
                      <p className="text-sm font-semibold text-foreground">扫码成功</p>
                      <p className="text-xs text-muted-foreground">请在手机上确认登录</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Smartphone size={14} />
                  请使用微信扫描二维码
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  二维码5分钟内有效
                </span>
              </div>

              {/* Status */}
              <div className="flex flex-col items-center gap-2">
                {status === "pending" && (
                  <>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted">
                      <QrCode size={20} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">等待扫码...</p>
                  </>
                )}
                {status === "scanned" && (
                  <>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                      <Check size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">已扫码，等待确认...</p>
                  </>
                )}
                {status === "confirmed" && (
                  <>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                      <Check size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">登录成功!</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
