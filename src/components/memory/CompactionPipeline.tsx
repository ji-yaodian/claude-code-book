/**
 * CompactionPipeline - 压缩流水线的交互式步骤展示
 * 用户可以逐步点击，看到每个阶段发生了什么
 */
import React, { useState } from 'react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: React.ReactNode;
  codeFile?: string;
  codeLine?: string;
  color: string;
}

const SM_STEPS: Step[] = [
  {
    id: 1,
    title: '检查 Session Memory 笔记',
    subtitle: 'trySessionMemoryCompaction()',
    description: (
      <>
        <p>系统首先读取后台持续维护的 Session Memory 笔记文件。</p>
        <p>两个前置条件必须满足：</p>
        <ul>
          <li><code>tengu_session_memory</code> 和 <code>tengu_sm_compact</code> 特性标志都为 true</li>
          <li>笔记文件存在且非空（不能只有模板，必须有实际内容）</li>
        </ul>
        <p>如果笔记为空，意味着后台提取还没来得及运行——<strong>回退到传统压缩</strong>。</p>
      </>
    ),
    codeFile: 'src/services/compact/sessionMemoryCompact.ts',
    codeLine: '514-543',
    color: '#8b5cf6',
  },
  {
    id: 2,
    title: '定位分界线',
    subtitle: 'lastSummarizedMessageId',
    description: (
      <>
        <p>
          每次 Session Memory 后台提取完成后，会记录一个 <code>lastSummarizedMessageId</code>——
          表示"笔记已经覆盖到了这条消息"。
        </p>
        <p>这个 ID 就是<strong>压缩的分界线</strong>：</p>
        <div style={{
          background: '#faf5ff', borderRadius: 8, padding: 12, margin: '8px 0',
          border: '1px solid #e9d5ff', fontSize: 13,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: 8, background: '#fee2e2', borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#991b1b' }}>分界线之前</div>
              <div style={{ fontWeight: 600 }}>已被笔记覆盖 → 可以删除</div>
            </div>
            <div style={{ fontSize: 20 }}>|</div>
            <div style={{ flex: 1, textAlign: 'center', padding: 8, background: '#dbeafe', borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#1e40af' }}>分界线之后</div>
              <div style={{ fontWeight: 600 }}>未被覆盖 → 必须保留</div>
            </div>
          </div>
        </div>
      </>
    ),
    codeFile: 'src/services/compact/sessionMemoryCompact.ts',
    codeLine: '546-566',
    color: '#8b5cf6',
  },
  {
    id: 3,
    title: '计算保留范围',
    subtitle: 'calculateMessagesToKeepIndex()',
    description: (
      <>
        <p>从分界线开始，系统需要决定<strong>保留多少最近的消息</strong>。保留太少会丢失关键上下文，保留太多则压缩不够。</p>
        <p>算法是一个<strong>向前扩展</strong>的过程：</p>
        <ol>
          <li>从分界线之后的消息开始计数</li>
          <li>检查是否已满足最低要求（10K tokens + 5条含文本消息）</li>
          <li>如果不够，向更早的消息扩展</li>
          <li>遇到 40K tokens 硬上限或上一个压缩边界时停止</li>
          <li>最后调整边界，确保不切割 tool_use/tool_result 配对</li>
        </ol>
        <div style={{
          fontFamily: 'monospace', fontSize: 12, background: '#f8fafc',
          padding: 10, borderRadius: 6, border: '1px solid #e2e8f0',
        }}>
          minTokens: 10,000 &nbsp;|&nbsp; minTextBlockMessages: 5 &nbsp;|&nbsp; maxTokens: 40,000
        </div>
      </>
    ),
    codeFile: 'src/services/compact/sessionMemoryCompact.ts',
    codeLine: '324-397',
    color: '#8b5cf6',
  },
  {
    id: 4,
    title: '重注入项目上下文',
    subtitle: 'processSessionStartHooks()',
    description: (
      <>
        <p>旧消息被删除后，其中可能包含了 CLAUDE.md 等项目指令的信息。系统需要<strong>重新注入</strong>这些上下文。</p>
        <p>这通过触发"会话启动 hooks"实现——效果等同于新建一个会话：</p>
        <ul>
          <li><strong>CLAUDE.md</strong>：重新读取并注入项目规则和用户指令</li>
          <li><strong>工具定义 Delta</strong>：重新声明可用工具的 schema</li>
          <li><strong>MCP 指令</strong>：重新注入 MCP 服务端的使用说明</li>
          <li><strong>代理列表</strong>：重新声明可用的子代理类型</li>
        </ul>
      </>
    ),
    codeFile: 'src/services/compact/sessionMemoryCompact.ts',
    codeLine: '584-586',
    color: '#10b981',
  },
  {
    id: 5,
    title: '组装新消息数组',
    subtitle: 'buildPostCompactMessages()',
    description: (
      <>
        <p>最终，一个全新的消息数组被组装出来：</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '8px 0' }}>
          {[
            { n: '①', label: 'boundaryMarker', desc: '压缩边界标记（元数据：时间、token 数、发现的工具）', bg: '#fef2f2', border: '#ef4444' },
            { n: '②', label: 'summaryMessages', desc: 'Session Memory 笔记内容，包装成 user 消息', bg: '#faf5ff', border: '#a855f7' },
            { n: '③', label: 'messagesToKeep', desc: '原样保留的最近消息（分界线之后）', bg: '#eff6ff', border: '#3b82f6' },
            { n: '④', label: 'attachments', desc: '计划附件、文件附件', bg: '#f0f9ff', border: '#0ea5e9' },
            { n: '⑤', label: 'hookResults', desc: 'CLAUDE.md + 工具定义 + MCP 指令', bg: '#ecfdf5', border: '#10b981' },
          ].map(item => (
            <div key={item.n} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: item.bg, borderLeft: `4px solid ${item.border}`,
              fontSize: 13,
            }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{item.n}</span>
              <code style={{ fontSize: 12 }}>{item.label}</code>
              <span style={{ color: '#64748b', marginLeft: 4 }}>— {item.desc}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          对模型来说，这看起来就像"在一个新会话中收到了完整的工作简报 + 最近的对话上下文"——它可以无缝继续工作。
        </p>
      </>
    ),
    codeFile: 'src/services/compact/compact.ts',
    codeLine: '330-348',
    color: '#3b82f6',
  },
];

const TRAD_STEPS: Step[] = [
  {
    id: 1,
    title: '微压缩预处理',
    subtitle: 'microcompactMessages()',
    description: (
      <>
        <p>在发送给总结模型之前，先对消息做"微压缩"——清理旧的工具调用结果以减少 token 数。</p>
        <p>只处理特定工具的结果：Read、Bash、Grep、Glob、WebSearch、WebFetch、Edit、Write。</p>
        <p>两种模式：</p>
        <ul>
          <li><strong>Cached Microcompact</strong>：通过 Prompt Cache API 的 <code>cache_edits</code> 在 API 层面删除旧结果，不修改本地消息</li>
          <li><strong>Time-Based Microcompact</strong>：当助手消息间隔超过阈值时，直接将旧结果替换为 <code>[Old tool result content cleared]</code></li>
        </ul>
      </>
    ),
    codeFile: 'src/services/compact/microCompact.ts',
    codeLine: '39-49',
    color: '#f59e0b',
  },
  {
    id: 2,
    title: '调用 API 生成总结',
    subtitle: 'streamCompactSummary()',
    description: (
      <>
        <p>这是传统压缩最核心（也是最昂贵）的步骤——<strong>额外调用一次 Claude API</strong> 来总结对话。</p>
        <p>关键设置：</p>
        <ul>
          <li>System Prompt 极简化：只告诉模型"你的任务是总结对话"</li>
          <li>用 <code>NO_TOOLS_PREAMBLE</code> 严格禁止一切工具调用</li>
          <li><code>maxTurns: 1</code>——只允许一轮输出</li>
          <li>要求输出 <code>&lt;analysis&gt;</code> 思维过程 + <code>&lt;summary&gt;</code> 正式总结</li>
        </ul>
        <p>总结包含 9 个标准段落：用户意图、技术概念、文件和代码、错误与修复、问题解决、所有用户消息、待办任务、当前工作、下一步建议。</p>
      </>
    ),
    codeFile: 'src/services/compact/prompt.ts',
    codeLine: '61-143',
    color: '#ef4444',
  },
  {
    id: 3,
    title: '后处理与组装',
    subtitle: 'formatCompactSummary()',
    description: (
      <>
        <p>API 返回后：</p>
        <ol>
          <li>删除 <code>&lt;analysis&gt;</code> 块——它只是改善总结质量的思维草稿，没有信息价值</li>
          <li>提取 <code>&lt;summary&gt;</code> 内容，格式化为可读文本</li>
          <li>与 SM 压缩相同：重注入 CLAUDE.md、工具定义等上下文</li>
          <li>组装最终的消息数组（结构与 SM 压缩相同）</li>
        </ol>
      </>
    ),
    codeFile: 'src/services/compact/prompt.ts',
    codeLine: '311-335',
    color: '#3b82f6',
  },
];

function StepCard({ step, isActive, onClick }: { step: Step; isActive: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 10,
        border: `2px solid ${isActive ? step.color : 'var(--ifm-color-emphasis-200, #e2e8f0)'}`,
        background: isActive ? `${step.color}08` : 'transparent',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* 头部 */}
      <div style={{
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: isActive ? `1px solid ${step.color}20` : 'none',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: isActive ? step.color : 'var(--ifm-color-emphasis-200)',
          color: isActive ? '#fff' : 'var(--ifm-color-emphasis-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, flexShrink: 0,
          transition: 'all 0.2s',
        }}>
          {step.id}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{step.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-500)', fontFamily: 'monospace' }}>
            {step.subtitle}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', transform: isActive ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          ▶
        </div>
      </div>

      {/* 展开内容 */}
      {isActive && (
        <div style={{ padding: '12px 14px 14px', fontSize: 14, lineHeight: 1.7 }}>
          {step.description}
          {step.codeFile && (
            <div style={{
              marginTop: 8, fontSize: 12, color: '#64748b',
              fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              📍 {step.codeFile}:{step.codeLine}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CompactionPipeline() {
  const [activeTab, setActiveTab] = useState<'sm' | 'traditional'>('sm');
  const [activeStep, setActiveStep] = useState(1);
  const steps = activeTab === 'sm' ? SM_STEPS : TRAD_STEPS;

  return (
    <div style={{ margin: '2rem 0' }}>
      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div
          onClick={() => { setActiveTab('sm'); setActiveStep(1); }}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
            border: `2px solid ${activeTab === 'sm' ? '#8b5cf6' : 'var(--ifm-color-emphasis-200)'}`,
            background: activeTab === 'sm' ? '#8b5cf610' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, color: activeTab === 'sm' ? '#8b5cf6' : undefined }}>
            路径 A：Session Memory 压缩
          </div>
          <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-500)', marginTop: 2 }}>
            优先选择 · 零 API 调用 · 用笔记文件代替总结
          </div>
        </div>
        <div
          onClick={() => { setActiveTab('traditional'); setActiveStep(1); }}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
            border: `2px solid ${activeTab === 'traditional' ? '#ef4444' : 'var(--ifm-color-emphasis-200)'}`,
            background: activeTab === 'traditional' ? '#ef444410' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, color: activeTab === 'traditional' ? '#ef4444' : undefined }}>
            路径 B：传统压缩
          </div>
          <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-500)', marginTop: 2 }}>
            回退方案 · 需要额外 API 调用 · 实时生成总结
          </div>
        </div>
      </div>

      {/* 步骤列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map(step => (
          <StepCard
            key={`${activeTab}-${step.id}`}
            step={step}
            isActive={activeStep === step.id}
            onClick={() => setActiveStep(activeStep === step.id ? -1 : step.id)}
          />
        ))}
      </div>
    </div>
  );
}
