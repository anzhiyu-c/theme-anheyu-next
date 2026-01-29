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

      // 默认错误 UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-3xl">😵</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">出错了</h2>
            <p className="text-muted-foreground max-w-md">页面遇到了一些问题，请尝试刷新页面或返回首页。</p>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="mb-6 p-4 bg-destructive/5 rounded-lg text-left max-w-md w-full">
              <p className="text-sm font-mono text-destructive break-all">{this.state.error.message}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              color="primary"
              variant="flat"
              startContent={<RefreshCw className="w-4 h-4" />}
              onPress={this.handleRetry}
            >
              重试
            </Button>
            <Button variant="bordered" startContent={<Home className="w-4 h-4" />} onPress={this.handleGoHome}>
              返回首页
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
