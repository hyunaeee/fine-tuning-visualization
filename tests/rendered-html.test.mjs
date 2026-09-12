import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the Modely workspace content intact", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /목적별 모델을 고르고 레시피로 저장하는 AI 튜닝 콘솔/);
  assert.match(page, /어떤 일을 맡길 AI가 필요한가요/);
  assert.match(page, /모델 라이브러리/);
  assert.match(page, /레시피 북/);
  assert.match(page, /무엇을 넣고, 무엇을 받나요/);
  assert.match(page, /실제 사용하면 이렇게 달라집니다/);
  assert.match(page, /제품 데모 기준 예상 결과/);
  assert.match(page, /입력·출력 명세/);
  assert.match(page, /설정은 이 기기에 안전하게 저장/);
  assert.doesNotMatch(page, /Your site is taking shape|react-loading-skeleton/);
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
  assert.match(page, /const outcomeExamples/);
  assert.match(page, /function saveCurrentRecipe/);
  assert.match(page, /function loadRecipe/);
  assert.match(page, /function deleteRecipe/);
  assert.match(css, /\.model-library/);
  assert.match(css, /\.recipe-book/);
  assert.match(css, /\.recipe-formula/);
  assert.match(layout, /업무 자료를 입력하면 어떤 AI 답변과 전달 결과를 받는지/);
  assert.match(layout, /VERCEL_PROJECT_PRODUCTION_URL/);
});
