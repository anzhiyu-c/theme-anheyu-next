import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * 缓存重新验证 API
 * Go 后端在数据更新时调用此接口清理缓存
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tags, secret } = body;

    // 验证密钥（可选，增加安全性）
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
    }

    // 验证 tags 参数
    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ success: false, message: "Invalid tags parameter" }, { status: 400 });
    }

    // 重新验证指定的缓存标签
    for (const tag of tags) {
      await revalidateTag(tag, "default");
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tags,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// 支持 GET 请求（用于简单测试）
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get("tag");

  if (!tag) {
    return NextResponse.json({ success: false, message: "Missing tag parameter" }, { status: 400 });
  }

  try {
    await revalidateTag(tag, "default");
    return NextResponse.json({
      success: true,
      revalidated: true,
      tag,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
