import React from 'react';
import {colors, fonts} from '../theme';

const movers = [
  {symbol: 'NVDA', price: '892.30', change: '+4.21%', vol: '2.1M', up: true},
  {symbol: 'AAPL', price: '178.45', change: '-1.83%', vol: '1.4M', up: false},
  {symbol: 'META', price: '523.10', change: '+2.94%', vol: '890K', up: true},
  {symbol: 'TSLA', price: '248.60', change: '+1.15%', vol: '1.2M', up: true},
];

const earnings = [
  {symbol: 'TSLA', when: 'After Hours', eps: '$0.62', rev: '$25.3B'},
  {symbol: 'GOOGL', when: 'After Hours', eps: '$1.89', rev: '$86.1B'},
];

const ratings = [
  {symbol: 'NVDA', action: 'Buy', firm: 'Goldman Sachs', pt: '$950'},
  {symbol: 'AAPL', action: 'Hold', firm: 'Morgan Stanley', pt: '$185'},
  {symbol: 'META', action: 'Buy', firm: 'JPMorgan', pt: '$600'},
];

const sentiments = [
  {source: 'Reddit', text: '$NVDA bullish on AI chips', signal: '↑↑', positive: true},
  {source: 'Twitter', text: '$AAPL mixed sentiment', signal: '≈', positive: null},
  {source: 'Reddit', text: '$TSLA earnings anticipation', signal: '↑', positive: true},
];

const SectionHeader: React.FC<{title: string}> = ({title}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    marginTop: 20,
  }}>
    <div style={{height: 1, width: 20, backgroundColor: colors.brand, opacity: 0.6}} />
    <span style={{
      fontFamily: fonts.mono,
      fontSize: 13,
      color: colors.brand,
      letterSpacing: 3,
      textTransform: 'uppercase' as const,
    }}>{title}</span>
    <div style={{flex: 1, height: 1, backgroundColor: colors.border}} />
  </div>
);

export const MorningBriefDisplay: React.FC<{scrollY?: number}> = ({scrollY = 0}) => {
  return (
    <div style={{
      width: 900,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      overflow: 'hidden',
      fontFamily: fonts.mono,
      transform: `translateY(${-scrollY}px)`,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)`,
        borderBottom: `1px solid ${colors.borderBright}`,
        padding: '20px 28px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.white,
              letterSpacing: 1,
            }}>
              <span style={{color: colors.brand}}>QVeris AI</span>
              <span style={{color: colors.textDim, margin: '0 8px'}}>·</span>
              Morning Brief
            </div>
            <div style={{fontSize: 13, color: colors.textMuted, marginTop: 4}}>
              Mon Apr 20, 2026 · Pre-Market Report
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{
              fontSize: 11,
              color: colors.green,
              backgroundColor: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 4,
              padding: '4px 10px',
            }}>
              ● LIVE
            </div>
            <div style={{fontSize: 11, color: colors.textDim, marginTop: 6}}>
              1 agent · 5 APIs · 2m 34s
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{padding: '16px 28px 24px'}}>
        {/* Pre-market movers */}
        <SectionHeader title="Pre-Market Movers" />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {movers.map((m) => (
            <div key={m.symbol} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: colors.surfaceAlt,
              borderRadius: 6,
              padding: '8px 14px',
              border: `1px solid ${colors.border}`,
            }}>
              <span style={{width: 60, color: colors.white, fontWeight: 700, fontSize: 14}}>{m.symbol}</span>
              <span style={{width: 90, color: colors.text, fontSize: 14}}>${m.price}</span>
              <span style={{
                width: 80,
                color: m.up ? colors.up : colors.down,
                fontSize: 14,
                fontWeight: 700,
              }}>
                {m.up ? '▲' : '▼'} {m.change}
              </span>
              <span style={{color: colors.textDim, fontSize: 12}}>Vol: {m.vol}</span>
            </div>
          ))}
        </div>

        {/* Earnings */}
        <SectionHeader title="Earnings Today" />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {earnings.map((e) => (
            <div key={e.symbol} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: colors.surfaceAlt,
              borderRadius: 6,
              padding: '8px 14px',
              border: `1px solid ${colors.border}`,
            }}>
              <span style={{width: 60, color: colors.white, fontWeight: 700, fontSize: 14}}>{e.symbol}</span>
              <span style={{width: 120, color: colors.warning, fontSize: 13}}>{e.when}</span>
              <span style={{width: 120, color: colors.textMuted, fontSize: 13}}>EPS Est: {e.eps}</span>
              <span style={{color: colors.textDim, fontSize: 13}}>Rev: {e.rev}</span>
            </div>
          ))}
        </div>

        {/* Analyst Ratings */}
        <SectionHeader title="Analyst Ratings" />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {ratings.map((r) => (
            <div key={r.symbol} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: colors.surfaceAlt,
              borderRadius: 6,
              padding: '8px 14px',
              border: `1px solid ${colors.border}`,
            }}>
              <span style={{width: 60, color: colors.white, fontWeight: 700, fontSize: 14}}>{r.symbol}</span>
              <span style={{
                width: 60,
                color: r.action === 'Buy' ? colors.up : colors.warning,
                fontSize: 13,
                fontWeight: 700,
              }}>{r.action}</span>
              <span style={{width: 160, color: colors.textMuted, fontSize: 13}}>{r.firm}</span>
              <span style={{color: colors.textDim, fontSize: 13}}>PT: {r.pt}</span>
            </div>
          ))}
        </div>

        {/* Social Sentiment */}
        <SectionHeader title="Social Sentiment" />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {sentiments.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: colors.surfaceAlt,
              borderRadius: 6,
              padding: '8px 14px',
              border: `1px solid ${colors.border}`,
            }}>
              <span style={{
                width: 80,
                fontSize: 11,
                color: s.source === 'Reddit' ? '#ff6b35' : '#1da1f2',
                fontWeight: 700,
                letterSpacing: 1,
              }}>{s.source.toUpperCase()}</span>
              <span style={{flex: 1, color: colors.text, fontSize: 13}}>{s.text}</span>
              <span style={{
                fontSize: 16,
                color: s.positive === true ? colors.up : s.positive === false ? colors.down : colors.warning,
              }}>{s.signal}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{fontSize: 12, color: colors.textDim}}>
            Generated at 09:28:15 UTC · Next run: 05:00 AM
          </span>
          <span style={{fontSize: 12, color: colors.brand}}>qveris.ai</span>
        </div>
      </div>
    </div>
  );
};
