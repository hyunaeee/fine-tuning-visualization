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
          <strong>정답은 없어요. 마음에 드는 답변을 찾아보세요.</strong>
          <p>
            추천 AI가 미리 선택되어 있어요. 조절기를 움직여 말투와 길이를
            바꾸고, 아래 답변 예시를 확인하세요. 마음에 들면 레시피로 저장하면
            돼요.
          </p>
        </div>
      </div>

      <div className="panel-heading">
        <div>
          <span>내 취향으로 맞추기</span>
          <h2>AI가 어떻게 말하면 좋을까요?</h2>
        </div>
        <span className={verifying ? "live-badge checking" : "live-badge"}>
          <i /> {verifying ? "바꾸는 중" : "바로 미리보기"}
        </span>
      </div>

      <div className="platform-update">
        <span>체험 안내</span>
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
          <small>지금 만드는 레시피</small>
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

      <div className="instant-preview">
        <div className="preview-terminal-head">
          <span>
            <i /> 이렇게 답해요
          </span>
          <small>{verifying ? "설정 반영 중…" : "예시 미리보기"}</small>
        </div>
        <div className="preview-terminal-body">
          <span>물어본 말</span>
          <p>{testQuestion}</p>
          <span>AI 답변 예시</span>
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

      <RecipeBook {...recipeProps} />

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
          직접 질문해보기 <span>→</span>
        </button>
      </div>
    </div>
  );
}
