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

export type PostBodySection =
  | { type: "paragraph"; content: string }
  | { type: "heading"; content: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "callout"; title: string; content: string }
  | { type: "code"; language: string; content: string };

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
  body: PostBodySection[];
  promptCard: {
    title: string;
    model: string;
    prompt: string;
    notes: string;
    setup?: string[];
    workflow?: string[];
  };
};

export type DefaultComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorLevel: string;
  content: string;
  createdAt: string;
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
  { label: "代码编写", count: 82, icon: "💻" },
  { label: "学术提效", count: 96, icon: "📘" },
  { label: "日常生活", count: 58, icon: "🏕️" }
];

export const profiles: DemoProfile[] = [
  buildProfile({
    id: "u1",
    name: "林昭",
    email: "linzhao@nju.edu.cn",
    department: "南京大学 · 计算机科学与技术系",
    bio: "喜欢把 AI 用法拆到足够具体，直到它能稳定服务于真实的作业和项目。",
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
    bio: "平时最爱折腾本地工作流，尤其是那种能把“看起来麻烦”的任务一步步压平的用法。",
    reputation: 128,
    reputationLogs: [
      { label: "帖子获得 2 次点赞", delta: 2 * REPUTATION_REWARDS.engagement },
      { label: "帖子获得 1 次收藏", delta: REPUTATION_REWARDS.engagement }
    ],
    avatarType: "library",
    avatarUrl: DEFAULT_AVATAR_LIBRARY[2].id,
    nickname: "周周有灵感",
    tagline: "把校园里的高频重复劳动，改造成顺手的半自动流程。",
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
    title: "Vibe Coding 爽完之后，我反过来让 AI 给我拆了一份代码库学习计划",
    excerpt:
      "Cursor 和 Copilot 帮我很快把项目原型堆出来了，但真到要改代码、要答辩的时候，我发现自己根本没学会。后来我干脆让 AI 站在架构师和教学设计者的角度，反过来替我设计自学路径。",
    publishedAt: "1 小时前",
    category: "代码编写",
    tags: ["Cursor", "Copilot", "Vibe Coding"],
    author: {
      id: "u1",
      name: "林昭",
      department: "计算机科学与技术系",
      level: getReputationLevel(236).title
    },
    stats: {
      likes: 71,
      comments: 16,
      reproductions: 34,
      favorites: 25
    },
    body: [
      {
        type: "paragraph",
        content:
          "前阵子我去听了一场全栈开发分享，回来之后整个人都处在一种很亢奋的状态，立刻把 Cursor 和 Copilot 全部开上，进入一种很典型的 Vibe Coding 模式：手不离 Tab，多文件一起生成，能自动补全就绝不自己写。"
      },
      {
        type: "paragraph",
        content:
          "那个阶段确实很爽。页面、组件、接口、状态管理一层一层被推出来，原型跑起来的速度比我以前自己敲快得多。我当时甚至有点误以为，既然 AI 已经把工程搭起来了，那理解这件事也会顺便发生。"
      },
      {
        type: "callout",
        title: "真正尴尬的瞬间",
        content:
          "项目能跑之后，我才意识到自己其实对里面很多类、函数、中间件根本不熟。要让我直接一行一行硬啃代码，不是不行，就是太慢，效率特别差。可后面还得二次修改，还要准备大作业答辩，这个坑迟早得补。"
      },
      {
        type: "paragraph",
        content:
          "后来我去看别人怎么处理这种情况，又在 GitHub 上翻到一些特别标准化的 AI 开发工作流，比如 `everything-claude-code` 这种仓库。那一刻我突然明白了一件事：对付 AI 堆出来的代码库，不能靠盲目理解，应该靠有设计感的学习。"
      },
      {
        type: "heading",
        content: "我的思路转向"
      },
      {
        type: "paragraph",
        content:
          "既然大模型对整个代码库的全局结构最熟，那我不如让它别再扮演“代写的人”，而是改扮演“高级系统架构师”和“教学设计专家”。我要它先吃透整个项目，再用关注点分离的方式，把这堆代码拆成能独立理解的功能单元，顺便给我产出一个真能执行的本地学习待办。"
      },
      {
        type: "bullet-list",
        items: [
          "先按层拆：基础设施与配置、数据模型、核心业务逻辑、健壮性、入口与生命周期。",
          "每个模块都必须告诉我关键文件在哪里，别让我在项目里瞎找。",
          "每个待办后面都必须跟一个极小的 Lab，比如改一行参数、打印一个变量、打断一个流程，让我必须动手。"
        ]
      },
      {
        type: "heading",
        content: "我最后怎么用"
      },
      {
        type: "paragraph",
        content:
          "我写了一个叫 `generate-learning-plan` 的 Prompt，在 Cursor 里直接让它扫描整个代码库，然后在 `docs/PROJECT_LEARNING_PLAN.md` 里生成一份打勾式的学习计划。这样我每天不是对着整坨代码发愣，而是顺着一块块模块往前推。"
      },
      {
        type: "ordered-list",
        items: [
          "打开项目文件夹，进入 Cursor 聊天框。",
          "触发 `#codebase`，让它获得全局项目上下文。",
          "把 Prompt 整段发进去，让它直接写出计划书到 `docs/PROJECT_LEARNING_PLAN.md`。",
          "按清单一个个打勾，并做里面的小 Lab，逼自己从“能跑”走向“能解释、能修改”。"
        ]
      },
      {
        type: "paragraph",
        content:
          "我现在回头看，最有价值的不是“AI 帮我写了多少代码”，而是“我终于开始把 AI 当作一个可被重新编排的学习工具”。以前我是让 AI 替我完成工作；后来我开始让 AI 帮我重构学习路径。这两个维度完全不是一回事。"
      }
    ],
    promptCard: {
      title: "generate-learning-plan",
      model: "Cursor / VS Code Copilot / Claude Code",
      prompt: `---
name: generate-learning-plan
description: "根据本地代码库生成结构化的项目学习待办计划（Learning Plan）"
---

# Generate Project Learning Plan

你是一个专业的教学设计专家和高级系统架构师。你的任务是基于我当前的本地项目（#codebase），为我量身定制一个模块化、功能化的深度学习待办计划。

## 执行要求
1. 按基础设施与配置、数据流与模型、核心业务逻辑、健壮性与稳定性、入口生命周期五个维度拆解项目。
2. 每个学习任务块必须包含：学习目标、涉及文件路径、技术点提炼、动手练习（Lab）。
3. 在 docs/ 目录下创建 PROJECT_LEARNING_PLAN.md，并使用 Markdown Checkbox（- [ ]）格式输出。
4. Lab 必须是低门槛、能立刻动手的微小改动任务，而不是抽象建议。`,
      notes:
        "重点不是让 AI 再解释一遍代码，而是让它先帮你排出理解顺序。你真正节省的是“摸索从哪里开始看”的时间。",
      setup: [
        "在 Cursor 或类似编辑器里打开整个项目文件夹。",
        "确保 AI 能访问代码库上下文，比如 Cursor 的 `#codebase`。",
        "给它写文件权限，让它可以把计划书直接落到 `docs/`。"
      ],
      workflow: [
        "先扫描全项目，别直接生成结论。",
        "按系统层次拆成多个可勾选任务块。",
        "每个任务块都绑定关键文件和一个极小 Lab。",
        "把计划书写入本地，之后就照着清单逐个推进。"
      ]
    }
  },
  {
    id: "p2",
    title: "微积分作业被扣格式分之后，我搭了一套手写稿转 LaTeX 的本地 Skill 工作流",
    excerpt:
      "一开始我也是手写、拍照、拼 PDF，结果字迹潦草再加排版混乱，直接被扣了 5 分格式分。后来我不再把整本教材硬塞给 AI，而是拆成可触发的原子 Skill，让它只在必要的时候调入知识和工具。",
    publishedAt: "昨天",
    category: "学术提效",
    tags: ["LaTeX", "Cherry Studio", "Skill"],
    author: {
      id: "u2",
      name: "周屿",
      department: "新闻传播学院",
      level: getReputationLevel(128).title
    },
    stats: {
      likes: 64,
      comments: 12,
      reproductions: 29,
      favorites: 31
    },
    body: [
      {
        type: "paragraph",
        content:
          "我们微积分老师要求作业必须交 PDF。最开始我走的是最简单粗暴的路线：手写解答，拍照，然后把几张图片直接拼成一个 PDF 上传。"
      },
      {
        type: "paragraph",
        content:
          "结果很现实。因为我本来字就不算好看，拍照一模糊、页面一歪，整个文件的观感非常差。助教最后直接扣了我 5 分格式分。我那时候看别人用 LaTeX 编译出来的作业，矩阵、积分、分段函数都特别干净，心里当然也羡慕。"
      },
      {
        type: "paragraph",
        content:
          "但让我天天去手敲那些复杂公式，我又觉得完全本末倒置。有这功夫，我宁愿多刷两道题。所以我一开始也想走捷径：把 800 页的微积分教材 PDF 整本丢给大模型，再把自己的手写草稿照片一股脑发进去，让它直接帮我转。"
      },
      {
        type: "callout",
        title: "为什么这条路行不通",
        content:
          "它不仅卡，还老是自作聪明。要么断联，要么擅自帮我纠错，要么跳过我草稿里故意保留的中间步骤。最后生成的 LaTeX 看起来像是“正确答案”，但根本不是我真正写在纸上的过程。"
      },
      {
        type: "paragraph",
        content:
          "后来我开始反过来想：为什么整本书一丢进去就卡？因为每一轮对话，大模型都在“负重”整本教材。你下一句哪怕只说一句“继续”，它也得连同那本书一起重新处理。上下文不是书柜，它更像背包。背太多，走得就慢。"
      },
      {
        type: "heading",
        content: "我后来的做法"
      },
      {
        type: "paragraph",
        content:
          "我把“知识库常驻上下文”的思路改成了“Skill 按需触发”。也就是说，不让庞大的教材内容一直塞在对话里，而是把高约束、强流程的能力写成单点 Skill：需要转写手写稿时，触发 `handwritten-tex-converter`；需要批改时，再触发 `homework-checker`。"
      },
      {
        type: "bullet-list",
        items: [
          "上下文只保留当前任务需要的最小信息。",
          "把“禁止自动纠错”“必须忠于原稿”写进 Skill，而不是寄希望于临场提醒。",
          "所有可能改写文件的行为，都必须加显式授权节点，把控制权握在自己手里。"
        ]
      },
      {
        type: "heading",
        content: "我实际搭出来的流程"
      },
      {
        type: "ordered-list",
        items: [
          "先在本地建一个专门的微积分工作区，里面区分教材切片、作业归档和 Skill 目录。",
          "把手写转 LaTeX 的规则写成独立 Skill 文件，明确保真转录、忽略涂改、禁止自动纠错。",
          "让 Agent 直接在本地写入 `.tex` 文件，而不是只在聊天框里输出代码块。",
          "配合本地终端和 LaTeX Workshop，一键编译并在编辑器里实时预览 PDF。",
          "等 PDF 出来后，再用 `homework-checker` 做闭环比对，只有我明确回复“好的”才允许它回写文件。"
        ]
      },
      {
        type: "heading",
        content: "后面我是怎么补全这套闭环的"
      },
      {
        type: "paragraph",
        content:
          "一开始我只做到“自动转成 `.tex` 并编译 PDF”。后来发现，真正让我安心的不是自动化本身，而是每一步都可中断、可确认、可回退。所以我又补了两层。"
      },
      {
        type: "bullet-list",
        items: [
          "先让 `homework-checker` 只输出纯文本错题分析，暂时不直接改文件。",
          "让它在每次准备改写 `.tex` 之前，都先问一句要不要执行，把授权权利留在我手里。",
          "每份作业按日期归档，这样我回头看某一天的版本，不会被后续修改覆盖。"
        ]
      },
      {
        type: "paragraph",
        content:
          "慢慢地我发现，我得到的不只是“更好看的作业 PDF”，而是一套更适合自己节奏的人机协作方法。不是把 AI 当作万能代做工具，而是把它做成一个服从流程、服从约束、服从授权的本地助手。"
      }
    ],
    promptCard: {
      title: "handwritten-tex-converter",
      model: "Cherry Studio / VS Code Agent / 本地多模态模型",
      prompt: `---
name: handwritten-tex-converter
description: "触发条件：当用户上传手写学术作业图片，要求将其转换为 LaTeX 时触发。严格执行保真转录，严禁自主纠错。"
---

# 手写作业转 LaTeX 转换器

你的任务是将我上传的手写微积分作业图片，直接转换为排版良好、可直接编译的 LaTeX (.tex) 代码。你必须在转录过程中绝对忠实于我的原始解答过程。

## 严格遵循以下约束
- 忽略划去、涂抹和明确删除的内容。
- 对模糊部分只允许结合上下文补全，不允许擅自改题或改步骤。
- 如果原稿有错误、跳步或不严谨之处，必须原样保留，禁止自动纠错。
- 直接在工作区 \`vjf/{YYYYMMDD}/\` 下创建 \`{YYYYMMDD}.tex\` 文件。
- 若内容过多，请主动停在合理位置，提示用户继续上传下一张。`,
      notes:
        "真正关键的是把“忠于原稿”写成硬约束，并且把文件写入、编译、修改授权这些动作纳入本地工作流，而不是靠聊天里反复口头提醒。",
      setup: [
        "本地准备好工作区目录，例如 `vjf/`、`skills/`、按日期归档的子文件夹。",
        "注册 Skill，让 Agent 能调用本地写文件工具。",
        "本地终端配置 `xelatex`，并配合 LaTeX Workshop 做预览。"
      ],
      workflow: [
        "上传手写稿，触发 `handwritten-tex-converter`。",
        "直接落 `.tex` 文件到日期目录，而不是只输出代码块。",
        "在本地终端编译 PDF，并在编辑器里预览。",
        "再调用 `homework-checker` 做纯文本分析；获得授权后才回写并重新编译。"
      ]
    }
  },
  {
    id: "p3",
    title: "我不再手写长 Prompt，而是先用 Skill 强制优化输入，再把整理后的需求发给 AI",
    excerpt:
      "以前我总觉得提示词要么写得太短，效果飘；要么写得太长，自己嫌累。后来我换了个思路：不是每次都逼自己现场写好 Prompt，而是先拦截输入，让另一个 Skill 帮我把需求整理成可执行的高质量 Prompt。",
    publishedAt: "3 天前",
    category: "日常生活",
    tags: ["提示词工程", "Skill", "工作流"],
    author: {
      id: "u1",
      name: "林昭",
      department: "计算机科学与技术系",
      level: getReputationLevel(236).title
    },
    stats: {
      likes: 59,
      comments: 10,
      reproductions: 26,
      favorites: 28
    },
    body: [
      {
        type: "paragraph",
        content:
          "我以前用 AI 时有个很常见的问题：脑子里其实知道自己想干什么，但打出来往往只有一两句话。比如“帮我写个活动策划”“优化一下这段文案”“给我做个学习计划”。这些输入看起来很省事，但结果通常也很飘。"
      },
      {
        type: "paragraph",
        content:
          "当然我也试过另一种极端，就是逼自己每次都写一大段特别完整的 Prompt，把角色、格式、边界、限制条件全写出来。问题是这样太费劲了。很多任务本来就只是日常高频小事，如果每次都靠手工写长 Prompt，迟早会嫌麻烦。"
      },
      {
        type: "callout",
        title: "我后来想明白的一点",
        content:
          "真正需要优化的，不是某一条 Prompt，而是我“提交需求给 AI”的这条输入管线。与其提高一次次临场发挥的水平，不如先改造我发消息的方式。"
      },
      {
        type: "paragraph",
        content:
          "所以我做了一个看起来有点绕、但实际上特别省力的东西：我先用一个 Skill 拦截自己的原始输入，让它不要直接去执行任务，而是先扮演提示词工程师，把我的随手一句话整理成结构化、可复用、可迭代的 Prompt。"
      },
      {
        type: "heading",
        content: "为什么这件事对我影响很大"
      },
      {
        type: "paragraph",
        content:
          "它改变的不是“我会不会写 Prompt”，而是“我开始把 AI 当成可以改造的方法系统”。以前我是拿着一个工具去碰任务；后来我开始先设计工具的入口，再让任务从这个入口流过去。这个视角一下子就高了一层。"
      },
      {
        type: "bullet-list",
        items: [
          "原始输入可以很粗糙，但进入主模型前必须先被整理。",
          "Prompt 设计不再是一次性行为，而是一个可复用的前置流程。",
          "我越来越少纠结“怎么现在把这句话写漂亮”，更多是在经营一条稳定的输入管线。"
        ]
      },
      {
        type: "heading",
        content: "我现在的使用方式"
      },
      {
        type: "ordered-list",
        items: [
          "先把自己最原始的需求丢给 `prompt-engineer`。",
          "让它先确认目标，再反向采访我，补足角色、受众、格式、语气和限制条件。",
          "等它输出结构化 Prompt 初稿后，我只做小范围修正。",
          "最后再把整理好的 Prompt 发给真正执行任务的模型或 Agent。"
        ]
      },
      {
        type: "paragraph",
        content:
          "看起来像是多绕了一步，但实际上是把以前那些反复重写、结果不稳、来回返工的时间提前压缩掉了。尤其是我经常要在写作、学习、做策划和代码解释之间来回切任务，这套方法让我每次进入新任务时都更快“对焦”。"
      },
      {
        type: "paragraph",
        content:
          "现在我越来越觉得，使用 AI 工具只是低一层的能力；真正更有意思的是去改造“使用 AI 的方法”。当你开始优化输入、优化上下文、优化工作流，其实你已经不只是在提需求了，而是在设计一套自己的智能协作系统。"
      }
    ],
    promptCard: {
      title: "prompt-engineer",
      model: "通用大模型 / 本地 Agent / ChatGPT / Claude",
      prompt: `---
name: prompt-engineer
description: |
  资深提示词工程专家，帮助用户从零开始编写高质量、结构化的 AI 提示词（Prompt）。
  当用户想要编写新的 AI 提示词、优化现有提示词、改进提示词效果、或者需要设计复杂的 AI 工作流提示词时，必须使用此技能。
---

# 提示词工程专家

你是一位资深提示词工程师，擅长通过系统化的方法帮助用户设计出高质量、效果卓越的 AI 提示词。

## 工作流程
1. 先用一句话确认你理解了用户的核心目标。
2. 提出 5 个以上针对性问题，覆盖角色、受众、形式、风格、限制等维度。
3. 使用 ICRO 框架生成提示词初稿：Input / Context / Role / Output。
4. 主动询问用户是否需要迭代，并提出合适的优化技术建议。`,
      notes:
        "这张卡最核心的价值，不是让 AI 替你写出一条更长的 Prompt，而是强迫你把模糊需求先摊开、先结构化，再进入真正的执行环节。",
      setup: [
        "把 `prompt-engineer` 注册成前置 Skill 或习惯性的第一跳。",
        "允许它在执行前先反问，而不是直接出答案。",
        "给自己设一个规则：任何关键任务都先走一次提示词整理。"
      ],
      workflow: [
        "原始输入先被 Skill 拦截。",
        "Skill 反向采访，补足上下文和限制条件。",
        "Skill 生成结构化 Prompt 初稿。",
        "你确认后，再把它交给真正执行任务的模型。"
      ]
    }
  }
];

export const featuredPosts = posts.slice(0, 3);

export const defaultComments: Record<string, DefaultComment[]> = {
  p1: [
    {
      id: "c-p1-1",
      postId: "p1",
      authorId: "u3",
      authorName: "陈淮",
      authorLevel: "咒语吟唱者",
      content:
        "我昨晚按这个思路给自己的课程项目也做了一版学习计划，最有用的是你说的 Lab。以前我总想“一口气看懂”，现在改成每个模块都强制改一点点代码，理解速度明显快了。",
      createdAt: "20 分钟前"
    },
    {
      id: "c-p1-2",
      postId: "p1",
      authorId: "u4",
      authorName: "许青禾",
      authorLevel: "魔法学徒",
      content:
        "我复现的时候有个小问题：如果项目里前后端目录特别多，AI 会把学习块拆得过细。后来我加了一句“优先按业务闭环分组，而不是按文件树机械拆分”，效果会更好一点。",
      createdAt: "1 小时前"
    }
  ],
  p2: [
    {
      id: "c-p2-1",
      postId: "p2",
      authorId: "u5",
      authorName: "沈砚秋",
      authorLevel: "炼金术士",
      content:
        "我昨天就拿这套流程试了常微分方程作业，最大的感受是“禁止自动纠错”真的太关键了。不然 AI 一边排版一边偷偷修步骤，最后交上去和草稿根本对不上。",
      createdAt: "刚刚"
    },
    {
      id: "c-p2-2",
      postId: "p2",
      authorId: "u6",
      authorName: "唐知白",
      authorLevel: "咒语吟唱者",
      content:
        "补充一个踩坑点：如果图片边缘阴影太重，转写时很容易把页边注释识别进去。我现在会先用手机自带扫描裁掉边缘，再丢给 Skill，命中率高很多。",
      createdAt: "35 分钟前"
    }
  ],
  p3: [
    {
      id: "c-p3-1",
      postId: "p3",
      authorId: "u7",
      authorName: "顾一川",
      authorLevel: "炼金术士",
      content:
        "这个思路我非常认同，尤其是“优化输入管线”那句。我现在写周报、做课程展示、甚至找文献总结，都会先走一层提示词整理，输出稳定太多了。",
      createdAt: "15 分钟前"
    },
    {
      id: "c-p3-2",
      postId: "p3",
      authorId: "u8",
      authorName: "陆繁",
      authorLevel: "咒语吟唱者",
      content:
        "我复现的时候把第二步的反向采访问题数从 5 个减到 3 个，结果明显信息不够。后来还是乖乖加回去，感觉这一步确实不能省。",
      createdAt: "2 小时前"
    }
  ]
};

export const notifications = [
  {
    id: "n1",
    title: "你的帖子被 3 位同学标记为“已复现”",
    description: "越来越多人完成复现，说明这套方法开始从个人经验变成可传播的做法。",
    time: "刚刚"
  },
  {
    id: "n2",
    title: "有人收藏了你的 Prompt 卡片",
    description: "对方准备稍后复用你的工作流，大概率还会回来补充反馈。",
    time: "2 小时前"
  },
  {
    id: "n3",
    title: "你的个人主页声望等级已更新",
    description: "随着帖子互动和可复现内容增加，主页上的成长轨迹也更清晰了。",
    time: "今天"
  }
];
