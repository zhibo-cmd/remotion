import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {colors} from './theme';
import {CTAScene} from './scenes/CTAScene';
import {DiscoverScene} from './scenes/DiscoverScene';
import {ExecuteScene} from './scenes/ExecuteScene';
import {HostScene} from './scenes/HostScene';
import {HookScene} from './scenes/HookScene';
import {InspectScene} from './scenes/InspectScene';
import {OutputScene} from './scenes/OutputScene';
import {TransitionScene} from './scenes/TransitionScene';

const FPS = 30;

// Timecodes from script (in seconds)
const T = {
  hook: {start: 0, end: 3},
  host: {start: 4, end: 15},
  transition: {start: 16, end: 20},
  discover: {start: 21, end: 35},
  inspect: {start: 36, end: 45},
  execute: {start: 46, end: 65},
  output: {start: 66, end: 78},
  cta: {start: 79, end: 84},
};

const f = (s: number) => s * FPS;
const dur = (start: number, end: number) => (end - start) * FPS;

export const QVerisMorningBrief: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <Sequence from={f(T.hook.start)} durationInFrames={dur(T.hook.start, T.hook.end)}>
        <HookScene />
      </Sequence>

      <Sequence from={f(T.host.start)} durationInFrames={dur(T.host.start, T.host.end)}>
        <HostScene />
      </Sequence>

      <Sequence from={f(T.transition.start)} durationInFrames={dur(T.transition.start, T.transition.end)}>
        <TransitionScene />
      </Sequence>

      <Sequence from={f(T.discover.start)} durationInFrames={dur(T.discover.start, T.discover.end)}>
        <DiscoverScene />
      </Sequence>

      <Sequence from={f(T.inspect.start)} durationInFrames={dur(T.inspect.start, T.inspect.end)}>
        <InspectScene />
      </Sequence>

      <Sequence from={f(T.execute.start)} durationInFrames={dur(T.execute.start, T.execute.end)}>
        <ExecuteScene />
      </Sequence>

      <Sequence from={f(T.output.start)} durationInFrames={dur(T.output.start, T.output.end)}>
        <OutputScene />
      </Sequence>

      <Sequence from={f(T.cta.start)} durationInFrames={dur(T.cta.start, T.cta.end)}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MORNING_BRIEF_DURATION = f(T.cta.end);
export const MORNING_BRIEF_FPS = FPS;
