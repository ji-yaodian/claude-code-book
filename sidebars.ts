import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  bookSidebar: [
    { type: 'doc', id: 'outline', label: '📖 目录与阅读指南' },
    {
      type: 'category',
      label: '基础篇',
      items: [
        { type: 'doc', id: 'project-overview', label: '第 1 章 · 项目概览' },
        { type: 'doc', id: 'entry-and-startup', label: '第 2 章 · 入口与启动流程' },
      ],
    },
    {
      type: 'category',
      label: '核心系统',
      items: [
        { type: 'doc', id: 'tool-system', label: '第 3 章 · 工具系统' },
        { type: 'doc', id: 'command-system', label: '第 4 章 · 命令系统' },
        { type: 'doc', id: 'query-engine', label: '第 5 章 · 查询引擎' },
      ],
    },
    {
      type: 'category',
      label: '通信与服务',
      items: [
        { type: 'doc', id: 'bridge-system', label: '第 6 章 · 桥接通信系统' },
        { type: 'doc', id: 'service-layer', label: '第 7 章 · 服务层' },
      ],
    },
    {
      type: 'category',
      label: '交互与安全',
      items: [
        { type: 'doc', id: 'ui-and-rendering', label: '第 8 章 · UI 组件与终端渲染' },
        { type: 'doc', id: 'permission-and-security', label: '第 9 章 · 权限与安全系统' },
      ],
    },
    {
      type: 'category',
      label: '扩展与协调',
      items: [
        { type: 'doc', id: 'plugin-and-skill-system', label: '第 10 章 · 插件与技能系统' },
        { type: 'doc', id: 'multi-agent-coordination', label: '第 11 章 · 多智能体协调' },
      ],
    },
    {
      type: 'category',
      label: '基础设施',
      items: [
        { type: 'doc', id: 'cli-transport-and-remote', label: '第 12 章 · CLI 传输层与远程会话' },
        { type: 'doc', id: 'state-and-persistence', label: '第 13 章 · 状态管理与数据持久化' },
      ],
    },
    {
      type: 'category',
      label: '总结',
      items: [
        { type: 'doc', id: 'engineering-practices', label: '第 14 章 · 工程实践与设计模式' },
        { type: 'doc', id: 'prompt-design-system', label: '第 15 章 · Prompt 工程体系' },
        { type: 'doc', id: 'message-construction', label: '第 16 章 · 消息数组的构造与生命周期' },
      ],
    },
  ],
};

export default sidebars;
