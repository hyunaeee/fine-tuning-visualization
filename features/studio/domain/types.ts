export type GoalId = "support" | "brand" | "organize";
export type AudienceId = "operator" | "web" | "developer" | "agency";
export type Stage = 0 | 1 | 2 | 3 | 4;
export type ModelId =
  | "gpt-5.6-sol"
  | "gpt-5.6-terra"
  | "gpt-5.6-luna"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "o4-mini";
export type DialKey = "policy" | "warmth" | "concision" | "creativity";
export type DialSettings = Record<DialKey, number>;
export type RecipeSettings = DialSettings & {
  goal: GoalId;
  modelId: ModelId;
  prompt: string;
  testQuestion: string;
};
export type Recipe = RecipeSettings & {
  id: string;
  name: string;
  createdAt: string;
};
export type PresetRecipe = Omit<Recipe, "prompt" | "testQuestion">;
export type StudioState = RecipeSettings & {
  session: number;
  stage: Stage;
  fileName: string;
  fileError: string;
};
export type Notice = { kind: "success" | "error"; message: string };
