"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import { Package, Plus, Edit, Trash2, Eye, EyeOff, Tag, ShoppingCart, TrendingUp, Sparkles } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟商品数据
const mockProducts = [
  {
    id: 1,
    name: "Pro 会员年卡",
    description: "解锁全部高级功能，享受一年会员服务",
    price: 299,
    originalPrice: 399,
    sales: 156,
    stock: -1,
    status: "active",
    category: "会员",
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    name: "Pro 会员季卡",
    description: "解锁全部高级功能，享受三个月会员服务",
    price: 99,
    originalPrice: 129,
    sales: 89,
    stock: -1,
    status: "active",
    category: "会员",
    createdAt: "2026-01-01",
  },
  {
    id: 3,
    name: "Pro 会员月卡",
    description: "解锁全部高级功能，享受一个月会员服务",
    price: 39,
    originalPrice: 49,
    sales: 234,
    stock: -1,
    status: "active",
    category: "会员",
    createdAt: "2026-01-01",
  },
  {
    id: 4,
    name: "主题皮肤包",
    description: "10款精美主题皮肤，个性化您的博客",
    price: 49,
    originalPrice: 79,
    sales: 67,
    stock: -1,
    status: "active",
    category: "主题",
    createdAt: "2025-12-15",
  },
  {
    id: 5,
    name: "知识库高级版",
    description: "AI 驱动的智能知识库，支持语义搜索",
    price: 199,
    originalPrice: 299,
    sales: 23,
    stock: 100,
    status: "active",
    category: "功能",
    createdAt: "2025-12-01",
  },
  {
    id: 6,
    name: "旧版主题包",
    description: "已停售",
    price: 29,
    originalPrice: 39,
    sales: 45,
    stock: 0,
    status: "inactive",
    category: "主题",
    createdAt: "2025-10-01",
  },
];

type ProductItem = (typeof mockProducts)[number];

export default function ProductsPage() {
  const [products] = useState(mockProducts);

  // 计算统计数据
  const totalSales = products.reduce((acc, p) => acc + p.sales, 0);
  const totalRevenue = products.reduce((acc, p) => acc + p.price * p.sales, 0);

  const ProductCard = ({ product, index }: { product: ProductItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all",
        product.status === "inactive" && "opacity-60"
      )}
    >
      {/* 商品图片区域 */}
      <div className="relative aspect-[16/9] bg-linear-to-br from-primary/5 to-primary/20 flex items-center justify-center">
        <Package className="w-16 h-16 text-primary/30" />

        {/* 状态标签 */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-1 rounded-md text-xs font-medium",
              product.status === "active" ? "bg-green/80 text-white" : "bg-muted text-muted-foreground"
            )}
          >
            {product.status === "active" ? "销售中" : "已下架"}
          </span>
          <span className="px-2 py-1 rounded-md bg-primary/80 text-white text-xs font-medium">{product.category}</span>
        </div>

        {/* 折扣标签 */}
        {product.originalPrice > product.price && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-red text-white text-xs font-bold">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>

        {/* 价格 */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-2xl font-bold text-primary">¥{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">¥{product.originalPrice}</span>
          )}
        </div>

        {/* 统计 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            已售 {product.sales}
          </span>
          <span>{product.stock === -1 ? "无限库存" : product.stock === 0 ? "已售罄" : `库存 ${product.stock}`}</span>
        </div>

        {/* 操作 */}
        <div className="flex items-center gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Edit className="w-3.5 h-3.5" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 w-9 p-0",
              product.status === "active"
                ? "text-yellow hover:text-yellow hover:bg-yellow/10"
                : "text-green hover:text-green hover:bg-green/10"
            )}
          >
            {product.status === "active" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red hover:text-red hover:bg-red/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="商品管理"
        description="管理您的虚拟商品和服务"
        icon={Package}
        primaryAction={{
          label: "添加商品",
          icon: Plus,
          onClick: () => console.log("Add product"),
        }}
        actions={
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow/10 text-yellow text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            PRO 功能
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{products.length}</p>
          <p className="text-sm text-muted-foreground mt-1">商品总数</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-green">{products.filter(p => p.status === "active").length}</p>
          <p className="text-sm text-muted-foreground mt-1">在售商品</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-primary">{totalSales}</p>
          <p className="text-sm text-muted-foreground mt-1">总销量</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-orange">¥{(totalRevenue / 1000).toFixed(1)}k</p>
          <p className="text-sm text-muted-foreground mt-1">总收入</p>
        </AdminCard>
      </div>

      {/* 商品列表 */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={Package}
            title="暂无商品"
            description="创建您的第一个商品，开始销售"
            action={{
              label: "添加商品",
              icon: Plus,
              onClick: () => console.log("Add product"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
