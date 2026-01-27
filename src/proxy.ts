import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 需要认证的路由
const protectedRoutes = ["/admin"];

// 认证相关路由（已登录用户访问会重定向）
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // 检查是否是认证路由
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // 从 cookie 中获取认证信息（服务端无法访问 localStorage）
  // 实际项目中应该使用 httpOnly cookie 存储 token
  // 这里我们依赖客户端的认证检查
  // 中间件主要用于提前重定向，减少不必要的页面加载

  // 获取认证 cookie（如果使用 cookie 存储）
  const authCookie = request.cookies.get("anheyu-auth");

  // 如果访问受保护路由但没有认证 cookie
  // 注意：实际的认证检查在客户端进行，proxy 只是提供额外的保护层
  // 因为我们使用 localStorage 存储 token，proxy 无法直接验证
  // 所以这里只做基本检查，完整的认证逻辑在 AdminLayout 组件中

  // 对于 API 路由，不进行重定向
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 对于静态资源，不进行重定向
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

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
