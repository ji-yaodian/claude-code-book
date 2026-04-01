# Claude Code 源码解析

> 深入理解大型 TypeScript CLI 智能体系统的构建方式

本书基于 [Claude Code](https://claude.ai/code) 项目源码（约 1,900 个文件、512,000+ 行代码）系统性地剖析其架构设计、核心模块、设计模式和工程实践。

## 📖 在线阅读

**[https://ji-yaodian.github.io/claude-code-book](https://ji-yaodian.github.io/claude-code-book)**

## 📚 内容目录

| 章节 | 主题 |
|------|------|
| 第 1 章 | 项目概览：技术栈、目录结构、架构全貌 |
| 第 2 章 | 入口与启动流程：并行预取、特性标志、初始化链路 |
| 第 3 章 | 工具系统：40+ 工具的设计与实现 |
| 第 4 章 | 命令系统：80+ 斜杠命令的注册与路由 |
| 第 5 章 | 查询引擎：LLM 交互的核心循环 |
| 第 6 章 | 桥接通信系统：IDE 与 CLI 的双向通信 |
| 第 7 章 | 服务层：外部集成与基础设施 |
| 第 8 章 | UI 组件与终端渲染：React + Ink 架构 |
| 第 9 章 | 权限与安全系统：多层防御体系 |
| 第 10 章 | 插件与技能系统：可扩展架构设计 |
| 第 11 章 | 多智能体协调：Agent Swarms 实现 |
| 第 12 章 | CLI 传输层与远程会话 |
| 第 13 章 | 状态管理与数据持久化 |
| 第 14 章 | 工程实践与设计模式总结 |
| 第 15 章 | Prompt 工程体系：系统提示词组装、工具描述即行为规范、缓存监控 |
| 第 16 章 | 消息数组的构造与生命周期：三通道注入、工具循环、分层压缩、缓存优化 |

## 🛠️ 本地开发

```bash
npm install
npm start
```

访问 [http://localhost:3000](http://localhost:3000)

## 🏗️ 技术栈

- [Docusaurus 3.x](https://docusaurus.io/) — 静态站点生成
- [MDX](https://mdxjs.com/) — Markdown + JSX
- [Mermaid](https://mermaid.js.org/) — 架构图与流程图
- GitHub Pages — 托管部署

## 📄 许可

本书内容仅供学习参考。
