import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import type { Tweet, TwitterUser } from "./lib/twitterapi";

export interface TwitterFeedProps {
  user: TwitterUser;
  tweets: Tweet[];
}

const TWEET_DURATION = 120; // frames per tweet
const FADE_FRAMES = 15;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TweetCard: React.FC<{
  tweet: Tweet;
  localFrame: number;
  totalFrames: number;
}> = ({ tweet, localFrame, totalFrames }) => {
  const opacity = interpolate(
    localFrame,
    [0, FADE_FRAMES, totalFrames - FADE_FRAMES, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(localFrame, [0, FADE_FRAMES], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "white",
        borderRadius: 20,
        padding: "48px 56px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        maxWidth: 900,
        width: "100%",
      }}
    >
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#1d9bf0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "white",
            fontWeight: "bold",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {tweet.author?.profilePicture ? (
            <img
              src={tweet.author.profilePicture}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            (tweet.author?.name ?? "?")[0].toUpperCase()
          )}
        </div>
        <div style={{ marginLeft: 20 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 28,
              color: "#0f1419",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {tweet.author?.name ?? "Unknown"}
            {tweet.author?.isBlueVerified && (
              <span style={{ color: "#1d9bf0", fontSize: 24 }}>✓</span>
            )}
          </div>
          <div style={{ color: "#536471", fontSize: 22 }}>
            @{tweet.author?.userName ?? ""} · {formatDate(tweet.createdAt)}
          </div>
        </div>
      </div>

      {/* Tweet text */}
      <div
        style={{
          fontSize: 32,
          lineHeight: 1.5,
          color: "#0f1419",
          marginBottom: 32,
          wordBreak: "break-word",
        }}
      >
        {tweet.text}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 48,
          color: "#536471",
          fontSize: 24,
          borderTop: "1px solid #eff3f4",
          paddingTop: 24,
        }}
      >
        <span>💬 {formatNumber(tweet.replyCount ?? 0)}</span>
        <span>🔁 {formatNumber(tweet.retweetCount ?? 0)}</span>
        <span>❤️ {formatNumber(tweet.likeCount ?? 0)}</span>
        <span>👁 {formatNumber(tweet.viewCount ?? 0)}</span>
      </div>
    </div>
  );
};

const ProfileHeader: React.FC<{ user: TwitterUser; frame: number }> = ({
  user,
  frame,
}) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        textAlign: "center",
        marginBottom: 60,
        color: "white",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          fontWeight: "bold",
          overflow: "hidden",
          border: "4px solid rgba(255,255,255,0.6)",
        }}
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          (user.name ?? "?")[0].toUpperCase()
        )}
      </div>
      <div style={{ fontSize: 42, fontWeight: 700 }}>{user.name}</div>
      <div style={{ fontSize: 28, opacity: 0.8, marginTop: 6 }}>
        @{user.userName}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 48,
          marginTop: 20,
          fontSize: 24,
        }}
      >
        <span>
          <strong>{formatNumber(user.followersCount ?? 0)}</strong> Followers
        </span>
        <span>
          <strong>{formatNumber(user.followingCount ?? 0)}</strong> Following
        </span>
        <span>
          <strong>{formatNumber(user.tweetCount ?? 0)}</strong> Tweets
        </span>
      </div>
    </div>
  );
};

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ user, tweets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visibleTweets = tweets.slice(0, 5);
  const tweetIndex = Math.floor(frame / TWEET_DURATION);
  const localFrame = frame % TWEET_DURATION;
  const currentTweet = visibleTweets[tweetIndex];

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1d9bf0 0%, #0d47a1 100%)",
        opacity: bgOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "60px 80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* X/Twitter logo */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          fontSize: 40,
          fontWeight: 900,
          color: "white",
          opacity: 0.6,
        }}
      >
        𝕏
      </div>

      <ProfileHeader user={user} frame={frame} />

      {currentTweet && (
        <TweetCard
          key={tweetIndex}
          tweet={currentTweet}
          localFrame={localFrame}
          totalFrames={TWEET_DURATION}
        />
      )}

      {/* Progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          gap: 12,
        }}
      >
        {visibleTweets.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === tweetIndex ? 32 : 12,
              height: 12,
              borderRadius: 6,
              background: "white",
              opacity: i === tweetIndex ? 1 : 0.4,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
