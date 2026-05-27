import type { DemoPost, DemoProfile } from "@/lib/mock-data";

export type DemoSession = {
  profileId: string;
};

export type DemoCreatedPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  tags: string[];
  authorId: string;
  stats: {
    likes: number;
    comments: number;
    reproductions: number;
    favorites: number;
  };
  promptCard: {
    title: string;
    model: string;
    prompt: string;
    notes: string;
  };
};

type DemoPostStats = {
  likes: number;
  favorites: number;
  reproductions: number;
};

export type DemoPostActionState = {
  liked: boolean;
  reproduced: boolean;
  favorited: boolean;
};

const SESSION_KEY = "tech-forum-demo-session";
const CREATED_POSTS_KEY = "tech-forum-created-posts";
const POST_STATS_KEY = "tech-forum-post-stats";
const POST_ACTIONS_KEY = "tech-forum-post-actions";
const PROFILE_OVERRIDES_KEY = "tech-forum-profile-overrides";
const POST_COMMENTS_KEY = "tech-forum-post-comments";

export type DemoProfileOverride = Pick<DemoProfile, "name" | "email" | "bio">;
export type DemoComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorLevel: string;
  content: string;
  createdAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getDemoSession(): DemoSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function setDemoSession(session: DemoSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearDemoSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function getCreatedPosts(): DemoCreatedPost[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(CREATED_POSTS_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as DemoCreatedPost[];
  } catch {
    return [];
  }
}

export function addCreatedPost(post: DemoCreatedPost) {
  if (!canUseStorage()) {
    return;
  }

  const existing = getCreatedPosts();
  window.localStorage.setItem(
    CREATED_POSTS_KEY,
    JSON.stringify([post, ...existing])
  );
}

export function getStoredPostStats(postId: string): DemoPostStats | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(POST_STATS_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, DemoPostStats>;
    return parsed[postId] ?? null;
  } catch {
    return null;
  }
}

export function setStoredPostStats(postId: string, stats: DemoPostStats) {
  if (!canUseStorage()) {
    return;
  }

  const raw = window.localStorage.getItem(POST_STATS_KEY);
  const parsed = raw ? (JSON.parse(raw) as Record<string, DemoPostStats>) : {};
  parsed[postId] = stats;
  window.localStorage.setItem(POST_STATS_KEY, JSON.stringify(parsed));
}

export function getStoredPostActions(postId: string): DemoPostActionState | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(POST_ACTIONS_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, DemoPostActionState>;
    return parsed[postId] ?? null;
  } catch {
    return null;
  }
}

export function setStoredPostActions(postId: string, actions: DemoPostActionState) {
  if (!canUseStorage()) {
    return;
  }

  const raw = window.localStorage.getItem(POST_ACTIONS_KEY);
  const parsed = raw ? (JSON.parse(raw) as Record<string, DemoPostActionState>) : {};
  parsed[postId] = actions;
  window.localStorage.setItem(POST_ACTIONS_KEY, JSON.stringify(parsed));
}

export function getProfileOverride(profileId: string): DemoProfileOverride | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(PROFILE_OVERRIDES_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, DemoProfileOverride>;
    return parsed[profileId] ?? null;
  } catch {
    return null;
  }
}

export function setProfileOverride(
  profileId: string,
  override: DemoProfileOverride
) {
  if (!canUseStorage()) {
    return;
  }

  const raw = window.localStorage.getItem(PROFILE_OVERRIDES_KEY);
  const parsed = raw ? (JSON.parse(raw) as Record<string, DemoProfileOverride>) : {};
  parsed[profileId] = override;
  window.localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(parsed));
}

export function getPostComments(postId: string): DemoComment[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(POST_COMMENTS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, DemoComment[]>;
    return parsed[postId] ?? [];
  } catch {
    return [];
  }
}

export function addPostComment(comment: DemoComment) {
  if (!canUseStorage()) {
    return;
  }

  const raw = window.localStorage.getItem(POST_COMMENTS_KEY);
  const parsed = raw ? (JSON.parse(raw) as Record<string, DemoComment[]>) : {};
  const current = parsed[comment.postId] ?? [];
  parsed[comment.postId] = [comment, ...current];
  window.localStorage.setItem(POST_COMMENTS_KEY, JSON.stringify(parsed));
}

export function mergeCreatedPost(
  createdPost: DemoCreatedPost,
  author: DemoPost["author"]
): DemoPost {
  return {
    id: createdPost.id,
    title: createdPost.title,
    excerpt: createdPost.excerpt,
    publishedAt: createdPost.publishedAt,
    category: createdPost.category,
    tags: createdPost.tags,
    author,
    stats: createdPost.stats,
    promptCard: createdPost.promptCard
  };
}
