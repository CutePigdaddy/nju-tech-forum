import {
  DEFAULT_AVATAR_LIBRARY,
  type DegreeLevelOption,
  type DepartmentOption,
  type GenderOption,
  type PrimaryAiToolOption,
  type ProfileVisibilityOption,
  type SkillFocusOption,
  type WorkflowAppOption
} from "@/lib/profile-config";
import { REPUTATION_REWARDS, getReputationLevel, type ReputationLog } from "@/lib/reputation";

export type DemoProfile = {
  id: string;
  name: string;
  email: string;
  department: string;
  bio: string;
  reputation: number;
  level: string;
  reputationLogs: ReputationLog[];
  avatarType: "image" | "library";
  avatarUrl: string;
  nickname: string;
  tagline: string;
  gender: GenderOption;
  genderCustom: string;
  degreeLevel: DegreeLevelOption;
  academicDepartment: DepartmentOption;
  enrollmentYear: string;
  primaryAiTools: PrimaryAiToolOption[];
  workflowApps: WorkflowAppOption[];
  skillFocus: SkillFocusOption[];
  githubUrl: string;
  academicUrl: string;
  profileVisibility: ProfileVisibilityOption;
  showRealName: boolean;
  notifyReproduced: boolean;
  notifyLiked: boolean;
  notifyCommented: boolean;
};

export type DemoPost = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    department: string;
    level: string;
  };
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

function buildProfile(input: Omit<DemoProfile, "level">): DemoProfile {
  return {
    ...input,
    level: getReputationLevel(input.reputation).title
  };
}

export const homeTabs = [
  { label: "最新", value: "latest" },
  { label: "最热", value: "hot" },
  { label: "复现最多", value: "reproduced" }
];

export const homeCategories = [
  { label: "学术提效", count: 128, icon: "📘" },
  { label: "代码编写", count: 85, icon: "💻" },
  { label: "日常生活", count: 64, icon: "🏡" }
];

export const profiles: DemoProfile[] = [
  buildProfile({
    id: "u1",
    name: "林昭",
    email: "linzhao@nju.edu.cn",
    department: "南京大学 · 计算机科学与技术系",
    bio: "专注把 AI 真实用进论文、实验报告和课程作业里。",
    reputation: 236,
    reputationLogs: [
      { label: "帖子被标记“已复现”", delta: REPUTATION_REWARDS.reproduced },
      { label: "帖子获得 3 次点赞", delta: 3 * REPUTATION_REWARDS.engagement },
      { label: "每日首次登录签到", delta: REPUTATION_REWARDS.dailyCheckIn }
    ],
    avatarType: "library",
    avatarUrl: DEFAULT_AVATAR_LIBRARY[0].id,
    nickname: "昭昭会写咒语",
    tagline: "把 Prompt 打磨成能复现的校园魔法。",
    gender: "保密",
    genderCustom: "",
    degreeLevel: "本科生",
    academicDepartment: "计算机科学与技术系",
    enrollmentYear: "2023级",
    primaryAiTools: ["ChatGPT", "Claude 3.5", "DeepSeek-V3", "Cursor"],
    workflowApps: ["VS Code", "Python", "Overleaf", "Obsidian"],
    skillFocus: ["学术科研提效", "全栈代码开发", "提示词工程"],
    githubUrl: "https://github.com/linzhao-nju",
    academicUrl: "",
    profileVisibility: "所有人可见",
    showRealName: false,
    notifyReproduced: true,
    notifyLiked: true,
    notifyCommented: true
  }),
  buildProfile({
    id: "u2",
    name: "周屿",
    email: "zhouyu@nju.edu.cn",
    department: "南京大学 · 新闻传播学院",
    bio: "关注 AI 在内容生产和校园传播中的使用体验。",
    reputation: 128,
    reputationLogs: [
      { label: "帖子获得 2 次点赞", delta: 2 * REPUTATION_REWARDS.engagement },
      { label: "帖子获得 1 次收藏", delta: REPUTATION_REWARDS.engagement }
    ],
    avatarType: "library",
    avatarUrl: DEFAULT_AVATAR_LIBRARY[2].id,
    nickname: "周周有灵感",
    tagline: "把校园内容生产流程做得更轻盈。",
    gender: "女",
    genderCustom: "",
    degreeLevel: "硕士研究生",
    academicDepartment: "新闻传播学院",
    enrollmentYear: "2022级",
    primaryAiTools: ["Kimi", "Midjourney", "ChatGPT"],
    workflowApps: ["Notion", "Figma", "Obsidian"],
    skillFocus: ["内容创作设计", "论文润色翻译"],
    githubUrl: "",
    academicUrl: "https://scholar.google.com/",
    profileVisibility: "仅登录的本校师生可见",
    showRealName: true,
    notifyReproduced: true,
    notifyLiked: true,
    notifyCommented: false
  })
];

