"use client";

import { useEffect, useMemo, useState } from "react";
import { profiles } from "@/lib/mock-data";
import {
  addPostComment,
  getDemoSession,
  getPostComments,
  getProfileOverride,
  type DemoComment
} from "@/lib/demo-store";

type PostCommentsProps = {
  postId: string;
};

export function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<DemoComment[]>([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setComments(getPostComments(postId));
  }, [postId]);

  const currentProfile = useMemo(() => {
    const session = getDemoSession();
    const currentId = session?.profileId ?? "u1";
    const base = profiles.find((item) => item.id === currentId) ?? profiles[0];
    const override = getProfileOverride(currentId);

    return {
      ...base,
      ...(override ?? {})
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setMessage("先写点评论内容再发布。");
      return;
    }

    const nextComment: DemoComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: currentProfile.id,
      authorName: currentProfile.name,
      authorLevel: currentProfile.level,
      content: content.trim(),
      createdAt: "刚刚"
    };

    addPostComment(nextComment);
    setComments((prev) => [nextComment, ...prev]);
    setContent("");
    setMessage("评论已发布。");
    window.setTimeout(() => setMessage(""), 1800);
  }

  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">评论区</h2>
        <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary-deep)]">
          {comments.length} 条评论
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-5 shadow-[0_10px_24px_rgba(93,107,255,0.04)]"
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
            {currentProfile.name.slice(0, 1)}
          </span>
          <div>
            <div className="text-sm font-semibold">{currentProfile.name}</div>
            <div className="text-xs text-[var(--muted)]">{currentProfile.level}</div>
          </div>
        </div>

        <textarea
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="写下你的补充经验、使用反馈或改进建议..."
          className="w-full rounded-3xl border border-[var(--border)] bg-white px-4 py-4 outline-none transition focus:border-[var(--primary)]"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-[var(--muted)]">
            你的评论会立即显示在当前帖子下方。
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
          >
            发布评论
          </button>
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--primary-deep)]">
            {message}
          </div>
        ) : null}
      </form>

      <div className="mt-6 grid gap-4">
        {comments.length ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-5 shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
                  {comment.authorName.slice(0, 1)}
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {comment.authorName}
                </span>
                <span className="rounded-full border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                  {comment.authorLevel}
                </span>
                <span className="text-xs text-[var(--muted)]">{comment.createdAt}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-6 text-sm text-[var(--muted)]">
            还没有评论，来留下第一条想法吧。
          </div>
        )}
      </div>
    </section>
  );
}
