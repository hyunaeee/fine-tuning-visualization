import { useState } from "react";
import { audiences } from "../data/catalog";
import type { AudienceId } from "../domain/types";
import type { StudioController } from "../hooks/use-studio";
import { useHandoff } from "../hooks/use-handoff";

type Props = Pick<StudioController, "state" | "selectedModel" | "setStage">;
const descriptions: Record<AudienceId, string> = {
  operator:
    "같은 모델·다이얼·목표 설명·테스트 질문을 여는 공유 링크와 설정 파일을 전달합니다.",
  web: "웹사이트에 연결할 때 필요한 입력·출력과 설정을 JSON으로 정리합니다. 실제 채팅 위젯 설치는 아직 지원하지 않습니다.",
  developer:
    "선택한 모델, 입력 설정과 출력 예시를 JSON으로 전달합니다. 실제 API 주소와 인증 키는 발급하지 않습니다.",
  agency:
    "고객용 전달 방식을 검토할 수 있도록 레시피, 입력·출력 예시와 데모 범위를 하나의 JSON 문서에 정리합니다.",
};
export function DeliveryStep({ state, selectedModel, setStage }: Props) {
  const [audience, setAudience] = useState<AudienceId>("operator");
  const { copyLink, downloadBundle, feedback } = useHandoff(state, audience);
  return (
    <div className="panel-content delivery-content">
      <div className="assistant-note">
        <span className="assistant-mark">✳</span>
        <div>
          <strong>설정과 예시 결과를 함께 전달하세요</strong>
          <p>
            현재 데모에서 만든 조합을 링크와 JSON 파일로 공유할 수 있습니다.
            실제 고객용 모델 배포는 다음 연결 단계입니다.
          </p>
        </div>
      </div>
      <div className="panel-heading delivery-heading">
        <div>
          <span>함께 써볼 준비</span>
          <h2>누가 이 AI를 사용하게 되나요?</h2>
        </div>
        <span className="plain-badge">데모 전달 센터</span>
      </div>
      <div
        className="audience-tabs"
        role="group"
        aria-label="결과물을 받을 고객 유형"
      >
        {(Object.keys(audiences) as AudienceId[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={audience === id}
            className={audience === id ? "selected" : ""}
            onClick={() => setAudience(id)}
          >
            <strong>{audiences[id].label}</strong>
            <small>{audiences[id].description}</small>
          </button>
        ))}
      </div>
      <div className="delivery-card">
        <div className="delivery-card-top">
          <span className="delivery-icon">↗</span>
          <span className="delivery-badge">{audiences[audience].badge}</span>
        </div>
        <h3>
          {audience === "operator"
            ? "같은 설정으로 체험하기"
            : "연동·인계를 위한 설정 문서"}
        </h3>
        <p>{descriptions[audience]}</p>
        <div className="handoff-preview">
          <span>JSON</span>
          <div>
            <strong>modely-{state.goal}-demo.json</strong>
            <small>{selectedModel.name} · 현재 레시피와 질문 · 예시 출력</small>
          </div>
        </div>
      </div>
      <div className="universal-package">
        <div className="section-label">
          <strong>파일에 실제로 포함되는 내용</strong>
          <span>JSON 형식</span>
        </div>
        <div className="package-list">
          <div>
            <span>✓</span>
            <p>
              <strong>모델·튜닝 레시피</strong>
              <small>모델 ID, 목표 설명, 네 개의 다이얼 값</small>
            </p>
          </div>
          <div>
            <span>✓</span>
            <p>
              <strong>입력·출력 명세</strong>
              <small>입력 자료 예시, 현재 질문과 답변 예시</small>
            </p>
          </div>
          <div>
            <span>✓</span>
            <p>
              <strong>설정 지표</strong>
              <small>시뮬레이션임을 명시한 다이얼 지표</small>
            </p>
          </div>
          <div>
            <span>✓</span>
            <p>
              <strong>전달 대상·생성 시각</strong>
              <small>선택한 고객 유형, 문서 버전과 생성 일시</small>
            </p>
          </div>
          <div>
            <span>✓</span>
            <p>
              <strong>데모 범위</strong>
              <small>실제 모델 호출·학습·배포의 미연결 상태</small>
            </p>
          </div>
          <div>
            <span>✓</span>
            <p>
              <strong>업무 목적·검증 계획</strong>
              <small>
                해결할 오류, 기준 모델 비교 방법, 미실행 상태의 평가 항목
              </small>
            </p>
          </div>
        </div>
      </div>
      <div className="share-settings">
        <button
          type="button"
          className="quiet-button"
          onClick={() => void copyLink()}
        >
          현재 설정 링크 복사 ↗
        </button>
        <small>
          목표 설명과 테스트 질문도 링크에 포함됩니다. 링크를 가진 사람이 볼 수
          있어요.
        </small>
      </div>
      {feedback && (
        <div
          className={"feedback " + feedback.notice.kind}
          role={feedback.notice.kind === "error" ? "alert" : "status"}
        >
          <p>{feedback.notice.message}</p>
          {feedback.notice.kind === "error" && feedback.link && (
            <textarea
              aria-label="직접 복사할 설정 링크"
              readOnly
              value={feedback.link}
            />
          )}
        </div>
      )}
      <div className="panel-footer">
        <button
          className="quiet-button"
          type="button"
          onClick={() => setStage(3)}
        >
          결과로 돌아가기
        </button>
        <button
          className="primary-action"
          type="button"
          onClick={downloadBundle}
        >
          설정·예시 JSON 다운로드 <span>↓</span>
        </button>
      </div>
    </div>
  );
}
