import type { StudioController } from "../hooks/use-studio";
import { modelCatalog, presetRecipes } from "../data/catalog";
import { purposeBriefs } from "../data/purposes";
const formatDate = (value: string) =>
  Number.isNaN(Date.parse(value))
    ? value
    : new Date(value).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
type Props = Pick<
  StudioController,
  | "saveCurrentRecipe"
  | "selectedModel"
  | "exampleCount"
  | "selectedGoal"
  | "policy"
  | "warmth"
  | "concision"
  | "creativity"
  | "verification"
  | "recipeNotice"
  | "noticeKind"
  | "loadRecipe"
  | "savedRecipes"
  | "deleteRecipe"
  | "recipesLoaded"
>;
export function RecipeBook({
  saveCurrentRecipe,
  selectedModel,
  exampleCount,
  selectedGoal,
  policy,
  warmth,
  concision,
  creativity,
  verification,
  recipeNotice,
  noticeKind,
  loadRecipe,
  savedRecipes,
  deleteRecipe,
  recipesLoaded,
}: Props) {
  return (
    <section className="recipe-book" id="recipe-book">
      <div className="recipe-book-head">
        <div>
          <span>나만의 레시피</span>
          <h3>잘 맞춘 조리법은 저장해두세요</h3>
          <p>
            모델, 목표 설명, 테스트 질문과 네 개의 다이얼 값을 저장하고 다시
            불러옵니다.
          </p>
        </div>
        <button
          type="button"
          onClick={saveCurrentRecipe}
          disabled={!recipesLoaded}
        >
          이 조합 저장
        </button>
      </div>

      <div className="recipe-formula">
        <div>
          <span>선택한 AI</span>
          <strong>{selectedModel.name}</strong>
          <small>{selectedModel.method}</small>
        </div>
        <i>＋</i>
        <div>
          <span>준비된 예시</span>
          <strong>{exampleCount}개 예시</strong>
          <small>{selectedGoal.title}</small>
        </div>
        <i>＋</i>
        <div>
          <span>동작 설정</span>
          <strong>
            {policy} · {warmth} · {concision} · {creativity}
          </strong>
          <small>규칙 · 말투 · 길이 · 다양성</small>
        </div>
        <i>＝</i>
        <div className="formula-score">
          <span>설정 성향</span>
          <strong>{verification.overall}점</strong>
          <small>다이얼 설정 지표</small>
        </div>
      </div>

      {recipeNotice && (
        <div
          className="recipe-notice"
          role={noticeKind === "error" ? "alert" : "status"}
        >
          <span>{noticeKind === "error" ? "!" : "✓"}</span>
          {recipeNotice}
        </div>
      )}

      <div className="recipe-shelf">
        <div className="shelf-title">
          <strong>바로 쓰는 기본 레시피</strong>
          <span>목적에 맞게 미리 조리됨</span>
        </div>
        <div className="recipe-cards">
          {presetRecipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>
              <span>{purposeBriefs[recipe.goal].badge}</span>
              <div>
                <strong>{recipe.name}</strong>
                <small>
                  {
                    modelCatalog.find((model) => model.id === recipe.modelId)
                      ?.name
                  }
                </small>
              </div>
              <button type="button" onClick={() => loadRecipe(recipe)}>
                불러오기
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="recipe-shelf saved-shelf">
        <div className="shelf-title">
          <strong>내가 저장한 레시피</strong>
          <span>{savedRecipes.length}개 · 이 기기에 저장됨</span>
        </div>
        {savedRecipes.length === 0 ? (
          <button
            className="empty-recipe"
            type="button"
            onClick={saveCurrentRecipe}
            disabled={!recipesLoaded}
          >
            <span>＋</span>
            <strong>첫 레시피 저장하기</strong>
            <small>현재 모델과 다이얼 설정이 그대로 담깁니다.</small>
          </button>
        ) : (
          <div className="recipe-cards">
            {savedRecipes.map((recipe) => (
              <article className="recipe-card saved" key={recipe.id}>
                <span>MY</span>
                <div>
                  <strong>{recipe.name}</strong>
                  <small>
                    {formatDate(recipe.createdAt)} · {recipe.policy}/
                    {recipe.warmth}/{recipe.concision}/{recipe.creativity}
                  </small>
                </div>
                <button type="button" onClick={() => loadRecipe(recipe)}>
                  적용
                </button>
                <button
                  className="delete-recipe"
                  type="button"
                  aria-label={`${recipe.name} 삭제`}
                  onClick={() => deleteRecipe(recipe.id)}
                >
                  ×
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
