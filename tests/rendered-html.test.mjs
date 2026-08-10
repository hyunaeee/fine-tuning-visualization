import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Modely workspace shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /목적별 모델을 고르고 레시피로 저장하는 AI 튜닝 콘솔/);
  assert.match(html, /어떤 일을 맡길 AI가 필요한가요/);
  assert.match(html, /모델 라이브러리/);
  assert.match(html, /레시피 북/);
  assert.match(html, /설정은 이 기기에 안전하게 저장/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("ships the model rack and persistent recipe workflow", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const modelCatalog/);
  assert.match(page, /gpt-5\.6-sol/);
  assert.match(page, /gpt-5\.6-terra/);
  assert.match(page, /gpt-5\.6-luna/);
  assert.match(page, /gpt-4\.1-mini/);
  assert.match(page, /o4-mini/);
  assert.match(page, /modely-recipes-v1/);
  assert.match(page, /window\.localStorage\.setItem/);
  assert.match(page, /function saveCurrentRecipe/);
  assert.match(page, /function loadRecipe/);
  assert.match(page, /function deleteRecipe/);
  assert.match(css, /\.model-library/);
  assert.match(css, /\.recipe-book/);
  assert.match(css, /\.recipe-formula/);
  assert.match(layout, /재사용 가능한 레시피로 저장/);
});
