import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

const vendors = [
  {name: 'Alpaca Markets', rate: 99.8, latency: 180, credits: 3, best: true},
  {name: 'Yahoo Finance', rate: 96.2, latency: 450, credits: 0, best: false},
  {name: 'Polygon.io', rate: 99.4, latency: 210, credits: 2, best: false},
];

const StatBar: React.FC<{value: number; max: number; color: string; frame: number; startFrame: number}> = ({
  value, max, color, frame, startFrame,
}) => {
  const progress = interpolate(frame, [startFrame, startFrame + 40], [0, value / max], {
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      flex: 1,
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: 4,
        transition: 'none',
      }} />
    </div>
  );
};

export const InspectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slideIn = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const panelOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const panelX = interpolate(slideIn, [0, 1], [60, 0]);

  // Animated counters
  const successRate = interpolate(frame, [20, 60], [0, 99.8], {extrapolateRight: 'clamp'});
  const latency = Math.floor(interpolate(frame, [20, 60], [0, 180], {extrapolateRight: 'clamp'}));
  const credits = Math.floor(interpolate(frame, [20, 55], [0, 3], {extrapolateRight: 'clamp'}));

  // Vendor comparison appears later
  const vendorOpacity = interpolate(frame, [100, 120], [0, 1], {extrapolateRight: 'clamp'});

  // On-screen text
  const textOpacity = interpolate(frame, [140, 160], [0, 1], {extrapolateRight: 'clamp'});

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
          qveris.ai/capabilities/pre-market-movers/inspect
        </div>
      </div>

      {/* Main content */}
      <div style={{
        position: 'absolute',
        top: 52,
        inset: 0,
        display: 'flex',
        gap: 0,
        opacity: panelOpacity,
        transform: `translateX(${panelX}px)`,
      }}>
        {/* Left panel - capability details */}
        <div style={{
          width: 640,
          backgroundColor: '#111827',
          borderRight: `1px solid ${colors.border}`,
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {/* Header */}
          <div>
            <div style={{
              fontSize: 11,
              color: colors.brand,
              fontFamily: fonts.mono,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Capability Inspect
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.white,
              fontFamily: fonts.sans,
            }}>
              Pre-Market Movers API
            </div>
            <div style={{
              fontSize: 14,
              color: colors.textMuted,
              fontFamily: fonts.mono,
              marginTop: 6,
            }}>
              Alpaca Markets · v2.1 · REST
            </div>
          </div>

          {/* Quality signals */}
          <div style={{
            backgroundColor: colors.surfaceAlt,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            <div style={{fontSize: 13, color: colors.brand, fontFamily: fonts.mono, letterSpacing: 2}}>
              QUALITY SIGNALS
            </div>

            {/* Success Rate */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span style={{fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans}}>Success Rate</span>
                <span style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.up,
                  fontFamily: fonts.mono,
                }}>
                  {successRate.toFixed(1)}%
                </span>
              </div>
              <StatBar value={successRate} max={100} color={colors.up} frame={frame} startFrame={20} />
              <div style={{fontSize: 11, color: colors.textDim, marginTop: 4, textAlign: 'right'}}>
                Excellent
              </div>
            </div>

            {/* Latency */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span style={{fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans}}>P95 Latency</span>
                <span style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.brand,
                  fontFamily: fonts.mono,
                }}>
                  ~{latency}ms
                </span>
              </div>
              <StatBar value={1000 - latency} max={1000} color={colors.brand} frame={frame} startFrame={25} />
              <div style={{fontSize: 11, color: colors.textDim, marginTop: 4, textAlign: 'right'}}>
                Fast
              </div>
            </div>

            {/* Cost */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span style={{fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans}}>Cost per Call</span>
                <span style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.warning,
                  fontFamily: fonts.mono,
                }}>
                  {credits} credits
                </span>
              </div>
              <StatBar value={credits} max={10} color={colors.warning} frame={frame} startFrame={30} />
              <div style={{fontSize: 11, color: colors.textDim, marginTop: 4, textAlign: 'right'}}>
                Low cost
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{display: 'flex', gap: 12}}>
            <div style={{
              backgroundColor: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 13,
              color: colors.green,
              fontFamily: fonts.mono,
            }}>
              ● Active
            </div>
            <div style={{
              backgroundColor: colors.brandDim,
              border: `1px solid ${colors.brandBorder}`,
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 13,
              color: colors.brand,
              fontFamily: fonts.mono,
            }}>
              Auto-selected
            </div>
          </div>
        </div>

        {/* Right panel - vendor comparison */}
        <div style={{
          flex: 1,
          padding: '32px 36px',
          backgroundColor: colors.bg,
          opacity: vendorOpacity,
        }}>
          <div style={{
            fontSize: 13,
            color: colors.brand,
            fontFamily: fonts.mono,
            letterSpacing: 2,
            marginBottom: 20,
          }}>
            VENDOR COMPARISON
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {vendors.map((v) => (
              <div key={v.name} style={{
                backgroundColor: v.best ? '#131c30' : colors.surface,
                border: `1px solid ${v.best ? colors.brand : colors.border}`,
                borderRadius: 10,
                padding: '16px 20px',
                position: 'relative',
              }}>
                {v.best && (
                  <div style={{
                    position: 'absolute',
                    top: -1,
                    right: 16,
                    backgroundColor: colors.brand,
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '0 0 6px 6px',
                    fontFamily: fonts.mono,
                    letterSpacing: 1,
                  }}>
                    BEST MATCH
                  </div>
                )}
                <div style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: v.best ? colors.white : colors.textMuted,
                  fontFamily: fonts.sans,
                  marginBottom: 12,
                }}>
                  {v.name}
                </div>
                <div style={{display: 'flex', gap: 28}}>
                  <div>
                    <div style={{
                      fontSize: 18,
                      color: colors.up,
                      fontFamily: fonts.mono,
                      fontWeight: 700,
                    }}>{v.rate}%</div>
                    <div style={{fontSize: 11, color: colors.textDim}}>success</div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: 18,
                      color: colors.brand,
                      fontFamily: fonts.mono,
                    }}>{v.latency}ms</div>
                    <div style={{fontSize: 11, color: colors.textDim}}>latency</div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: 18,
                      color: colors.warning,
                      fontFamily: fonts.mono,
                    }}>{v.credits}c</div>
                    <div style={{fontSize: 11, color: colors.textDim}}>credits</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 20,
            padding: '14px 20px',
            backgroundColor: colors.brandDim,
            border: `1px solid ${colors.brandBorder}`,
            borderRadius: 8,
            fontSize: 14,
            color: colors.brand,
            fontFamily: fonts.sans,
          }}>
            Agent auto-selects the best vendor — you just describe what you need.
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
          99.8% success rate · ~180ms · 3 credits
        </div>
      </div>
    </AbsoluteFill>
  );
};
