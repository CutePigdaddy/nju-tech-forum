import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <main className="page-container flex min-h-[calc(100vh-92px)] items-center py-10">
      <section className="surface-card mx-auto grid w-full max-w-5xl overflow-hidden md:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[linear-gradient(135deg,#6d78ff_0%,#8b7cff_100%)] p-8 text-white md:p-10">
          <span className="eyebrow bg-white/20 text-white">账号登录</span>
          <h1 className="section-title mt-5">登录后就能发布帖子、查看个人资料并参与评论互动</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/84">
            登录后可以继续浏览内容、发布经验、保存 Prompt，并在个人主页里管理自己的资料与发帖记录。
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/90">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              支持发布、评论、收藏和个人资料编辑等常用功能。
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              使用统一测试账号即可快速体验完整的社区互动流程。
            </div>
          </div>
        </div>

        <AuthForm />
      </section>
    </main>
  );
}
