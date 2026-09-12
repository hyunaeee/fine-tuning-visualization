import type { StudioController } from "../hooks/use-studio";

type Props = Pick<
  StudioController,
  "controls" | "policy" | "warmth" | "concision" | "creativity" | "tuningName"
>;
export function BehaviorConsole({
  controls,
  policy,
  warmth,
  concision,
  creativity,
  tuningName,
}: Props) {
  return (
    <div className="machine-console">
      <div className="machine-topbar">
        <span className="machine-screw" />
        <div>
          <strong>MODELY / BEHAVIOR CONSOLE</strong>
          <small>조작값이 답변 미리보기에 반영됩니다</small>
        </div>
        <div className="machine-lights">
          <i />
          <i />
          <i />
        </div>
        <span className="machine-screw" />
      </div>

      <div className="dial-bank">
        {controls.map((control) => (
          <label className="control-dial" key={control.label}>
            <span className="dial-label">{control.label}</span>
            <div
              className="knob"
              style={
                {
                  "--dial-angle": `${-132 + control.value * 2.64}deg`,
                } as React.CSSProperties
              }
            >
              <span className="knob-ticks" />
              <span className="knob-face">
                <i />
                <strong>{control.value}</strong>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={control.value}
              onChange={(event) => control.setter(Number(event.target.value))}
              aria-label={control.label}
            />
            <span className="dial-scale">
              <i>{control.low}</i>
              <i>{control.high}</i>
            </span>
            <small>{control.description}</small>
          </label>
        ))}
      </div>

      <div className="machine-lower">
        <div className="learning-modules">
          <div className="machine-section-title">
            <span>LEARNING CHANNELS</span>
            <small>무엇을 학습하나요?</small>
          </div>
          <div className="switch-row">
            <span className="toggle-switch on">
              <i />
            </span>
            <p>
              <strong>회사 규칙과 판단 기준</strong>
              <small>교환·환불처럼 반복되는 정책</small>
            </p>
            <b>{policy}%</b>
          </div>
          <div className="switch-row">
            <span className="toggle-switch on">
              <i />
            </span>
            <p>
              <strong>말투와 표현 패턴</strong>
              <small>인사, 공감, 문장 마무리 방식</small>
            </p>
            <b>{warmth}%</b>
          </div>
          <div className="switch-row">
            <span className="toggle-switch on">
              <i />
            </span>
            <p>
              <strong>답변의 구조와 길이</strong>
              <small>순서, 항목, 간결한 정도</small>
            </p>
            <b>{concision}%</b>
          </div>
          <div className="switch-row disabled">
            <span className="toggle-switch">
              <i />
            </span>
            <p>
              <strong>새로운 사실과 최신 지식</strong>
              <small>파인튜닝보다 지식 검색 연결이 적합</small>
            </p>
            <b>OFF</b>
          </div>
        </div>

        <div className="signal-display">
          <div className="machine-section-title">
            <span>TUNING EFFECT</span>
            <small>현재 만들어지는 성향</small>
          </div>
          <div className="signal-name">
            <span>PROFILE</span>
            <strong>{tuningName}</strong>
          </div>
          <div className="signal-bars">
            <div>
              <span>RULES</span>
              <i>
                <b style={{ width: `${policy}%` }} />
              </i>
            </div>
            <div>
              <span>TONE</span>
              <i>
                <b style={{ width: `${warmth}%` }} />
              </i>
            </div>
            <div>
              <span>FORMAT</span>
              <i>
                <b style={{ width: `${concision}%` }} />
              </i>
            </div>
            <div>
              <span>VARIETY</span>
              <i>
                <b style={{ width: `${creativity}%` }} />
              </i>
            </div>
          </div>
          <div className="effect-tags">
            <span>{policy >= 70 ? "규칙 우선" : "상황 판단"}</span>
            <span>{warmth >= 65 ? "친절한 말투" : "담백한 말투"}</span>
            <span>{concision >= 65 ? "짧은 답변" : "상세한 답변"}</span>
            <span>{creativity < 45 ? "일관성 중심" : "다양한 표현"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
