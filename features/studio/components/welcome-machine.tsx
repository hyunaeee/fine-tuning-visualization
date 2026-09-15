import type { CSSProperties } from "react";
import type { StudioController } from "../hooks/use-studio";

type Props = Pick<
  StudioController,
  "controls" | "liveAnswer" | "verifying" | "selectedGoal"
>;

/** A real preview control, not a decorative screenshot: it shares the recipe state. */
export function WelcomeMachine({
  controls,
  liveAnswer,
  verifying,
  selectedGoal,
}: Props) {
  const previewControl = controls[0];
  return (
    <div className="welcome-machine-scene">
      <div className="scene-orbit" aria-hidden="true" />
      <span className="scene-spark spark-one" aria-hidden="true">
        ✦
      </span>
      <span className="scene-spark spark-two" aria-hidden="true">
        ✧
      </span>
      <div className="welcome-machine">
        <div className="welcome-machine-header">
          <span className="mini-brand">✳ modely</span>
          <span className="preview-status">
            <i /> 체험 모드
          </span>
        </div>
        <div className="machine-task">
          <span>지금 맞추고 있는 AI</span>
          <strong>{selectedGoal.title}</strong>
        </div>
        <div className="welcome-dial-layout">
          <div
            className="welcome-knob"
            style={
              {
                "--dial-angle": `${-132 + previewControl.value * 2.64}deg`,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <div className="welcome-knob-face">
              <i />
              <span>업무 기준</span>
              <strong>
                {previewControl.value >= 70 ? "기준 우선" : "기본 응답"}
              </strong>
            </div>
          </div>
          <div className="dial-invitation">
            <span>직접 움직여보세요 ↙</span>
            <strong>
              기준을 지키는
              <br />
              응답으로.
            </strong>
            <p>
              슬라이더 하나로
              <br />
              예시의 처리 방식이 달라져요.
            </p>
          </div>
        </div>
        <label className="welcome-slider">
          <span>
            <strong>업무 기준 반영</strong>
            <output>{previewControl.value}</output>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={previewControl.value}
            onChange={(event) =>
              previewControl.setter(Number(event.target.value))
            }
            aria-label="첫 화면 업무 기준 반영"
          />
          <span className="welcome-slider-scale">
            <span>기본 응답</span>
            <span>기준 우선</span>
          </span>
        </label>
        <div
          className="welcome-response"
          aria-live="polite"
          aria-busy={verifying}
        >
          <span>
            <i /> {verifying ? "답변을 바꾸고 있어요" : "이렇게 답해요"}
          </span>
          <p>{liveAnswer}</p>
        </div>
        <div className="welcome-machine-footer">
          <span>예시 기반 미리보기 · 실제 학습 아님</span>
          <span aria-hidden="true">● ● ●</span>
        </div>
      </div>
      <div className="floating-recipe">
        <span aria-hidden="true">▤</span>
        <div>
          <strong>업무별 설정은 레시피로</strong>
          <small>같은 설정으로 다시 비교하세요</small>
        </div>
        <i aria-hidden="true">✓</i>
      </div>
    </div>
  );
}
