import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {MorningBriefDisplay} from '../components/MorningBriefDisplay';
import {colors, fonts} from '../theme';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const blur = interpolate(frame, [0, 45], [12, 0], {extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(frame, [0, 45], [1.04, 1], {extrapolateRight: 'clamp'});
  const textOpacity = interpolate(frame, [40, 60], [0, 1], {extrapolateRight: 'clamp'});
  const textY = interpolate(frame, [40, 60], [24, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg, overflow: 'hidden'}}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}>
        <MorningBriefDisplay />
      </div>

      {/* On-screen text */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{
          backgroundColor: 'rgba(10,14,26,0.9)',
          border: `1px solid rgba(0,212,255,0.4)`,
          borderRadius: 8,
          padding: '14px 40px',
          fontFamily: fonts.mono,
          fontSize: 26,
          color: colors.brand,
          letterSpacing: 2,
        }}>
          5 APIs. One morning brief. Fully automated.
        </div>
      </div>
    </AbsoluteFill>
  );
};
