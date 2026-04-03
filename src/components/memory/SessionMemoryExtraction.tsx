/**
 * SessionMemoryExtraction - Session Memory 后台提取机制的可视化
 * 展示提取触发条件、子代理工作方式、笔记文件结构
 */
import React, { useState } from 'react';

const SECTIONS = [
  { title: 'Session Title', desc: '5-10 字的会话主题', example: '重构 Auth 模块并修复 Token 刷新', icon: '🏷️' },
  { title: 'Current State', desc: '当前正在做什么', example: '正在修复 refresh token 的并发竞态问题，已定位到 mutex 缺失', icon: '📍' },
  { title: 'Task specification', desc: '用户要求构建什么', example: '用户要求重构 auth 模块，采用 JWT + refresh token 方案，需要向后兼容', icon: '📋' },
  { title: 'Files and Functions', desc: '重要文件清单', example: 'src/auth/index.ts (主入口)、src/auth/refresh.ts (token 刷新)、src/auth/middleware.ts (Express 中间件)', icon: '📁' },
  { title: 'Workflow', desc: '常用的命令和流程', example: 'npm test 运行测试 → npm run lint 检查 → 查看 test/auth.test.ts 的输出', icon: '⚡' },
  { title: 'Errors & Corrections', desc: '遇到的错误和修复', example: '尝试用 setTimeout 做 token 刷新被用户否决。用户要求用 mutex 方案。', icon: '🔧' },
  { title: 'Codebase and System Documentation', desc: '系统组件说明', example: 'Auth 模块依赖 Redis 做 session 存储，中间件链：rate-limit → auth → router', icon: '🏗️' },
  { title: 'Learnings', desc: '什么有效什么无效', example: '编辑 middleware.ts 前必须先跑测试，否则容易破坏登录流程', icon: '💡' },
  { title: 'Key results', desc: '关键输出结果', example: '（用户要求的性能对比表格或最终方案总结）', icon: '🎯' },
  { title: 'Worklog', desc: '工作日志', example: '1.读取auth目录 2.重构index.ts 3.测试失败 4.修复import 5.测试通过 6.开始处理refresh', icon: '📝' },
];

