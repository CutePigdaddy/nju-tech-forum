"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearDemoSession,
  getComputedProfile,
  getDemoSession,
  setDemoSession
} from "@/lib/demo-store";
import { profiles } from "@/lib/mock-data";
import { DemoSessionPanel } from "@/components/demo-session-panel";

type AuthStatus = "idle" | "error" | "success";

export function AuthForm() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentSessionName, setCurrentSessionName] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const session = getDemoSession();

    if (!session) {
      setCurrentSessionName(null);
    } else {
      const profile = getComputedProfile(session.profileId);
      setCurrentSessionName(profile.email);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  function clearPendingRedirect() {
    if (!redirectTimeoutRef.current) {
      return;
    }

    clearTimeout(redirectTimeoutRef.current);
    redirectTimeoutRef.current = null;
  }

  function beginLogin(profileId: string) {
    clearPendingRedirect();

    const checkInReward = setDemoSession({ profileId });
    const nextProfile = getComputedProfile(profileId);

    setCurrentSessionName(nextProfile.email);
    setStatus("success");
    setMessage(
      checkInReward
        ? `欢迎回来，${nextProfile.nickname}。今日签到 +${checkInReward.delta} 声望，当前等级 ${nextProfile.level}，正在进入你的个人主页...`
        : `欢迎回来，${nextProfile.nickname}。当前等级 ${nextProfile.level}，正在进入你的个人主页...`
    );
    redirectTimeoutRef.current = setTimeout(() => {
      router.push(`/profile/${profileId}`);
      router.refresh();
    }, 850);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account || !password) {
      setStatus("error");
      setMessage("请输入 NJU 邮箱和密码后再继续。");
      return;
    }

    const normalizedAccount = account.trim().toLowerCase();
    const matchedProfile = profiles.find((item) => item.email.toLowerCase() === normalizedAccount);

    if (!matchedProfile || !normalizedAccount.endsWith("@nju.edu.cn") || password !== "1") {
      setStatus("error");
      setMessage("邮箱或密码不正确。当前演示环境请使用资料中已有的 `@nju.edu.cn` 邮箱，密码输入 1。");
      return;
    }

    beginLogin(matchedProfile.id);
  }

  function handleReset() {
    clearPendingRedirect();
    clearDemoSession();
    setCurrentSessionName(null);
    setStatus("idle");
    setMessage("你已退出当前账号。");
    router.refresh();
  }

  const isRedirecting = status === "success";
  const inputClassName = `rounded-[22px] border bg-white/96 px-4 py-3.5 text-[15px] text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[#9aa1bf] ${
    status === "error"
      ? "border-[#ffb7b7] shadow-[0_0_0_4px_rgba(255,92,92,0.08)] focus:border-[#ff8f8f] focus:shadow-[0_0_0_4px_rgba(255,92,92,0.12)]"
      : "border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(93,107,255,0.12)]"
  }`;
  const messageClassName =
    status === "error"
      ? "border-[#ffd8d8] bg-[#fff7f7] text-[#c94b4b]"
      : status === "success"
        ? "border-[#dbe3ff] bg-[linear-gradient(180deg,#f7f9ff_0%,#eef2ff_100%)] text-[var(--primary-deep)]"
        : "border-[var(--border)] bg-white text-[var(--muted)]";

  return (
    <div className="p-8 md:p-10">
      <h2 className="text-2xl font-bold">登录账号</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        使用 `@nju.edu.cn` 邮箱登录即可进入社区，继续浏览内容、发布经验并参与互动。
      </p>

      <DemoSessionPanel />

      <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-5 shadow-[0_14px_28px_rgba(93,107,255,0.05)]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--muted)]">
          测试邮箱：<span className="font-semibold text-[var(--foreground)]">linzhao@nju.edu.cn</span>
          <span className="mx-2 text-[var(--border)]">/</span>
          演示密码：<span className="font-semibold text-[var(--foreground)]">1</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            <div className="flex items-center justify-between gap-3">
              <span>账号</span>
              <span className="text-xs font-medium text-[var(--muted)]">请输入已登记的 NJU 邮箱</span>
            </div>
            <input
              type="email"
              value={account}
              onChange={(event) => {
                setAccount(event.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="例如：linzhao@nju.edu.cn"
              disabled={isRedirecting}
              className={inputClassName}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            <div className="flex items-center justify-between gap-3">
              <span>密码</span>
              <span className="text-xs font-medium text-[var(--muted)]">演示环境统一输入 1</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="请输入密码"
              disabled={isRedirecting}
              className={inputClassName}
            />
          </label>

          <button
            type="submit"
            disabled={isRedirecting}
            className="flex items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(93,107,255,0.2)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.02] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-95"
          >
            {isRedirecting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                登录成功，正在进入...
              </>
            ) : (
              "立即登录"
            )}
          </button>
          {currentSessionName ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={isRedirecting}
              className="rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              退出当前账号
            </button>
          ) : null}
        </form>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <span>登录后将直接跳转到个人主页。</span>
          <span>你可以在个人主页继续查看和管理内容。</span>
        </div>
      </div>

      {currentSessionName ? (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)] shadow-[0_8px_18px_rgba(93,107,255,0.04)]">
          当前账号：<span className="font-semibold text-[var(--foreground)]">{currentSessionName}</span>
        </div>
      ) : null}

      {message ? (
        <div className={`mt-4 overflow-hidden rounded-2xl border px-4 py-3 text-sm shadow-[0_10px_24px_rgba(93,107,255,0.05)] ${messageClassName}`}>
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                status === "error"
                  ? "bg-[#ffe3e3] text-[#c94b4b]"
                  : status === "success"
                    ? "bg-white text-[var(--primary-deep)]"
                    : "bg-[var(--surface-soft)] text-[var(--primary-deep)]"
              }`}
            >
              {status === "error" ? "!" : status === "success" ? "✓" : "i"}
            </span>
            <div className="flex-1">
              <div className="font-semibold">
                {status === "error" ? "登录信息有误" : status === "success" ? "登录成功" : "提示"}
              </div>
              <div className="mt-1 leading-6">{message}</div>
              {status === "success" ? (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div className="auth-progress-bar h-full rounded-full bg-[linear-gradient(90deg,var(--primary)_0%,var(--accent)_100%)]" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
