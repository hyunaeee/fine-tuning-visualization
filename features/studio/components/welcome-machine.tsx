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
  const isDocument = selectedGoal.id === "organize";
  const previewControl = controls[isDocument ? 2 : 1];
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
              <span>{isDocument ? "답변 길이" : "말투"}</span>
              <strong>
                {isDocument
                  ? previewControl.value >= 72
                    ? "핵심만"
                    : "자세하게"
                  : previewControl.value >= 65
                    ? "따뜻하게"
                    : "담백하게"}
              </strong>
            </div>
          </div>
          <div className="dial-invitation">
            <span>직접 움직여보세요 ↙</span>
            <strong>
              조금 더<br />
              {isDocument ? "간결한 AI로." : "다정한 AI로."}
            </strong>
            <p>
              슬라이더 하나로
              <br />
              답변의 느낌이 달라져요.
            </p>
          </div>
        </div>
        <label className="welcome-slider">
          <span>
            <strong>{isDocument ? "답변의 간결함" : "친절한 말투"}</strong>
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
            aria-label={
              isDocument ? "첫 화면 답변의 간결함" : "첫 화면 친절한 말투"
            }
          />
          <span className="welcome-slider-scale">
            <span>{isDocument ? "자세하게" : "담백하게"}</span>
            <span>{isDocument ? "핵심만" : "따뜻하게"}</span>
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
          <strong>마음에 드는 조합은 레시피로</strong>
          <small>저장해두면 다음에도 그대로</small>
        </div>
        <i aria-hidden="true">✓</i>
      </div>
    </div>
  );
}
