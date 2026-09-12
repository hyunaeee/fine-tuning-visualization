import {
  decodeRecipes,
  encodeRecipes,
  LEGACY_STORAGE_KEY,
  MAX_RECIPES,
  STORAGE_KEY,
} from "../domain/validation.ts";
import type { Notice, Recipe } from "../domain/types.ts";

export type StoragePort = Pick<Storage, "getItem" | "setItem">;
export type RecipeSnapshot = {
  recipes: Recipe[];
  loaded: boolean;
  notice: Notice | null;
};
export const EMPTY_SNAPSHOT: RecipeSnapshot = {
  recipes: [],
  loaded: false,
  notice: null,
};

export function createRecipeStore(getStorage: () => StoragePort) {
  let snapshot = EMPTY_SNAPSHOT;
  const listeners = new Set<() => void>();
  function publish(next: RecipeSnapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  }
  function refresh() {
    try {
      const storage = getStorage();
      const raw =
        storage.getItem(STORAGE_KEY) ?? storage.getItem(LEGACY_STORAGE_KEY);
      const result = decodeRecipes(raw);
      publish({
        recipes: result.recipes,
        loaded: true,
        notice: result.warning
          ? { kind: "error", message: result.warning }
          : null,
      });
      return true;
    } catch {
      publish({
        ...snapshot,
        loaded: true,
        notice: {
          kind: "error",
          message:
            "이 브라우저에서 저장소를 사용할 수 없어요. 레시피를 저장하지 못할 수 있습니다.",
        },
      });
      return false;
    }
  }
  function write(recipes: Recipe[], message: string): boolean {
    try {
      getStorage().setItem(STORAGE_KEY, encodeRecipes(recipes));
      publish({ recipes, loaded: true, notice: { kind: "success", message } });
      return true;
    } catch {
      publish({
        ...snapshot,
        notice: {
          kind: "error",
          message:
            "레시피를 저장하지 못했어요. 브라우저 저장 권한이나 용량을 확인해주세요.",
        },
      });
      return false;
    }
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    refresh,
    save(recipe: Recipe) {
      if (!snapshot.loaded) return false;
      // Re-read before a write so a second tab's saved recipes are not lost.
      if (!refresh()) return false;
      if (snapshot.notice?.kind === "error" && snapshot.recipes.length === 0)
        return false;
      const remaining = snapshot.recipes.filter(
        (item) => item.id !== recipe.id,
      );
      if (remaining.length >= MAX_RECIPES) {
        publish({
          ...snapshot,
          notice: {
            kind: "error",
            message:
              "최대 100개까지 저장할 수 있어요. 필요 없는 레시피를 먼저 삭제해주세요.",
          },
        });
        return false;
      }
      return write(
        [recipe, ...remaining],
        "레시피를 이 브라우저에 저장했어요.",
      );
    },
    remove(id: string) {
      if (!snapshot.loaded) return false;
      if (!refresh()) return false;
      if (snapshot.notice?.kind === "error" && snapshot.recipes.length === 0)
        return false;
      return write(
        snapshot.recipes.filter((item) => item.id !== id),
        "저장한 레시피를 삭제했어요.",
      );
    },
  };
}
