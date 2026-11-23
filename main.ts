import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Copies VIDEO.json into the grader's output directory.
// No network, no wall clock, no files outside this repository.
// Run: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const source = join(botDir, "VIDEO.json");
const parsed = JSON.parse(readFileSync(source, "utf8")) as { url: string };
if (typeof parsed.url !== "string") {
  throw new Error("VIDEO.json must contain a string url");
}

// The entry only counts for a real public TikTok video post, so refuse
// anything that is not a TikTok video URL before copying it onward.
const tiktokVideo = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;
if (!tiktokVideo.test(parsed.url)) {
  throw new Error(
    "VIDEO.json url must be a TikTok video URL like https://www.tiktok.com/@<handle>/video/<id>"
  );
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "VIDEO.json"));
