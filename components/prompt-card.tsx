import type { DemoPost } from "@/lib/mock-data";
import { CopyPromptButton } from "@/components/copy-prompt-button";

export function PromptCard({ post }: { post: DemoPost }) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f5ff_100%)] p-6 shadow-[0_18px_42px_rgba(93,107,255,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Prompt 卡片</span>
          <h2 className="mt-3 text-2xl font-bold">{post.promptCard.title}</h2>
        </div>
        <CopyPromptButton text={post.promptCard.prompt} />
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
            适用模型
          </div>
          <div className="text-sm leading-7 text-[var(--foreground)]">
            {post.promptCard.model}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
            Prompt
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
            {post.promptCard.prompt}
          </pre>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
            参数说明
          </div>
          <div className="text-sm leading-7 text-[var(--foreground)]">
            {post.promptCard.notes}
          </div>
        </div>
      </div>
    </section>
  );
}
