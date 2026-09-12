import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("production HTML is useful before browser hydration", async () => {
  const html = await readFile(
    new URL("../.next/server/app/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /<html lang="ko"/);
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
  assert.match(html, /무엇을 넣고, 무엇을 받나요/);
  assert.match(html, /직접|어떤 일을 맡길/);
  assert.match(html, /고객 문의에 답하는 AI/);
  assert.doesNotMatch(
    html,
    /Your site is taking shape|자동 저장됨|312개의 질문/,
  );
});
test("production metadata points to this deployed product", async () => {
  const html = await readFile(
    new URL("../.next/server/app/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /property="og:image"/);
  assert.doesNotMatch(html, /modely-finetune-kr\.vercel\.app|chatgpt\.site/);
});
