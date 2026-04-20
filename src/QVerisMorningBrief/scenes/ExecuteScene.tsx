import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';

const apiCalls = [
  {
    label: 'Pre-Market Movers',
    provider: 'Alpaca Markets',
    status: 200,
    time: '183ms',
    jsonLines: [
      '{',
      '  "status": "success",',
      '  "timestamp": "2026-04-20T09:28:15Z",',
      '  "data": {',
      '    "movers": [',
      '      { "symbol": "NVDA", "price": 892.30, "change_pct": 4.21, "volume": 2100000 },',
      '      { "symbol": "AAPL", "price": 178.45, "change_pct": -1.83, "volume": 1400000 },',
      '      { "symbol": "META", "price": 523.10, "change_pct": 2.94, "volume": 890000 }',
      '    ]',
      '  }',
      '}',
    ],
    startFrame: 0,
  },
  {
    label: 'Earnings Calendar',
    provider: 'Polygon.io',
    status: 200,
    time: '118ms',
    jsonLines: [
      '{',
      '  "status": "success",',
      '  "data": {',
      '    "earnings": [',
      '      { "symbol": "TSLA", "when": "after_hours", "eps_est": 0.62 },',
      '      { "symbol": "GOOGL", "when": "after_hours", "eps_est": 1.89 }',
      '    ]',
      '  }',
      '}',
    ],
    startFrame: 140,
  },
  {
    label: 'Analyst Ratings',
    provider: 'TipRanks',
    status: 200,
    time: '204ms',
    jsonLines: [
      '{',
      '  "status": "success",',
      '  "data": {',
      '    "ratings": [',
      '      { "symbol": "NVDA", "action": "Buy", "firm": "Goldman Sachs", "pt": 950 },',
      '      { "symbol": "AAPL", "action": "Hold", "firm": "Morgan Stanley", "pt": 185 }',
      '    ]',
      '  }',
      '}',
    ],
    startFrame: 290,
  },
];

const syntaxColor = (line: string): Array<{text: string; color: string}> => {
  const tokens: Array<{text: string; color: string}> = [];
  let remaining = line;

  while (remaining.length > 0) {
    // String key
    const keyMatch = remaining.match(/^("[\w_]+")\s*:/);
    if (keyMatch) {
      tokens.push({text: keyMatch[1], color: '#7dd3fc'});
      remaining = remaining.slice(keyMatch[1].length);
      continue;
    }
    // String value
    const strMatch = remaining.match(/^("(?:[^"\\]|\\.)*")/);
    if (strMatch) {
      tokens.push({text: strMatch[1], color: '#86efac'});
      remaining = remaining.slice(strMatch[1].length);
      continue;
    }
    // Number
    const numMatch = remaining.match(/^(-?\d+(?:\.\d+)?)/);
    if (numMatch) {
      tokens.push({text: numMatch[1], color: '#fbbf24'});
      remaining = remaining.slice(numMatch[1].length);
      continue;
    }
    // Single char
    tokens.push({text: remaining[0], color: colors.textMuted});
    remaining = remaining.slice(1);
  }
  return tokens;
};

