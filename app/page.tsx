"use client";

import { useEffect, useMemo, useState } from "react";

type GoalId = "support" | "brand" | "organize";
type AudienceId = "operator" | "web" | "developer" | "agency";

const goals: Array<{
  id: GoalId;
  title: string;
  description: string;
  prompt: string;
  example: string;
  answer: string;
}> = [
  {
    id: "support",
    title: "고객 문의에 답하는 AI",
    description: "정책과 말투를 익혀 반복 문의에 일관되게 답합니다.",
    prompt: "우리 쇼핑몰의 교환·환불 정책을 익혀서 고객 문의에 친절하게 답하는 AI를 만들고 싶어요.",
    example: "주문한 운동화 사이즈를 바꾸고 싶어요.",
    answer: "물론이에요. 상품 수령 후 7일 안이라면 무료 교환이 가능합니다. 주문 번호를 알려주시면 바로 도와드릴게요.",
  },
  {
    id: "brand",
    title: "브랜드 문체로 쓰는 AI",
    description: "캠페인과 상품 문구를 한결같은 목소리로 작성합니다.",
    prompt: "우리 브랜드의 차분하고 솔직한 말투를 익혀서 상품 소개 문구를 쓰는 AI를 만들고 싶어요.",
    example: "신제품 텀블러 출시 안내 문구를 작성해줘.",
    answer: "매일 손이 가는 물건은 가볍고 오래가야 하니까. 새로운 데일리 텀블러를 만나보세요.",
  },
  {
    id: "organize",
    title: "문서를 정리하는 AI",
    description: "긴 기록에서 담당자와 마감일, 할 일을 정확히 추출합니다.",
    prompt: "회의록에서 담당자, 마감일, 다음 할 일을 찾아 표로 정리하는 AI를 만들고 싶어요.",
    example: "이번 주 회의 기록에서 결정된 할 일을 정리해줘.",
    answer: "담당자: 김하나 · 마감일: 8월 16일 · 할 일: 온보딩 초안 공유",
  },
];

const stages = [
  { label: "목표", helper: "맡길 일을 설명해요" },
  { label: "예시", helper: "좋은 답변을 보여줘요" },
  { label: "조정", helper: "다이얼로 성향을 맞춰요" },
  { label: "실시간 검증", helper: "바꾸는 즉시 확인해요" },
  { label: "전달", helper: "고객에게 바로 넘겨요" },
];

const testQuestions: Record<GoalId, string[]> = {
  support: [
    "주문한 운동화 사이즈를 바꾸고 싶어요.",
    "상품을 환불하려면 어떻게 해야 하나요?",
    "배송이 아직 오지 않았어요.",
  ],
  brand: [
    "신제품 텀블러 출시 안내 문구를 작성해줘.",
    "여름 세일을 알리는 짧은 문구를 써줘.",
    "첫 구매 고객에게 보내는 환영 문구가 필요해.",
  ],
  organize: [
    "이번 주 회의 기록에서 결정된 할 일을 정리해줘.",
    "이 문서의 담당자와 마감일을 찾아줘.",
    "고객 인터뷰에서 반복된 요구사항을 요약해줘.",
  ],
};

const audiences: Record<AudienceId, {
  label: string;
  description: string;
  headline: string;
  detail: string;
  action: string;
  badge: string;
}> = {
  operator: {
    label: "실무 담당자",
    description: "개발 지식 없이 바로 사용",
    headline: "비공개 체험 링크",
    detail: "로그인 후 질문을 입력하고 결과를 확인하는 전용 페이지를 전달합니다.",
    action: "체험 링크 복사",
    badge: "가장 쉬운 전달",
  },
  web: {
    label: "웹사이트 운영팀",
    description: "홈페이지에 채팅으로 설치",
    headline: "웹 채팅 위젯",
    detail: "브랜드 색상과 환영 문구가 적용된 설치 코드와 운영 화면을 전달합니다.",
    action: "설치 패키지 만들기",
    badge: "웹사이트용",
  },
  developer: {
    label: "개발팀",
    description: "제품과 시스템에 연결",
    headline: "API 연결 정보",
    detail: "모델 ID, 인증 키 발급 안내, 요청 예시와 오류 처리 문서를 전달합니다.",
    action: "개발자 패키지 만들기",
    badge: "제품 연동용",
  },
  agency: {
    label: "고객사 납품",
    description: "완성 결과를 공식 인계",
    headline: "고객 인계 패키지",
    detail: "화이트라벨 체험 링크, 성능 보고서, 운영 가이드와 변경 이력을 한 번에 전달합니다.",
    action: "인계 패키지 만들기",
    badge: "에이전시·컨설턴트",
  },
};

