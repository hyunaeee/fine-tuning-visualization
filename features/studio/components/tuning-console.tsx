import type { StudioController } from "../hooks/use-studio";
import { ModelRack } from "./model-rack";
import { BehaviorConsole } from "./behavior-console";
import { RecipeBook } from "./recipe-book";
type Props = Pick<
  StudioController,
  | "selectedModel"
  | "tuningName"
  | "saveCurrentRecipe"
  | "recipesLoaded"
  | "verifying"
  | "testQuestion"
  | "liveAnswer"
  | "verification"
  | "setStage"
  | "selectedGoal"
  | "selectedModelId"
  | "recommendedModels"
  | "setSelectedModelId"
  | "goal"
  | "controls"
  | "policy"
  | "warmth"
  | "concision"
  | "creativity"
  | "exampleCount"
  | "recipeNotice"
  | "noticeKind"
  | "loadRecipe"
  | "savedRecipes"
  | "deleteRecipe"
>;
export function TuningConsole({
  selectedModel,
  tuningName,
  saveCurrentRecipe,
  recipesLoaded,
  verifying,
  testQuestion,
  liveAnswer,
  verification,
  setStage,
  selectedGoal,
  selectedModelId,
  recommendedModels,
  setSelectedModelId,
  goal,
  controls,
  policy,
  warmth,
  concision,
  creativity,
  exampleCount,
  recipeNotice,
  noticeKind,
  loadRecipe,
  savedRecipes,
  deleteRecipe,
}: Props) {
  const rackProps = {
    selectedGoal,
    selectedModel,
    selectedModelId,
    recommendedModels,
    setSelectedModelId,
    goal,
  };
  const behaviorProps = {
    controls,
    policy,
    warmth,
    concision,
    creativity,
    tuningName,
  };
  const recipeProps = {
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
  };
  return (
    <div className="panel-content console-content">
      <div className="assistant-note">
        <span className="assistant-mark">✳</span>
        <div>
          <strong>기계의 다이얼을 맞추듯 조정하세요</strong>
          <p>
            숫자를 몰라도 괜찮아요. 다이얼을 움직이면 예상 답변과 검증 계기판이
            즉시 반응합니다. 만족스러운 지점에서 설정을 고정하면 돼요.
          </p>
        </div>
      </div>

      <div className="panel-heading">
        <div>
          <span>STEP 2 · TUNING CONSOLE</span>
          <h2>AI의 행동을 직접 조율하세요</h2>
        </div>
        <span className={verifying ? "live-badge checking" : "live-badge"}>
          <i /> {verifying ? "재계산 중" : "LIVE"}
        </span>
      </div>

      <div className="platform-update">
        <span>DEMO MODE</span>
        <div>
          <strong>모델을 고르고 조정 흐름을 체험하세요</strong>
          <p>
            모델 목록과 순서는 시연용 데이터입니다. 아래 답변과 지표는 로컬
            시뮬레이션이며 실제 API·학습 작업은 실행하지 않습니다.
          </p>
        </div>
      </div>

      <ModelRack {...rackProps} />

      <div className="active-recipe-strip">
        <span className="stove-light" />
        <div>
          <small>NOW COOKING</small>
          <strong>
            {selectedModel.name} × {tuningName}
          </strong>
        </div>
        <span>{selectedModel.method}</span>
        <button
          type="button"
          onClick={saveCurrentRecipe}
          disabled={!recipesLoaded}
        >
          현재 레시피 저장 ＋
        </button>
      </div>

      <BehaviorConsole {...behaviorProps} />

      <RecipeBook {...recipeProps} />

      <div className="instant-preview">
        <div className="preview-terminal-head">
          <span>
            <i /> INSTANT PREVIEW
          </span>
          <small>{verifying ? "설정 반영 중…" : "예시 미리보기"}</small>
        </div>
        <div className="preview-terminal-body">
          <span>TEST INPUT</span>
          <p>{testQuestion}</p>
          <span>TUNED OUTPUT</span>
          <strong>{liveAnswer}</strong>
        </div>
        <div className="preview-score">
          <span>다이얼 설정 지표</span>
          <strong>{verification.overall}</strong>
          <i>
            <b style={{ width: `${verification.overall}%` }} />
          </i>
        </div>
      </div>

      <div className="fine-tune-explainer">
        <span>이 레시피의 효과</span>
        <p>
          목표에 맞는 <strong>규칙·말투·길이·표현 방식</strong>을 설정으로
          보관합니다. 실제 모델 동작을 바꾸려면 이 설정을 모델 API나 학습
          파이프라인에 연결해야 합니다.
        </p>
      </div>

      <div className="panel-footer">
        <button
          className="quiet-button"
          type="button"
          onClick={() => setStage(1)}
        >
          이전
        </button>
        <button
          className="primary-action"
          type="button"
          onClick={() => setStage(3)}
        >
          이 설정으로 실시간 테스트 <span>→</span>
        </button>
      </div>
    </div>
  );
}
