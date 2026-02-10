"use client";

import { motion } from "framer-motion";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { EssayManagementSkeleton } from "@/components/admin/essays/EssayManagementSkeleton";
import { useEssaysPage } from "./_hooks/use-essays-page";
import { EssayToolbar } from "./_components/EssayToolbar";
import { EssayList } from "./_components/EssayList";
import { EssayModals } from "./_components/EssayModals";

export default function EssayManagementPage() {
  const cm = useEssaysPage();

  if (cm.isLoading) {
    return <EssayManagementSkeleton />;
  }

  return (
    <motion.div
      className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8"
      variants={adminContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ===== 白色卡片容器 ===== */}
      <motion.div
        variants={adminItemVariants}
        className="flex-1 min-h-0 flex flex-col mx-6 mt-5 mb-2 bg-card border border-border/60 rounded-xl overflow-hidden"
      >
        <EssayToolbar cm={cm} />
        <EssayList cm={cm} />
      </motion.div>

      <EssayModals cm={cm} />
    </motion.div>
  );
}
