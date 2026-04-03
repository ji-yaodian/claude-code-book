/**
 * CompactionBeforeAfter - 压缩前后消息数组的可视化对比
 * 核心教学组件：直观展示压缩到底做了什么
 */
import React, { useState } from 'react';

type MessageType = 'user' | 'assistant' | 'tool_use' | 'tool_result' | 'system' | 'summary' | 'boundary' | 'hook' | 'attachment';

interface MessageBlock {
  type: MessageType;
  label: string;
  detail?: string;
  tokens?: number;
  /** 是否在压缩中被删除 */
  removed?: boolean;
  /** 是否在压缩中被保留 */
  kept?: boolean;
  /** 是否是新生成的 */
  generated?: boolean;
}

const TYPE_STYLES: Record<MessageType, { bg: string; border: string; icon: string }> = {
  user:        { bg: '#eff6ff', border: '#3b82f6', icon: '👤' },
  assistant:   { bg: '#f0fdf4', border: '#22c55e', icon: '🤖' },
  tool_use:    { bg: '#fefce8', border: '#eab308', icon: '🔧' },
  tool_result: { bg: '#fef9ee', border: '#f59e0b', icon: '📋' },
  system:      { bg: '#f8fafc', border: '#94a3b8', icon: '⚙️' },
  summary:     { bg: '#faf5ff', border: '#a855f7', icon: '📝' },
  boundary:    { bg: '#fef2f2', border: '#ef4444', icon: '🔖' },
  hook:        { bg: '#ecfdf5', border: '#10b981', icon: '📎' },
  attachment:  { bg: '#f0f9ff', border: '#0ea5e9', icon: '📦' },
};

const BEFORE: MessageBlock[] = [
  { type: 'user', label: '用户: "帮我重构 auth 模块"', tokens: 200, removed: true },
  { type: 'assistant', label: '助手: "好的，让我先看看代码结构..."', tokens: 500, removed: true },
  { type: 'tool_use', label: '→ Read src/auth/index.ts', tokens: 100, removed: true },
  { type: 'tool_result', label: '← 文件内容 (420行)', tokens: 3200, removed: true },
  { type: 'tool_use', label: '→ Read src/auth/middleware.ts', tokens: 100, removed: true },
  { type: 'tool_result', label: '← 文件内容 (280行)', tokens: 2100, removed: true },
  { type: 'assistant', label: '助手: "我发现了几个问题..."', tokens: 800, removed: true },
  { type: 'tool_use', label: '→ Edit src/auth/index.ts', tokens: 400, removed: true },
  { type: 'tool_result', label: '← 编辑成功', tokens: 50, removed: true },
  { type: 'user', label: '用户: "测试跑一下"', tokens: 50, removed: true },
  { type: 'tool_use', label: '→ Bash: npm test', tokens: 100, removed: true },
  { type: 'tool_result', label: '← 3 tests failed', tokens: 600, removed: true },
  { type: 'assistant', label: '助手: "测试失败了，让我修复..."', tokens: 400, removed: true },
  { type: 'tool_use', label: '→ Edit src/auth/index.ts', tokens: 350, removed: true },
  { type: 'tool_result', label: '← 编辑成功', tokens: 50, removed: true },
  // ... 这里省略了大量中间消息 ...
  { type: 'user', label: '用户: "还需要处理 token 刷新逻辑"', tokens: 100, kept: true },
  { type: 'assistant', label: '助手: "好的，我来处理 refresh token..."', tokens: 600, kept: true },
  { type: 'tool_use', label: '→ Read src/auth/refresh.ts', tokens: 100, kept: true },
  { type: 'tool_result', label: '← 文件内容 (150行)', tokens: 1800, kept: true },
  { type: 'tool_use', label: '→ Edit src/auth/refresh.ts', tokens: 300, kept: true },
  { type: 'tool_result', label: '← 编辑成功', tokens: 50, kept: true },
];