export const posts: DemoPost[] = [
  {
    id: "p1",
    title: "用 DeepSeek 写实验报告：从原始数据到成稿的一套可复用流程",
    excerpt:
      "把实验目的、原始结果和老师要求拆成固定输入结构，再让模型按章节输出，能明显减少返工。",
    publishedAt: "2 小时前",
    category: "学术提效",
    tags: ["学术提效", "实验报告", "DeepSeek"],
    author: {
      id: "u1",
      name: "林昭",
      department: "计算机科学与技术系",
      level: getReputationLevel(236).title
    },
    stats: {
      likes: 86,
      comments: 19,
      reproductions: 43,
      favorites: 26
    },
    promptCard: {
      title: "实验报告结构化生成 Prompt",
      model: "DeepSeek / Claude / 通用大模型",
      prompt:
        "你是我的实验报告助教。请根据我提供的实验目的、实验步骤、原始结果和课程要求，输出一篇结构完整、语言正式的实验报告。必须包含：实验目的、实验原理、实验步骤、结果分析、结论。对结果分析部分要结合数据变化给出解释，不要凭空编造。",
      notes: "建议搭配你自己的原始实验数据一起输入，效果会比空口要求更稳。"
    }
  },
  {
    id: "p2",
    title: "把 Claude 当成课程作业代码审阅助手的一个稳定用法",
    excerpt:
      "不是让它直接替你写完，而是让它先找 bug、再解释复杂度、最后给重构建议，作业质量会更稳。",
    publishedAt: "今天",
    category: "代码编写",
    tags: ["代码编写", "Claude", "Python"],
    author: {
      id: "u1",
      name: "林昭",
      department: "计算机科学与技术系",
      level: getReputationLevel(236).title
    },
    stats: {
      likes: 55,
      comments: 11,
      reproductions: 28,
      favorites: 17
    },
    promptCard: {
      title: "课程作业代码审阅 Prompt",
      model: "Claude / ChatGPT",
      prompt:
        "你是严谨的算法课助教。请不要直接重写我的代码，而是先完成 3 件事：1. 找出潜在 bug 或边界条件问题；2. 评估时间复杂度与空间复杂度；3. 给出最值得修改的 3 条建议，并解释原因。",
      notes: "更适合搭配一段真实代码一起使用，这样模型给出的建议会更具体。"
    }
  },
  {
    id: "p3",
    title: "Midjourney 海报生成经验：校园活动视觉稿如何更快出效果",
    excerpt:
      "先把海报信息拆成活动主题、受众、氛围、配色，再让模型输出英文提示词，效率会高很多。",
    publishedAt: "昨天",
    category: "日常生活",
    tags: ["AI 绘图", "Midjourney", "校园海报"],
    author: {
      id: "u2",
      name: "周屿",
      department: "新闻传播学院",
      level: getReputationLevel(128).title
    },
    stats: {
      likes: 37,
      comments: 8,
      reproductions: 20,
      favorites: 14
    },
    promptCard: {
      title: "校园活动海报 Prompt",
      model: "Midjourney / 即梦 / 通用绘图模型",
      prompt:
        "Design a modern university event poster, clean composition, strong visual hierarchy, academic yet youthful, white and blue color palette, Chinese campus atmosphere, high readability, premium typography feel.",
      notes: "重点是先把信息层级想清楚，Prompt 只是把你的视觉方向翻译给模型。"
    }
  }
];

export const featuredPosts = posts.slice(0, 3);

export const notifications = [
  {
    id: "n1",
    title: "你的帖子被 3 位同学标记为“已复现”",
    description: "更多同学完成复现，说明这篇经验对大家真的有帮助。",
    time: "刚刚"
  },
  {
    id: "n2",
    title: "有人点赞了你的 Prompt 卡片",
    description: "你的内容正在被更多人看到，也许很快会收到新的讨论。",
    time: "2 小时前"
  },
  {
    id: "n3",
    title: "你的个人主页声望等级已更新",
    description: "随着互动和内容积累，你的主页会逐步展示更清晰的成长轨迹。",
    time: "今天"
  }
];
