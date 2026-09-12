import type { StudioController } from "../hooks/use-studio";
import { goals } from "../data/catalog";
type Props = Pick<
  StudioController,
  | "prompt"
  | "setPrompt"
  | "setStage"
  | "goal"
  | "chooseGoal"
  | "selectedGoal"
  | "selectedOutcome"
>;
export function StartView({
  prompt,
  setPrompt,
  setStage,
  goal,
  chooseGoal,
  selectedGoal,
  selectedOutcome,
}: Props) {
  return (
    <section className="start-view">
      <div className="codex-orb" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p className="overline">FINE-TUNING WORKSPACE</p>
      <h1>어떤 일을 맡길 AI가 필요한가요?</h1>
      <p className="lead">
        파인튜닝이나 모델을 몰라도 괜찮아요.
        <br />
        평소 동료에게 설명하듯 원하는 결과를 적어주세요.
      </p>

      <form
        className="prompt-box"
        onSubmit={(event) => {
          event.preventDefault();
          if (prompt.trim()) setStage(1);
        }}
      >
        <textarea
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
            <span>한국어로 편하게 설명하세요</span>
          </div>
          <button className="send-button" type="submit" aria-label="설명 제출">
            ↑
          </button>
        </div>
      </form>

      <div className="suggestion-row" aria-label="빠른 시작 예시">
        {goals.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => chooseGoal(item.id)}
            className={goal === item.id ? "active" : ""}
          >
            {item.title}
          </button>
        ))}
      </div>

      <section className="io-showcase" aria-labelledby="io-showcase-title">
        <div className="showcase-heading">
          <div>
            <span>INPUT → OUTPUT</span>
            <h2 id="io-showcase-title">무엇을 넣고, 무엇을 받나요?</h2>
          </div>
          <small>선택한 목적에 따라 아래 예시가 바뀝니다</small>
        </div>

        <div className="io-pipeline">
          <article className="io-card input-card">
            <div className="io-card-head">
              <span>01 / INPUT</span>
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
            <small>모델 선택 · 레시피 조정 · 검증</small>
            <i>→</i>
          </div>

          <article className="io-card output-card">
            <div className="io-card-head">
              <span>02 / OUTPUT</span>
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
            <span>BEFORE → AFTER</span>
            <h2 id="outcome-showcase-title">실제 사용하면 이렇게 달라집니다</h2>
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
