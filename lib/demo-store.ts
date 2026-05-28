import { profiles, posts, type DemoPost, type DemoProfile } from "@/lib/mock-data";
import {
  REPUTATION_REWARDS,
  getReputationLevel,
  type ReputationLog
} from "@/lib/reputation";

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

type StoredReputationState = {
  reputation: number;
  logs: ReputationLog[];
  lastCheckInDate: string | null;
};

type ReputationAwardReason =
  | "publishPost"
  | "reproduced"
  | "liked"
  | "favorited"
  | "dailyCheckIn";

type ReputationTarget = {
  profileId: string;
  label: string;
};

const SESSION_KEY = "tech-forum-demo-session";
const CREATED_POSTS_KEY = "tech-forum-created-posts";
const POST_STATS_KEY = "tech-forum-post-stats";
const POST_ACTIONS_KEY = "tech-forum-post-actions";
const PROFILE_OVERRIDES_KEY = "tech-forum-profile-overrides";
const POST_COMMENTS_KEY = "tech-forum-post-comments";
const REPUTATION_STATE_KEY = "tech-forum-reputation-state";

const REPUTATION_COPY: Record<
  ReputationAwardReason,
  { delta: number; buildLabel: (target: ReputationTarget) => string }
> = {
  publishPost: {
    delta: REPUTATION_REWARDS.publishPost,
    buildLabel: () => "发布帖子"
  },
  reproduced: {
    delta: REPUTATION_REWARDS.reproduced,
    buildLabel: (target) => `帖子《${target.label}》被标记“已复现”`
  },
  liked: {
    delta: REPUTATION_REWARDS.engagement,
    buildLabel: (target) => `帖子《${target.label}》获得点赞`
  },
  favorited: {
    delta: REPUTATION_REWARDS.engagement,
    buildLabel: (target) => `帖子《${target.label}》获得收藏`
  },
  dailyCheckIn: {
    delta: REPUTATION_REWARDS.dailyCheckIn,
    buildLabel: () => "每日首次登录签到"
  }
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorageObject<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorageObject<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getBaseProfile(profileId: string) {
  return profiles.find((item) => item.id === profileId) ?? profiles[0];
}

function getStoredReputationMap() {
  return readStorageObject<Record<string, StoredReputationState>>(REPUTATION_STATE_KEY, {});
}

function setStoredReputationMap(next: Record<string, StoredReputationState>) {
  writeStorageObject(REPUTATION_STATE_KEY, next);
}

function getBaseReputationState(profileId: string): StoredReputationState {
  const profile = getBaseProfile(profileId);
  return {
    reputation: profile.reputation,
    logs: profile.reputationLogs,
    lastCheckInDate: null
  };
}

function getStoredReputationState(profileId: string): StoredReputationState {
  const stored = getStoredReputationMap();
  return stored[profileId] ?? getBaseReputationState(profileId);
}

function setStoredReputationState(profileId: string, next: StoredReputationState) {
  const stored = getStoredReputationMap();
  stored[profileId] = next;
  setStoredReputationMap(stored);
}

function awardReputation(
  profileId: string,
  reason: ReputationAwardReason,
  target: ReputationTarget
) {
  if (!canUseStorage()) {
    return null;
  }

  const definition = REPUTATION_COPY[reason];
  const current = getStoredReputationState(profileId);
  const next: StoredReputationState = {
    ...current,
    reputation: current.reputation + definition.delta,
    logs: [
      {
        label: definition.buildLabel(target),
        delta: definition.delta
      },
      ...current.logs
    ].slice(0, 8)
  };

  setStoredReputationState(profileId, next);
  return next;
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
    return null;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  const current = getStoredReputationState(session.profileId);
  const today = getTodayKey();

  if (current.lastCheckInDate === today) {
    return null;
  }

  const next = awardReputation(session.profileId, "dailyCheckIn", {
    profileId: session.profileId,
    label: ""
  });

  if (!next) {
    return null;
  }

  const withCheckIn = {
    ...next,
    lastCheckInDate: today
  };

  setStoredReputationState(session.profileId, withCheckIn);
  return {
    delta: REPUTATION_REWARDS.dailyCheckIn,
    reputation: withCheckIn.reputation,
    level: getReputationLevel(withCheckIn.reputation).title
  };
}

export function clearDemoSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function getCreatedPosts(): DemoCreatedPost[] {
  return readStorageObject<DemoCreatedPost[]>(CREATED_POSTS_KEY, []);
}

export function addCreatedPost(post: DemoCreatedPost) {
  if (!canUseStorage()) {
    return null;
  }

  const existing = getCreatedPosts();
  writeStorageObject(CREATED_POSTS_KEY, [post, ...existing]);

  const reputation = awardReputation(post.authorId, "publishPost", {
    profileId: post.authorId,
    label: post.title
  });

  if (!reputation) {
    return null;
  }

  return {
    reputation: reputation.reputation,
    level: getReputationLevel(reputation.reputation).title,
    delta: REPUTATION_REWARDS.publishPost
  };
}

export function getStoredPostStats(postId: string): DemoPostStats | null {
  const parsed = readStorageObject<Record<string, DemoPostStats>>(POST_STATS_KEY, {});
  return parsed[postId] ?? null;
}

export function setStoredPostStats(postId: string, stats: DemoPostStats) {
  const parsed = readStorageObject<Record<string, DemoPostStats>>(POST_STATS_KEY, {});
  parsed[postId] = stats;
  writeStorageObject(POST_STATS_KEY, parsed);
}

export function getStoredPostActions(postId: string): DemoPostActionState | null {
  const parsed = readStorageObject<Record<string, DemoPostActionState>>(POST_ACTIONS_KEY, {});
  return parsed[postId] ?? null;
}

export function setStoredPostActions(postId: string, actions: DemoPostActionState) {
  const parsed = readStorageObject<Record<string, DemoPostActionState>>(POST_ACTIONS_KEY, {});
  parsed[postId] = actions;
  writeStorageObject(POST_ACTIONS_KEY, parsed);
}

export function rewardPostAuthor(
  postId: string,
  action: Extract<ReputationAwardReason, "liked" | "favorited" | "reproduced">
) {
  const targetPost = getDemoPostById(postId);

  if (!targetPost) {
    return null;
  }

  const reputation = awardReputation(targetPost.author.id, action, {
    profileId: targetPost.author.id,
    label: targetPost.title
  });

  if (!reputation) {
    return null;
  }

  return {
    authorName: targetPost.author.name,
    reputation: reputation.reputation,
    level: getReputationLevel(reputation.reputation).title,
    delta: REPUTATION_COPY[action].delta
  };
}

export function getProfileOverride(profileId: string): DemoProfileOverride | null {
  const parsed = readStorageObject<Record<string, DemoProfileOverride>>(PROFILE_OVERRIDES_KEY, {});
  return parsed[profileId] ?? null;
}

export function setProfileOverride(
  profileId: string,
  override: DemoProfileOverride
) {
  const parsed = readStorageObject<Record<string, DemoProfileOverride>>(PROFILE_OVERRIDES_KEY, {});
  parsed[profileId] = override;
  writeStorageObject(PROFILE_OVERRIDES_KEY, parsed);
}

export function getPostComments(postId: string): DemoComment[] {
  const parsed = readStorageObject<Record<string, DemoComment[]>>(POST_COMMENTS_KEY, {});
  return parsed[postId] ?? [];
}

export function addPostComment(comment: DemoComment) {
  const parsed = readStorageObject<Record<string, DemoComment[]>>(POST_COMMENTS_KEY, {});
  const current = parsed[comment.postId] ?? [];
  parsed[comment.postId] = [comment, ...current];
  writeStorageObject(POST_COMMENTS_KEY, parsed);
}

export function getComputedProfile(profileId: string): DemoProfile {
  const base = getBaseProfile(profileId);
  const override = getProfileOverride(profileId);
  const reputationState = getStoredReputationState(profileId);

  return {
    ...base,
    ...(override ?? {}),
    reputation: reputationState.reputation,
    level: getReputationLevel(reputationState.reputation).title,
    reputationLogs: reputationState.logs
  };
}

export function getComputedPost(post: DemoPost): DemoPost {
  const stats = getStoredPostStats(post.id) ?? post.stats;
  const author = getComputedProfile(post.author.id);

  return {
    ...post,
    stats: {
      ...post.stats,
      ...stats
    },
    author: {
      ...post.author,
      name: author.name,
      department: author.department,
      level: author.level
    }
  };
}

export function getComputedPosts(inputPosts: DemoPost[]) {
  return inputPosts.map((post) => getComputedPost(post));
}

export function getDemoPostById(postId: string) {
  const createdPost = getCreatedPosts().find((item) => item.id === postId);

  if (createdPost) {
    return mergeCreatedPost(createdPost);
  }

  const basePost = posts.find((item) => item.id === postId);
  return basePost ? getComputedPost(basePost) : null;
}

export function mergeCreatedPost(createdPost: DemoCreatedPost): DemoPost {
  const authorProfile = getComputedProfile(createdPost.authorId);
  const stats = getStoredPostStats(createdPost.id) ?? createdPost.stats;

  return {
    id: createdPost.id,
    title: createdPost.title,
    excerpt: createdPost.excerpt,
    publishedAt: createdPost.publishedAt,
    category: createdPost.category,
    tags: createdPost.tags,
    author: {
      id: authorProfile.id,
      name: authorProfile.name,
      department: authorProfile.department,
      level: authorProfile.level
    },
    stats: {
      ...createdPost.stats,
      ...stats
    },
    promptCard: createdPost.promptCard
  };
}