const AFTER: MessageBlock[] = [
  { type: 'boundary', label: '压缩边界标记', detail: '记录压缩类型、时间戳、压缩前 token 数', generated: true },
  { type: 'summary', label: '上下文摘要（来自 Session Memory 笔记）', detail: '包含 9 个段落的结构化摘要 + transcript 路径', generated: true },
  { type: 'user', label: '用户: "还需要处理 token 刷新逻辑"', tokens: 100, kept: true },
  { type: 'assistant', label: '助手: "好的，我来处理 refresh token..."', tokens: 600, kept: true },
  { type: 'tool_use', label: '→ Read src/auth/refresh.ts', tokens: 100, kept: true },
  { type: 'tool_result', label: '← 文件内容 (150行)', tokens: 1800, kept: true },
  { type: 'tool_use', label: '→ Edit src/auth/refresh.ts', tokens: 300, kept: true },
  { type: 'tool_result', label: '← 编辑成功', tokens: 50, kept: true },
  { type: 'hook', label: 'CLAUDE.md 重新注入', detail: '通过 processSessionStartHooks 重新加载项目指令', generated: true },
  { type: 'attachment', label: '工具/MCP 指令重注入', detail: '工具定义 Delta + 代理列表 + MCP 服务端指令', generated: true },
];

function MessageRow({ msg, index, animated }: { msg: MessageBlock; index: number; animated?: boolean }) {
  const style = TYPE_STYLES[msg.type];
  const opacity = msg.removed ? 0.4 : 1;

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', gap: 0,
      opacity, fontSize: 13, lineHeight: 1.4,
      transition: animated ? 'all 0.3s ease' : undefined,
      marginBottom: 2,
    }}>
      {/* 左侧色条 */}
      <div style={{
        width: 4, borderRadius: '2px 0 0 2px',
        background: style.border, flexShrink: 0,
      }} />
      {/* 主体 */}
      <div style={{
        flex: 1, padding: '6px 10px',
        background: style.bg,
        borderRadius: '0 6px 6px 0',
        border: `1px solid ${style.border}20`,
        borderLeft: 'none',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{style.icon}</span>
          <span style={{ fontWeight: msg.generated ? 600 : 400 }}>{msg.label}</span>
          {msg.tokens && (
            <span style={{
              marginLeft: 'auto', fontSize: 11, color: '#94a3b8',
              fontFamily: 'monospace',
            }}>
              ~{msg.tokens >= 1000 ? `${(msg.tokens / 1000).toFixed(1)}K` : msg.tokens} tok
            </span>
          )}
        </div>
        {msg.detail && (
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, paddingLeft: 22 }}>
            {msg.detail}
          </div>
        )}
        {/* 标注 */}
        {msg.removed && (
          <div style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            fontSize: 10, color: '#ef4444', fontWeight: 600,
            background: '#fef2f2', padding: '1px 6px', borderRadius: 3,
          }}>
            已被摘要覆盖 ✕
          </div>
        )}
        {msg.generated && (
          <div style={{
            position: 'absolute', right: 8, top: 4,
            fontSize: 10, color: '#8b5cf6', fontWeight: 600,
            background: '#faf5ff', padding: '1px 6px', borderRadius: 3,
          }}>
            新生成 ✦
          </div>
        )}
      </div>
    </div>
  );
}

