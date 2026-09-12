import { goals, modelCatalog, testQuestions } from "../data/catalog.ts";
import { MAX_TEXT_LENGTH } from "./workspace.ts";
import type { Recipe, RecipeSettings } from "./types.ts";

export const STORAGE_KEY = "modely-recipes-v2";
export const LEGACY_STORAGE_KEY = "modely-recipes-v1";
export const MAX_RECIPES = 100;
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown, max: number, allowEmpty = false): v is string =>
  typeof v === "string" &&
  v.length <= max &&
  (allowEmpty || v.trim().length > 0);
export function parseSettings(value: unknown): RecipeSettings | null {
  if (!isRecord(value)) return null;
  if (
    !goals.some((g) => g.id === value.goal) ||
    !modelCatalog.some((m) => m.id === value.modelId)
  )
    return null;
  if (
    !isText(value.prompt, MAX_TEXT_LENGTH, true) ||
    !isText(value.testQuestion, MAX_TEXT_LENGTH, true)
  )
    return null;
  for (const key of ["policy", "warmth", "concision", "creativity"]) {
    const v = value[key];
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > 100)
      return null;
  }
  // Copy only the validated fields; untrusted storage never becomes arbitrary app state.
  return {
    goal: value.goal as RecipeSettings["goal"],
    modelId: value.modelId as RecipeSettings["modelId"],
    prompt: value.prompt,
    testQuestion: value.testQuestion,
    policy: value.policy as number,
    warmth: value.warmth as number,
    concision: value.concision as number,
    creativity: value.creativity as number,
  };
}
function parseRecipe(value: unknown, legacy: boolean): Recipe | null {
  if (
    !isRecord(value) ||
    !isText(value.id, 100) ||
    !isText(value.name, 200) ||
    !isText(value.createdAt, 80)
  )
    return null;
  const goal = goals.find((g) => g.id === value.goal);
  const settings = parseSettings(
    legacy && goal
      ? {
          ...value,
          prompt: goal.prompt,
          testQuestion: testQuestions[goal.id][0],
        }
      : value,
  );
  return settings
    ? {
        ...settings,
        id: value.id,
        name: value.name,
        createdAt: value.createdAt,
      }
    : null;
}
export type DecodeResult = { recipes: Recipe[]; warning: string };
export function decodeRecipes(raw: string | null): DecodeResult {
  if (raw === null) return { recipes: [], warning: "" };
  try {
    if (raw.length > 2_000_000) throw new Error("Oversized storage");
    const value: unknown = JSON.parse(raw);
    const legacy = Array.isArray(value);
    const entries = legacy
      ? value
      : isRecord(value) && value.version === 2 && Array.isArray(value.recipes)
        ? value.recipes
        : null;
    if (!entries) throw new Error("Unsupported storage version");
    const recipes: Recipe[] = [];
    const ids = new Set<string>();
    for (const entry of entries) {
      const recipe = parseRecipe(entry, legacy);
      if (recipe && !ids.has(recipe.id) && recipes.length < MAX_RECIPES) {
        recipes.push(recipe);
        ids.add(recipe.id);
      }
    }
    return {
      recipes,
      warning:
        recipes.length !== entries.length
          ? "읽을 수 없는 레시피가 있어 유효한 항목만 불러왔어요."
          : "",
    };
  } catch {
    return {
      recipes: [],
      warning:
        "저장된 레시피를 읽지 못했어요. 기존 저장 데이터는 그대로 유지됩니다.",
    };
  }
}
export function encodeRecipes(recipes: Recipe[]): string {
  const encoded = JSON.stringify({ version: 2, recipes });
  const checked = decodeRecipes(encoded);
  if (checked.warning || checked.recipes.length !== recipes.length)
    throw new Error("Invalid recipe data");
  return encoded;
}
