"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@heroui/react";
import { RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 错误边界组件
 * 用于捕获子组件的 JavaScript 错误，记录错误日志，并显示备用 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息，可以发送到日志服务
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI - 全屏居中布局
      return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center">
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto">
            {/* 图标 */}
            <div className="mb-8">
              <span className="text-5xl">😵</span>
            </div>

            {/* 标题和描述 */}
            <h2 className="text-2xl font-semibold text-foreground mb-3">出错了</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              页面遇到了一些问题，请尝试刷新页面或返回首页。
            </p>

            {/* 开发环境错误信息 */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-4 bg-destructive/5 border border-destructive/10 rounded-lg text-left w-full">
                <p className="text-sm font-mono text-destructive break-all">{this.state.error.message}</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex items-center gap-4">
              <Button
                color="default"
                variant="light"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={this.handleRetry}
              >
                重试
              </Button>
              <Button
                color="default"
                variant="light"
                startContent={<Home className="w-4 h-4" />}
                onPress={this.handleGoHome}
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
