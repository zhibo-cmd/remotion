import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

const lines = [
  'This used to take a 3-person',
  'research team —',
  'pull pre-market movers,',
  'check earnings,',
  'scan sentiment,',
  'compile it all.',
  '',
  'I built it with',
  'one QVeris agent.',
  'Here\'s how.',
];

export const HostScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slideIn = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  // Pulse animation for live indicator
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.4, 1],
  );

  // Talking animation - subtle mouth movement
  const talkPhase = Math.sin((frame / fps) * Math.PI * 5);
  const mouthOpen = Math.max(0, talkPhase) * 6;

  // Which lines are visible based on frame
  const lineDelay = 22;
  const visibleLineCount = Math.floor(frame / lineDelay) + 1;

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg, overflow: 'hidden'}}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.04) 0%, transparent 60%)',
      }} />

      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 80,
        opacity,
        transform: `translateX(${interpolate(slideIn, [0, 1], [60, 0])}px)`,
      }}>
        {/* Host avatar / camera feed */}
        <div style={{
          width: 380,
          height: 460,
          borderRadius: 16,
          border: `2px solid ${colors.borderBright}`,
          backgroundColor: '#0d1526',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Camera overlay top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            backgroundColor: 'rgba(10,14,26,0.8)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 8,
            zIndex: 10,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: colors.up,
              opacity: pulse,
            }} />
            <span style={{fontSize: 12, color: colors.textMuted, fontFamily: fonts.mono}}>
              CAM · LIVE
            </span>
          </div>

          {/* Avatar body */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #0d1933 0%, #0a1628 100%)',
          }}>
            {/* Head */}
            <div style={{
              width: 100,
              height: 110,
              borderRadius: '50%',
              backgroundColor: '#1e3a5f',
              border: `3px solid ${colors.brand}`,
              position: 'relative',
              marginBottom: -20,
              zIndex: 2,
            }}>
              {/* Eyes */}
              <div style={{
                position: 'absolute',
                top: '38%',
                left: '20%',
                right: '20%',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <div style={{width: 14, height: 14, borderRadius: '50%', backgroundColor: colors.brand}} />
                <div style={{width: 14, height: 14, borderRadius: '50%', backgroundColor: colors.brand}} />
              </div>
              {/* Mouth */}
              <div style={{
                position: 'absolute',
                bottom: '22%',
                left: '30%',
                right: '30%',
                height: mouthOpen + 2,
                borderRadius: 4,
                backgroundColor: colors.brand,
                opacity: 0.8,
              }} />
            </div>

            {/* Shoulders */}
            <div style={{
              width: 200,
              height: 120,
              background: 'linear-gradient(180deg, #1e3a5f 0%, #152d4a 100%)',
              borderRadius: '50% 50% 0 0',
              zIndex: 1,
            }} />
          </div>

          {/* Name tag */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            backgroundColor: 'rgba(10,14,26,0.85)',
            border: `1px solid ${colors.borderBright}`,
            borderRadius: 6,
            padding: '8px 12px',
          }}>
            <div style={{fontSize: 14, color: colors.white, fontFamily: fonts.sans, fontWeight: 600}}>
              Alex Chen
            </div>
            <div style={{fontSize: 11, color: colors.brand, fontFamily: fonts.mono}}>
              QVeris AI · Product Demo
            </div>
          </div>
        </div>

        {/* Script / narration text */}
        <div style={{
          width: 560,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {lines.map((line, i) => {
            const lineOpacity = interpolate(
              frame,
              [i * lineDelay, i * lineDelay + 15],
              [0, 1],
              {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'},
            );
            const lineY = interpolate(
              frame,
              [i * lineDelay, i * lineDelay + 15],
              [16, 0],
              {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'},
            );

            if (line === '') return <div key={i} style={{height: 6}} />;

            return (
              <div key={i} style={{
                opacity: lineOpacity,
                transform: `translateY(${lineY}px)`,
                fontFamily: fonts.sans,
                fontSize: 26,
                color: i >= 7 ? colors.brand : colors.text,
                fontWeight: i >= 7 ? 700 : 400,
                lineHeight: 1.4,
              }}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
