# 开发说明

## 当前定位

这不是长期运营产品的工程骨架，而是比赛演示优先的最小实现：

- 页面要完整
- 主链路要能演示
- 技术栈尽量少
- 暂不追求复杂架构

## 当前技术栈

- Next.js
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage

## 页面范围

- `/` 首页
- `/auth` 登录页
- `/create` 发帖页
- `/post/[id]` 帖子详情页
- `/profile/[id]` 个人主页
- `/notifications` 通知页

## 当前简化策略

- 不做富文本编辑器，改为结构化发帖表单
- 不做 Prisma、Redis、复杂通知系统
- 声望、通知、排序逻辑都按最小演示实现
- Prompt 卡片作为独立内容块重点展示

## 本地启动

1. 配置 `.env.local`
2. 安装依赖：`npm.cmd install`
3. 启动开发：`npm.cmd run dev`

## Supabase 初始化

1. 新建 Supabase 项目
2. 在 SQL Editor 中执行 `supabase/schema.sql`
3. 将项目 URL 和 anon key 填入 `.env.local`

## 后续优先级

1. 接通 Supabase Auth
2. 接通 posts / prompt_cards 读写
3. 接通 Storage 上传图片
4. 再补点赞、已复现、收藏等轻交互
