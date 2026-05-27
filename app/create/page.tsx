import { CreatePostForm } from "@/components/create-post-form";

export default function CreatePage() {
  return (
    <main className="page-container py-8 md:py-10">
      <section className="surface-card p-6 md:p-8">
        <div className="mb-8">
          <span className="eyebrow">发布内容</span>
          <h1 className="section-title mt-4">用结构化表单整理你的经验与 Prompt</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            通过标题、摘要、正文和 Prompt 卡片四部分整理内容，能让经验分享更清晰，也更方便其他同学复用。
          </p>
        </div>

        <CreatePostForm />
      </section>
    </main>
  );
}