function NoteFileViewer() {
  const [activeSection, setActiveSection] = useState(0);
  const section = SECTIONS[activeSection];

  return (
    <div style={{
      display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden',
      border: '1px solid var(--ifm-color-emphasis-200, #e2e8f0)',
      minHeight: 380,
    }}>
      {/* 左侧段落列表 */}
      <div style={{
        width: 220, flexShrink: 0,
        background: 'var(--ifm-color-emphasis-100, #f8fafc)',
        borderRight: '1px solid var(--ifm-color-emphasis-200, #e2e8f0)',
        overflowY: 'auto',
      }}>
        <div style={{
          padding: '10px 12px', fontSize: 11, fontWeight: 600,
          color: 'var(--ifm-color-emphasis-500)',
          textTransform: 'uppercase', letterSpacing: 1,
          borderBottom: '1px solid var(--ifm-color-emphasis-200, #e2e8f0)',
        }}>
          session-memory.md
        </div>
        {SECTIONS.map((s, i) => (
          <div
            key={i}
            onClick={() => setActiveSection(i)}
            style={{
              padding: '8px 12px', cursor: 'pointer',
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              background: activeSection === i ? 'var(--ifm-color-primary-lightest, #dbeafe)' : 'transparent',
              borderLeft: activeSection === i ? '3px solid var(--ifm-color-primary, #3b82f6)' : '3px solid transparent',
              fontWeight: activeSection === i ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            <span>{s.icon}</span>
            <span style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{s.title}</span>
          </div>
        ))}
      </div>
      {/* 右侧详情 */}
      <div style={{ flex: 1, padding: 16 }}>
        <div style={{
          fontSize: 18, fontWeight: 700, marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>{section.icon}</span>
          # {section.title}
        </div>
        <div style={{
          fontSize: 13, color: 'var(--ifm-color-emphasis-600)',
          fontStyle: 'italic', marginBottom: 12,
          padding: '4px 8px',
          background: 'var(--ifm-color-emphasis-100, #f1f5f9)',
          borderRadius: 4,
        }}>
          _{section.desc}_
        </div>
        <div style={{
          fontSize: 14, lineHeight: 1.7,
          padding: 12, borderRadius: 8,
          background: '#fffbeb', border: '1px solid #fde68a',
        }}>
          <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600, marginBottom: 4 }}>
            示例内容（由子代理自动填充）：
          </div>
          {section.example}
        </div>
        <div style={{
          marginTop: 16, fontSize: 12, color: 'var(--ifm-color-emphasis-500)',
          padding: '8px 10px', borderRadius: 6,
          background: 'var(--ifm-color-emphasis-100, #f8fafc)',
          border: '1px dashed var(--ifm-color-emphasis-300)',
        }}>
          每个段落有 ~2000 token 的上限。整个文件总计不超过 ~12000 token。
          超出时子代理会被要求精简——优先保留 Current State 和 Errors & Corrections。
        </div>
      </div>
    </div>
  );
}

function TriggerCondition() {
  return (
    <div style={{
      display: 'flex', gap: 12, margin: '1rem 0',
      flexWrap: 'wrap',
    }}>
      {/* 初始化条件 */}
      <div style={{
        flex: '1 1 280px', padding: 16, borderRadius: 10,
        border: '2px solid #8b5cf6', background: '#8b5cf608',
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#8b5cf6', marginBottom: 8 }}>
          🚀 首次激活
        </div>
        <div style={{
          fontSize: 40, fontWeight: 800, color: '#8b5cf6',
          fontFamily: 'monospace',
        }}>
          10K
        </div>
        <div style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600)', marginTop: 4 }}>
          对话累积到 <strong>10,000 tokens</strong> 时，Session Memory 首次激活。
          在此之前对话太短，不值得提取。
        </div>
        <div style={{
          fontSize: 11, fontFamily: 'monospace', color: '#7c3aed',
          marginTop: 8, padding: '4px 8px', background: '#f5f3ff', borderRadius: 4,
        }}>
          minimumMessageTokensToInit: 10_000
        </div>
      </div>

      {/* 更新条件 */}
      <div style={{
        flex: '1 1 280px', padding: 16, borderRadius: 10,
        border: '2px solid #3b82f6', background: '#3b82f608',
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#3b82f6', marginBottom: 8 }}>
          🔄 后续更新
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--ifm-color-emphasis-700)' }}>
          满足以下条件之一：
          <div style={{
            margin: '8px 0', padding: 10, borderRadius: 6,
            background: '#eff6ff', fontSize: 13,
          }}>
            <div style={{ marginBottom: 6 }}>
              <strong>条件 A：</strong>token 增量 ≥ <code>5,000</code> <strong>且</strong> 工具调用 ≥ <code>3</code> 次
            </div>
            <div style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 700 }}>OR</div>
            <div style={{ marginTop: 6 }}>
              <strong>条件 B：</strong>token 增量 ≥ <code>5,000</code> <strong>且</strong> 最后一轮无工具调用（对话自然停顿）
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            注意：token 增量阈值是<strong>始终必须的</strong>——即使工具调用条件满足，
            也要等 token 增长足够才提取，防止过于频繁。
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SessionMemoryExtraction() {
  return (
    <div>
      <TriggerCondition />
      <div style={{ marginTop: 24 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, marginBottom: 10,
          color: 'var(--ifm-color-emphasis-700)',
        }}>
          笔记文件的 9 段式结构（点击左侧段落名查看详情）
        </div>
        <NoteFileViewer />
      </div>
    </div>
  );
}

export { TriggerCondition, NoteFileViewer };
