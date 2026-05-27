"use client";

import { useEffect, useState } from "react";
import {
  getStoredPostActions,
  getStoredPostStats,
  setStoredPostActions,
  setStoredPostStats,
  type DemoPostActionState
} from "@/lib/demo-store";

type PostActionsProps = {
  postId: string;
  initialStats: {
    likes: number;
    reproductions: number;
    favorites: number;
  };
};

export function PostActions({ postId, initialStats }: PostActionsProps) {
  const [stats, setStats] = useState(initialStats);
  const [actionState, setActionState] = useState<DemoPostActionState>({
    liked: false,
    reproduced: false,
    favorited: false
  });
  const [feedbackMessage, setFeedbackMessage] = useState<null | string>(null);

  useEffect(() => {
    const stored = getStoredPostStats(postId);
    const storedActions = getStoredPostActions(postId);

    if (stored) {
      setStats(stored);
    }

    if (storedActions) {
      setActionState(storedActions);
    }
  }, [postId]);

  function bump(
    field: keyof typeof initialStats,
    actionKey: keyof DemoPostActionState,
    label: string
  ) {
    if (actionState[actionKey]) {
      return;
    }

    const next = {
      ...stats,
      [field]: stats[field] + 1
    };
    const nextActions = {
      ...actionState,
      [actionKey]: true
    };

    setStats(next);
    setActionState(nextActions);
    setStoredPostStats(postId, next);
    setStoredPostActions(postId, nextActions);
    setFeedbackMessage(label);
    window.setTimeout(() => setFeedbackMessage(null), 1400);
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => bump("likes", "liked", "已点赞")}
          disabled={actionState.liked}
          className={`rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_24px_rgba(93,107,255,0.18)] transition ${
            actionState.liked
              ? "cursor-not-allowed bg-[linear-gradient(135deg,#6f78ff_0%,#95a0ff_100%)] text-white opacity-95"
              : "bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-white hover:brightness-[1.02]"
          }`}
        >
          {actionState.liked ? `已点赞 ${stats.likes}` : `点赞 ${stats.likes}`}
        </button>
        <button
          type="button"
          onClick={() => bump("reproductions", "reproduced", "已标记复现")}
          disabled={actionState.reproduced}
          className={`rounded-full border px-5 py-3 text-sm font-semibold shadow-[0_8px_18px_rgba(93,107,255,0.04)] transition ${
            actionState.reproduced
              ? "cursor-not-allowed border-[#cdeed6] bg-[#eefbf1] text-[#1f7b4c]"
              : "border-[var(--border)] bg-white text-[var(--primary-deep)] hover:bg-[var(--surface-soft)]"
          }`}
        >
          {actionState.reproduced ? `已复现 ${stats.reproductions}` : `标记复现 ${stats.reproductions}`}
        </button>
        <button
          type="button"
          onClick={() => bump("favorites", "favorited", "已收藏")}
          disabled={actionState.favorited}
          className={`rounded-full border px-5 py-3 text-sm font-semibold shadow-[0_8px_18px_rgba(93,107,255,0.04)] transition ${
            actionState.favorited
              ? "cursor-not-allowed border-[#ffe2a6] bg-[#fff6df] text-[#b56d00]"
              : "border-[var(--border)] bg-white text-[var(--primary-deep)] hover:bg-[var(--surface-soft)]"
          }`}
        >
          {actionState.favorited ? `已收藏 ${stats.favorites}` : `收藏 ${stats.favorites}`}
        </button>
      </div>
      {feedbackMessage ? (
        <div className="mt-4 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--primary-deep)]">
          {feedbackMessage}
        </div>
      ) : null}
    </>
  );
}
