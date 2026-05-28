"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  featuredPosts,
  homeCategories,
  homeTabs,
  posts,
  type DemoPost
} from "@/lib/mock-data";
import { PostCard } from "@/components/post-card";
import { getComputedPosts } from "@/lib/demo-store";

function sortPosts(input: DemoPost[], tab: string) {
  if (tab === "hot") {
    return [...input].sort((a, b) => b.stats.likes - a.stats.likes);
  }

  if (tab === "reproduced") {
    return [...input].sort((a, b) => b.stats.reproductions - a.stats.reproductions);
  }

  return input;
}

export function HomeFeed() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q")?.trim() ?? "";
  const [activeTab, setActiveTab] = useState("latest");
  const [activeCategory, setActiveCategory] = useState("学术提效");
  const feedPosts = useMemo(() => getComputedPosts(posts), []);

  const visiblePosts = useMemo(() => {
    const filteredByCategory = feedPosts.filter((post) => post.category === activeCategory);
    const filteredBySearch = search
      ? filteredByCategory.filter((post) => {
          const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
          return haystack.includes(search.toLowerCase());
        })
      : filteredByCategory;

    return sortPosts(filteredBySearch, activeTab);
  }, [activeCategory, activeTab, feedPosts, search]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full flex-shrink-0 lg:w-64">
        <div className="grid gap-6">
          <section className="surface-card p-4">
            <h2 className="mb-4 px-2 text-base font-bold">话题分类</h2>
            <div className="grid gap-1">
              {homeCategories.map((item) => {
                const active = item.label === activeCategory;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveCategory(item.label)}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                      active
                        ? "border border-[#d9dcff] bg-[linear-gradient(180deg,#f4f2ff_0%,#ececff_100%)] text-[var(--primary-deep)] shadow-sm"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-soft)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active ? "bg-white/80" : "bg-[var(--surface-soft)]"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] bg-[linear-gradient(135deg,#6d78ff_0%,#8b7cff_100%)] p-5 text-white shadow-[0_18px_44px_rgba(109,120,255,0.22)]">
            <h2 className="text-lg font-bold">加入经验分享</h2>
            <p className="mt-2 text-sm leading-7 text-white/82">
              分享你亲测有效的 Prompt 或 AI 使用流程，让更多同学少走弯路，也让优质经验被持续看见。
            </p>
            <Link
              href="/create"
              className="mt-5 inline-flex rounded-2xl border border-[#d8dcff] bg-[#eef1ff] px-4 py-2.5 text-sm font-semibold !text-[#3f35c8] shadow-[0_10px_22px_rgba(79,72,221,0.12)] transition hover:bg-white"
            >
              立即发布
            </Link>
          </section>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <div className="surface-card mb-6 overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[linear-gradient(180deg,#fcfbff_0%,#f5f7ff_100%)] p-6 md:p-7">
              <span className="eyebrow">精选推荐</span>
              <h1 className="mt-4 text-[1.95rem] font-bold leading-[1.15] tracking-[-0.025em] md:text-[2.25rem]">
                面向南大学生的 AI 经验分享社区
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                聚焦论文润色、实验报告、代码作业和日常生活这些校园真实场景，
                让同学们更方便地获取方法、复用 Prompt，并把实践经验沉淀下来。
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <span className="pill border border-transparent bg-[var(--primary-soft)]">
                  已验证案例 3,204
                </span>
                <span className="pill">
                  {search ? `搜索：${search}` : "最近持续更新"}
                </span>
              </div>
            </div>

            <div className="grid gap-3 border-l border-[var(--border)] bg-white p-6 lg:w-full">
              {featuredPosts.slice(1, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="rounded-[22px] border border-[var(--border)] bg-[linear-gradient(180deg,#faf9ff_0%,#f2f4ff_100%)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary-glow)] hover:bg-white"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[var(--primary-deep)] shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                      推荐
                    </span>
                  </div>
                  <div className="text-sm font-bold leading-6">{post.title}</div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-soft)] font-bold text-[var(--primary-deep)]">
                      {post.author.name.slice(0, 1)}
                    </span>
                    <span>{post.author.name}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs leading-5 text-[var(--muted)]">
                    <span>{post.stats.reproductions} 人已复现</span>
                    <span>{post.stats.likes} 点赞</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-6 border-b border-[var(--border)]">
          {homeTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`feed-tab ${activeTab === tab.value ? "feed-tab-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visiblePosts.length ? (
          <section className="grid gap-5">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <section className="surface-card p-8 text-center">
            <div className="text-lg font-semibold">当前筛选下还没有内容</div>
            <div className="mt-2 text-sm text-[var(--muted)]">
              试试切换分类或清空搜索关键词。
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
