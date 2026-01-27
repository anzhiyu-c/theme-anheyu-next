import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "后台概览",
  description: "AnHeYu 后台管理系统",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
