import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const fadeIn = spring({frame, fps, config: {damping: 18, stiffness: 100}});
  const opacity = interpolate(fadeIn, [0, 1], [0, 1]);
  const scale = interpolate(fadeIn, [0, 1], [0.95, 1]);

  const urlOpacity = interpolate(frame, [30, 55], [0, 1], {extrapolateRight: 'clamp'});
  const urlY = interpolate(frame, [30, 55], [24, 0], {extrapolateRight: 'clamp'});

  const badge1Opacity = interpolate(frame, [40, 65], [0, 1], {extrapolateRight: 'clamp'});
  const badge2Opacity = interpolate(frame, [55, 80], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{
      backgroundColor: colors.bg,
      overflow: 'hidden',
    }}>
      {/* Gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(0,212,255,0.07) 0%, rgba(124,58,237,0.05) 50%, transparent 70%)',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Main content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        opacity,
        transform: `scale(${scale})`,
      }}>
        {/* Logo / Brand */}
        <div style={{textAlign: 'center'}}>
          <div style={{
            fontSize: 52,
            fontWeight: 800,
            color: colors.white,
            fontFamily: fonts.sans,
            letterSpacing: -1,
          }}>
            <span style={{color: colors.brand}}>QVeris</span>
            <span style={{color: colors.textDim, fontWeight: 300}}> AI</span>
          </div>
          <div style={{
            fontSize: 18,
            color: colors.textMuted,
            fontFamily: fonts.sans,
            marginTop: 8,
            letterSpacing: 1,
          }}>
            Your Agent Just Replaced a 3-Person Research Team
          </div>
        </div>

        {/* URL overlay */}
        <div style={{
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 32,
            fontFamily: fonts.mono,
            color: colors.brand,
            fontWeight: 700,
            letterSpacing: 1,
          }}>
            qveris.ai/capabilities/explore
          </div>
          <div style={{
            fontSize: 16,
            color: colors.textDim,
            fontFamily: fonts.mono,
            marginTop: 6,
          }}>
            Get started today
          </div>
        </div>

        {/* Badges */}
        <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center'}}>
          <div style={{
            opacity: badge1Opacity,
            backgroundColor: colors.brandDim,
            border: `1px solid ${colors.brandBorder}`,
            borderRadius: 10,
            padding: '14px 28px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              color: colors.brand,
              fontFamily: fonts.mono,
            }}>
              1,000
            </div>
            <div style={{fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans, marginTop: 4}}>
              free credits on signup
            </div>
          </div>

          <div style={{
            opacity: badge2Opacity,
            backgroundColor: colors.purpleDim,
            border: `1px solid rgba(124,58,237,0.35)`,
            borderRadius: 10,
            padding: '14px 28px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#a78bfa',
              fontFamily: fonts.sans,
            }}>
              Discover + Inspect
            </div>
            <div style={{fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans, marginTop: 4}}>
              always free
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
