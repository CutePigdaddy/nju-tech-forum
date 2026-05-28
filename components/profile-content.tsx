"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { posts, type DemoPost, type DemoProfile } from "@/lib/mock-data";
import {
  DEFAULT_AVATAR_LIBRARY,
  DEGREE_LEVEL_OPTIONS,
  DEPARTMENT_OPTIONS,
  GENDER_OPTIONS,
  PRIMARY_AI_TOOL_OPTIONS,
  PROFILE_VISIBILITY_OPTIONS,
  SKILL_FOCUS_OPTIONS,
  WORKFLOW_APP_OPTIONS,
  getEnrollmentYearOptions
} from "@/lib/profile-config";
import {
  getComputedPost,
  getComputedProfile,
  getCreatedPosts,
  getDemoSession,
  setProfileOverride,
  type DemoProfileOverride
} from "@/lib/demo-store";
import { getReputationLevel } from "@/lib/reputation";

type ProfileContentProps = {
  profileId: string;
};

type ProfileFormState = {
  avatarType: DemoProfile["avatarType"];
  avatarUrl: string;
  name: string;
  nickname: string;
  email: string;
  tagline: string;
  bio: string;
  gender: DemoProfile["gender"];
  genderCustom: string;
  degreeLevel: DemoProfile["degreeLevel"];
  academicDepartment: DemoProfile["academicDepartment"];
  enrollmentYear: string;
  primaryAiTools: DemoProfile["primaryAiTools"];
  workflowApps: DemoProfile["workflowApps"];
  skillFocus: DemoProfile["skillFocus"];
  githubUrl: string;
  academicUrl: string;
  profileVisibility: DemoProfile["profileVisibility"];
  showRealName: boolean;
  notifyReproduced: boolean;
  notifyLiked: boolean;
  notifyCommented: boolean;
};

function toFormState(profile: DemoProfile): ProfileFormState {
  return {
    avatarType: profile.avatarType,
    avatarUrl: profile.avatarUrl,
    name: profile.name,
    nickname: profile.nickname,
    email: profile.email,
    tagline: profile.tagline,
    bio: profile.bio,
    gender: profile.gender,
    genderCustom: profile.genderCustom,
    degreeLevel: profile.degreeLevel,
    academicDepartment: profile.academicDepartment,
    enrollmentYear: profile.enrollmentYear,
    primaryAiTools: profile.primaryAiTools,
    workflowApps: profile.workflowApps,
    skillFocus: profile.skillFocus,
    githubUrl: profile.githubUrl,
    academicUrl: profile.academicUrl,
    profileVisibility: profile.profileVisibility,
    showRealName: profile.showRealName,
    notifyReproduced: profile.notifyReproduced,
    notifyLiked: profile.notifyLiked,
    notifyCommented: profile.notifyCommented
  };
}

function isValidNjuEmail(value: string) {
  return /^[^\s@]+@nju\.edu\.cn$/i.test(value.trim());
}

function isValidOptionalUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function toggleTag<T extends string>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

