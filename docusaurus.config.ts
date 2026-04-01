import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Claude Code 源码解析',
  tagline: '深入理解大型智能体系统的构建方式',
  url: 'https://ji-yaodian.github.io',
  baseUrl: '/claude-code-book/',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'Claude Code, 源码解析, LLM Agent, TypeScript, AI 智能体, Anthropic, 系统架构',
      },
    },
  ],

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      'docusaurus-lunr-search',
      {
        languages: ['en', 'zh'],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Claude Code 源码解析',
      items: [
        {
          href: 'https://github.com/ji-yaodian/claude-code-book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'javascript'],
      defaultLanguage: 'typescript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
