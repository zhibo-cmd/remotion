import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';

interface OnscreenTextProps {
  text: string;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const OnscreenText: React.FC<OnscreenTextProps> = ({text, startFrame = 0, style}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {extrapolateRight: 'clamp'});
  const translateY = interpolate(frame, [startFrame, startFrame + 20], [20, 0], {extrapolateRight: 'clamp'});

  return (
    <div style={{
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      opacity,
      transform: `translateY(${translateY}px)`,
      ...style,
    }}>
      <div style={{
        backgroundColor: 'rgba(10,14,26,0.85)',
        border: `1px solid ${colors.brandBorder}`,
        borderRadius: 8,
        padding: '14px 36px',
        fontFamily: fonts.mono,
        fontSize: 24,
        color: colors.brand,
        letterSpacing: 1,
        textAlign: 'center',
        maxWidth: '80%',
      }}>
        {text}
      </div>
    </div>
  );
};
