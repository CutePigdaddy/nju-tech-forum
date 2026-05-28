export const REPUTATION_REWARDS = {
  publishPost: 5,
  reproduced: 10,
  engagement: 2,
  dailyCheckIn: 1
} as const;

export const REPUTATION_LEVELS = [
  {
    min: 1000,
    title: "真理探索者",
    description: "社区的顶尖先驱，深刻理解人机交互本质。"
  },
  {
    min: 500,
    title: "大魔导师",
    description: "精通多种模型调教，持续产出高赞、高复现的优质咒语。"
  },
  {
    min: 200,
    title: "炼金术士",
    description: "能把复杂需求精炼成高效配方，帮助他人稳定复现成果。"
  },
  {
    min: 50,
    title: "咒语吟唱者",
    description: "开始掌握 Prompt 编写技巧，能解决清晰而具体的问题。"
  },
  {
    min: 0,
    title: "魔法学徒",
    description: "刚接触 AI 魔法，正在社区里学习、练习和积累经验。"
  }
] as const;

export type ReputationLog = {
  label: string;
  delta: number;
};

export function getReputationLevel(reputation: number) {
  return (
    REPUTATION_LEVELS.find((level) => reputation >= level.min) ??
    REPUTATION_LEVELS[REPUTATION_LEVELS.length - 1]
  );
}
