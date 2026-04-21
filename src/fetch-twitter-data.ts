/**
 * Run with: npx ts-node src/fetch-twitter-data.ts > twitter-data.json
 * Then render with: remotion render TwitterFeed --props twitter-data.json
 */
import { getUserInfo, getUserTweets } from "./lib/twitterapi";

async function main() {
  const [user, { tweets }] = await Promise.all([
    getUserInfo(),
    getUserTweets(undefined, 5),
  ]);

  const props = { user, tweets };
  process.stdout.write(JSON.stringify(props, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
