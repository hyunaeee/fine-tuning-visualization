import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeRecipes,
  encodeRecipes,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
} from "../features/studio/domain/validation.ts";
import {
  initialState,
  recipeSettings,
} from "../features/studio/domain/workspace.ts";
import { createRecipeStore } from "../features/studio/storage/recipe-store.ts";
import type { Recipe } from "../features/studio/domain/types.ts";

const recipe = (id = "one"): Recipe => ({
  ...recipeSettings(initialState()),
  id,
  name: "내 고객 응대",
  prompt: "직접 작성한 업무 설명",
  testQuestion: "배송 지연 문의",
  createdAt: "2026-09-12T09:00:00.000Z",
});
function memory(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
test("v2 restores custom prompts and test questions, not just the dials", () => {
  const saved = recipe();
  assert.deepEqual(decodeRecipes(encodeRecipes([saved])), {
    recipes: [saved],
    warning: "",
  });
});
test("legacy recipes migrate with goal-specific defaults", () => {
  const { prompt: _prompt, testQuestion: _question, ...old } = recipe();
  assert(_prompt && _question);
  const migrated = decodeRecipes(JSON.stringify([old]));
  assert.equal(migrated.warning, "");
  assert.equal(migrated.recipes[0].policy, old.policy);
  assert.equal(migrated.recipes[0].prompt, initialState().prompt);
});
for (const raw of [
  "{broken",
  "null",
  "42",
  "{}",
  '{"version":999,"recipes":[]}',
  '{"version":2,"recipes":{}}',
]) {
  test("malformed storage cannot become application state: " + raw, () => {
    const result = decodeRecipes(raw);
    assert.deepEqual(result.recipes, []);
    assert(result.warning);
  });
}
for (const change of [
  { goal: "missing" },
  { modelId: "unknown" },
  { policy: 101 },
  { warmth: -1 },
  { creativity: "90" },
  { concision: 3.2 },
  { prompt: null },
  { id: "" },
  { name: "<".repeat(201) },
]) {
  test("rejects invalid fields: " + JSON.stringify(change), () => {
    const result = decodeRecipes(
      JSON.stringify({ version: 2, recipes: [{ ...recipe(), ...change }] }),
    );
    assert.equal(result.recipes.length, 0);
    assert(result.warning);
  });
}
test("filters corrupt entries and duplicate IDs while keeping valid recipes", () => {
  const first = recipe();
  const result = decodeRecipes(
    JSON.stringify({
      version: 2,
      recipes: [null, first, { ...first, name: "duplicate" }, recipe("two")],
    }),
  );
  assert.deepEqual(
    result.recipes.map((r) => r.id),
    ["one", "two"],
  );
  assert(result.warning);
});
test("a storage failure never reports a successful save or deletes the last good list", () => {
  const storage = memory({ [STORAGE_KEY]: encodeRecipes([recipe()]) });
  const store = createRecipeStore(() => storage);
  store.refresh();
  storage.setItem = () => {
    throw new Error("Quota exceeded");
  };
  assert.equal(store.save(recipe("two")), false);
  assert.equal(store.remove("one"), false);
  assert.equal(store.getSnapshot().recipes[0].id, "one");
  assert.equal(store.getSnapshot().notice?.kind, "error");
});
test("blocked browser storage does not crash initialization", () => {
  const store = createRecipeStore(() => {
    throw new Error("Denied");
  });
  store.refresh();
  assert.equal(store.getSnapshot().loaded, true);
  assert.equal(store.save(recipe()), false);
  assert.equal(store.getSnapshot().notice?.kind, "error");
});

test("a failed refresh blocks writes even when an older snapshot has recipes", () => {
  const original = encodeRecipes([recipe()]);
  const storage = memory({ [STORAGE_KEY]: original });
  const store = createRecipeStore(() => storage);
  store.refresh();
  storage.getItem = () => {
    throw new Error("Read access revoked");
  };
  assert.equal(store.save(recipe("two")), false);
  assert.equal(store.remove("one"), false);
  assert.equal(storage.values.get(STORAGE_KEY), original);
  assert.deepEqual(
    store.getSnapshot().recipes.map((item) => item.id),
    ["one"],
  );
});
test("save before hydration is rejected to protect existing storage", () => {
  const storage = memory({ [STORAGE_KEY]: encodeRecipes([recipe()]) });
  const store = createRecipeStore(() => storage);
  assert.equal(store.save(recipe("two")), false);
  assert.equal(decodeRecipes(storage.getItem(STORAGE_KEY)).recipes.length, 1);
});
test("migration preserves v1 and stores new writes in a versioned envelope", () => {
  const { prompt: _prompt, testQuestion: _question, ...old } = recipe();
  assert(_prompt && _question);
  const storage = memory({ [LEGACY_STORAGE_KEY]: JSON.stringify([old]) });
  const store = createRecipeStore(() => storage);
  store.refresh();
  assert.equal(store.save(recipe("two")), true);
  assert(storage.getItem(LEGACY_STORAGE_KEY));
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)!).version, 2);
  assert.equal(store.getSnapshot().recipes.length, 2);
  assert.equal(store.remove("two"), true);
  const reloaded = createRecipeStore(() => storage);
  reloaded.refresh();
  assert.deepEqual(
    reloaded.getSnapshot().recipes.map((r) => r.id),
    ["one"],
  );
});
test("a later write re-reads changes made by another tab", () => {
  const storage = memory();
  const first = createRecipeStore(() => storage),
    second = createRecipeStore(() => storage);
  first.refresh();
  second.refresh();
  assert(first.save(recipe("first")));
  assert(second.save(recipe("second")));
  first.refresh();
  assert.deepEqual(
    first.getSnapshot().recipes.map((r) => r.id),
    ["second", "first"],
  );
});
test("totally corrupt storage stays intact instead of being overwritten", () => {
  const storage = memory({ [STORAGE_KEY]: "{corrupt" });
  const store = createRecipeStore(() => storage);
  store.refresh();
  assert.equal(store.save(recipe()), false);
  assert.equal(storage.getItem(STORAGE_KEY), "{corrupt");
});
test("caps the library at 100 without silently dropping existing saves", () => {
  const list = Array.from({ length: 100 }, (_, i) => recipe(String(i)));
  const storage = memory({ [STORAGE_KEY]: encodeRecipes(list) });
  const store = createRecipeStore(() => storage);
  store.refresh();
  assert.equal(store.save(recipe("overflow")), false);
  assert.equal(store.getSnapshot().recipes.length, 100);
});
