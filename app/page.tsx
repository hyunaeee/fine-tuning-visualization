"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GoalId = "support" | "tone" | "extract";

const goals: Array<{
  id: GoalId;
  icon: string;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    id: "support",
    icon: "↗",
    title: "고객 문의 답변",
    description: "우리 서비스 정책에 맞춰 친절하게 답해요.",
    accent: "green",
  },
  {
    id: "tone",
    icon: "✦",
    title: "브랜드 문체 만들기",
    description: "어디서나 일관된 우리 브랜드 말투를 써요.",
    accent: "orange",
  },
  {
    id: "extract",
    icon: "⌘",
    title: "정보 자동 정리",
    description: "긴 문서에서 필요한 정보만 구조화해요.",
    accent: "purple",
  },
];

const samples: Record<GoalId, { input: string; output: string }> = {
  support: {
    input: "주문한 운동화 사이즈를 바꾸고 싶어요.",
    output:
      "물론이에요! 상품 수령 후 7일 안이라면 무료로 교환할 수 있어요. 주문 번호를 알려주시면 바로 도와드릴게요.",
  },
  tone: {
    input: "신제품 텀블러 출시 안내 문구를 작성해줘.",
    output:
      "매일 손이 가는 물건은, 가볍고 오래가야 하니까. 새로운 데일리 텀블러를 만나보세요.",
  },
  extract: {
    input: "미팅 기록에서 담당자, 마감일, 할 일을 정리해줘.",
    output: "담당자: 김하나 · 마감일: 8월 16일 · 할 일: 온보딩 초안 공유",
  },
};

