import assert from "node:assert/strict";
import test from "node:test";
import {
  goals,
  modelCatalog,
  presetRecipes,
  testQuestions,
} from "../features/studio/data/catalog.ts";
import { purposeBriefs } from "../features/studio/data/purposes.ts";
import {
  buildHandoff,
  parseSharedSettings,
  shareFragment,
} from "../features/studio/domain/handoff.ts";
import { simulate } from "../features/studio/domain/simulation.ts";
import {
  decodeRecipes,
  encodeRecipes,
} from "../features/studio/domain/validation.ts";
import {
  initialState,
  recipeSettings,
  studioReducer,
} from "../features/studio/domain/workspace.ts";

for (const { id: goal } of goals) {
  test(`${goal}: purpose, examples, recipe and evaluation plan stay aligned`, () => {
    const state = studioReducer(initialState(), { type: "goal", goal });
    const brief = purposeBriefs[goal];
    assert(
      brief.problem && brief.trainingTarget && brief.baseline && brief.dataRule,
    );
    assert.equal(brief.evaluation.length, 3);
    assert(modelCatalog.every((model) => Number.isFinite(model.fit[goal])));
    assert(presetRecipes.some((recipe) => recipe.goal === goal));
    const doc = buildHandoff(state, "agency", "2026-09-15T00:00:00Z");
    assert.equal(doc.purpose.trainingTarget, brief.trainingTarget);
    assert.equal(doc.evaluationPlan.status, "not-run");
    assert.deepEqual(doc.evaluationPlan.criteria, brief.evaluation);
    assert.equal(doc.outputExample, simulate(state).answer);
    assert.deepEqual(
      parseSharedSettings(shareFragment(state)),
      recipeSettings(state),
    );
    const recipe = {
      ...recipeSettings(state),
      id: goal,
      name: brief.shortTitle,
      createdAt: "2026-09-15",
    };
    assert.deepEqual(decodeRecipes(encodeRecipes([recipe])).recipes, [recipe]);
    assert.notEqual(
      simulate({ ...state, policy: 0 }).answer,
      simulate({ ...state, policy: 100 }).answer,
    );
  });
}

test("policy exceptions request review instead of promising a refund or exchange", () => {
  const answer = simulate(initialState()).answer;
  assert.match(answer, /일반 교환 조건에 해당하지 않습니다/);
  assert.match(answer, /이관/);
  assert.doesNotMatch(answer, /무료 교환이 가능합니다/);
});

test("technical classification distinguishes incidents, account issues and missing evidence", () => {
  const state = studioReducer(initialState(), {
    type: "goal",
    goal: "technical",
  });
  const answers = testQuestions.technical.map(
    (testQuestion) => simulate({ ...state, testQuestion }).answer,
  );
  assert.match(answers[0], /P1[\s\S]*결제팀/);
  assert.match(answers[1], /P3[\s\S]*계정지원팀/);
  assert.match(answers[2], /우선순위: 미정/);
  assert.doesNotMatch(answers[2], /P1|P3/);
});

test("structured extraction keeps missing fields null and returns valid JSON", () => {
  const state = studioReducer(initialState(), {
    type: "goal",
    goal: "organize",
  });
  for (const testQuestion of testQuestions.organize) {
    assert.doesNotThrow(() =>
      JSON.parse(simulate({ ...state, testQuestion }).answer),
    );
  }
  const missing = JSON.parse(
    simulate({ ...state, testQuestion: testQuestions.organize[1] }).answer,
  );
  assert.equal(missing.owner, null);
  assert.equal(missing.due_date, null);
});

test("existing brand recipes retain their goal and custom content", () => {
  const old = {
    ...recipeSettings(initialState()),
    goal: "brand" as const,
    prompt: "기존 브랜드 말투",
    testQuestion: "신제품 텀블러 출시 안내 문구를 작성해줘.",
  };
  assert.deepEqual(parseSharedSettings(shareFragment(old)), old);
  assert(simulate(old).supported);
});

test("normal policy cases are not incorrectly escalated", () => {
  const result = simulate({
    ...initialState(),
    testQuestion: testQuestions.support[3],
  });
  assert(result.supported);
  assert.match(result.answer, /일반 교환 절차/);
  assert.doesNotMatch(result.answer, /이관|보류/);
});

test("a familiar keyword does not pretend an arbitrary document was analyzed", () => {
  for (const { id: goal } of goals) {
    const state = studioReducer(initialState(), { type: "goal", goal });
    const result = simulate({
      ...state,
      testQuestion: `${state.testQuestion} 실제 조건은 위와 다릅니다.`,
    });
    assert.equal(result.supported, false);
    assert.match(result.answer, /모델 API 연결/);
  }
});
