import Link from "next/link";
import type { DemoPost } from "@/lib/mock-data";

export function FeaturedHero({ post }: { post: DemoPost }) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="rounded-[28px] border border-[rgba(255,255,255,0.24)] bg-[linear-gradient(140deg,rgba(13,79,129,0.96),rgba(89,151,201,0.9))] p-5 text-white transition hover:-translate-y-0.5"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
        Featured
      </div>
      <h2 className="mt-4 text-xl font-bold leading-8">{post.title}</h2>
      <p className="mt-3 text-sm leading-7 text-white/82">{post.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/80">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/14 px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
