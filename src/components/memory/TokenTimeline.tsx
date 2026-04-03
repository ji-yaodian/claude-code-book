/**
 * TokenTimeline - 展示一次完整会话中 token 使用量的变化
 * 包含：token 累积曲线、Session Memory 提取点、压缩阈值线、压缩事件
 */
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ReferenceLine, Tooltip, ResponsiveContainer, ReferenceArea,
} from 'recharts';

const data = [
  { turn: 1,  tokens: 8000,   event: null },
  { turn: 2,  tokens: 12000,  event: 'init' },
  { turn: 3,  tokens: 18000,  event: null },
  { turn: 4,  tokens: 25000,  event: 'extract' },
  { turn: 5,  tokens: 34000,  event: null },
  { turn: 6,  tokens: 42000,  event: null },
  { turn: 7,  tokens: 51000,  event: 'extract' },
  { turn: 8,  tokens: 63000,  event: null },
  { turn: 9,  tokens: 78000,  event: null },
  { turn: 10, tokens: 89000,  event: 'extract' },
  { turn: 11, tokens: 102000, event: null },
  { turn: 12, tokens: 118000, event: null },
  { turn: 13, tokens: 131000, event: 'extract' },
  { turn: 14, tokens: 148000, event: null },
  { turn: 15, tokens: 160000, event: null },
  { turn: 16, tokens: 167000, event: 'compact' },
  // 压缩后 token 大幅下降
  { turn: 17, tokens: 35000,  event: null },
  { turn: 18, tokens: 48000,  event: null },
  { turn: 19, tokens: 61000,  event: 'extract' },
  { turn: 20, tokens: 75000,  event: null },
];

const THRESHOLD = 167000;
const WARNING = 147000;

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (!payload.event || payload.event === 'init') return null;

  if (payload.event === 'extract') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#8b5cf6" stroke="#fff" strokeWidth={2} />
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize={10} fill="#8b5cf6" fontWeight={600}>
          提取
        </text>
      </g>
    );
  }
  if (payload.event === 'compact') {
    return (
      <g>
        <polygon
          points={`${cx},${cy - 10} ${cx - 8},${cy + 6} ${cx + 8},${cy + 6}`}
          fill="#ef4444" stroke="#fff" strokeWidth={2}
        />
        <text x={cx} y={cy - 18} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={700}>
          压缩触发!
        </text>
      </g>
    );
  }
  return null;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const eventLabel: Record<string, string> = {
    init: '🟢 Session Memory 初始化（达到 10K tokens）',
    extract: '🟣 Session Memory 后台提取',
    compact: '🔴 触发上下文压缩',
  };
  return (
    <div style={{
      background: 'var(--ifm-background-color, #fff)',
      border: '1px solid var(--ifm-color-emphasis-300, #ddd)',
      borderRadius: 8, padding: '8px 12px', fontSize: 13,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: 600 }}>第 {d.turn} 轮</div>
      <div>Token 使用量：{(d.tokens / 1000).toFixed(0)}K</div>
      {d.event && <div style={{ marginTop: 4 }}>{eventLabel[d.event]}</div>}
    </div>
  );
}

export default function TokenTimeline() {
  return (
    <div style={{ margin: '2rem 0' }}>
      <div style={{
        textAlign: 'center', fontSize: 15, fontWeight: 600,
        color: 'var(--ifm-color-emphasis-700)', marginBottom: 8,
      }}>
        一次典型会话的 Token 使用量变化
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ifm-color-emphasis-200, #eee)" />
          <XAxis
            dataKey="turn" fontSize={12}
            label={{ value: '对话轮次', position: 'insideBottom', offset: -4, fontSize: 12 }}
          />
          <YAxis
            fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            label={{ value: 'Token 数', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* 警告区域 */}
          <ReferenceArea y1={WARNING} y2={THRESHOLD} fill="#fef3c7" fillOpacity={0.5} />

          {/* 压缩阈值线 */}
          <ReferenceLine
            y={THRESHOLD} stroke="#ef4444" strokeDasharray="8 4" strokeWidth={2}
            label={{
              value: `自动压缩阈值 (${(THRESHOLD / 1000).toFixed(0)}K)`,
              position: 'right', fontSize: 11, fill: '#ef4444',
            }}
          />

          {/* 初始化阈值线 */}
          <ReferenceLine
            y={10000} stroke="#8b5cf6" strokeDasharray="4 4" strokeWidth={1}
            label={{
              value: 'SM 初始化 (10K)',
              position: 'right', fontSize: 10, fill: '#8b5cf6',
            }}
          />

          <Area
            type="monotone" dataKey="tokens"
            stroke="#3b82f6" strokeWidth={2.5}
            fill="url(#tokenGrad)"
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 24,
        fontSize: 12, color: 'var(--ifm-color-emphasis-600)', marginTop: 4,
      }}>
        <span>🟣 Session Memory 提取</span>
        <span>🔴 压缩事件</span>
        <span style={{ color: '#ef4444' }}>--- 压缩阈值</span>
        <span style={{ background: '#fef3c7', padding: '0 6px', borderRadius: 3 }}>警告区</span>
      </div>
    </div>
  );
}
