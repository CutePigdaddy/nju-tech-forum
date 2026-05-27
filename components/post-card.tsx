import Link from "next/link";
import type { DemoPost } from "@/lib/mock-data";

export function PostCard({ post }: { post: DemoPost }) {
  return (
    <article className="surface-card border border-white/80 p-5 transition hover:border-[var(--primary-glow)] hover:shadow-[0_20px_44px_rgba(93,107,255,0.12)] md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                index === 0
                  ? "bg-[var(--primary-soft)] text-[var(--primary-deep)]"
                  : index === 1
                    ? "bg-[#f2f3f8] text-[var(--muted)]"
                    : "bg-white text-[var(--primary)] shadow-sm"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="pt-1 text-xs text-[var(--muted)]">{post.publishedAt}</span>
      </div>

      <Link
        href={`/post/${post.id}`}
        className="text-[1.15rem] font-bold leading-8 transition hover:text-[var(--primary)]"
      >
        {post.title}
      </Link>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>

      <div className="mt-5 flex flex-col gap-4 border-t border-[var(--border)] pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
            {post.author.name.slice(0, 1)}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">{post.author.name}</span>
            <span className="rounded-full border border-[var(--border)] bg-[#fafaff] px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] text-[var(--muted)]">
              {post.author.level}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          <span>👍 {post.stats.likes}</span>
          <span>💬 {post.stats.comments}</span>
          <span className="rounded-full bg-[#eefbf3] px-2.5 py-1 text-[var(--success)]">
            ✓ {post.stats.reproductions} 人已复现
          </span>
          <Link
            href={`/post/${post.id}`}
            className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-deep)]"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
