import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { TwitterFeed, type TwitterFeedProps } from "./TwitterFeed";

// Default props used in Remotion Studio preview.
// In production, pass real data via --props or inputProps.
const defaultTwitterProps: TwitterFeedProps = {
  user: {
    id: "377533805642756096",
    name: "Twitter User",
    userName: "user",
    description: "",
    profilePicture: "",
    followersCount: 0,
    followingCount: 0,
    tweetCount: 0,
    isVerified: false,
    isBlueVerified: false,
  },
  tweets: [
    {
      id: "1",
      text: "Loading tweets from twitterapi.io…",
      createdAt: new Date().toISOString(),
      author: {
        id: "377533805642756096",
        name: "Twitter User",
        userName: "user",
        description: "",
        profilePicture: "",
        followersCount: 0,
        followingCount: 0,
        tweetCount: 0,
        isVerified: false,
        isBlueVerified: false,
      },
      likeCount: 0,
      retweetCount: 0,
      replyCount: 0,
      viewCount: 0,
      bookmarkCount: 0,
      isRetweet: false,
      isQuote: false,
      lang: "en",
    },
  ],
};

// 5 tweets × 120 frames each = 600 frames total
const TWEET_DURATION = 120;
const MAX_TWEETS = 5;

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
        id="TwitterFeed"
        component={TwitterFeed}
        durationInFrames={TWEET_DURATION * MAX_TWEETS}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultTwitterProps}
      />
    </>
  );
};
