import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b84f3",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 80,
          color: "white",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          opacity,
        }}
      >
        Hello World!
      </div>
    </AbsoluteFill>
  );
};
