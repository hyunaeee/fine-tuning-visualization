import assert from "node:assert/strict";
import test from "node:test";
import {
  buildHandoff,
  parseSharedSettings,
  shareFragment,
} from "../features/studio/domain/handoff.ts";
import {
  initialState,
  recipeSettings,
  studioReducer,
} from "../features/studio/domain/workspace.ts";
import { copyText } from "../features/studio/browser/actions.ts";

test("shared settings preserve Unicode, custom input and zero-valued dials", () => {
  const settings = {
    ...recipeSettings(initialState()),
    prompt: "브랜드 & 정책 #한글",
    testQuestion: "배송? 확인해주세요",
    warmth: 0,
  };
  assert.deepEqual(parseSharedSettings(shareFragment(settings)), settings);
  assert.equal(
    studioReducer(initialState(), { type: "shared", settings }).stage,
    3,
  );
});
for (const hash of [
  "",
  "#recipe=%XX",
  "#recipe=null",
  "#recipe=" + encodeURIComponent('{"version":9}'),
  "#recipe=" + "x".repeat(50_001),
]) {
  test("rejects malformed shared settings " + hash.slice(0, 30), () =>
    assert.equal(parseSharedSettings(hash), null),
  );
}
test("shared URLs never inject UI state or unrecognized fields", () => {
  const malicious = {
    version: 1,
    settings: {
      ...recipeSettings(initialState()),
      stage: 99,
      fileName: "secret.csv",
      admin: true,
    },
  };
  const parsed = parseSharedSettings(
    "#recipe=" + encodeURIComponent(JSON.stringify(malicious)),
  )!;
  assert(!("stage" in parsed));
  assert(!("admin" in parsed));
  assert(!("fileName" in parsed));
});
test("handoff serializes current settings and a matching response", () => {
  const state = studioReducer(initialState(), { type: "goal", goal: "brand" });
  const doc = JSON.parse(
    JSON.stringify(
      buildHandoff(state, "developer", "2026-09-12T00:00:00.000Z"),
    ),
  );
  assert.equal(doc.model.id, state.modelId);
  assert.equal(doc.recipe.goal, "brand");
  assert.equal(doc.recipe.testQuestion, testQuestionsForBrand());
  assert.equal(doc.audience, "developer");
  assert.equal(doc.indicators.kind, "configuration-simulation");
  assert.match(doc.outputExample, /텀블러/);
  assert(doc.limitations.length);
  assert(!("fileName" in doc.recipe));
});
function testQuestionsForBrand() {
  return studioReducer(initialState(), { type: "goal", goal: "brand" })
    .testQuestion;
}
test("clipboard errors propagate as failure, never false success", async () => {
  let written = "";
  assert.equal(
    await copyText("demo", async (value) => {
      written = value;
    }),
    true,
  );
  assert.equal(written, "demo");
  assert.equal(
    await copyText("demo", async () => {
      throw new Error("denied");
    }),
    false,
  );
});
