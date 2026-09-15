import type { StudioController } from "../hooks/use-studio";
import { testQuestions } from "../data/catalog";
import { PurposePlan } from "./purpose-plan";
type Props = Pick<
  StudioController,
  | "verifying"
  | "verification"
  | "testQuestion"
  | "setTestQuestion"
  | "goal"
  | "controls"
  | "selectedModel"
  | "liveAnswer"
  | "tuningName"
  | "supportedQuestion"
  | "previewHistory"
  | "setStage"
>;
export function TestBench({
  verifying,
  verification,
  testQuestion,
  setTestQuestion,
  goal,
  controls,
  selectedModel,
  liveAnswer,
  tuningName,
  supportedQuestion,
  previewHistory,
  setStage,
}: Props) {
  return (
    <div className="panel-content test-lab-content">
      <div className="assistant-note success-note">
        <span className="assistant-mark">↻</span>
        <div>
          <strong>질문이나 다이얼을 바꾸면 예시를 다시 계산합니다</strong>
          <p>
            바뀐 예시 답변과 설정 지표를 같은 화면에서 확인하세요. 지표는 다이얼
            값의 시뮬레이션이며 모델 성능·안전성 평가가 아닙니다. 준비된 예시
            질문만 지원하며 임의 입력의 내용은 분석하지 않습니다.
          </p>
        </div>
      </div>

      <div className="panel-heading">
        <div>
          <span>답변 직접 확인하기</span>
          <h2>이 출력이 업무 기준을 지키나요?</h2>
        </div>
        <span className={verifying ? "score-pill verifying" : "score-pill"}>
          {verifying ? "갱신 중" : "예시 미리보기"}
        </span>
      </div>

      <PurposePlan goal={goal} evaluationOnly />

      <div className="test-bench">
        <div className="bench-topbar">
          <span className="machine-screw" />
          <strong>나의 AI와 대화해보기</strong>
          <div>
            <i className={verifying ? "blink" : ""} />{" "}
            {verifying ? "RUNNING" : "PREVIEW"}
          </div>
          <span className="machine-screw" />
        </div>

        <div className="bench-controls">
          <div className="test-input-area">
            <label htmlFor="live-test-question">
              AI에게 어떤 말을 해볼까요?
            </label>
            <textarea
              maxLength={2000}
              id="live-test-question"
              value={testQuestion}
              onChange={(event) => setTestQuestion(event.target.value)}
            />
            <div className="test-presets">
              {testQuestions[goal].map((question, index) => (
                <button
                  key={question}
                  type="button"
                  className={testQuestion === question ? "active" : ""}
                  onClick={() => setTestQuestion(question)}
                >
                  예시 질문 {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="mini-controls">
            {controls.map((control) => (
              <label key={control.label}>
                <span>{control.label}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={control.value}
                  onChange={(event) =>
                    control.setter(Number(event.target.value))
                  }
                />
                <strong>{control.value}</strong>
              </label>
            ))}
          </div>
        </div>

        <div className="live-output-grid">
          <article className="live-response">
            <header>
              <span>이렇게 답해요 · 예시</span>
              <small>
                {selectedModel.name} / {goal}-v1
              </small>
            </header>
            <p aria-live="polite" className={verifying ? "updating" : ""}>
              {liveAnswer}
            </p>
            <footer>
              <span className="response-type">{tuningName}</span>
              <span>{liveAnswer.length}자</span>
            </footer>
          </article>

          <aside className="validation-meter">
            <div className="meter-score">
              <span>설정 성향 · 실측 아님</span>
              <strong>{verification.overall}</strong>
              <small>/ 100</small>
            </div>
            <div className="meter-list">
              <div>
                <span>규칙 강도</span>
                <i>
                  <b style={{ width: `${verification.accuracy}%` }} />
                </i>
                <strong>{verification.accuracy}</strong>
              </div>
              <div>
                <span>친절도</span>
                <i>
                  <b style={{ width: `${verification.tone}%` }} />
                </i>
                <strong>{verification.tone}</strong>
              </div>
              <div>
                <span>일관성 성향</span>
                <i>
                  <b style={{ width: `${verification.consistency}%` }} />
                </i>
                <strong>{verification.consistency}</strong>
              </div>
              <div>
                <span>보수성</span>
                <i>
                  <b style={{ width: `${verification.safety}%` }} />
                </i>
                <strong>{verification.safety}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="verification-grid">
        <div>
          <span className="check-led pass" />
          <p>
            <strong>질문 예시 범위</strong>
            <small>
              {verifying
                ? "설정 적용 중"
                : supportedQuestion
                  ? "데모에 준비된 질문 유형"
                  : "아래 테스트 예시를 선택해주세요"}
            </small>
          </p>
          <b>{verifying ? "…" : supportedQuestion ? "DEMO" : "미지원"}</b>
        </div>
        <div>
          <span className="check-led pass" />
          <p>
            <strong>현재 답변 성향</strong>
            <small>{tuningName}</small>
          </p>
          <b>예시</b>
        </div>
      </div>
      <div className="test-history">
        <div className="section-label">
          <strong>미리보기 기록</strong>
          <span>현재 세션 · 최근 8건</span>
        </div>
        {previewHistory.length === 0 && (
          <p>질문을 입력하면 완료된 미리보기가 기록됩니다.</p>
        )}
        {previewHistory.map((entry) => (
          <div className="history-table" key={entry.id}>
            <span>
              {new Date(entry.time).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <p>{entry.settings.testQuestion}</p>
            <strong>{entry.answer.length}자</strong>
            <i>{entry.supported ? "예시" : "미지원"}</i>
          </div>
        ))}
      </div>
      <div className="panel-footer">
        <button
          className="quiet-button"
          type="button"
          onClick={() => setStage(2)}
        >
          다이얼 다시 조정
        </button>
        <button
          className="primary-action"
          type="button"
          onClick={() => setStage(4)}
        >
          이 결과로 고객에게 전달 <span>→</span>
        </button>
      </div>
    </div>
  );
}
