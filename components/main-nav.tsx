"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearDemoSession, getComputedProfile, getDemoSession } from "@/lib/demo-store";

export function MainNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileInitial, setProfileInitial] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState<null | { type: "image" | "library"; value: string }>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = getDemoSession();
    if (!session) {
      setProfileId(null);
      setProfileInitial("");
      setProfileName("");
      setProfileAvatar(null);
      setIsLoggedIn(false);
      return;
    }

    const profile = getComputedProfile(session.profileId);
    const currentName = profile.nickname.trim() || profile.name.trim();

    setProfileId(session.profileId);
    setProfileInitial(currentName.slice(0, 1));
    setProfileName(`${currentName} · ${profile.level}`);
    setProfileAvatar({ type: profile.avatarType, value: profile.avatarUrl });
    setIsLoggedIn(true);
  }, [searchParams]);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "首页" },
      { href: isLoggedIn && profileId ? `/profile/${profileId}` : "/auth", label: "我的主页" }
    ],
    [isLoggedIn, profileId]
  );

  function handleLogout() {
    clearDemoSession();
    setIsLoggedIn(false);
    setProfileId(null);
    setProfileInitial("");
    setProfileName("");
    setProfileAvatar(null);
    router.refresh();
    router.push("/auth");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/88 shadow-[0_8px_24px_rgba(93,107,255,0.05)] backdrop-blur">
      <div className="page-container flex h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold text-[var(--foreground)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-base font-bold text-white shadow-[0_10px_24px_rgba(93,107,255,0.22)]">
              N
            </span>
            <span className="tracking-[-0.02em]">南大AI社区</span>
          </Link>
          <nav className="hidden gap-5 text-sm text-[var(--muted)] md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-[var(--primary-deep)] ${
                  link.href === "/" ? "font-semibold text-[var(--primary-deep)]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form
            action="/"
            className="nav-search hidden items-center rounded-full border border-white bg-white px-3 py-2 shadow-[0_8px_18px_rgba(93,107,255,0.04)] md:flex"
          >
            <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)] text-sm text-[var(--primary-deep)]">
              🔎
            </span>
            <input
              name="q"
              type="text"
              defaultValue={currentQuery}
              placeholder="搜索帖子、Prompt..."
              className="w-full border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </form>
          <Link
            href="/notifications"
            aria-label="查看通知"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-[18px] text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)] transition hover:bg-[var(--surface-soft)]"
          >
            🔔
          </Link>
          <div className="hidden text-sm text-[var(--muted)] lg:block">
            {isLoggedIn ? `当前账号：${profileName}` : "未登录"}
          </div>
          {isLoggedIn && profileId ? (
            <Link
              href={`/profile/${profileId}`}
              aria-label="进入个人主页"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white bg-[linear-gradient(135deg,#f1eeff_0%,#e5edff_100%)] text-sm font-bold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.05)] transition hover:scale-[1.02]"
            >
              {profileAvatar?.type === "image" ? (
                <img src={profileAvatar.value} alt="头像" className="h-full w-full object-cover" />
              ) : (
                profileInitial
              )}
            </Link>
          ) : null}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
            >
              退出
            </button>
          ) : (
            <Link
              href="/auth"
              className="rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
            >
              登录
            </Link>
          )}
          <Link
            href="/create"
            className="rounded-full bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)] transition hover:brightness-[0.98]"
          >
            发布
          </Link>
        </div>
      </div>
    </header>
  );
}
