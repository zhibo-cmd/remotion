import React from 'react';
import {Player} from '@remotion/player';
import {QVerisMorningBrief, MORNING_BRIEF_DURATION, MORNING_BRIEF_FPS} from '../QVerisMorningBrief';

export const App: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0e1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: 32,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 13,
          letterSpacing: 4,
          color: '#64748b',
          textTransform: 'uppercase',
          marginBottom: 10,
          fontFamily: 'monospace',
        }}>
          QVeris AI · Demo
        </div>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: 8,
        }}>
          Your Agent Just Replaced a{' '}
          <span style={{color: '#00d4ff'}}>3-Person Research Team</span>
        </h1>
        <p style={{fontSize: 15, color: '#64748b'}}>
          Script 4 · Morning Brief — Daily Research Automation · 84s
        </p>
      </div>

      {/* Player */}
      <div style={{
        width: '100%',
        maxWidth: 1100,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #1e293b',
        boxShadow: '0 0 60px rgba(0,212,255,0.08)',
      }}>
        <Player
          component={QVerisMorningBrief}
          durationInFrames={MORNING_BRIEF_DURATION}
          fps={MORNING_BRIEF_FPS}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{width: '100%'}}
          controls
          autoPlay
          loop
          clickToPlay
        />
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 24,
        fontSize: 13,
        color: '#334155',
        fontFamily: 'monospace',
      }}>
        Built with Remotion · Deployed on Vercel
      </div>
    </div>
  );
};
