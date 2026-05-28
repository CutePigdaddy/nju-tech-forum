"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearDemoSession, getComputedProfile, getDemoSession } from "@/lib/demo-store";

export function DemoSessionPanel() {
  const router = useRouter();
  const [currentUserLabel, setCurrentUserLabel] = useState<string | null>(null);

  useEffect(() => {
    const session = getDemoSession();

    if (!session) {
      setCurrentUserLabel(null);
      return;
    }

    const profile = getComputedProfile(session.profileId);
    setCurrentUserLabel(`${profile.name} · ${profile.level}`);
  }, []);

  function handleLogout() {
    clearDemoSession();
    setCurrentUserLabel(null);
    router.refresh();
    router.push("/auth");
  }

  if (!currentUserLabel) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/80 p-4 text-sm text-[var(--muted)]">
        当前还没有登录。使用测试账号 1 和密码 1 即可进入社区。
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-4 shadow-[0_8px_18px_rgba(93,107,255,0.04)]">
      <div className="text-sm">
        当前账号：
        <span className="ml-2 font-semibold text-[var(--foreground)]">
          {currentUserLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
      >
        退出登录
      </button>
    </div>
  );
}