const steps = ["목표 선택", "데이터", "학습 설정", "완료"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<GoalId>("support");
  const [fileName, setFileName] = useState("");
  const [exampleCount, setExampleCount] = useState(248);
  const [tone, setTone] = useState("친근하게");
  const [creativity, setCreativity] = useState(38);
  const [advanced, setAdvanced] = useState(false);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const studioRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!training || progress >= 100) return;

    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 4));
    }, 90);

    return () => window.clearInterval(timer);
  }, [training, progress]);

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === goal) ?? goals[0],
    [goal],
  );

  const qualityScore = Math.min(96, 72 + Math.round(exampleCount / 24));

  function startStudio() {
    setStep(0);
    studioRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function nextStep() {
    setStep((current) => Math.min(3, current + 1));
  }

  function previousStep() {
    setStep((current) => Math.max(0, current - 1));
  }

  function beginTraining() {
    setTraining(true);
    setProgress(8);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="모델리 홈">
          <span className="brand-mark">m</span>
          <span>모델리</span>
          <span className="beta">BETA</span>
        </a>
        <nav className="topnav" aria-label="주요 메뉴">
          <a href="#how">어떻게 작동하나요?</a>
          <a href="#examples">활용 사례</a>
          <button className="header-cta" type="button" onClick={startStudio}>
            무료로 시작
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> 코딩 없이 만드는 나만의 AI</p>
          <h1>
            내 데이터를 배우는 AI,
            <br />
            <span className="marker">복잡함 없이</span> 만들어요.
          </h1>
          <p className="hero-description">
            좋은 예시만 준비하세요. 모델 선택부터 학습 설정, 결과 확인까지
            모델리가 알기 쉬운 말과 화면으로 안내해 드려요.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={startStudio}>
              내 AI 만들어보기 <span aria-hidden="true">→</span>
            </button>
            <span className="helper-text">카드 등록 없이 · 첫 학습 무료</span>
          </div>
          <div className="proof-row" aria-label="서비스 특징">
            <div><strong>5분</strong><span>설정 완료</span></div>
            <div><strong>₩0</strong><span>첫 실험 비용</span></div>
            <div><strong>한국어</strong><span>가이드 제공</span></div>
          </div>
        </div>

        <section className="studio-card" ref={studioRef} aria-label="파인튜닝 만들기 체험">
          <div className="studio-topline">
            <div>
              <span className="window-dot dot-coral" />
              <span className="window-dot dot-yellow" />
              <span className="window-dot dot-green" />
            </div>
            <span className="autosave"><i /> 자동 저장됨</span>
          </div>

          <div className="step-tabs" aria-label="진행 단계">
            {steps.map((label, index) => (
              <button
                className={index === step ? "step-tab active" : index < step ? "step-tab done" : "step-tab"}
                key={label}
                type="button"
                onClick={() => setStep(index)}
                aria-current={index === step ? "step" : undefined}
              >
                <span>{index < step ? "✓" : index + 1}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="studio-body">
            <div className="stage-panel">
              {step === 0 && (
                <div className="stage-content">
                  <div className="stage-heading">
                    <span className="stage-number">01</span>
                    <div>
                      <p>먼저 알려주세요</p>
                      <h2>어떤 AI를 만들고 싶나요?</h2>
                    </div>
                  </div>
                  <div className="goal-list">
                    {goals.map((item) => (
                      <button
                        key={item.id}
                        className={goal === item.id ? `goal-card selected ${item.accent}` : `goal-card ${item.accent}`}
                        type="button"
                        onClick={() => setGoal(item.id)}
                        aria-pressed={goal === item.id}
                      >
                        <span className="goal-icon">{item.icon}</span>
                        <span className="goal-text">
                          <strong>{item.title}</strong>
                          <small>{item.description}</small>
                        </span>
                        <span className="radio-dot" />
                      </button>
                    ))}
                  </div>
                  <div className="tip-box">
                    <span>TIP</span>
                    <p>처음이라면 한 가지 일만 잘하는 AI부터 시작해 보세요.</p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="stage-content">
                  <div className="stage-heading">
                    <span className="stage-number">02</span>
                    <div>
                      <p>AI에게 예시를 보여주세요</p>
                      <h2>좋은 답변을 모아볼까요?</h2>
                    </div>
                  </div>
                  <label className={fileName ? "drop-zone has-file" : "drop-zone"}>
                    <input
                      type="file"
                      accept=".csv,.jsonl,.xlsx"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setFileName(file.name);
                          setExampleCount(312);
                        }
                      }}
                    />
                    <span className="upload-icon">↑</span>
                    <strong>{fileName || "파일을 놓거나 눌러서 선택하세요"}</strong>
                    <small>{fileName ? "312개의 예시를 찾았어요" : "CSV, JSONL, XLSX · 최대 20MB"}</small>
                  </label>
                  <div className="sample-block">
                    <div className="sample-head">
                      <strong>예시 미리보기</strong>
                      <span>{exampleCount}개 중 1개</span>
                    </div>
                    <div className="sample-pair">
                      <div><span>고객 입력</span><p>{samples[goal].input}</p></div>
                      <div><span>좋은 답변</span><p>{samples[goal].output}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="stage-content">
                  <div className="stage-heading">
                    <span className="stage-number">03</span>
                    <div>
                      <p>원하는 느낌을 정해주세요</p>
                      <h2>AI의 성격을 조절해 볼까요?</h2>
                    </div>
                  </div>
                  <div className="setting-group">
                    <div className="setting-label"><strong>답변 말투</strong><span>하나를 선택하세요</span></div>
                    <div className="segment-control">
                      {["정중하게", "친근하게", "간결하게"].map((item) => (
                        <button type="button" key={item} className={tone === item ? "active" : ""} onClick={() => setTone(item)}>{item}</button>
                      ))}
                    </div>
                  </div>
                  <div className="setting-group">
                    <div className="setting-label"><strong>창의성</strong><span>{creativity < 34 ? "정확하게" : creativity < 67 ? "균형 있게" : "다채롭게"}</span></div>
                    <input
                      className="range"
                      type="range"
                      min="0"
                      max="100"
                      value={creativity}
                      onChange={(event) => setCreativity(Number(event.target.value))}
                      aria-label="창의성"
                      style={{ "--range-value": `${creativity}%` } as React.CSSProperties}
                    />
                    <div className="range-labels"><span>사실 중심</span><span>표현 중심</span></div>
                  </div>
                  <button className="advanced-toggle" type="button" onClick={() => setAdvanced((value) => !value)} aria-expanded={advanced}>
                    <span>전문가 설정</span><span>{advanced ? "−" : "+"}</span>
                  </button>
                  {advanced && (
                    <div className="advanced-panel">
                      <label>기반 모델<select defaultValue="gpt-mini"><option value="gpt-mini">가볍고 빠른 모델</option><option value="gpt-pro">정교한 모델</option></select></label>
                      <label>학습 반복<select defaultValue="auto"><option value="auto">자동 추천</option><option value="3">3회</option><option value="5">5회</option></select></label>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="stage-content completion-stage">
                  <div className={progress === 100 ? "launch-orbit complete" : training ? "launch-orbit training" : "launch-orbit"}>
                    <span className="orbit-ring ring-one" />
                    <span className="orbit-ring ring-two" />
                    <span className="orbit-core">{progress === 100 ? "✓" : training ? `${progress}%` : "AI"}</span>
                  </div>
                  <p className="completion-kicker">모든 준비가 끝났어요</p>
                  <h2>{progress === 100 ? "나만의 AI가 완성됐어요!" : training ? "AI가 예시를 배우고 있어요" : "이제 AI를 학습시켜 볼까요?"}</h2>
                  <p className="completion-copy">
                    {progress === 100
                      ? "같은 질문에 기본 AI와 어떤 차이가 있는지 바로 비교해 보세요."
                      : training
                        ? "창을 닫아도 학습은 계속돼요. 완료되면 알려드릴게요."
                        : `${exampleCount}개의 예시를 사용해 약 12분 동안 학습합니다.`}
                  </p>
                  {training && <div className="progress-track" aria-label={`학습 진행률 ${progress}%`}><span style={{ width: `${progress}%` }} /></div>}
                  {!training && <button className="launch-button" type="button" onClick={beginTraining}>학습 시작하기 <span>→</span></button>}
                  {progress === 100 && <button className="launch-button" type="button" onClick={() => { setTraining(false); setProgress(0); }}>결과 비교하기 <span>→</span></button>}
                  <small className="safe-note">언제든 중단할 수 있고, 원본 데이터는 안전하게 보호돼요.</small>
                </div>
              )}
            </div>

            <aside className="status-panel">
              <div className="status-heading">
                <span>현재 준비 상태</span>
                <strong className={qualityScore > 84 ? "good" : ""}>{qualityScore > 84 ? "아주 좋아요" : "좋아요"}</strong>
              </div>
              <div className="score-block">
                <div className="score-ring" style={{ "--score": `${qualityScore * 3.6}deg` } as React.CSSProperties}>
                  <div><strong>{qualityScore}</strong><span>/ 100</span></div>
                </div>
                <p>지금 데이터면<br /><strong>안정적인 결과</strong>가 예상돼요.</p>
              </div>
              <div className="status-divider" />
              <dl className="summary-list">
                <div><dt>만들 AI</dt><dd>{selectedGoal.title}</dd></div>
                <div><dt>학습 예시</dt><dd>{exampleCount}개</dd></div>
                <div><dt>답변 말투</dt><dd>{tone}</dd></div>
                <div><dt>예상 시간</dt><dd>약 12분</dd></div>
                <div><dt>예상 비용</dt><dd><span className="free-badge">첫 학습 무료</span></dd></div>
              </dl>
              <div className="mini-preview">
                <div><span className="avatar">M</span><p>{samples[goal].output.slice(0, 58)}…</p></div>
                <small>내 AI 답변 미리보기</small>
              </div>
            </aside>
          </div>

          <div className="studio-footer">
            <button className="back-button" type="button" onClick={previousStep} disabled={step === 0}>← 이전</button>
            <span>{step + 1} / 4</span>
            {step < 3 && <button className="next-button" type="button" onClick={nextStep}>다음 단계 <span>→</span></button>}
          </div>
        </section>
      </section>

      <section className="how-section" id="how">
        <div className="section-intro">
          <p className="eyebrow"><span>●</span> 모델리가 쉬운 이유</p>
          <h2>전문 용어 대신,<br />눈에 보이는 과정으로.</h2>
        </div>
        <div className="feature-grid" id="examples">
          <article>
            <span className="feature-index">01</span>
            <div className="feature-visual visual-data"><i /><i /><i /></div>
            <h3>예시를 넣으면</h3>
            <p>복잡한 데이터 형식은 모델리가 알아서 확인하고 고쳐드려요.</p>
          </article>
          <article>
            <span className="feature-index">02</span>
            <div className="feature-visual visual-learn"><i /><i /><i /></div>
            <h3>배우는 과정이 보이고</h3>
            <p>현재 상태와 예상 결과를 쉬운 점수와 문장으로 알려드려요.</p>
          </article>
          <article>
            <span className="feature-index">03</span>
            <div className="feature-visual visual-compare"><i>기본</i><i>나의 AI</i></div>
            <h3>결과를 바로 비교해요</h3>
            <p>같은 질문에 달라진 답변을 나란히 보고 더 좋게 다듬어요.</p>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-wordmark">모델리</div>
        <p>누구나 자기만의 AI를 만들 수 있도록.</p>
        <button type="button" onClick={startStudio}>지금 시작하기 ↗</button>
      </footer>
    </main>
  );
}
