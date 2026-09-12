"use client";
import { useEffect, useState } from "react";
import { simulate } from "../domain/simulation";
import { recipeSettings } from "../domain/workspace";
import type { RecipeSettings } from "../domain/types";

export type PreviewRecord = {
  id: string;
  time: string;
  settings: RecipeSettings;
  answer: string;
  supported: boolean;
};
export function usePreview(settings: RecipeSettings, session: number) {
  const key = JSON.stringify(recipeSettings(settings));
  const [snapshot, setSnapshot] = useState(() => ({
    key,
    session,
    result: simulate(settings),
    history: [] as PreviewRecord[],
  }));
  useEffect(() => {
    // Coalesce slider events. Only completed local previews enter the history.
    const timer = window.setTimeout(() => {
      const request: RecipeSettings = JSON.parse(key);
      const result = simulate(request);
      const entry = {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        settings: request,
        answer: result.answer,
        supported: result.supported,
      };
      setSnapshot((previous) => ({
        key,
        session,
        result,
        history: request.testQuestion.trim()
          ? [
              entry,
              ...(previous.session === session
                ? previous.history.filter(
                    (item) => item.settings.goal === request.goal,
                  )
                : []),
            ].slice(0, 8)
          : [],
      }));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [key, session]);
  return {
    ...snapshot.result,
    verifying: snapshot.key !== key || snapshot.session !== session,
    history:
      snapshot.session === session
        ? snapshot.history.filter(
            (item) => item.settings.goal === settings.goal,
          )
        : [],
  };
}
