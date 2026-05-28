export const DEFAULT_AVATAR_LIBRARY = [
  { id: "arcane-owl", label: "星辉猫头鹰", icon: "🦉", accent: "from-[#0f4cff] to-[#6fd3ff]" },
  { id: "mecha-fox", label: "机巧灵狐", icon: "🦊", accent: "from-[#ff7a18] to-[#ffd166]" },
  { id: "rune-whale", label: "符文鲸歌", icon: "🐋", accent: "from-[#0f766e] to-[#6ee7b7]" },
  { id: "plasma-dragon", label: "等离子幼龙", icon: "🐉", accent: "from-[#7c3aed] to-[#f472b6]" }
] as const;

export const GENDER_OPTIONS = ["男", "女", "保密", "自定义"] as const;
export const DEGREE_LEVEL_OPTIONS = [
  "本科生",
  "硕士研究生",
  "博士研究生",
  "教职工",
  "校友"
] as const;

export const DEPARTMENT_OPTIONS = [
  "计算机科学与技术系",
  "软件学院",
  "人工智能学院",
  "新闻传播学院",
  "化学化工学院",
  "环境学院",
  "物理学院",
  "电子科学与工程学院",
  "商学院",
  "建筑与城市规划学院"
] as const;

export const PRIMARY_AI_TOOL_OPTIONS = [
  "ChatGPT",
  "Claude 3.5",
  "DeepSeek-V3",
  "Kimi",
  "Midjourney",
  "Cursor",
  "GitHub Copilot"
] as const;

export const WORKFLOW_APP_OPTIONS = [
  "Notion",
  "Obsidian",
  "Overleaf",
  "VS Code",
  "Python",
  "Jupyter",
  "Figma"
] as const;

export const SKILL_FOCUS_OPTIONS = [
  "学术科研提效",
  "论文润色翻译",
  "全栈代码开发",
  "数据拟合分析",
  "提示词工程",
  "内容创作设计"
] as const;

export const PROFILE_VISIBILITY_OPTIONS = [
  "所有人可见",
  "仅登录的本校师生可见"
] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number];
export type DegreeLevelOption = (typeof DEGREE_LEVEL_OPTIONS)[number];
export type DepartmentOption = (typeof DEPARTMENT_OPTIONS)[number];
export type PrimaryAiToolOption = (typeof PRIMARY_AI_TOOL_OPTIONS)[number];
export type WorkflowAppOption = (typeof WORKFLOW_APP_OPTIONS)[number];
export type SkillFocusOption = (typeof SKILL_FOCUS_OPTIONS)[number];
export type ProfileVisibilityOption = (typeof PROFILE_VISIBILITY_OPTIONS)[number];

export function getEnrollmentYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 16 }, (_, index) => `${currentYear - index}级`);
}
