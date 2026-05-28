"use client";

import { useEffect, useMemo, useState } from "react";
import { posts, profiles, type DemoPost, type DemoProfile } from "@/lib/mock-data";
import {
  getComputedPost,
  getComputedProfile,
  getCreatedPosts,
  getDemoSession,
  setProfileOverride
} from "@/lib/demo-store";
import { getReputationLevel } from "@/lib/reputation";

type ProfileContentProps = {
  profileId: string;
};

export function ProfileContent({ profileId }: ProfileContentProps) {
  const [createdCount, setCreatedCount] = useState(0);
  const [createdPosts, setCreatedPosts] = useState<DemoPost[]>([]);
  const [sessionNotice, setSessionNotice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [profileView, setProfileView] = useState<DemoProfile | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftBio, setDraftBio] = useState("");

  const profile = useMemo(
    () => profiles.find((item) => item.id === profileId) ?? profiles[0],
    [profileId]
  );

  useEffect(() => {
    const mergedProfile = getComputedProfile(profileId);

    setProfileView(mergedProfile);
    setDraftName(mergedProfile.name);
    setDraftEmail(mergedProfile.email);
    setDraftBio(mergedProfile.bio);

    const stored = getCreatedPosts().filter((item) => item.authorId === profileId);

    setCreatedPosts(
      stored.map((item) =>
        getComputedPost({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          publishedAt: item.publishedAt,
          category: item.category,
          tags: item.tags,
          author: {
            id: mergedProfile.id,
            name: mergedProfile.name,
            department: mergedProfile.department,
            level: mergedProfile.level
          },
          stats: item.stats,
          promptCard: item.promptCard
        })
      )
    );
    setCreatedCount(stored.length);

    const session = getDemoSession();
    if (session?.profileId === profileId) {
      setSessionNotice("你当前查看的是自己的个人主页。");
    } else {
      setSessionNotice("你也可以在这里更新昵称、邮箱和个性签名。");
    }
  }, [profile, profileId]);

  const authoredPosts = posts
    .filter((post) => post.author.id === profile.id)
    .map((post) => getComputedPost(post));
  const allPosts = [...createdPosts, ...authoredPosts];
  const levelMeta = getReputationLevel(profileView?.reputation ?? 0);

  function handleSaveProfile() {
    if (!profileView) {
      return;
    }

    const nextProfile = {
      ...profileView,
      name: draftName.trim() || profileView.name,
      email: draftEmail.trim() || profileView.email,
      bio: draftBio.trim() || profileView.bio,
      level: getReputationLevel(profileView.reputation).title
    };

    setProfileOverride(profileId, {
      name: nextProfile.name,
      email: nextProfile.email,
      bio: nextProfile.bio
    });
    setProfileView(nextProfile);
    setIsEditing(false);
    setSaveMessage("个人资料已更新。");
    window.setTimeout(() => setSaveMessage(""), 1800);
  }

  if (!profileView) {
    return null;
  }

  const statCards = [
    {
      label: "当前等级",
      value: profileView.level,
      tone: "orange",
      icon: "✦"
    },
    {
      label: "声望值",
      value: `${profileView.reputation}`,
      tone: "blue",
      icon: "↗"
    },
    {
      label: "累计发帖",
      value: `${allPosts.length}`,
      tone: "green",
      icon: "✓"
    }
  ] as const;

  return (
    <>
      <section className="surface-card overflow-hidden border border-white/80 bg-white p-0 shadow-[0_20px_48px_rgba(35,55,120,0.08)]">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(255,186,104,0.22),transparent_24%),radial-gradient(circle_at_top_right,rgba(95,161,255,0.18),transparent_26%),linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-[linear-gradient(135deg,#ffe3bf_0%,#ffd27a_100%)] text-3xl font-bold text-[#b35a00] shadow-[0_16px_32px_rgba(255,176,82,0.22)]">
              {profileView.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="eyebrow border border-white/80 bg-white/88 text-[var(--foreground)] shadow-[0_8px_20px_rgba(39,68,145,0.08)]">
                  个人主页
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing((value) => !value)}
                  className="rounded-xl border border-[#d8deef] bg-white px-4 py-2 text-sm font-semibold text-[#43506a] shadow-[0_8px_18px_rgba(93,107,255,0.06)] transition hover:bg-[#f7f9ff]"
                >
                  {isEditing ? "取消编辑" : "编辑资料"}
                </button>
              </div>
              <h1 className="section-title mt-4">{profileView.name}</h1>
              <p className="mt-2 text-sm font-medium text-[#5f6880]">{profileView.department}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{profileView.bio}</p>
              <p className="mt-2 text-sm text-[#6f7592]">{profileView.email}</p>
              <div className="mt-4 rounded-2xl border border-[#efe4be] bg-[linear-gradient(180deg,#fff9ea_0%,#fff5d9_100%)] px-4 py-3 text-sm text-[#8c6200] shadow-[0_10px_24px_rgba(255,196,74,0.12)]">
                <div className="font-semibold">{profileView.level}</div>
                <div className="mt-1 leading-6">{levelMeta.description}</div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-2xl border p-4 shadow-sm ${
                      card.tone === "orange"
                        ? "border-[#ffd98d] bg-[linear-gradient(180deg,#fff8e8_0%,#fff2cb_100%)]"
                        : card.tone === "blue"
                          ? "border-[#cfe2ff] bg-[linear-gradient(180deg,#eef6ff_0%,#e1efff_100%)]"
                          : "border-[#cceccc] bg-[linear-gradient(180deg,#effcf2_0%,#e3f8e7_100%)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${
                          card.tone === "orange"
                            ? "bg-[#fff1c9] text-[#c06a00]"
                            : card.tone === "blue"
                              ? "bg-[#ddebff] text-[#1d6eb3]"
                              : "bg-[#dcf7e2] text-[#19804e]"
                        }`}
                      >
                        {card.icon}
                      </span>
                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            card.tone === "orange"
                              ? "text-[#9e650a]"
                              : card.tone === "blue"
                                ? "text-[#256aa8]"
                                : "text-[#24704e]"
                          }`}
                        >
                          {card.label}
                        </div>
                        <div
                          className={`mt-1 text-xl font-bold ${
                            card.tone === "orange"
                              ? "text-[#9c4d00]"
                              : card.tone === "blue"
                                ? "text-[#0d63a7]"
                                : "text-[#15663f]"
                          }`}
                        >
                          {card.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sessionNotice ? (
                <div className="mt-4 rounded-2xl border border-[#d7e6ff] bg-white/88 px-4 py-3 text-sm text-[#3167aa] shadow-[0_8px_18px_rgba(93,107,255,0.05)]">
                  {sessionNotice}
                </div>
              ) : null}
              {saveMessage ? (
                <div className="mt-3 rounded-2xl border border-[#cdeed6] bg-[#eefbf1] px-4 py-3 text-sm font-medium text-[#1f7b4c]">
                  {saveMessage}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {isEditing ? (
          <section className="surface-card border border-[#d9e2f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 lg:col-span-2">
            <h2 className="text-lg font-bold">编辑个人资料</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                个人名称
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                邮箱
                <input
                  value={draftEmail}
                  onChange={(event) => setDraftEmail(event.target.value)}
                  className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-medium">
              个性签名
              <textarea
                rows={4}
                value={draftBio}
                onChange={(event) => setDraftBio(event.target.value)}
                className="rounded-3xl border border-[#d8deef] bg-white px-4 py-4 outline-none transition focus:border-[#5d6bff]"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
              >
                保存资料
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-2xl border border-[#d8deef] bg-white px-5 py-3 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
              >
                取消
              </button>
            </div>
          </section>
        ) : null}

        <section className="surface-card border border-[#e2e8f6] bg-white p-6 shadow-[0_16px_36px_rgba(33,58,120,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f1ff] text-[#1767af]">
                📘
              </span>
              我的帖子
            </h2>
            {createdCount ? (
              <span className="rounded-full bg-[#fff2cf] px-3 py-1 text-xs font-semibold text-[#a85b00]">
                新增 {createdCount}
              </span>
            ) : null}
          </div>
          <div className="mt-4 grid gap-4">
            {allPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-[#e5ebf7] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 shadow-[0_10px_20px_rgba(93,107,255,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold">{post.title}</div>
                  <span className="rounded-full bg-[#eef5ff] px-2.5 py-1 text-[11px] font-semibold text-[#276aa8]">
                    {post.category}
                  </span>
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {post.excerpt}
                </div>
                <div className="mt-3 text-xs font-medium text-[#7a839d]">{post.publishedAt}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card border border-[#e2e8f6] bg-white p-6 shadow-[0_16px_36px_rgba(33,58,120,0.06)]">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f8ea] text-[#1d7d4c]">
              ⏱
            </span>
            近期声望变化
          </h2>
          <div className="mt-4 grid gap-4">
            {profileView.reputationLogs.map((item) => (
              <div
                key={`${item.label}-${item.delta}`}
                className="flex items-center justify-between rounded-2xl border border-[#e6f0e8] bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf8_100%)] p-4 shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
              >
                <span className="text-sm text-[var(--foreground)]">{item.label}</span>
                <span className="rounded-full bg-[#ddf7e4] px-3 py-1 text-sm font-semibold text-[var(--success)]">
                  +{item.delta}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
