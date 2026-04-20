import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {MorningBriefDisplay} from '../components/MorningBriefDisplay';
import {colors, fonts} from '../theme';

export const OutputScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 25], [0, 1], {extrapolateRight: 'clamp'});

  // Slow scroll through the morning brief
  const scrollY = interpolate(frame, [30, 280], [0, 320], {extrapolateRight: 'clamp'});

  // Section highlights pulse
  const highlightOpacity = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1],
    [0.3, 0.7],
  );

  const textOpacity = interpolate(frame, [240, 270], [0, 1], {extrapolateRight: 'clamp'});
  const textY = interpolate(frame, [240, 270], [20, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg, overflow: 'hidden'}}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(0,212,255,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Full-screen morning brief with scroll */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
        opacity,
        overflow: 'hidden',
      }}>
        {/* Section highlight overlay - simulates "section highlights" from script */}
        <div style={{
          position: 'relative',
          zIndex: 1,
        }}>
          <MorningBriefDisplay scrollY={scrollY} />

          {/* Moving highlight bar */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 50,
            top: interpolate(frame, [40, 280], [80, 480], {extrapolateRight: 'clamp'}) - scrollY,
            backgroundColor: `rgba(0,212,255,${highlightOpacity * 0.06})`,
            borderLeft: `3px solid rgba(0,212,255,${highlightOpacity * 0.5})`,
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* "Final deliverable" label */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.35)',
          borderRadius: 6,
          padding: '6px 20px',
          fontFamily: fonts.mono,
          fontSize: 13,
          color: colors.green,
          letterSpacing: 2,
        }}>
          ● FINAL DELIVERABLE · Morning Brief Complete
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
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{
          backgroundColor: 'rgba(10,14,26,0.92)',
          border: `1px solid rgba(0,212,255,0.4)`,
          borderRadius: 8,
          padding: '14px 36px',
          fontFamily: fonts.sans,
          fontSize: 22,
          color: colors.white,
          textAlign: 'center',
          maxWidth: '75%',
        }}>
          What used to take a 3-person team —
          <span style={{color: colors.brand, fontWeight: 700}}>
            {' '}now runs every morning on autopilot
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
