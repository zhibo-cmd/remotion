/**
 * Scrape Twitter Threads about 金融 Agent / Financial Agent
 * Output: finance-agent-threads.csv (top 30, sorted by engagement, last 2 months)
 *
 * Run: node scripts/scrape-finance-threads.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://api.twitterapi.io";
const API_KEY = "new1_4fa7e5999b994c5cbbfca5287d8d57ce";

// ── date range: last 2 months ────────────────────────────────────────────────
const now = new Date();
const since = new Date(now);
since.setMonth(since.getMonth() - 2);
const sinceStr = since.toISOString().slice(0, 10); // YYYY-MM-DD

console.log(`📅 Fetching threads from ${sinceStr} to ${now.toISOString().slice(0, 10)}`);

// ── search queries ───────────────────────────────────────────────────────────
const QUERIES = [
  `金融 agent 🧵 since:${sinceStr}`,
  `金融 AI agent since:${sinceStr}`,
  `金融agent thread since:${sinceStr}`,
  `"financial agent" thread since:${sinceStr}`,
  `"finance agent" 🧵 since:${sinceStr}`,
  `AI agent 金融市场 since:${sinceStr}`,
  `"AI agent" 投资 thread since:${sinceStr}`,
  `金融大模型 agent since:${sinceStr}`,
  `trading agent AI 🧵 since:${sinceStr}`,
  `fintech agent thread since:${sinceStr}`,
];

// thread indicators in tweet text
const THREAD_PATTERNS = [
  /🧵/,
  /\b1\/\d+\b/,        // 1/10
  /\b1\s*\/\s*\d+/,
  /（1[\/／]\d+）/,
  /\[1\/\d+\]/,
  /^1\.|^\(1\)/m,
  /thread\s*👇/i,
  /thread\s*below/i,
  /a\s+thread/i,
  /long\s+thread/i,
  /小线程/,
  /连载/,
  /系列推/,
];

function isThread(text) {
  return THREAD_PATTERNS.some((p) => p.test(text));
}

// engagement score (weighted)
function engagementScore(t) {
  const views = t.viewCount ?? 0;
  const likes = t.likeCount ?? 0;
  const retweets = t.retweetCount ?? 0;
  const replies = t.replyCount ?? 0;
  return views * 1 + likes * 5 + retweets * 10 + replies * 3;
}

async function apiFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { "X-API-Key": API_KEY },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
  return res.json();
}

async function searchPage(query, queryType = "Top", cursor) {
  const params = { query, queryType, count: "20" };
  if (cursor) params.cursor = cursor;
  const data = await apiFetch("/twitter/tweet/advanced_search", params);
  return {
    tweets: data.data?.tweets ?? data.tweets ?? [],
    has_next_page: data.has_next_page ?? data.data?.has_next_page ?? false,
    next_cursor: data.next_cursor ?? data.data?.next_cursor ?? "",
  };
}

// fetch up to maxPages pages for a query
async function fetchQuery(query, maxPages = 3) {
  const results = [];
  let cursor;
  for (let page = 0; page < maxPages; page++) {
    try {
      const { tweets, has_next_page, next_cursor } = await searchPage(
        query,
        "Top",
        cursor
      );
      results.push(...tweets);
      console.log(`  → query[${page + 1}] got ${tweets.length} tweets`);
      if (!has_next_page || !next_cursor) break;
      cursor = next_cursor;
      await new Promise((r) => setTimeout(r, 800)); // polite delay
    } catch (err) {
      console.warn(`  ⚠ query failed: ${err.message}`);
      break;
    }
  }
  return results;
}

function tweetUrl(tweet) {
  const username = tweet.author?.userName ?? "i";
  return `https://x.com/${username}/status/${tweet.id}`;
}

function escapeCSV(val) {
  if (val == null) return "";
  const str = String(val).replace(/\r?\n/g, " ").trim();
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

// shorten text to first meaningful sentence / 120 chars
function threadTitle(text) {
  const clean = text.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= 120) return clean;
  const dot = clean.indexOf("。");
  const nl = clean.indexOf("\n");
  const cut = [dot, nl].filter((i) => i > 0 && i <= 120).sort((a, b) => a - b)[0];
  return cut ? clean.slice(0, cut + 1) : clean.slice(0, 120) + "…";
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const seen = new Map(); // id → tweet

  for (const query of QUERIES) {
    console.log(`\n🔍 Searching: ${query}`);
    const tweets = await fetchQuery(query, 2);

    for (const t of tweets) {
      if (seen.has(t.id)) continue;
      // date filter
      const created = new Date(t.createdAt);
      if (created < since) continue;
      // skip retweets (keep original content only)
      if (t.isRetweet) continue;
      seen.set(t.id, t);
    }

    console.log(`  累计唯一推文: ${seen.size}`);
  }

  let all = Array.from(seen.values());

  // Prefer threads, but fall back to all high-engagement tweets if < 30 threads
  const threads = all.filter((t) => isThread(t.text));
  const nonThreads = all.filter((t) => !isThread(t.text));

  console.log(`\n📊 总计: ${all.length} 条 (含Thread标志: ${threads.length})`);

  let pool = threads;
  if (pool.length < 30) {
    console.log(`  Thread不足30条，补充高互动推文…`);
    pool = [
      ...threads,
      ...nonThreads.sort((a, b) => engagementScore(b) - engagementScore(a)),
    ];
  }

  // sort by engagement desc, take top 30
  pool.sort((a, b) => engagementScore(b) - engagementScore(a));
  const top30 = pool.slice(0, 30);

  // ── write CSV ──────────────────────────────────────────────────────────────
  const headers = [
    "序号",
    "首贴标题",
    "首贴链接",
    "作者",
    "发帖日期",
    "浏览量",
    "转发量",
    "点赞量",
    "回复量",
    "是否Thread",
  ];

  const rows = top30.map((t, i) => [
    i + 1,
    threadTitle(t.text),
    tweetUrl(t),
    `@${t.author?.userName ?? ""}`,
    formatDate(t.createdAt),
    t.viewCount ?? 0,
    t.retweetCount ?? 0,
    t.likeCount ?? 0,
    t.replyCount ?? 0,
    isThread(t.text) ? "是" : "否",
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((r) => r.map(escapeCSV).join(",")),
  ].join("\n");

  const outPath = path.join(__dirname, "..", "finance-agent-threads.csv");
  fs.writeFileSync(outPath, "﻿" + csv, "utf8"); // BOM for Excel

  console.log(`\n✅ 已保存 ${top30.length} 条到: ${outPath}`);
  console.log("\n前5条预览:");
  top30.slice(0, 5).forEach((t, i) => {
    console.log(
      `  ${i + 1}. [👁${(t.viewCount ?? 0).toLocaleString()} ❤${(t.likeCount ?? 0).toLocaleString()} 🔁${(t.retweetCount ?? 0).toLocaleString()}] ${threadTitle(t.text).slice(0, 60)}…`
    );
  });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
