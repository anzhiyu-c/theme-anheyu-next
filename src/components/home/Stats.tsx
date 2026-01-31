"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Eye, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StatsProps {
  statistics?: {
    articles: number;
    comments: number;
    views: number;
    visitors: number;
  };
}

export function Stats({ statistics }: StatsProps) {
  const stats = statistics || {
    articles: 128,
    comments: 2456,
    views: 123456,
    visitors: 45678,
  };

  const items = [
    { label: "文章", value: stats.articles, icon: FileText, color: "text-blue-500" },
    { label: "评论", value: stats.comments, icon: MessageSquare, color: "text-green-500" },
    { label: "浏览", value: stats.views, icon: Eye, color: "text-orange-500" },
    { label: "访客", value: stats.visitors, icon: Users, color: "text-purple-500" },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-widget text-center"
            >
              <div className={`inline-flex p-3 rounded-xl bg-muted mb-3 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold mb-1">{formatNumber(item.value)}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
