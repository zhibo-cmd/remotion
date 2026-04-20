import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

const QUERY = 'pre-market movers, earnings, analyst ratings, social sentiment';

const capabilities = [
  {name: 'Pre-Market Movers API', provider: 'Alpaca Markets', rate: '99.8%', latency: '~180ms', credits: '3c', tag: 'movers'},
  {name: 'Earnings Calendar API', provider: 'Polygon.io', rate: '99.4%', latency: '~120ms', credits: '2c', tag: 'earnings'},
  {name: 'Analyst Ratings API', provider: 'TipRanks', rate: '98.9%', latency: '~200ms', credits: '4c', tag: 'ratings'},
  {name: 'Reddit Sentiment API', provider: 'PRAW / Reddit', rate: '97.2%', latency: '~350ms', credits: '2c', tag: 'sentiment'},
  {name: 'Twitter Sentiment API', provider: 'X / Twitter API', rate: '96.8%', latency: '~280ms', credits: '3c', tag: 'sentiment'},
];

const tagColors: Record<string, string> = {
  movers: '#7c3aed',
  earnings: '#f59e0b',
  ratings: '#0ea5e9',
  sentiment: '#10b981',
};

export const DiscoverScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Typing animation for query
  const typingDuration = 60;
  const charsVisible = Math.floor(interpolate(frame, [0, typingDuration], [0, QUERY.length], {
    extrapolateRight: 'clamp',
  }));
  const displayedQuery = QUERY.slice(0, charsVisible);
  const showCursor = frame < typingDuration + 10;

  // Results appear after typing
  const resultsStartFrame = typingDuration + 20;
  const visibleResults = Math.floor(
    interpolate(frame, [resultsStartFrame, resultsStartFrame + capabilities.length * 18], [0, capabilities.length], {
      extrapolateRight: 'clamp',
    })
  );

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  // On-screen text
  const textOpacity = interpolate(frame, [resultsStartFrame + 80, resultsStartFrame + 100], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const slideIn = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const panelX = interpolate(slideIn, [0, 1], [-40, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {/* Screen recording chrome */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        opacity: headerOpacity,
        transform: `translateX(${panelX}px)`,
      }}>
        {/* Browser/app bar */}
        <div style={{
          height: 52,
          backgroundColor: '#0f172a',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          flexShrink: 0,
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
            qveris.ai/capabilities/explore
          </div>
        </div>

        {/* App header */}
        <div style={{
          backgroundColor: '#111827',
          borderBottom: `1px solid ${colors.border}`,
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexShrink: 0,
        }}>
          <span style={{fontSize: 20, fontWeight: 700, color: colors.brand, fontFamily: fonts.mono}}>
            QVeris
          </span>
          <span style={{color: colors.borderBright}}>|</span>
          <span style={{fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans}}>
            Discover Capabilities
          </span>
        </div>

        {/* Main content */}
        <div style={{flex: 1, padding: '32px 48px', overflowY: 'hidden'}}>
          {/* Search bar with typing */}
          <div style={{
            backgroundColor: '#1a2035',
            border: `2px solid ${colors.brand}`,
            borderRadius: 10,
            padding: '16px 24px',
            marginBottom: 28,
            fontFamily: fonts.mono,
            fontSize: 18,
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{color: colors.brand, fontSize: 20}}>⌖</span>
            <span>{displayedQuery}</span>
            {showCursor && (
              <span style={{
                display: 'inline-block',
                width: 2,
                height: 22,
                backgroundColor: colors.brand,
                opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
              }} />
            )}
          </div>

          {/* Results header */}
          {visibleResults > 0 && (
            <div style={{
              marginBottom: 16,
              fontFamily: fonts.mono,
              fontSize: 13,
              color: colors.textDim,
              opacity: interpolate(frame, [resultsStartFrame, resultsStartFrame + 15], [0, 1], {extrapolateRight: 'clamp'}),
            }}>
              {visibleResults} of {capabilities.length} capabilities found · natural language · no docs needed
            </div>
          )}

          {/* Results list */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {capabilities.slice(0, visibleResults).map((cap, i) => {
              const itemFrame = frame - (resultsStartFrame + i * 18);
              const itemOpacity = interpolate(itemFrame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
              const itemX = interpolate(itemFrame, [0, 15], [-20, 0], {extrapolateRight: 'clamp'});

              return (
                <div key={cap.name} style={{
                  backgroundColor: '#131c30',
                  border: `1px solid ${colors.border}`,
                  borderLeft: `3px solid ${tagColors[cap.tag] || colors.brand}`,
                  borderRadius: 8,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}>
                  {/* Index */}
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: colors.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    color: colors.textDim,
                    fontFamily: fonts.mono,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>

                  {/* Name + Provider */}
                  <div style={{flex: 1}}>
                    <div style={{
                      fontSize: 16,
                      color: colors.text,
                      fontFamily: fonts.sans,
                      fontWeight: 600,
                    }}>{cap.name}</div>
                    <div style={{
                      fontSize: 13,
                      color: colors.textDim,
                      fontFamily: fonts.mono,
                      marginTop: 3,
                    }}>{cap.provider}</div>
                  </div>

                  {/* Stats */}
                  <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: 15, color: colors.up, fontFamily: fonts.mono, fontWeight: 700}}>
                        {cap.rate}
                      </div>
                      <div style={{fontSize: 11, color: colors.textDim}}>success</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: 15, color: colors.brand, fontFamily: fonts.mono}}>
                        {cap.latency}
                      </div>
                      <div style={{fontSize: 11, color: colors.textDim}}>latency</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: 15, color: colors.warning, fontFamily: fonts.mono}}>
                        {cap.credits}
                      </div>
                      <div style={{fontSize: 11, color: colors.textDim}}>per call</div>
                    </div>
                  </div>

                  {/* Check */}
                  <span style={{fontSize: 20, color: colors.up}}>✓</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* On-screen text */}
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
          backgroundColor: 'rgba(10,14,26,0.9)',
          border: `1px solid rgba(0,212,255,0.4)`,
          borderRadius: 8,
          padding: '12px 32px',
          fontFamily: fonts.mono,
          fontSize: 22,
          color: colors.brand,
        }}>
          5 capabilities found — natural language, no docs needed
        </div>
      </div>
    </AbsoluteFill>
  );
};
