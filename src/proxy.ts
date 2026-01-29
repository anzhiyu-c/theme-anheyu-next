import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy
 * 用于处理请求级别的路由控制
 *
 * 注意：由于使用 localStorage 存储认证信息，proxy 无法直接验证 token
 * 完整的认证逻辑在各个 Layout 组件中通过客户端进行
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 路由直接放行
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 静态资源直接放行
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 可以在这里添加：
  // - 请求头注入
  // - 国际化重定向
  // - A/B 测试路由

  return NextResponse.next();
}

export const config = {
  // 匹配所有路由，但排除静态资源
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
