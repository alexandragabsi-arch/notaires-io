import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// N8N calls this after publishing a new article to instantly clear the blog cache.
// Protect with a secret set in BLOG_REVALIDATE_SECRET env var.
export async function POST(req: NextRequest) {
  const secret = process.env.BLOG_REVALIDATE_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let slug: string | undefined;
  try {
    const body = await req.json();
    slug = body.slug;
  } catch {
    // no body is fine, just revalidate the index
  }

  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true, slug: slug ?? null });
}
