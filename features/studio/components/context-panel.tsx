import type { StudioController } from "../hooks/use-studio";
import { stages } from "../data/catalog";
type Props = Pick<
  StudioController,
  | "selectedGoal"
  | "prompt"
  | "exampleCount"
  | "selectedModel"
  | "policy"
  | "stage"
  | "verification"
  | "savedRecipes"
>;
export function ContextPanel({
  selectedGoal,
  prompt,
  exampleCount,
  selectedModel,
  policy,
  stage,
  verification,
  savedRecipes,
}: Props) {
  return (
    <aside className="context-panel">
      <p className="context-title">지금까지 만든 설정</p>
      <div className="context-block">
        <span>목표</span>
        <strong>{selectedGoal.title}</strong>
        <p>{prompt}</p>
      </div>
      <div className="context-divider" />
      <dl className="context-list">
        <div>
          <dt>샘플 예시</dt>
          <dd>{exampleCount}개</dd>
        </div>
        <div>
          <dt>품질 상태</dt>
          <dd>실제 데이터 미검사</dd>
        </div>
        <div>
          <dt>선택 모델</dt>
          <dd>{selectedModel.name}</dd>
        </div>
        <div>
          <dt>적용 방식</dt>
          <dd>{selectedModel.method}</dd>
        </div>
        <div>
          <dt>튜닝 유형</dt>
          <dd>{policy >= 75 ? "규칙 준수형" : "균형형"}</dd>
        </div>
        <div>
          <dt>현재 버전</dt>
          <dd>v1</dd>
        </div>
        <div>
          <dt>설정 지표</dt>
          <dd>{stage >= 2 ? `${verification.overall} / 100` : "대기 중"}</dd>
        </div>
        <div>
          <dt>저장 레시피</dt>
          <dd>{savedRecipes.length}개</dd>
        </div>
      </dl>
      <div className="context-divider" />
      <div className="stage-explanation">
        <span>지금 하는 일</span>
        <strong>{stages[stage].label}</strong>
        <p>{stages[stage].helper}. 완료하면 다음 단계로 이어집니다.</p>
      </div>
      {stage === 4 && (
        <div className="handoff-rule">
          <span>전달 원칙</span>
          <p>
            공유한 설정을 같은 화면에서 확인하고{" "}
            <strong>데모 범위와 사용 방법</strong>도 함께 안내합니다.
          </p>
        </div>
      )}
    </aside>
  );
}
