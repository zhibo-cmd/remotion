import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

const QVerisInterfacePlaceholder: React.FC = () => (
  <div style={{
    width: '100%',
    height: '100%',
    backgroundColor: '#0d1526',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: fonts.mono,
  }}>
    {/* Toolbar */}
    <div style={{
      height: 48,
      backgroundColor: '#111827',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 12,
    }}>
      <span style={{fontSize: 16, fontWeight: 700, color: colors.brand}}>QVeris</span>
      <span style={{fontSize: 12, color: colors.textDim}}>/ capabilities / explore</span>
    </div>
    {/* Search bar */}
    <div style={{padding: '20px 24px 0'}}>
      <div style={{
        backgroundColor: '#1e293b',
        border: `1px solid ${colors.borderBright}`,
        borderRadius: 8,
        padding: '12px 20px',
        fontSize: 15,
        color: colors.textMuted,
      }}>
        pre-market movers, earnings, analyst ratings, social sentiment...
      </div>
    </div>
    {/* Results hint */}
    <div style={{padding: '16px 24px', color: colors.textDim, fontSize: 13}}>
      Loading capabilities...
    </div>
  </div>
);

export const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Host shrinks from full to PiP
  const shrink = spring({frame, fps, config: {damping: 20, stiffness: 100}});

  const hostWidth = interpolate(shrink, [0, 1], [1920, 300]);
  const hostHeight = interpolate(shrink, [0, 1], [1080, 190]);
  const hostX = interpolate(shrink, [0, 1], [0, 1920 - 300 - 24]);
  const hostY = interpolate(shrink, [0, 1], [0, 1080 - 190 - 24]);

  const screenOpacity = interpolate(frame, [15, 45], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {/* Screen recording appears */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: screenOpacity,
      }}>
        <QVerisInterfacePlaceholder />
      </div>

      {/* Host PiP */}
      <div style={{
        position: 'absolute',
        left: hostX,
        top: hostY,
        width: hostWidth,
        height: hostHeight,
        borderRadius: 12,
        overflow: 'hidden',
        border: `2px solid ${colors.borderBright}`,
        backgroundColor: '#0d1526',
      }}>
        {/* Simplified host avatar for PiP */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0d1933 0%, #0a1628 100%)',
        }}>
          <div style={{
            width: 50,
            height: 55,
            borderRadius: '50%',
            backgroundColor: '#1e3a5f',
            border: `2px solid ${colors.brand}`,
          }} />
        </div>
        {/* PiP label */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(10,14,26,0.8)',
          padding: '4px 10px',
          fontSize: 11,
          color: colors.textMuted,
          fontFamily: fonts.mono,
        }}>
          Alex Chen · QVeris AI
        </div>
      </div>
    </AbsoluteFill>
  );
};
