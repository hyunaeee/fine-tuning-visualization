import { goals, modelCatalog, testQuestions } from "../data/catalog.ts";
import type {
  DialKey,
  GoalId,
  PresetRecipe,
  Recipe,
  RecipeSettings,
  Stage,
  StudioState,
} from "./types.ts";

export const MAX_TEXT_LENGTH = 2000;
export const exampleCounts: Record<GoalId, number> = {
  support: 84,
  brand: 120,
  organize: 60,
};
export const defaultDials = {
  policy: 88,
  warmth: 72,
  concision: 58,
  creativity: 26,
};
export function initialState(session = 0): StudioState {
  return {
    ...defaultDials,
    session,
    stage: 0,
    goal: "support",
    modelId: "gpt-5.6-terra",
    prompt: goals[0].prompt,
    testQuestion: testQuestions.support[0],
    fileName: "",
    fileError: "",
  };
}
export function clampDial(value: number): number {
  return Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : 0;
}
export function recommendedModels(goal: GoalId) {
  return [...modelCatalog].sort((a, b) => b.fit[goal] - a.fit[goal]);
}
export function recipeSettings(state: RecipeSettings): RecipeSettings {
  const {
    goal,
    modelId,
    prompt,
    testQuestion,
    policy,
    warmth,
    concision,
    creativity,
  } = state;
  return {
    goal,
    modelId,
    prompt,
    testQuestion,
    policy,
    warmth,
    concision,
    creativity,
  };
}
export type StudioAction =
  | { type: "reset" }
  | { type: "stage"; stage: Stage }
  | { type: "goal"; goal: GoalId }
  | { type: "model"; modelId: RecipeSettings["modelId"] }
  | { type: "text"; field: "prompt" | "testQuestion"; value: string }
  | { type: "dial"; key: DialKey; value: number }
  | { type: "file"; file: { name: string; size: number } | null }
  | { type: "recipe"; recipe: Recipe | PresetRecipe }
  | { type: "shared"; settings: RecipeSettings };

export function studioReducer(
  state: StudioState,
  action: StudioAction,
): StudioState {
  switch (action.type) {
    case "reset":
      return initialState(state.session + 1);
    case "stage":
      return { ...state, stage: action.stage };
    case "goal": {
      const goal = goals.find((item) => item.id === action.goal)!;
      return {
        ...state,
        goal: goal.id,
        prompt: goal.prompt,
        testQuestion: testQuestions[goal.id][0],
        modelId: recommendedModels(goal.id)[0].id,
        fileName: "",
        fileError: "",
      };
    }
    case "model":
      return { ...state, modelId: action.modelId };
    case "text":
      return {
        ...state,
        [action.field]: action.value.slice(0, MAX_TEXT_LENGTH),
      };
    case "dial":
      return { ...state, [action.key]: clampDial(action.value) };
    case "file": {
      if (!action.file) return state;
      const validType = /\.(csv|xlsx|jsonl)$/i.test(action.file.name);
      const validSize =
        action.file.size > 0 && action.file.size <= 20 * 1024 * 1024;
      if (!validType || !validSize)
        return {
          ...state,
          fileError:
            "비어 있지 않은 CSV·XLSX·JSONL 파일을 20MB 이하로 선택해주세요.",
        };
      return { ...state, fileName: action.file.name, fileError: "" };
    }
    case "recipe": {
      const recipe = action.recipe;
      const goal = goals.find((item) => item.id === recipe.goal)!;
      return {
        ...state,
        ...recipeSettings({
          ...recipe,
          prompt: "prompt" in recipe ? recipe.prompt : goal.prompt,
          testQuestion:
            "testQuestion" in recipe
              ? recipe.testQuestion
              : testQuestions[recipe.goal][0],
        }),
        stage: 2,
        fileName: "",
        fileError: "",
      };
    }
    case "shared":
      return {
        ...initialState(),
        ...recipeSettings(action.settings),
        stage: 3,
      };
  }
}
