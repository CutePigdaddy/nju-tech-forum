import type { DemoPost } from "@/lib/mock-data";
import { CopyPromptButton } from "@/components/copy-prompt-button";

export function PromptCard({ post }: { post: DemoPost }) {
  return (
    <section className="rounded-[30px] border border-[#dfe3ff] bg-[linear-gradient(180deg,#ffffff_0%,#f6f3ff_100%)] p-6 shadow-[0_22px_48px_rgba(93,107,255,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <span className="eyebrow bg-white text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.08)]">
            Prompt Card
          </span>
          <h2 className="mt-4 text-[1.85rem] font-bold leading-[1.12] tracking-[-0.03em]">
            {post.promptCard.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.promptCard.notes}</p>
        </div>
        <CopyPromptButton text={post.promptCard.prompt} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-[#e6e9fb] bg-white p-5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
              适用模型
            </div>
            <div className="text-sm leading-7 text-[var(--foreground)]">{post.promptCard.model}</div>
          </div>

          <div className="rounded-[24px] border border-[#e6e9fb] bg-[#fcfcff] p-5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
              Prompt
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap text-[0.93rem] leading-7 text-[var(--foreground)]">
              {post.promptCard.prompt}
            </pre>
          </div>
        </div>

        <div className="grid gap-4">
          {post.promptCard.setup?.length ? (
            <div className="rounded-[24px] border border-[#e6e9fb] bg-white p-5">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
                使用前准备
              </div>
              <ul className="grid gap-2 text-sm leading-7 text-[var(--foreground)]">
                {post.promptCard.setup.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {post.promptCard.workflow?.length ? (
            <div className="rounded-[24px] border border-[#e6e9fb] bg-white p-5">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]">
                推荐流程
              </div>
              <ol className="grid gap-3 text-sm leading-7 text-[var(--foreground)]">
                {post.promptCard.workflow.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary-deep)]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
