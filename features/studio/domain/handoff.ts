import { goals, modelCatalog, outcomeExamples } from "../data/catalog.ts";
import { recipeSettings } from "./workspace.ts";
import { parseSettings } from "./validation.ts";
import { simulate } from "./simulation.ts";
import type { AudienceId, RecipeSettings } from "./types.ts";
import { evaluationProtocol, purposeBriefs } from "../data/purposes.ts";

export function shareFragment(settings: RecipeSettings): string {
  return (
    "#recipe=" +
    encodeURIComponent(
      JSON.stringify({ version: 1, settings: recipeSettings(settings) }),
    )
  );
}
export function parseSharedSettings(hash: string): RecipeSettings | null {
  if (!hash.startsWith("#recipe=") || hash.length > 50_000) return null;
  try {
    const value = JSON.parse(decodeURIComponent(hash.slice(8)));
    return value && value.version === 1 ? parseSettings(value.settings) : null;
  } catch {
    return null;
  }
}
export function buildHandoff(
  settings: RecipeSettings,
  audience: AudienceId,
  createdAt: string,
) {
  const goal = goals.find((g) => g.id === settings.goal)!;
  const model = modelCatalog.find((m) => m.id === settings.modelId)!;
  const preview = simulate(settings);
  return {
    schemaVersion: 1,
    kind: "modely-demo-handoff",
    createdAt,
    audience,
    project: goal.title,
    model: { id: model.id, name: model.name },
    recipe: recipeSettings(settings),
    inputExamples: outcomeExamples[settings.goal].inputAssets,
    purpose: {
      problem: purposeBriefs[settings.goal].problem,
      trainingTarget: purposeBriefs[settings.goal].trainingTarget,
      baseline: purposeBriefs[settings.goal].baseline,
      dataRule: purposeBriefs[settings.goal].dataRule,
    },
    evaluationPlan: {
      status: "not-run",
      protocol: evaluationProtocol,
      criteria: purposeBriefs[settings.goal].evaluation.map((criterion) => ({
        ...criterion,
      })),
    },
    outputExample: preview.answer,
    indicators: {
      kind: "configuration-simulation",
      values: preview.indicators,
    },
    limitations: [
      "예시 기반 시뮬레이션입니다. 실제 모델 평가 결과가 아닙니다.",
      "모델 API, 학습 작업, 고객용 API와 위젯은 연결되지 않았습니다.",
    ],
    suggestedDeliverables: outcomeExamples[settings.goal].outputs,
  };
}
