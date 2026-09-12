import assert from "node:assert/strict";
import test from "node:test";
import {
  initialState,
  studioReducer,
  recommendedModels,
} from "../features/studio/domain/workspace.ts";
import {
  modelCatalog,
  presetRecipes,
  testQuestions,
} from "../features/studio/data/catalog.ts";
import { simulate } from "../features/studio/domain/simulation.ts";

test("switching goal resets incompatible question, file and model together", () => {
  const state = {
    ...initialState(),
    fileName: "support.csv",
    fileError: "old error",
  };
  const next = studioReducer(state, { type: "goal", goal: "brand" });
  assert.equal(next.testQuestion, testQuestions.brand[0]);
  assert.equal(next.fileName, "");
  assert.equal(next.fileError, "");
  assert.equal(next.modelId, recommendedModels("brand")[0].id);
  assert.equal(state.goal, "support");
});
test("preset restore replaces the whole tuning configuration", () => {
  const next = studioReducer(
    { ...initialState(), fileName: "old.csv" },
    { type: "recipe", recipe: presetRecipes[2] },
  );
  assert.equal(next.goal, "organize");
  assert.equal(next.modelId, "gpt-5.6-luna");
  assert.equal(next.policy, 96);
  assert.equal(next.testQuestion, testQuestions.organize[0]);
  assert.equal(next.stage, 2);
  assert.equal(next.fileName, "");
});
test("reset clears transient state and starts a new preview session", () => {
  const next = studioReducer(
    { ...initialState(), stage: 4, fileName: "old.csv", warmth: 1 },
    { type: "reset" },
  );
  assert.deepEqual(next, initialState(1));
});
test("invalid dial inputs cannot leak NaN or out-of-range values into state", () => {
  for (const [value, expected] of [
    [Infinity, 0],
    [NaN, 0],
    [-9, 0],
    [109, 100],
    [50.4, 50],
  ]) {
    assert.equal(
      studioReducer(initialState(), { type: "dial", key: "policy", value })
        .policy,
      expected,
    );
  }
});
test("ranking models never mutates the catalog", () => {
  const ids = modelCatalog.map((m) => m.id);
  const ranked = recommendedModels("organize");
  assert.equal(ranked[0].id, "gpt-5.6-luna");
  assert.deepEqual(
    modelCatalog.map((m) => m.id),
    ids,
  );
});
test("file selection validates type and size, without inventing data counts", () => {
  for (const file of [
    { name: "secret.exe", size: 42 },
    { name: "empty.csv", size: 0 },
    { name: "huge.jsonl", size: 21 * 1024 * 1024 },
  ]) {
    const next = studioReducer(initialState(), { type: "file", file });
    assert(next.fileError);
    assert.equal(next.fileName, "");
  }
  const next = studioReducer(initialState(), {
    type: "file",
    file: { name: "Q&A.CSV", size: 42 },
  });
  assert.equal(next.fileName, "Q&A.CSV");
  assert.equal(next.fileError, "");
  assert(!("exampleCount" in next));
});
for (const goal of ["support", "brand", "organize"] as const) {
  test(goal + " questions produce distinct examples", () => {
    const state = studioReducer(initialState(), { type: "goal", goal });
    const results = testQuestions[goal].map((question) =>
      simulate({ ...state, testQuestion: question }),
    );
    assert(results.every((result) => result.supported));
    // Meeting and field extraction share a fixture; interviews must use a different one.
    assert(
      new Set(results.map((r) => r.answer)).size >=
        (goal === "organize" ? 2 : 3),
    );
  });
}
test("unknown and empty prompts do not silently get a successful canned answer", () => {
  assert.equal(
    simulate({ ...initialState(), testQuestion: " " }).supported,
    false,
  );
  const unsupported = simulate({
    ...initialState(),
    testQuestion: "미분방정식을 풀어줘",
  });
  assert.equal(unsupported.supported, false);
  assert.match(unsupported.answer, /데모 예시가 아직 없어요/);
});
test("dial changes affect the preview and all indicators stay within 0–100", () => {
  const state = initialState();
  assert.notEqual(
    simulate(state).answer,
    simulate({ ...state, warmth: 0, concision: 100 }).answer,
  );
  for (const level of [0, 50, 100]) {
    const result = simulate({
      ...state,
      policy: level,
      warmth: level,
      concision: level,
      creativity: level,
    });
    for (const value of Object.values(result.indicators))
      assert(value >= 0 && value <= 100 && Number.isInteger(value));
  }
});
