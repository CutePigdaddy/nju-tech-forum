"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCreatedPost, getDemoSession } from "@/lib/demo-store";
import { REPUTATION_REWARDS } from "@/lib/reputation";

export function CreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("学术提效");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [promptTitle, setPromptTitle] = useState("");
  const [promptModel, setPromptModel] = useState("");
  const [promptBody, setPromptBody] = useState("");
  const [promptNotes, setPromptNotes] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title || !excerpt || !content || !promptTitle || !promptBody) {
      setMessage("请先补齐标题、摘要、正文和 Prompt 卡片的核心内容。");
      return;
    }

    const session = getDemoSession();
    const authorId = session?.profileId ?? "u1";

    const reward = addCreatedPost({
      id: `local-${Date.now()}`,
      title,
      excerpt,
      content,
      category,
      publishedAt: "刚刚",
      tags: [category, "我的发布"],
      authorId,
      stats: {
        likes: 0,
        comments: 0,
        reproductions: 0,
        favorites: 0
      },
      promptCard: {
        title: promptTitle,
        model: promptModel || "通用大模型",
        prompt: promptBody,
        notes: promptNotes || "已保存到帖子中，可在个人主页继续查看。"
      }
    });

    const rewardText = reward
      ? ` 发布成功，获得 +${REPUTATION_REWARDS.publishPost} 声望，当前等级为 ${reward.level}。`
      : " 帖子已发布。";

    setMessage(`帖子已发布，正在跳转到个人主页。${rewardText}`);
    router.push(`/profile/${authorId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          标题
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：用 DeepSeek 写实验报告的完整流程"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          分类
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
          >
            <option>学术提效</option>
            <option>代码编写</option>
            <option>日常生活</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        摘要
        <textarea
          rows={3}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          placeholder="一句话说清楚这篇经验帖帮别人解决什么问题"
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        正文
        <textarea
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="先用普通 textarea 打通首版，后面如果真有时间再升级编辑体验。"
          className="rounded-3xl border border-[var(--border)] bg-white px-4 py-4 outline-none transition focus:border-[var(--primary)]"
        />
      </label>

      <div className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,#fcfbff_0%,#f4f6ff_100%)] p-5">
        <div>
          <h2 className="text-lg font-bold">Prompt 卡片</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            把常用 Prompt 单独整理出来，其他同学可以更快理解和复用。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={promptTitle}
            onChange={(event) => setPromptTitle(event.target.value)}
            placeholder="Prompt 标题"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
          />
          <input
            type="text"
            value={promptModel}
            onChange={(event) => setPromptModel(event.target.value)}
            placeholder="适用模型，例如 DeepSeek / Claude"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
          />
        </div>

        <textarea
          rows={6}
          value={promptBody}
          onChange={(event) => setPromptBody(event.target.value)}
          placeholder="Prompt 正文"
          className="rounded-3xl border border-[var(--border)] bg-white px-4 py-4 outline-none transition focus:border-[var(--primary)]"
        />

        <textarea
          rows={4}
          value={promptNotes}
          onChange={(event) => setPromptNotes(event.target.value)}
          placeholder="System Prompt / 参数说明"
          className="rounded-3xl border border-[var(--border)] bg-white px-4 py-4 outline-none transition focus:border-[var(--primary)]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)] transition hover:brightness-[0.98]"
        >
          发布帖子
        </button>
        <button
          type="button"
          className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)] transition hover:bg-[var(--surface-soft)]"
        >
          上传封面图
        </button>
      </div>

      {message ? (
        <div className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--primary-deep)]">
          {message}
        </div>
      ) : null}
    </form>
  );
}
