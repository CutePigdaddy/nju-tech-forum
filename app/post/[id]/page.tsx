import { notFound } from "next/navigation";
import { PromptCard } from "@/components/prompt-card";
import { PostActions } from "@/components/post-actions";
import { PostComments } from "@/components/post-comments";
import { getDemoPostById } from "@/lib/demo-store";
import type { PostBodySection } from "@/lib/mock-data";

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

function renderSection(section: PostBodySection, index: number) {
  if (section.type === "paragraph") {
    return (
      <p key={index} className="article-paragraph">
        {section.content}
      </p>
    );
  }

  if (section.type === "heading") {
    return (
      <h2 key={index} className="article-heading">
        {section.content}
      </h2>
    );
  }

  if (section.type === "bullet-list") {
    return (
      <ul key={index} className="article-list">
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (section.type === "ordered-list") {
    return (
      <ol key={index} className="article-list article-list-ordered">
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  if (section.type === "callout") {
    return (
      <div key={index} className="article-callout">
        <div className="article-callout-title">{section.title}</div>
        <div className="article-callout-body">{section.content}</div>
      </div>
    );
  }

  return (
    <div key={index} className="article-code-block">
      <div className="article-code-label">{section.language}</div>
      <pre className="article-code-content">{section.content}</pre>
    </div>
  );
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = getDemoPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-container py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.58fr_0.82fr]">
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

          <h1 className="mt-5 text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] md:text-[2.7rem]">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[1.02rem] leading-8 text-[var(--muted)]">
            {post.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,#fcfbff_0%,#f6f7ff_100%)] p-4 text-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
              {post.author.name.slice(0, 1)}
            </span>
            <span className="font-medium text-[var(--foreground)]">{post.author.name}</span>
            <span className="rounded-full border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
              {post.author.level}
            </span>
            <span className="text-[var(--muted)]">{post.publishedAt}</span>
          </div>

          <div className="article-prose mt-9">
            {post.body.map((section, index) => renderSection(section, index))}
          </div>

          <div className="mt-10">
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
              <li>先看作者是怎么定位问题的，再看 Prompt 和工作流部分。</li>
              <li>不要急着整段照抄，先复现一遍关键步骤，再按自己的场景改细节。</li>
              <li>如果你已经试过，可以在评论区补充自己的踩坑点和修订版本。</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