function TokenBar({ total, label, color }: { total: number; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <span style={{ width: 80, textAlign: 'right', color: '#64748b' }}>{label}</span>
      <div style={{
        flex: 1, height: 20, background: 'var(--ifm-color-emphasis-100, #f1f5f9)',
        borderRadius: 4, overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.min((total / 167000) * 100, 100)}%`,
          height: '100%', background: color, borderRadius: 4,
          transition: 'width 0.5s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
        }}>
          <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            {(total / 1000).toFixed(0)}K
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CompactionBeforeAfter() {
  const [showAfter, setShowAfter] = useState(false);
  const beforeTokens = BEFORE.reduce((s, m) => s + (m.tokens || 200), 0);
  const afterTokens = AFTER.reduce((s, m) => s + (m.tokens || 200), 0);

  return (
    <div style={{ margin: '2rem 0' }}>
      {/* 切换按钮 */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 16, gap: 0,
      }}>
        <button
          onClick={() => setShowAfter(false)}
          style={{
            padding: '8px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            border: '2px solid #3b82f6',
            borderRadius: '8px 0 0 8px',
            background: !showAfter ? '#3b82f6' : 'transparent',
            color: !showAfter ? '#fff' : '#3b82f6',
            transition: 'all 0.2s',
          }}
        >
          压缩前（{BEFORE.length} 条消息）
        </button>
        <button
          onClick={() => setShowAfter(true)}
          style={{
            padding: '8px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            border: '2px solid #22c55e',
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            background: showAfter ? '#22c55e' : 'transparent',
            color: showAfter ? '#fff' : '#22c55e',
            transition: 'all 0.2s',
          }}
        >
          压缩后（{AFTER.length} 条消息）
        </button>
      </div>

      {/* Token 对比条 */}
      <div style={{ marginBottom: 16, padding: '0 8px' }}>
        <TokenBar total={beforeTokens} label="压缩前" color={!showAfter ? '#3b82f6' : '#cbd5e1'} />
        <div style={{ height: 4 }} />
        <TokenBar total={afterTokens} label="压缩后" color={showAfter ? '#22c55e' : '#cbd5e1'} />
      </div>

      {/* 消息列表 */}
      <div style={{
        maxHeight: 520, overflowY: 'auto', padding: '8px',
        border: '1px solid var(--ifm-color-emphasis-200, #e2e8f0)',
        borderRadius: 8,
        background: 'var(--ifm-background-surface-color, #fff)',
      }}>
        {!showAfter ? (
          <>
            {BEFORE.slice(0, 15).map((msg, i) => (
              <MessageRow key={i} msg={msg} index={i} />
            ))}
            {/* 省略标记 */}
            <div style={{
              textAlign: 'center', padding: '12px', color: '#94a3b8',
              fontSize: 13, fontStyle: 'italic',
              borderTop: '1px dashed #e2e8f0',
              borderBottom: '1px dashed #e2e8f0',
              margin: '4px 0',
            }}>
              ··· 此处省略约 120+ 条消息（大量文件读写、测试执行、错误修复循环）···
            </div>
            {BEFORE.slice(15).map((msg, i) => (
              <MessageRow key={i + 15} msg={msg} index={i + 15} />
            ))}
          </>
        ) : (
          AFTER.map((msg, i) => (
            <MessageRow key={i} msg={msg} index={i} animated />
          ))
        )}
      </div>

      {/* 说明文字 */}
      <div style={{
        marginTop: 12, padding: '10px 14px', fontSize: 12,
        color: 'var(--ifm-color-emphasis-600)',
        background: showAfter ? '#f0fdf4' : '#eff6ff',
        borderRadius: 6, lineHeight: 1.6,
        transition: 'background 0.3s',
      }}>
        {!showAfter ? (
          <>
            <strong>压缩前：</strong>消息数组包含完整对话历史。红色标注的早期消息已被 Session Memory
            笔记文件覆盖（<code>lastSummarizedMessageId</code> 之前的消息），可以安全删除。
            蓝色标注的最近消息将原样保留。
          </>
        ) : (
          <>
            <strong>压缩后：</strong>旧消息被替换为 4 个新组件——
            <strong>①</strong> 压缩边界标记（元数据）、
            <strong>②</strong> Session Memory 笔记作为摘要、
            <strong>③</strong> 原样保留的最近消息、
            <strong>④</strong> CLAUDE.md 和工具定义的重注入。
            模型看到的效果就像"刚在一个新会话中拿到了完整的工作简报"。
          </>
        )}
      </div>
    </div>
  );
}
