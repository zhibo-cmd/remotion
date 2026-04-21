const BASE_URL = "https://api.twitterapi.io";
const API_KEY = "new1_4fa7e5999b994c5cbbfca5287d8d57ce";
const USER_ID = "377533805642756096";

export interface TwitterUser {
  id: string;
  name: string;
  userName: string;
  description: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  isVerified: boolean;
  isBlueVerified: boolean;
}

export interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  author: TwitterUser;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  viewCount: number;
  bookmarkCount: number;
  isRetweet: boolean;
  isQuote: boolean;
  lang: string;
}

export interface TweetsResponse {
  tweets: Tweet[];
  has_next_page: boolean;
  next_cursor: string;
}

export interface UserInfoResponse {
  user: TwitterUser;
}

async function apiFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "X-API-Key": API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`twitterapi.io error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export async function getUserInfo(userId = USER_ID): Promise<TwitterUser> {
  const data = await apiFetch<{ data?: UserInfoResponse; user?: TwitterUser }>(
    "/twitter/user/info",
    { userId }
  );
  // Handle both response shapes
  return (data as any).data?.user ?? (data as any).user ?? (data as any);
}

export async function getUserTweets(
  userId = USER_ID,
  count = 20,
  cursor?: string
): Promise<TweetsResponse> {
  const params: Record<string, string> = { userId, count: String(count) };
  if (cursor) params.cursor = cursor;

  const data = await apiFetch<any>("/twitter/user/tweets", params);
  return {
    tweets: data.data?.tweets ?? data.tweets ?? [],
    has_next_page: data.has_next_page ?? data.data?.has_next_page ?? false,
    next_cursor: data.next_cursor ?? data.data?.next_cursor ?? "",
  };
}

export async function searchTweets(
  query: string,
  queryType: "Top" | "Latest" = "Top",
  count = 20,
  cursor?: string
): Promise<TweetsResponse> {
  const params: Record<string, string> = {
    query,
    queryType,
    count: String(count),
  };
  if (cursor) params.cursor = cursor;

  const data = await apiFetch<any>("/twitter/tweet/advanced_search", params);
  return {
    tweets: data.data?.tweets ?? data.tweets ?? [],
    has_next_page: data.has_next_page ?? data.data?.has_next_page ?? false,
    next_cursor: data.next_cursor ?? data.data?.next_cursor ?? "",
  };
}

export { USER_ID, API_KEY };
