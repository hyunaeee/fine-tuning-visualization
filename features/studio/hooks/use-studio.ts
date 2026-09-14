"use client";
import { useEffect, useReducer, useState } from "react";
import { goals, modelCatalog, outcomeExamples } from "../data/catalog";
import {
  initialState,
  studioReducer,
  recommendedModels as rankModels,
  exampleCounts,
  recipeSettings,
} from "../domain/workspace";
import { parseSharedSettings } from "../domain/handoff";
import { calculateIndicators, tuningLabel } from "../domain/simulation";
import type {
  DialKey,
  GoalId,
  ModelId,
  Notice,
  PresetRecipe,
  Recipe,
  Stage,
} from "../domain/types";
import { useRecipeLibrary } from "./use-recipe-library";
import { usePreview } from "./use-preview";

export function useStudio() {
  const [state, dispatch] = useReducer(studioReducer, undefined, () =>
    initialState(),
  );
  const library = useRecipeLibrary();
  const preview = usePreview(state, state.session);
  const [localNotice, setLocalNotice] = useState<Notice | null>(null);
  const [anchor, setAnchor] = useState<"model-library" | "recipe-book" | null>(
    null,
  );
  const selectedGoal = goals.find((item) => item.id === state.goal)!;
  const selectedModel = modelCatalog.find((item) => item.id === state.modelId)!;
  useEffect(() => {
    const importHash = () => {
      const settings = parseSharedSettings(window.location.hash);
      if (settings) dispatch({ type: "shared", settings });
      else if (window.location.hash.startsWith("#recipe="))
        setLocalNotice({
          kind: "error",
          message: "유효하지 않은 공유 설정이에요. 기본 프로젝트를 표시합니다.",
        });
    };
    importHash();
    window.addEventListener("hashchange", importHash);
    return () => window.removeEventListener("hashchange", importHash);
  }, []);
  useEffect(() => {
    if (state.stage === 2 && anchor)
      document
        .getElementById(anchor)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.stage, anchor]);
  const setStage = (stage: number) => {
    if (Number.isInteger(stage) && stage >= 0 && stage <= 4)
      dispatch({ type: "stage", stage: stage as Stage });
  };
  const chooseGoal = (goal: GoalId) => {
    dispatch({ type: "goal", goal });
    setLocalNotice(null);
  };
  const setDial = (key: DialKey, value: number) =>
    dispatch({ type: "dial", key, value });
  const controls = [
    {
      label: "규칙 준수",
      value: state.policy,
      setter: (value: number) => setDial("policy", value),
      low: "유연",
      high: "엄격",
      description: "회사 정책을 우선하는 정도",
    },
    {
      label: "친절한 말투",
      value: state.warmth,
      setter: (value: number) => setDial("warmth", value),
      low: "담백",
      high: "따뜻",
      description: "답변의 공감과 친근함",
    },
    {
      label: "간결함",
      value: state.concision,
      setter: (value: number) => setDial("concision", value),
      low: "자세히",
      high: "짧게",
      description: "답변 길이와 핵심 밀도",
    },
    {
      label: "표현 다양성",
      value: state.creativity,
      setter: (value: number) => setDial("creativity", value),
      low: "일관",
      high: "다양",
      description: "새로운 표현을 허용하는 정도",
    },
  ];
  function saveCurrentRecipe() {
    setLocalNotice(null);
    library.save({
      ...recipeSettings(state),
      id: crypto.randomUUID(),
      name: selectedGoal.title.replace(" AI", "") + " · " + selectedModel.name,
      createdAt: new Date().toISOString(),
    });
  }
  function loadRecipe(recipe: Recipe | PresetRecipe) {
    dispatch({ type: "recipe", recipe });
    setLocalNotice({
      kind: "success",
      message: "“" + recipe.name + "” 레시피를 불러왔어요.",
    });
  }
  const notice = localNotice ?? library.notice;
  return {
    state,
    ...state,
    selectedGoal,
    selectedModel,
    selectedModelId: state.modelId,
    selectedOutcome: outcomeExamples[state.goal],
    recommendedModels: rankModels(state.goal),
    exampleCount: exampleCounts[state.goal],
    verification: calculateIndicators(state),
    tuningName: tuningLabel(state),
    liveAnswer: preview.verifying
      ? "현재 설정으로 미리보기를 갱신하고 있어요…"
      : preview.answer,
    verifying: preview.verifying,
    previewHistory: preview.history,
    supportedQuestion: preview.supported,
    controls,
    savedRecipes: library.recipes,
    recipesLoaded: library.loaded,
    recipeNotice: notice?.message ?? "",
    noticeKind: notice?.kind,
    setStage,
    chooseGoal,
    setPrompt: (value: string) =>
      dispatch({ type: "text", field: "prompt", value }),
    setTestQuestion: (value: string) =>
      dispatch({ type: "text", field: "testQuestion", value }),
    setSelectedModelId: (modelId: ModelId) =>
      dispatch({ type: "model", modelId }),
    selectFile: (file: File | null) => dispatch({ type: "file", file }),
    resetProject: () => {
      dispatch({ type: "reset" });
      setLocalNotice(null);
      setAnchor(null);
    },
    openStudio: (nextAnchor: "model-library" | "recipe-book") => {
      setAnchor(nextAnchor);
      setStage(2);
      if (state.stage === 2)
        document
          .getElementById(nextAnchor)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    saveCurrentRecipe,
    loadRecipe,
    deleteRecipe: (id: string) => {
      setLocalNotice(null);
      library.remove(id);
    },
  };
}
export type StudioController = ReturnType<typeof useStudio>;
