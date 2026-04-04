/**
 * SessionMemoryExtraction - Session Memory 提取触发条件的可视化
 */
import React from 'react';

export function TriggerCondition() {
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

export default TriggerCondition;
