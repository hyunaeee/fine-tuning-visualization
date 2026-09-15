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
  assert.match(html, /우리 업무의 기준을/);
  assert.match(html, /첫 화면 업무 기준 반영/);
  assert.match(html, /내 AI 만들기/);
  assert.match(html, /간단한 사용 순서/);
  assert.match(html, /정책을 준수하는 상담 AI/);
  assert.match(html, /기술지원 티켓 분류/);
  assert.match(html, /검증 설계 · 미실행/);
  assert.match(html, /먼저 비교할 방법/);
  assert.match(html, /별도 평가셋/);
  assert.doesNotMatch(
    html,
    /Your site is taking shape|자동 저장됨|312개의 질문|약 4분|약 8초|정답은 없어요/,
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
