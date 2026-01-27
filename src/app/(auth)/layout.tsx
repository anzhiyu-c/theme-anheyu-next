export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // 认证页面使用独立布局，不包含 Header/Footer
  return <>{children}</>;
}
