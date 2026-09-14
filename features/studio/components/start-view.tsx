import type { StudioController } from "../hooks/use-studio";
import { goals } from "../data/catalog";
import { WelcomeMachine } from "./welcome-machine";
type Props = Pick<
  StudioController,
  | "prompt"
  | "setPrompt"
  | "setStage"
  | "goal"
  | "chooseGoal"
  | "selectedGoal"
  | "selectedOutcome"
  | "controls"
  | "liveAnswer"
  | "verifying"
>;
export function StartView({
  prompt,
  setPrompt,
  setStage,
  goal,
  chooseGoal,
  selectedGoal,
  selectedOutcome,
  controls,
  liveAnswer,
  verifying,
}: Props) {
  return (
    <section className="start-view">
      <div className="welcome-hero">
        <div className="welcome-copy">
          <p className="welcome-eyebrow">
            <span>✦</span> 누구나 만드는 나만의 AI
          </p>
          <h1>
            내 일에 딱 맞는 AI,
            <br />
            <em>내 손으로 가볍게.</em>
          </h1>
          <p className="lead">
            어려운 코드는 모델리에게 맡기세요.
            <br />할 일을 고르고, 말투를 맞추고, 답변을 확인하면 돼요.
          </p>

          <div
            className="suggestion-row"
            role="group"
            aria-label="빠른 시작 예시"
          >
            {goals.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseGoal(item.id)}
                aria-pressed={goal === item.id}
                className={goal === item.id ? "active" : ""}
              >
                <span
                  className={"goal-token goal-token-" + item.id}
                  aria-hidden="true"
                >
                  {["☏", "✎", "▤"][index]}
                </span>
                <span>
                  <strong>
                    {
                      ["고객 문의 답변", "우리 브랜드 글쓰기", "긴 문서 정리"][
                        index
                      ]
                    }
                  </strong>
                  <small>
                    {
                      [
                        "친절하고 일관된 응대",
                        "우리다운 말투와 표현",
                        "핵심만 쏙, 빠짐없이",
                      ][index]
                    }
                  </small>
                </span>
                <i aria-hidden="true">{goal === item.id ? "✓" : ""}</i>
              </button>
            ))}
          </div>

          <form
            className="prompt-box"
            onSubmit={(event) => {
              event.preventDefault();
              if (prompt.trim()) setStage(1);
            }}
          >
            <label htmlFor="project-prompt">어떤 일을 맡기고 싶나요?</label>
            <textarea
              id="project-prompt"
              value={prompt}
              maxLength={2000}
              onChange={(event) => setPrompt(event.target.value)}
              aria-label="만들고 싶은 AI 설명"
              placeholder="예: 우리 쇼핑몰 정책에 맞춰 고객 문의에 답하는 AI를 만들고 싶어요."
            />
            <div className="prompt-footer">
              <div>
                <button
                  type="button"
                  aria-label="파일 선택 단계로 이동"
                  onClick={() => setStage(1)}
                >
                  ＋
                </button>
                <span>예시를 그대로 써도 좋아요</span>
              </div>
              <button
                className="send-button"
                type="submit"
                disabled={!prompt.trim()}
              >
                내 AI 만들기 <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
          <p className="welcome-reassurance">
            ✓ 설치 없이 체험 <span>✓ 준비된 예시 제공</span> ✓ 언제든 다시 조절
          </p>
        </div>
        <WelcomeMachine
          controls={controls}
          liveAnswer={liveAnswer}
          verifying={verifying}
          selectedGoal={selectedGoal}
        />
      </div>

      <div className="welcome-path" aria-label="간단한 사용 순서">
        {[
          ["1", "할 일을 골라요", "어떤 도움이 필요한가요?"],
          ["2", "내 취향으로 조절해요", "말투와 답변 길이를 맞춰요"],
          ["3", "확인하고 보관해요", "마음에 들면 레시피로 저장"],
        ].map(([number, title, text]) => (
          <div key={number}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
            <i aria-hidden="true">→</i>
          </div>
        ))}
      </div>

      <section className="io-showcase" aria-labelledby="io-showcase-title">
        <div className="showcase-heading">
          <div>
            <span>준비부터 결과까지</span>
            <h2 id="io-showcase-title">무엇을 넣고, 무엇을 받나요?</h2>
          </div>
          <small>선택한 목적에 따라 아래 예시가 바뀝니다</small>
        </div>

        <div className="io-pipeline">
          <article className="io-card input-card">
            <div className="io-card-head">
              <span>01 / 준비할 것</span>
              <strong>내 업무를 설명하는 재료</strong>
            </div>
            <div className="input-prompt-sample">
              <span>하고 싶은 일</span>
              <p>{selectedGoal.prompt}</p>
            </div>
            <ul>
              {selectedOutcome.inputAssets.map((asset) => (
                <li key={asset}>
                  <span>＋</span>
                  {asset}
                </li>
              ))}
            </ul>
          </article>

          <div
            className="pipeline-engine"
            aria-label="모델리가 입력을 처리해 출력으로 변환"
          >
            <span>✳</span>
            <strong>MODELY</strong>
            <small>고르고 · 맞추고 · 확인하고</small>
            <i>→</i>
          </div>

          <article className="io-card output-card">
            <div className="io-card-head">
              <span>02 / 받을 것</span>
              <strong>바로 사용할 수 있는 결과물</strong>
            </div>
            <div className="output-answer-sample">
              <span>AI 답변 예시</span>
              <p>{selectedGoal.answer}</p>
              <small>
                <i /> 예시 답변 · 실제 모델 호출 없음
              </small>
            </div>
            <ul>
              {selectedOutcome.outputs.map((output) => (
                <li key={output}>
                  <span>✓</span>
                  {output}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section
        className="outcome-showcase"
        aria-labelledby="outcome-showcase-title"
      >
        <div className="showcase-heading">
          <div>
            <span>사용 모습 미리보기</span>
            <h2 id="outcome-showcase-title">내가 원하는 답변에 더 가까이</h2>
          </div>
          <small>제품 데모의 가상 시나리오 · 실측 성과가 아닙니다</small>
        </div>

        <div
          className="outcome-tabs"
          role="group"
          aria-label="사용 결과 예시 선택"
        >
          {goals.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={goal === item.id}
              className={goal === item.id ? "selected" : ""}
              onClick={() => chooseGoal(item.id)}
            >
              <span>
                {item.id === "support"
                  ? "CS"
                  : item.id === "brand"
                    ? "BR"
                    : "DOC"}
              </span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </div>
            </button>
          ))}
        </div>

        <div className="result-comparison">
          <article className="result-before">
            <header>
              <span>BEFORE</span>
              <small>기본 AI 답변</small>
            </header>
            <p>{selectedOutcome.before}</p>
            <footer>
              <i>!</i> 회사 기준과 결과 형식이 매번 달라질 수 있어요
            </footer>
          </article>
          <article className="result-after">
            <header>
              <span>AFTER</span>
              <small>레시피 적용 답변</small>
            </header>
            <p>{selectedGoal.answer}</p>
            <footer>
              <i>✓</i> 원하는 규칙·말투·형식을 반복해서 유지해요
            </footer>
          </article>
        </div>

        <div className="usage-result">
          <div className="usage-copy">
            <span>사용 결과</span>
            <strong>{selectedOutcome.workflowResult}</strong>
          </div>
          <div className="result-metrics">
            {selectedOutcome.metrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <p>
                  <del>{metric.before}</del>
                  <i>→</i>
                  <strong>{metric.after}</strong>
                </p>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setStage(1)}>
            이 예시로 시작하기 <span>→</span>
          </button>
        </div>
      </section>

      <div className="start-explainer">
        <div className="explainer-title">
          <span>이후에는 이렇게 진행돼요</span>
          <small>각 단계마다 모델리가 설명합니다</small>
        </div>
        <div className="explainer-grid">
          <article>
            <span>01</span>
            <strong>좋은 예시를 모아요</strong>
            <p>질문과 기대 답변의 샘플을 보고 필요한 자료를 이해해요.</p>
          </article>
          <article>
            <span>02</span>
            <strong>모델을 고르고 레시피로 저장해요</strong>
            <p>
              목적별 추천 모델을 고른 뒤 규칙, 말투, 길이를 맞춰 다시 쓸 수 있는
              레시피로 보관해요.
            </p>
          </article>
          <article>
            <span>03</span>
            <strong>쓸 수 있는 형태로 전달해요</strong>
            <p>공유 링크와 설정 파일을 만들고, 고객별 전달 방식을 살펴봐요.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
