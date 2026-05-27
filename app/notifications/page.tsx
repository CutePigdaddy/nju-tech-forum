import { notifications } from "@/lib/mock-data";

export default function NotificationsPage() {
  return (
    <main className="page-container py-8 md:py-10">
      <section className="surface-card p-6 md:p-8">
        <span className="eyebrow">消息通知</span>
        <h1 className="section-title mt-4">关注你的互动与更新</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          这里会集中展示点赞、收藏、评论和复现反馈，方便你及时了解社区里的最新互动。
        </p>

        <div className="mt-8 grid gap-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-5 shadow-[0_8px_18px_rgba(93,107,255,0.04)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </div>
              </div>
              <span className="pill">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
