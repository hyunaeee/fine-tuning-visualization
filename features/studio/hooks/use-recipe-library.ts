"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import { createRecipeStore, EMPTY_SNAPSHOT } from "../storage/recipe-store";
import { LEGACY_STORAGE_KEY, STORAGE_KEY } from "../domain/validation";

export function useRecipeLibrary() {
  const [store] = useState(() => createRecipeStore(() => window.localStorage));
  const subscribe = useCallback(
    (listener: () => void) => {
      const unsubscribe = store.subscribe(listener);
      const onStorage = (event: StorageEvent) => {
        if (
          event.key === STORAGE_KEY ||
          event.key === LEGACY_STORAGE_KEY ||
          event.key === null
        )
          store.refresh();
      };
      window.addEventListener("storage", onStorage);
      store.refresh();
      return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
      };
    },
    [store],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    store.getSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  return { ...snapshot, save: store.save, remove: store.remove };
}
