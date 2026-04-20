import React from 'react';
import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {QVerisMorningBrief, MORNING_BRIEF_DURATION, MORNING_BRIEF_FPS} from './QVerisMorningBrief';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="QVerisMorningBrief"
        component={QVerisMorningBrief}
        durationInFrames={MORNING_BRIEF_DURATION}
        fps={MORNING_BRIEF_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