export default function Home() {
  const [stage, setStage] = useState(0);
  const [goal, setGoal] = useState<GoalId>("support");
  const [prompt, setPrompt] = useState(goals[0].prompt);
  const [fileName, setFileName] = useState("");
  const [exampleCount, setExampleCount] = useState(84);
  const [policy, setPolicy] = useState(88);
  const [warmth, setWarmth] = useState(72);
  const [concision, setConcision] = useState(58);
  const [creativity, setCreativity] = useState(26);
  const [testQuestion, setTestQuestion] = useState(testQuestions.support[0]);
  const [verifying, setVerifying] = useState(false);
  const [audience, setAudience] = useState<AudienceId>("operator");
  const [copied, setCopied] = useState(false);
  const [bundleReady, setBundleReady] = useState(false);

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === goal) ?? goals[0],
    [goal],
  );

  useEffect(() => {
    setVerifying(true);
    const timer = window.setTimeout(() => setVerifying(false), 420);
    return () => window.clearTimeout(timer);
  }, [policy, warmth, concision, creativity, testQuestion]);

  const verification = useMemo(() => {
    const accuracy = Math.min(99, Math.round(58 + policy * 0.38 + (100 - creativity) * 0.06));
    const tone = Math.min(99, Math.round(52 + warmth * 0.47 + creativity * 0.04));
    const consistency = Math.min(99, Math.round(61 + policy * 0.24 + (100 - creativity) * 0.17));
    const safety = Math.min(100, Math.round(66 + policy * 0.37));
    return {
      accuracy,
      tone,
      consistency,
      safety,
      overall: Math.round((accuracy + tone + consistency + safety) / 4),
    };
  }, [policy, warmth, creativity]);

  const tuningName = useMemo(() => {
    const mode = policy >= 75 ? "규칙 준수형" : creativity >= 60 ? "표현 확장형" : "균형형";
    const task = goal === "support" ? "고객 응대" : goal === "brand" ? "브랜드 문체" : "문서 구조화";
    return `${mode} ${task} 파인튜닝`;
  }, [goal, policy, creativity]);

  const liveAnswer = useMemo(() => {
    const friendlyOpen = warmth >= 65 ? (warmth >= 85 ? "걱정하지 마세요. 바로 도와드릴게요. " : "물론이에요. ") : "";
    const friendlyClose = warmth >= 62 && concision < 78 ? " 필요한 내용을 알려주시면 이어서 도와드릴게요." : "";

    if (goal === "support") {
      if (testQuestion.includes("환불")) {
        const rule = policy >= 70 ? "상품 수령 후 7일 안이며 사용하지 않은 상태라면 환불할 수 있어요." : "환불 가능 여부를 확인해드릴게요.";
        return `${friendlyOpen}${rule}${concision < 70 ? " 주문 번호와 상품 상태를 알려주세요." : ""}${friendlyClose}`;
      }
      if (testQuestion.includes("배송")) {
        const rule = policy >= 70 ? "주문 내역의 배송 조회에서 현재 위치를 확인할 수 있어요." : "배송 상태를 확인해드릴게요.";
        return `${friendlyOpen}${rule}${concision < 70 ? " 주문 번호를 보내주시면 지연 여부도 함께 확인하겠습니다." : ""}${friendlyClose}`;
      }
      return `${friendlyOpen}${policy >= 70 ? "상품 수령 후 7일 안이라면 무료 교환이 가능합니다." : "사이즈 교환을 도와드릴게요."}${concision < 72 ? " 주문 번호와 원하는 사이즈를 알려주세요." : ""}${friendlyClose}`;
    }

    if (goal === "brand") {
      const lead = creativity >= 55 ? "매일의 장면을 조금 더 가볍게." : "매일 쓰기 좋은 제품을 소개합니다.";
      const body = concision >= 70 ? " 새로운 데일리 텀블러를 만나보세요." : " 가볍고 오래가는 새로운 데일리 텀블러를 지금 만나보세요.";
      return `${lead}${body}${warmth >= 75 ? " 당신의 하루에 자연스럽게 어울릴 거예요." : ""}`;
    }

    const format = policy >= 70
      ? "담당자: 김하나 · 마감일: 8월 16일 · 할 일: 온보딩 초안 공유"
      : "김하나 님이 8월 16일까지 온보딩 초안을 공유하기로 했습니다.";
    return concision >= 72 ? format : `${format}\n추가 확인: 디자인팀 검토 일정은 아직 정해지지 않았습니다.`;
  }, [goal, testQuestion, policy, warmth, concision, creativity]);

  const controls = [
    { label: "규칙 준수", value: policy, setter: setPolicy, low: "유연", high: "엄격", description: "회사 정책을 우선하는 정도" },
    { label: "친절한 말투", value: warmth, setter: setWarmth, low: "담백", high: "따뜻", description: "답변의 공감과 친근함" },
    { label: "간결함", value: concision, setter: setConcision, low: "자세히", high: "짧게", description: "답변 길이와 핵심 밀도" },
    { label: "표현 다양성", value: creativity, setter: setCreativity, low: "일관", high: "다양", description: "새로운 표현을 허용하는 정도" },
  ];

  function resetProject() {
    setStage(0);
    setGoal("support");
    setPrompt(goals[0].prompt);
    setFileName("");
    setExampleCount(84);
    setPolicy(88);
    setWarmth(72);
    setConcision(58);
    setCreativity(26);
    setTestQuestion(testQuestions.support[0]);
    setCopied(false);
    setBundleReady(false);
  }

  function chooseGoal(id: GoalId) {
    const item = goals.find((candidate) => candidate.id === id) ?? goals[0];
    setGoal(id);
    setPrompt(item.prompt);
    setTestQuestion(testQuestions[id][0]);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://modely.ai/demo/customer-support-v1");
    } catch {
      // The UI still confirms what would be included in this product prototype.
    }
    setCopied(true);
  }

  function createBundle() {
    setBundleReady(true);
    if (audience === "operator") void copyLink();
  }

  return (
    <main className="app-frame">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-glyph">✳</span>
          <strong>modely</strong>
        </div>

        <button className="new-project" type="button" onClick={resetProject}>
          <span>＋</span> 새 AI 만들기
        </button>

        <nav className="sidebar-nav" aria-label="워크스페이스 메뉴">
          <button className="nav-item active" type="button"><span>⌂</span> 만들기</button>
          <button className="nav-item" type="button" onClick={() => setStage(4)}><span>↗</span> 전달함 <i>2</i></button>
          <button className="nav-item" type="button"><span>◫</span> 사용 기록</button>
        </nav>

        <div className="sidebar-section">
          <p>프로젝트</p>
          <button className="project-row selected" type="button" onClick={() => { chooseGoal("support"); setStage(Math.max(stage, 1)); }}>
            <span className="project-icon">CS</span>
            <span><strong>고객 응대 AI</strong><small>방금 수정됨</small></span>
            <i className="project-status ready" />
          </button>
          <button className="project-row" type="button" onClick={() => { chooseGoal("brand"); setStage(1); }}>
            <span className="project-icon">BR</span>
            <span><strong>브랜드 카피</strong><small>초안</small></span>
            <i className="project-status" />
          </button>
        </div>

        <div className="sidebar-spacer" />
        <div className="plan-card">
          <div><span>이번 달 사용량</span><strong>18%</strong></div>
          <div className="plan-track"><i /></div>
          <small>첫 번째 실제 학습까지 무료</small>
        </div>
        <button className="profile-row" type="button">
          <span className="profile-avatar">M</span>
          <span><strong>My workspace</strong><small>개인 워크스페이스</small></span>
          <i>⋯</i>
        </button>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div className="mobile-brand"><span>✳</span> modely</div>
          <div className="breadcrumbs">
            <span>개인 워크스페이스</span><i>/</i><strong>{stage === 0 ? "새 AI" : selectedGoal.title}</strong>
          </div>
          <div className="header-actions">
            <span className="demo-label"><i /> 제품 데모</span>
            <button className="share-button" type="button" onClick={() => setStage(4)}>전달하기 <span>↗</span></button>
          </div>
        </header>

        <div className="workspace-scroll">
          {stage === 0 ? (
            <section className="start-view">
              <div className="codex-orb" aria-hidden="true"><i /><i /><i /></div>
              <p className="overline">FINE-TUNING WORKSPACE</p>
              <h1>어떤 일을 맡길 AI가 필요한가요?</h1>
              <p className="lead">파인튜닝이나 모델을 몰라도 괜찮아요.<br />평소 동료에게 설명하듯 원하는 결과를 적어주세요.</p>

              <form className="prompt-box" onSubmit={(event) => { event.preventDefault(); if (prompt.trim()) setStage(1); }}>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  aria-label="만들고 싶은 AI 설명"
                  placeholder="예: 우리 쇼핑몰 정책에 맞춰 고객 문의에 답하는 AI를 만들고 싶어요."
                />
                <div className="prompt-footer">
                  <div><button type="button" aria-label="파일 첨부">＋</button><span>한국어로 편하게 설명하세요</span></div>
                  <button className="send-button" type="submit" aria-label="설명 제출">↑</button>
                </div>
              </form>

              <div className="suggestion-row" aria-label="빠른 시작 예시">
                {goals.map((item) => (
                  <button key={item.id} type="button" onClick={() => chooseGoal(item.id)} className={goal === item.id ? "active" : ""}>
                    {item.title}
                  </button>
                ))}
              </div>

              <div className="start-explainer">
                <div className="explainer-title"><span>이후에는 이렇게 진행돼요</span><small>각 단계마다 모델리가 설명합니다</small></div>
                <div className="explainer-grid">
                  <article><span>01</span><strong>좋은 예시를 모아요</strong><p>질문과 기대 답변을 올리면 형식과 품질을 자동으로 확인해요.</p></article>
                  <article><span>02</span><strong>다이얼로 맞추고 바로 시험해요</strong><p>규칙, 말투, 길이를 조절할 때마다 답변과 검증 점수가 즉시 바뀌어요.</p></article>
                  <article><span>03</span><strong>쓸 수 있는 형태로 전달해요</strong><p>링크, 웹 위젯, API, 인계 문서 중 고객에게 맞는 형태로 만들어요.</p></article>
                </div>
              </div>
            </section>
          ) : (
            <section className="project-view">
              <div className="project-titlebar">
                <div>
                  <span className="project-kicker">PROJECT / {String(stage).padStart(2, "0")}</span>
                  <h1>{selectedGoal.title}</h1>
                  <p>{selectedGoal.description}</p>
                </div>
                <div className="project-meta"><span className="live-dot" /> 자동 저장됨</div>
              </div>

              <div className="stage-rail" aria-label="파인튜닝 진행 단계">
                {stages.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className={index === stage ? "current" : index < stage ? "complete" : ""}
                    onClick={() => setStage(index)}
                    aria-current={index === stage ? "step" : undefined}
                  >
                    <span>{index < stage ? "✓" : index + 1}</span>
                    <div><strong>{item.label}</strong><small>{item.helper}</small></div>
                  </button>
                ))}
              </div>

              <div className="project-layout">
                <div className="primary-panel">
                  {stage === 1 && (
                    <div className="panel-content">
                      <div className="assistant-note">
                        <span className="assistant-mark">✳</span>
                        <div><strong>무엇을 준비하면 되나요?</strong><p>실제 고객 질문과 그때 들려주고 싶은 좋은 답변을 한 쌍으로 모아주세요. 50개부터 시작할 수 있고, 200개 이상이면 더 안정적이에요.</p></div>
                      </div>

                      <div className="panel-heading">
                        <div><span>STEP 1 · EXAMPLES</span><h2>AI에게 좋은 답변을 보여주세요</h2></div>
                        <span className="plain-badge">전문 지식 불필요</span>
                      </div>

                      <label className={fileName ? "upload-card uploaded" : "upload-card"}>
                        <input type="file" accept=".csv,.xlsx,.jsonl" onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) { setFileName(file.name); setExampleCount(312); }
                        }} />
                        <span className="upload-symbol">＋</span>
                        <div><strong>{fileName || "파일을 선택하거나 여기로 끌어오세요"}</strong><small>{fileName ? "312개의 질문·답변 쌍을 찾았습니다" : "엑셀, CSV, JSONL · 최대 20MB"}</small></div>
                        <span className="upload-action">{fileName ? "다시 선택" : "파일 선택"}</span>
                      </label>

                      <div className="data-status">
                        <div><span className="status-icon ok">✓</span><strong>{exampleCount}개</strong><small>사용할 수 있는 예시</small></div>
                        <div><span className="status-icon fix">↻</span><strong>{fileName ? "7개" : "0개"}</strong><small>자동으로 형식 수정</small></div>
                        <div><span className="status-icon safe">◇</span><strong>0개</strong><small>민감정보 발견</small></div>
                      </div>

                      <div className="example-preview">
                        <div className="section-label"><strong>예시가 이렇게 읽혀요</strong><span>{exampleCount}개 중 1개</span></div>
                        <div className="conversation-pair">
                          <div><span>고객이 묻는 말</span><p>{selectedGoal.example}</p></div>
                          <div><span>AI가 배울 좋은 답변</span><p>{selectedGoal.answer}</p></div>
                        </div>
                      </div>

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(0)}>이전</button><button className="primary-action" type="button" onClick={() => setStage(2)}>튜닝 콘솔 열기 <span>→</span></button></div>
                    </div>
                  )}

                  {stage === 2 && (
                    <div className="panel-content console-content">
                      <div className="assistant-note">
                        <span className="assistant-mark">✳</span>
                        <div><strong>기계의 다이얼을 맞추듯 조정하세요</strong><p>숫자를 몰라도 괜찮아요. 다이얼을 움직이면 예상 답변과 검증 계기판이 즉시 반응합니다. 만족스러운 지점에서 설정을 고정하면 돼요.</p></div>
                      </div>

                      <div className="panel-heading">
                        <div><span>STEP 2 · TUNING CONSOLE</span><h2>AI의 행동을 직접 조율하세요</h2></div>
                        <span className={verifying ? "live-badge checking" : "live-badge"}><i /> {verifying ? "재계산 중" : "LIVE"}</span>
                      </div>

                      <div className="machine-console">
                        <div className="machine-topbar">
                          <span className="machine-screw" />
                          <div><strong>MODELY / BEHAVIOR CONSOLE</strong><small>조작값이 오른쪽 출력에 바로 반영됩니다</small></div>
                          <div className="machine-lights"><i /><i /><i /></div>
                          <span className="machine-screw" />
                        </div>

                        <div className="dial-bank">
                          {controls.map((control) => (
                            <label className="control-dial" key={control.label}>
                              <span className="dial-label">{control.label}</span>
                              <div className="knob" style={{ "--dial-angle": `${-132 + control.value * 2.64}deg` } as React.CSSProperties}>
                                <span className="knob-ticks" />
                                <span className="knob-face"><i /><strong>{control.value}</strong></span>
                              </div>
                              <input type="range" min="0" max="100" value={control.value} onChange={(event) => control.setter(Number(event.target.value))} aria-label={control.label} />
                              <span className="dial-scale"><i>{control.low}</i><i>{control.high}</i></span>
                              <small>{control.description}</small>
                            </label>
                          ))}
                        </div>

                        <div className="machine-lower">
                          <div className="learning-modules">
                            <div className="machine-section-title"><span>LEARNING CHANNELS</span><small>무엇을 학습하나요?</small></div>
                            <div className="switch-row"><span className="toggle-switch on"><i /></span><p><strong>회사 규칙과 판단 기준</strong><small>교환·환불처럼 반복되는 정책</small></p><b>{policy}%</b></div>
                            <div className="switch-row"><span className="toggle-switch on"><i /></span><p><strong>말투와 표현 패턴</strong><small>인사, 공감, 문장 마무리 방식</small></p><b>{warmth}%</b></div>
                            <div className="switch-row"><span className="toggle-switch on"><i /></span><p><strong>답변의 구조와 길이</strong><small>순서, 항목, 간결한 정도</small></p><b>{concision}%</b></div>
                            <div className="switch-row disabled"><span className="toggle-switch"><i /></span><p><strong>새로운 사실과 최신 지식</strong><small>파인튜닝보다 지식 검색 연결이 적합</small></p><b>OFF</b></div>
                          </div>

                          <div className="signal-display">
                            <div className="machine-section-title"><span>TUNING EFFECT</span><small>현재 만들어지는 성향</small></div>
                            <div className="signal-name"><span>PROFILE</span><strong>{tuningName}</strong></div>
                            <div className="signal-bars">
                              <div><span>RULES</span><i><b style={{ width: `${policy}%` }} /></i></div>
                              <div><span>TONE</span><i><b style={{ width: `${warmth}%` }} /></i></div>
                              <div><span>FORMAT</span><i><b style={{ width: `${concision}%` }} /></i></div>
                              <div><span>VARIETY</span><i><b style={{ width: `${creativity}%` }} /></i></div>
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

                      <div className="instant-preview">
                        <div className="preview-terminal-head"><span><i /> INSTANT PREVIEW</span><small>{verifying ? "설정 반영 중…" : "0.2초 전 검증됨"}</small></div>
                        <div className="preview-terminal-body"><span>TEST INPUT</span><p>{testQuestion}</p><span>TUNED OUTPUT</span><strong>{liveAnswer}</strong></div>
                        <div className="preview-score"><span>예상 검증 점수</span><strong>{verification.overall}</strong><i><b style={{ width: `${verification.overall}%` }} /></i></div>
                      </div>

                      <div className="fine-tune-explainer">
                        <span>이 파인튜닝의 효과</span>
                        <p>새로운 지식을 외우게 하기보다, <strong>같은 상황에서 회사가 원하는 방식으로 판단하고 말하는 패턴</strong>을 반복해서 익히게 합니다.</p>
                      </div>

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(1)}>이전</button><button className="primary-action" type="button" onClick={() => setStage(3)}>이 설정으로 실시간 테스트 <span>→</span></button></div>
                    </div>
                  )}

                  {stage === 3 && (
                    <div className="panel-content test-lab-content">
                      <div className="assistant-note success-note">
                        <span className="assistant-mark">↻</span>
                        <div><strong>질문이나 다이얼을 바꾸면 즉시 다시 검사합니다</strong><p>저장 버튼이나 새 학습을 기다릴 필요 없이, 바뀐 답변과 정확성·말투·안전성 점수를 같은 화면에서 바로 확인하세요.</p></div>
                      </div>

                      <div className="panel-heading">
                        <div><span>STEP 3 · LIVE TEST BENCH</span><h2>바꿔보고, 바로 검증하세요</h2></div>
                        <span className={verifying ? "score-pill verifying" : "score-pill"}>{verifying ? "검사 중" : `${verification.overall} / 100`}</span>
                      </div>

                      <div className="test-bench">
                        <div className="bench-topbar"><span className="machine-screw" /><strong>LIVE EVALUATION UNIT</strong><div><i className={verifying ? "blink" : ""} /> {verifying ? "RUNNING" : "VERIFIED"}</div><span className="machine-screw" /></div>

                        <div className="bench-controls">
                          <div className="test-input-area">
                            <label htmlFor="live-test-question">TEST INPUT / 질문을 바꿔보세요</label>
                            <textarea id="live-test-question" value={testQuestion} onChange={(event) => setTestQuestion(event.target.value)} />
                            <div className="test-presets">
                              {testQuestions[goal].map((question, index) => <button key={question} type="button" className={testQuestion === question ? "active" : ""} onClick={() => setTestQuestion(question)}>테스트 {index + 1}</button>)}
                            </div>
                          </div>
                          <div className="mini-controls">
                            {controls.map((control) => (
                              <label key={control.label}><span>{control.label}</span><input type="range" min="0" max="100" value={control.value} onChange={(event) => control.setter(Number(event.target.value))} /><strong>{control.value}</strong></label>
                            ))}
                          </div>
                        </div>

                        <div className="live-output-grid">
                          <article className="live-response">
                            <header><span>TUNED OUTPUT</span><small>modely / {goal}-v1</small></header>
                            <p className={verifying ? "updating" : ""}>{liveAnswer}</p>
                            <footer><span className="response-type">{tuningName}</span><span>{liveAnswer.length}자</span></footer>
                          </article>

                          <aside className="validation-meter">
                            <div className="meter-score"><span>LIVE SCORE</span><strong>{verification.overall}</strong><small>/ 100</small></div>
                            <div className="meter-list">
                              <div><span>정확성</span><i><b style={{ width: `${verification.accuracy}%` }} /></i><strong>{verification.accuracy}</strong></div>
                              <div><span>말투</span><i><b style={{ width: `${verification.tone}%` }} /></i><strong>{verification.tone}</strong></div>
                              <div><span>일관성</span><i><b style={{ width: `${verification.consistency}%` }} /></i><strong>{verification.consistency}</strong></div>
                              <div><span>안전성</span><i><b style={{ width: `${verification.safety}%` }} /></i><strong>{verification.safety}</strong></div>
                            </div>
                          </aside>
                        </div>
                      </div>

                      <div className="verification-grid">
                        <div><span className="check-led pass" /><p><strong>회사 규칙 반영</strong><small>{policy >= 70 ? "교환·환불 기준이 정확히 포함됨" : "규칙 강도를 조금 높이는 것을 추천"}</small></p><b>{policy >= 70 ? "PASS" : "CHECK"}</b></div>
                        <div><span className="check-led pass" /><p><strong>말투 일치</strong><small>{warmth >= 65 ? "친절한 인사와 도움 제안이 포함됨" : "현재는 담백하고 직접적인 말투"}</small></p><b>PASS</b></div>
                        <div><span className={creativity > 65 ? "check-led warn" : "check-led pass"} /><p><strong>답변 일관성</strong><small>{creativity > 65 ? "표현 변화가 커질 수 있어요" : "질문이 달라도 같은 기준을 유지함"}</small></p><b>{creativity > 65 ? "WATCH" : "PASS"}</b></div>
                      </div>

                      <div className="test-history">
                        <div className="section-label"><strong>자동 테스트 기록</strong><span>변경할 때마다 한 줄씩 기록돼요</span></div>
                        <div className="history-table"><span>방금</span><p>{testQuestion}</p><strong>{verification.overall}점</strong><i>통과</i></div>
                        <div className="history-table muted"><span>2분 전</span><p>{testQuestions[goal][1]}</p><strong>{Math.max(0, verification.overall - 3)}점</strong><i>통과</i></div>
                      </div>

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(2)}>다이얼 다시 조정</button><button className="primary-action" type="button" onClick={() => setStage(4)}>이 결과로 고객에게 전달 <span>→</span></button></div>
                    </div>
                  )}

                  {stage === 4 && (
                    <div className="panel-content delivery-content">
                      <div className="assistant-note">
                        <span className="assistant-mark">✳</span>
                        <div><strong>결과물은 받는 사람에 맞춰야 해요</strong><p>AI 모델 하나만 넘기지 않습니다. 실제로 써볼 방법, 성능 근거, 운영 방법을 함께 전달해야 고객이 바로 사용할 수 있어요.</p></div>
                      </div>

                      <div className="panel-heading delivery-heading">
                        <div><span>STEP 4 · HANDOFF</span><h2>누가 이 AI를 사용하게 되나요?</h2></div>
                        <span className="plain-badge">전달 센터</span>
                      </div>

                      <div className="audience-tabs" role="tablist" aria-label="결과물을 받을 고객 유형">
                        {(Object.keys(audiences) as AudienceId[]).map((id) => (
                          <button key={id} type="button" role="tab" aria-selected={audience === id} className={audience === id ? "selected" : ""} onClick={() => { setAudience(id); setBundleReady(false); setCopied(false); }}>
                            <strong>{audiences[id].label}</strong><small>{audiences[id].description}</small>
                          </button>
                        ))}
                      </div>

                      <div className="delivery-card">
                        <div className="delivery-card-top"><span className="delivery-icon">↗</span><span className="delivery-badge">{audiences[audience].badge}</span></div>
                        <h3>{audiences[audience].headline}</h3>
                        <p>{audiences[audience].detail}</p>
                        {audience === "operator" && <div className="link-preview"><span>modely.ai/demo/</span><strong>customer-support-v1</strong><button type="button" onClick={copyLink}>{copied ? "복사됨 ✓" : "복사"}</button></div>}
                        {audience === "web" && <div className="code-preview"><span>&lt;script</span> src=&quot;modely.ai/widget.js&quot; data-model=&quot;cs-v1&quot;<span>&gt;&lt;/script&gt;</span></div>}
                        {audience === "developer" && <div className="code-preview"><span>POST</span> https://api.modely.ai/v1/respond <i>model: cs-v1</i></div>}
                        {audience === "agency" && <div className="handoff-preview"><span>ZIP</span><div><strong>고객사명_AI_인계패키지</strong><small>체험 링크 · 보고서 · 운영 문서 · 변경 이력</small></div></div>}
                      </div>

                      <div className="universal-package">
                        <div className="section-label"><strong>모든 고객에게 기본으로 전달</strong><span>누락 없이 자동 구성</span></div>
                        <div className="package-list">
                          <div><span>✓</span><p><strong>AI 사용 방법</strong><small>할 수 있는 일과 질문 예시</small></p></div>
                          <div><span>✓</span><p><strong>성능 검증 보고서</strong><small>정확성·말투·안전성 점수</small></p></div>
                          <div><span>✓</span><p><strong>주의사항과 금지 예시</strong><small>잘못 쓰기 쉬운 상황 안내</small></p></div>
                          <div><span>✓</span><p><strong>버전과 변경 이력</strong><small>언제 무엇이 달라졌는지 기록</small></p></div>
                          <div><span>✓</span><p><strong>운영·문의 안내</strong><small>담당자와 업데이트 방법</small></p></div>
                        </div>
                      </div>

                      {bundleReady && <div className="bundle-success"><span>✓</span><div><strong>전달 패키지가 준비됐습니다</strong><small>{audiences[audience].label}에게 바로 보낼 수 있어요.</small></div><button type="button">미리보기</button></div>}

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(3)}>결과로 돌아가기</button><button className="primary-action" type="button" onClick={createBundle}>{bundleReady ? "전달 패키지 다시 만들기" : audiences[audience].action} <span>↗</span></button></div>
                    </div>
                  )}
                </div>

                <aside className="context-panel">
                  <p className="context-title">PROJECT CONTEXT</p>
                  <div className="context-block"><span>목표</span><strong>{selectedGoal.title}</strong><p>{prompt}</p></div>
                  <div className="context-divider" />
                  <dl className="context-list">
                    <div><dt>예시 데이터</dt><dd>{exampleCount}개</dd></div>
                    <div><dt>품질 상태</dt><dd className="positive">좋음</dd></div>
                    <div><dt>튜닝 유형</dt><dd>{policy >= 75 ? "규칙 준수형" : "균형형"}</dd></div>
                    <div><dt>현재 버전</dt><dd>v1</dd></div>
                    <div><dt>검증 점수</dt><dd>{stage >= 2 ? `${verification.overall} / 100` : "대기 중"}</dd></div>
                  </dl>
                  <div className="context-divider" />
                  <div className="stage-explanation"><span>지금 하는 일</span><strong>{stages[stage].label}</strong><p>{stages[stage].helper}. 완료하면 다음 단계로 이어집니다.</p></div>
                  {stage === 4 && <div className="handoff-rule"><span>전달 원칙</span><p>고객은 모델이 아니라 <strong>바로 쓸 수 있는 결과</strong>를 받아야 합니다.</p></div>}
                </aside>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