const JsonOutput: React.FC<{lines: string[]; frame: number; startFrame: number}> = ({lines, frame, startFrame}) => {
  const linesPerFrame = 0.35;
  const visibleLines = Math.min(
    lines.length,
    Math.floor(interpolate(frame, [startFrame, startFrame + lines.length / linesPerFrame], [0, lines.length], {
      extrapolateRight: 'clamp',
    }))
  );

  return (
    <div style={{
      fontFamily: fonts.mono,
      fontSize: 14,
      lineHeight: 1.6,
    }}>
      {lines.slice(0, visibleLines).map((line, i) => {
        const tokens = syntaxColor(line);
        return (
          <div key={i} style={{
            opacity: interpolate(frame, [startFrame + i * 3, startFrame + i * 3 + 6], [0, 1], {
              extrapolateRight: 'clamp',
            }),
          }}>
            <span style={{color: colors.textDim, marginRight: 16, userSelect: 'none'}}>
              {String(i + 1).padStart(2, ' ')}
            </span>
            {tokens.map((t, j) => (
              <span key={j} style={{color: t.color}}>{t.text}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const ExecuteScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  // Which API call panel is active
  const activeCall = apiCalls.findIndex((c, i) => {
    const next = apiCalls[i + 1];
    return frame >= c.startFrame && (!next || frame < next.startFrame);
  });

  const textOpacity = interpolate(frame, [400, 430], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {/* Browser chrome */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        backgroundColor: '#0f172a',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        opacity: headerOpacity,
      }}>
        <div style={{display: 'flex', gap: 8}}>
          <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444'}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b'}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e'}} />
        </div>
        <div style={{
          flex: 1,
          backgroundColor: '#1e293b',
          borderRadius: 6,
          padding: '6px 16px',
          fontSize: 13,
          color: colors.textDim,
          fontFamily: fonts.mono,
        }}>
          qveris.ai/execute · sandboxed
        </div>
        <div style={{
          backgroundColor: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 6,
          padding: '4px 12px',
          fontSize: 12,
          color: colors.green,
          fontFamily: fonts.mono,
        }}>
          ● Sandboxed
        </div>
      </div>

      {/* Main content */}
      <div style={{
        position: 'absolute',
        top: 52,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        opacity: headerOpacity,
      }}>
        {/* Left sidebar - API call list */}
        <div style={{
          width: 300,
          backgroundColor: '#0d1526',
          borderRight: `1px solid ${colors.border}`,
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{
            fontSize: 11,
            color: colors.brand,
            fontFamily: fonts.mono,
            letterSpacing: 3,
            marginBottom: 8,
          }}>
            API CALLS
          </div>
          {apiCalls.map((call, i) => {
            const isVisible = frame >= call.startFrame;
            const isActive = i === activeCall;
            const isDone = frame > (apiCalls[i + 1]?.startFrame ?? Infinity - 1);

            return (
              <div key={call.label} style={{
                backgroundColor: isActive ? '#1a2a45' : 'transparent',
                border: `1px solid ${isActive ? colors.brand : colors.border}`,
                borderRadius: 8,
                padding: '10px 14px',
                opacity: isVisible ? 1 : 0.3,
                transition: 'none',
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
                  <span style={{
                    fontSize: 12,
                    color: isDone ? colors.up : isActive ? colors.warning : colors.textDim,
                    fontFamily: fonts.mono,
                  }}>
                    {isDone ? '✓' : isActive ? '▶' : '○'}
                  </span>
                  <span style={{
                    fontSize: 13,
                    color: isActive ? colors.white : colors.textMuted,
                    fontFamily: fonts.sans,
                    fontWeight: isActive ? 600 : 400,
                  }}>
                    {call.label}
                  </span>
                </div>
                <div style={{display: 'flex', gap: 8, paddingLeft: 20}}>
                  <span style={{
                    fontSize: 11,
                    color: colors.textDim,
                    fontFamily: fonts.mono,
                  }}>
                    {call.provider}
                  </span>
                  {isDone && (
                    <span style={{fontSize: 11, color: colors.up, fontFamily: fonts.mono}}>
                      {call.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          {frame >= 450 && (
            <div style={{
              marginTop: 12,
              padding: '12px 14px',
              backgroundColor: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 8,
              opacity: interpolate(frame, [450, 475], [0, 1], {extrapolateRight: 'clamp'}),
            }}>
              <div style={{fontSize: 12, color: colors.green, fontFamily: fonts.mono}}>
                ✓ All calls complete
              </div>
              <div style={{fontSize: 11, color: colors.textDim, fontFamily: fonts.mono, marginTop: 4}}>
                Total: 505ms · 9 credits
              </div>
            </div>
          )}
        </div>

        {/* Right - JSON output panel */}
        <div style={{
          flex: 1,
          backgroundColor: '#0a1020',
          padding: '24px 32px',
          overflowY: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}>
            <span style={{fontSize: 13, color: colors.brand, fontFamily: fonts.mono, letterSpacing: 2}}>
              OUTPUT
            </span>
            {activeCall >= 0 && (
              <span style={{
                fontSize: 12,
                color: colors.textDim,
                fontFamily: fonts.mono,
                backgroundColor: colors.surface,
                padding: '3px 10px',
                borderRadius: 4,
              }}>
                {apiCalls[activeCall]?.label} · HTTP {apiCalls[activeCall]?.status}
              </span>
            )}
          </div>

          {/* Show JSON for active / most recent call */}
          {apiCalls.map((call, i) => {
            const isVisible = frame >= call.startFrame && (i === activeCall || frame >= (apiCalls[i + 1]?.startFrame ?? Infinity));
            const isLatest = i === Math.max(activeCall, 0);

            return isLatest ? (
              <JsonOutput
                key={call.label}
                lines={call.jsonLines}
                frame={frame}
                startFrame={call.startFrame + 5}
              />
            ) : null;
          })}
        </div>
      </div>

      {/* Bottom tags */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: textOpacity,
      }}>
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          backgroundColor: 'rgba(10,14,26,0.9)',
          border: `1px solid rgba(0,212,255,0.4)`,
          borderRadius: 8,
          padding: '12px 28px',
          fontFamily: fonts.mono,
          fontSize: 20,
          color: colors.brand,
        }}>
          Real market data.
          <span style={{color: colors.borderBright}}>·</span>
          Structured JSON.
          <span style={{color: colors.borderBright}}>·</span>
          Sandboxed execution.
        </div>
      </div>
    </AbsoluteFill>
  );
};