function AvatarPreview({ profile }: { profile: DemoProfile }) {
  if (profile.avatarType === "image") {
    return (
      <img
        src={profile.avatarUrl}
        alt={`${profile.nickname} 的头像`}
        className="h-24 w-24 rounded-full object-cover shadow-[0_16px_32px_rgba(35,55,120,0.18)]"
      />
    );
  }

  const libraryAvatar =
    DEFAULT_AVATAR_LIBRARY.find((item) => item.id === profile.avatarUrl) ?? DEFAULT_AVATAR_LIBRARY[0];

  return (
    <div
      className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${libraryAvatar.accent} text-4xl shadow-[0_16px_32px_rgba(35,55,120,0.18)]`}
    >
      {libraryAvatar.icon}
    </div>
  );
}

export function ProfileContent({ profileId }: ProfileContentProps) {
  const [createdCount, setCreatedCount] = useState(0);
  const [createdPosts, setCreatedPosts] = useState<DemoPost[]>([]);
  const [sessionNotice, setSessionNotice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileView, setProfileView] = useState<DemoProfile | null>(null);
  const [formState, setFormState] = useState<ProfileFormState | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const baseProfile = useMemo(() => getComputedProfile(profileId), [profileId]);

  useEffect(() => {
    const mergedProfile = getComputedProfile(profileId);
    setProfileView(mergedProfile);
    setFormState(toFormState(mergedProfile));

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
          body:
            item.body ??
            item.content
              .split(/\n{2,}/)
              .map((content) => ({ type: "paragraph" as const, content })),
          promptCard: item.promptCard
        })
      )
    );
    setCreatedCount(stored.length);

    const session = getDemoSession();
    if (session?.profileId === profileId) {
      setSessionNotice("这里展示的是你的个人魔法档案，可以随时补全学术身份、工具偏好和隐私设置。");
    } else {
      setSessionNotice("当前是他人的个人主页，你仍然可以浏览对方的声望等级、帖子和技能标签。");
    }
  }, [profileId]);

  const authoredPosts = posts
    .filter((post) => post.author.id === baseProfile.id)
    .map((post) => getComputedPost(post));
  const allPosts = [...createdPosts, ...authoredPosts];
  const levelMeta = getReputationLevel(profileView?.reputation ?? 0);
  const enrollmentYearOptions = getEnrollmentYearOptions();
  const canEdit = getDemoSession()?.profileId === profileId;

  function updateForm<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setFormState((current) => (current ? { ...current, [key]: value } : current));
  }

  function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateForm("avatarType", "image");
      updateForm("avatarUrl", result);
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    if (!profileView || !formState) {
      return;
    }

    const trimmedNickname = formState.nickname.trim();
    const trimmedEmail = formState.email.trim().toLowerCase();

    if (trimmedNickname.length < 2 || trimmedNickname.length > 15) {
      setErrorMessage("昵称需控制在 2 到 15 个字符之间。");
      return;
    }

    if (!isValidNjuEmail(trimmedEmail)) {
      setErrorMessage("登录邮箱需为有效的 `@nju.edu.cn` 邮箱。");
      return;
    }

    if (!isValidOptionalUrl(formState.githubUrl) || !isValidOptionalUrl(formState.academicUrl)) {
      setErrorMessage("GitHub 或学术主页链接格式不正确，请使用 http 或 https 开头。");
      return;
    }

    const nextOverride: DemoProfileOverride = {
      ...profileView,
      ...formState,
      name: formState.showRealName ? profileView.name : trimmedNickname,
      nickname: trimmedNickname,
      email: trimmedEmail,
      tagline: formState.tagline.trim(),
      bio: formState.bio.trim(),
      githubUrl: formState.githubUrl.trim(),
      academicUrl: formState.academicUrl.trim(),
      genderCustom: formState.gender === "自定义" ? formState.genderCustom.trim() : ""
    };

    setProfileOverride(profileId, nextOverride);

    const computed = getComputedProfile(profileId);
    setProfileView(computed);
    setFormState(toFormState(computed));
    setIsEditing(false);
    setErrorMessage("");
    setSaveMessage("个人资料已更新，新的学术档案和偏好设置已生效。");
    window.setTimeout(() => setSaveMessage(""), 2200);
  }

  if (!profileView || !formState) {
    return null;
  }

  const statCards = [
    { label: "当前等级", value: profileView.level, tone: "orange", icon: "✦" },
    { label: "声望值", value: `${profileView.reputation}`, tone: "blue", icon: "↗" },
    { label: "累计发帖", value: `${allPosts.length}`, tone: "green", icon: "✓" }
  ] as const;

  const profileTags = [
    ...profileView.primaryAiTools,
    ...profileView.workflowApps,
    ...profileView.skillFocus
  ];

  return (
    <>
      <section className="surface-card overflow-hidden border border-white/80 bg-white p-0 shadow-[0_20px_48px_rgba(35,55,120,0.08)]">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(255,186,104,0.22),transparent_24%),radial-gradient(circle_at_top_right,rgba(95,161,255,0.18),transparent_26%),linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <AvatarPreview profile={profileView} />
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="eyebrow border border-white/80 bg-white/88 text-[var(--foreground)] shadow-[0_8px_20px_rgba(39,68,145,0.08)]">
                  个人魔法档案
                </span>
                {canEdit ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing((value) => !value);
                      setErrorMessage("");
                    }}
                    className="rounded-xl border border-[#d8deef] bg-white px-4 py-2 text-sm font-semibold text-[#43506a] shadow-[0_8px_18px_rgba(93,107,255,0.06)] transition hover:bg-[#f7f9ff]"
                  >
                    {isEditing ? "取消编辑" : "编辑资料"}
                  </button>
                ) : null}
              </div>
              <h1 className="section-title mt-4">{profileView.nickname}</h1>
              <p className="mt-2 text-sm font-medium text-[#5f6880]">
                {profileView.degreeLevel} · {profileView.academicDepartment} · {profileView.enrollmentYear}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground)]">{profileView.tagline}</p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">{profileView.bio}</p>
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
                        <div className="text-xs font-semibold">{card.label}</div>
                        <div className="mt-1 text-xl font-bold">{card.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {profileTags.length ? (
                  profileTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#dce7fb] bg-white px-3 py-1 text-xs font-semibold text-[#3765a3]"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--muted)]">还没有补充工具偏好和技能方向。</span>
                )}
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
              {errorMessage ? (
                <div className="mt-3 rounded-2xl border border-[#ffd9d9] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#c14a4a]">
                  {errorMessage}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {isEditing && canEdit ? (
          <section className="surface-card border border-[#d9e2f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">编辑个人资料</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  这里会同时影响你的登录邮箱、主页展示身份和社区中的公开昵称。
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-[#d8deef] bg-white px-4 py-2 text-sm font-semibold text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(93,107,255,0.04)]"
              >
                上传本地头像
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="mt-6 grid gap-6">
              <section className="rounded-3xl border border-[#e3eaf8] bg-white p-5">
                <h3 className="text-base font-bold">1. 基础身份信息</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    NJU 邮箱
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    昵称（2-15 字）
                    <input
                      value={formState.nickname}
                      maxLength={15}
                      onChange={(event) => updateForm("nickname", event.target.value)}
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    />
                  </label>
                </div>

                <label className="mt-4 grid gap-2 text-sm font-medium">
                  一句话简介
                  <input
                    value={formState.tagline}
                    maxLength={40}
                    onChange={(event) => updateForm("tagline", event.target.value)}
                    className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                  />
                </label>

                <label className="mt-4 grid gap-2 text-sm font-medium">
                  个人简介
                  <textarea
                    rows={4}
                    value={formState.bio}
                    onChange={(event) => updateForm("bio", event.target.value)}
                    className="rounded-3xl border border-[#d8deef] bg-white px-4 py-4 outline-none transition focus:border-[#5d6bff]"
                  />
                </label>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    性别
                    <select
                      value={formState.gender}
                      onChange={(event) => updateForm("gender", event.target.value as DemoProfile["gender"])}
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  {formState.gender === "自定义" ? (
                    <label className="grid gap-2 text-sm font-medium">
                      自定义性别
                      <input
                        value={formState.genderCustom}
                        onChange={(event) => updateForm("genderCustom", event.target.value)}
                        className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                      />
                    </label>
                  ) : null}
                </div>

                <div className="mt-5">
                  <div className="text-sm font-medium">AI 极客风默认头像库</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {DEFAULT_AVATAR_LIBRARY.map((avatar) => {
                      const active =
                        formState.avatarType === "library" && formState.avatarUrl === avatar.id;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => {
                            updateForm("avatarType", "library");
                            updateForm("avatarUrl", avatar.id);
                          }}
                          className={`rounded-3xl border p-4 text-left transition ${
                            active
                              ? "border-[#bcd0ff] bg-[#f4f7ff] shadow-[0_10px_24px_rgba(93,107,255,0.1)]"
                              : "border-[#e3eaf8] bg-white"
                          }`}
                        >
                          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${avatar.accent} text-2xl`}>
                            {avatar.icon}
                          </div>
                          <div className="mt-3 text-sm font-semibold">{avatar.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#e3eaf8] bg-white p-5">
                <h3 className="text-base font-bold">2. 校园学术档案</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-sm font-medium">
                    学历阶段
                    <select
                      value={formState.degreeLevel}
                      onChange={(event) =>
                        updateForm("degreeLevel", event.target.value as DemoProfile["degreeLevel"])
                      }
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    >
                      {DEGREE_LEVEL_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    所属院系
                    <select
                      value={formState.academicDepartment}
                      onChange={(event) =>
                        updateForm(
                          "academicDepartment",
                          event.target.value as DemoProfile["academicDepartment"]
                        )
                      }
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    >
                      {DEPARTMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    入学年份
                    <select
                      value={formState.enrollmentYear}
                      onChange={(event) => updateForm("enrollmentYear", event.target.value)}
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    >
                      {enrollmentYearOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-[#e3eaf8] bg-white p-5">
                <h3 className="text-base font-bold">3. AI 技能与工具偏好</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">这部分可跳过不填。</p>

                <div className="mt-4">
                  <div className="text-sm font-medium">核心生产力工具</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRIMARY_AI_TOOL_OPTIONS.map((option) => {
                      const active = formState.primaryAiTools.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateForm("primaryAiTools", toggleTag(formState.primaryAiTools, option))
                          }
                          className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
                              : "border border-[#d8deef] bg-white text-[var(--primary-deep)]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">常用工作流软件</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {WORKFLOW_APP_OPTIONS.map((option) => {
                      const active = formState.workflowApps.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateForm("workflowApps", toggleTag(formState.workflowApps, option))
                          }
                          className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
                              : "border border-[#d8deef] bg-white text-[var(--primary-deep)]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">AI 技能侧重方向</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SKILL_FOCUS_OPTIONS.map((option) => {
                      const active = formState.skillFocus.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateForm("skillFocus", toggleTag(formState.skillFocus, option))
                          }
                          className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
                              : "border border-[#d8deef] bg-white text-[var(--primary-deep)]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#e3eaf8] bg-white p-5">
                <h3 className="text-base font-bold">4. 社交与外部展示</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    GitHub 主页链接
                    <input
                      value={formState.githubUrl}
                      onChange={(event) => updateForm("githubUrl", event.target.value)}
                      placeholder="https://github.com/your-name"
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    学术主页
                    <input
                      value={formState.academicUrl}
                      onChange={(event) => updateForm("academicUrl", event.target.value)}
                      placeholder="https://scholar.google.com/..."
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-[#e3eaf8] bg-white p-5">
                <h3 className="text-base font-bold">5. 偏好与隐私设置</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    主页展示权限
                    <select
                      value={formState.profileVisibility}
                      onChange={(event) =>
                        updateForm(
                          "profileVisibility",
                          event.target.value as DemoProfile["profileVisibility"]
                        )
                      }
                      className="rounded-2xl border border-[#d8deef] bg-white px-4 py-3 outline-none transition focus:border-[#5d6bff]"
                    >
                      {PROFILE_VISIBILITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-3">
                  {[
                    {
                      key: "showRealName" as const,
                      label: "真实姓名展示",
                      description: "关闭后将优先展示昵称。"
                    },
                    {
                      key: "notifyReproduced" as const,
                      label: "接收“已复现”通知",
                      description: "帖子被复现时收到站内提醒。"
                    },
                    {
                      key: "notifyLiked" as const,
                      label: "接收点赞通知",
                      description: "帖子或 Prompt 被点赞时收到提醒。"
                    },
                    {
                      key: "notifyCommented" as const,
                      label: "接收评论通知",
                      description: "有人评论你的帖子时收到提醒。"
                    }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between rounded-2xl border border-[#e8edf7] bg-[#fbfcff] px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{item.description}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formState[item.key]}
                        onChange={(event) => updateForm(item.key, event.target.checked)}
                        className="h-4 w-4 rounded border-[#b9c5e7]"
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
              >
                保存资料
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormState(toFormState(profileView));
                  setErrorMessage("");
                  setIsEditing(false);
                }}
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
                <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</div>
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
