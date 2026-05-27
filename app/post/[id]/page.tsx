import { notFound } from "next/navigation";
import { PromptCard } from "@/components/prompt-card";
import { PostActions } from "@/components/post-actions";
import { PostComments } from "@/components/post-comments";
import { posts } from "@/lib/mock-data";

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = posts.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-container py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <article className="surface-card border border-white/80 p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  index === 0
                    ? "bg-[var(--primary-soft)] text-[var(--primary-deep)]"
                    : "bg-[var(--surface-soft)] text-[var(--muted)]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-[2rem] font-bold leading-[1.2] tracking-[-0.025em] md:text-[2.35rem]">
            {post.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,#fcfbff_0%,#f6f7ff_100%)] p-4 text-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
              {post.author.name.slice(0, 1)}
            </span>
            <span className="font-medium text-[var(--foreground)]">{post.author.name}</span>
            <span className="rounded-full border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
              {post.author.level}
            </span>
            <span className="text-[var(--muted)]">{post.publishedAt}</span>
          </div>

          <div className="prose-lite mt-8">
            <p>
              这篇内容围绕真实使用场景展开，重点分享作者如何把一套可复用的方法整理成更稳定的流程，并配套一张便于直接上手的 Prompt 卡片。
            </p>
            <h2>为什么这套方法值得参考</h2>
            <p>
              它不是单纯给出一个答案，而是把问题拆解、组织输入、生成结果和复查修改几个关键环节串起来，适合在学习和创作场景里长期复用。
            </p>
            <h2>你可以怎么使用这条经验</h2>
            <p>
              你可以先阅读作者的思路，再复制 Prompt 到自己的工具里尝试一遍，根据课程、任务或项目要求做适当调整，最后把结果整理成自己的版本。
            </p>
          </div>

          <div className="mt-8">
            <PromptCard post={post} />
          </div>

          <PostActions
            postId={post.id}
            initialStats={{
              likes: post.stats.likes,
              reproductions: post.stats.reproductions,
              favorites: post.stats.favorites
            }}
          />

          <PostComments postId={post.id} />
        </article>

        <aside className="grid gap-6">
          <section className="surface-card p-6">
            <h2 className="text-lg font-bold">作者信息</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {post.author.name}，{post.author.department}。如果这篇内容对你有帮助，也可以进入对方主页查看更多分享。
            </p>
          </section>

          <section className="surface-card p-6">
            <h2 className="text-lg font-bold">阅读建议</h2>
            <ul className="mt-3 grid gap-3 pl-5 text-sm leading-7 text-[var(--muted)]">
              <li>先看作者如何拆解问题，再看 Prompt 的写法。</li>
              <li>结合自己的任务目标调整输入内容和输出格式。</li>
              <li>如果已经试过这套方法，可以在评论区补充你的反馈。</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
