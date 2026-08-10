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
  { label: "학습", helper: "AI가 패턴을 배워요" },
  { label: "검증", helper: "전후 결과를 비교해요" },
  { label: "전달", helper: "고객에게 바로 넘겨요" },
];

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
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [advanced, setAdvanced] = useState(false);
  const [audience, setAudience] = useState<AudienceId>("operator");
  const [copied, setCopied] = useState(false);
  const [bundleReady, setBundleReady] = useState(false);

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === goal) ?? goals[0],
    [goal],
  );

  useEffect(() => {
    if (!training || progress >= 100) return;
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 4));
    }, 90);
    return () => window.clearInterval(timer);
  }, [training, progress]);

  function resetProject() {
    setStage(0);
    setGoal("support");
    setPrompt(goals[0].prompt);
    setFileName("");
    setExampleCount(84);
    setTraining(false);
    setProgress(0);
    setCopied(false);
    setBundleReady(false);
  }

  function chooseGoal(id: GoalId) {
    const item = goals.find((candidate) => candidate.id === id) ?? goals[0];
    setGoal(id);
    setPrompt(item.prompt);
  }

  function startTraining() {
    setTraining(true);
    setProgress(8);
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
          <button className="project-row selected" type="button" onClick={() => { setGoal("support"); setStage(Math.max(stage, 1)); }}>
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
                  <article><span>02</span><strong>차이를 눈으로 확인해요</strong><p>기본 AI와 학습한 AI의 답변을 같은 질문으로 나란히 비교해요.</p></article>
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

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(0)}>이전</button><button className="primary-action" type="button" onClick={() => setStage(2)}>이 예시로 학습 준비 <span>→</span></button></div>
                    </div>
                  )}

                  {stage === 2 && (
                    <div className="panel-content">
                      <div className="assistant-note">
                        <span className="assistant-mark">✳</span>
                        <div><strong>설정은 모델리가 추천할게요</strong><p>{exampleCount}개의 예시와 “{selectedGoal.title}” 목표를 분석했어요. 처음에는 균형 설정이 비용과 품질 면에서 가장 적합합니다.</p></div>
                      </div>

                      <div className="panel-heading">
                        <div><span>STEP 2 · TRAIN</span><h2>얼마나 꼼꼼하게 학습할까요?</h2></div>
                        <span className="plain-badge recommended">자동 추천</span>
                      </div>

                      <div className="effort-options">
                        <button type="button"><span>빠른 확인</span><strong>약 4분</strong><small>방향을 먼저 볼 때</small></button>
                        <button type="button" className="selected"><i>추천</i><span>균형 있게</span><strong>약 12분</strong><small>대부분의 업무에 적합</small></button>
                        <button type="button"><span>최고 품질</span><strong>약 28분</strong><small>최종 배포 전 정교하게</small></button>
                      </div>

                      <div className="training-summary">
                        <div><span>사용 예시</span><strong>{exampleCount}개</strong></div>
                        <div><span>예상 비용</span><strong>첫 학습 무료</strong></div>
                        <div><span>완료 알림</span><strong>웹 + 이메일</strong></div>
                      </div>

                      <button className="advanced-row" type="button" onClick={() => setAdvanced((value) => !value)} aria-expanded={advanced}><span>전문가 설정</span><small>모델·반복 횟수를 직접 선택할 수 있어요</small><i>{advanced ? "−" : "+"}</i></button>
                      {advanced && <div className="advanced-settings"><label>기반 모델<select defaultValue="auto"><option value="auto">목표에 맞게 자동 선택</option><option value="fast">빠른 모델</option><option value="quality">고품질 모델</option></select></label><label>학습 반복<select defaultValue="3"><option value="3">3회 · 추천</option><option value="5">5회</option></select></label></div>}

                      <div className="training-run">
                        <div className="run-copy"><span className={training ? "run-indicator active" : "run-indicator"}>{progress === 100 ? "✓" : "↗"}</span><div><strong>{progress === 100 ? "학습이 완료됐습니다" : training ? "AI가 예시를 배우는 중입니다" : "학습할 준비가 됐습니다"}</strong><small>{progress === 100 ? "같은 질문으로 전후 결과를 비교해 보세요." : training ? "창을 닫아도 안전하게 계속됩니다." : "시작 후에도 언제든 중단할 수 있어요."}</small></div></div>
                        {training && <div className="run-progress"><i style={{ width: `${progress}%` }} /><span>{progress}%</span></div>}
                        {!training ? <button type="button" onClick={startTraining}>학습 시작</button> : progress === 100 ? <button type="button" onClick={() => setStage(3)}>결과 비교</button> : <span className="running-label">약 12분 남음</span>}
                      </div>

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(1)}>이전</button></div>
                    </div>
                  )}

                  {stage === 3 && (
                    <div className="panel-content">
                      <div className="assistant-note success-note">
                        <span className="assistant-mark">✓</span>
                        <div><strong>학습 전보다 31점 좋아졌어요</strong><p>말투와 정책 정확도가 크게 개선됐습니다. 실제 고객 질문 24개로 확인했고, 22개가 기준을 통과했어요.</p></div>
                      </div>

                      <div className="panel-heading">
                        <div><span>STEP 3 · EVALUATE</span><h2>무엇이 달라졌는지 확인하세요</h2></div>
                        <span className="score-pill">92 / 100</span>
                      </div>

                      <div className="test-question"><span>테스트 질문</span><strong>{selectedGoal.example}</strong><button type="button">다른 질문</button></div>

                      <div className="compare-grid">
                        <article><div><span>학습 전</span><small>기본 AI</small></div><p>주문 정보에서 사이즈 변경 옵션을 확인하세요. 교환 정책은 판매자에게 문의하시기 바랍니다.</p><footer><span>정책 반영</span><strong className="low">부족</strong></footer></article>
                        <article className="improved"><div><span>학습 후</span><small>나의 AI · v1</small></div><p>{selectedGoal.answer}</p><footer><span>정책 반영</span><strong>정확</strong></footer></article>
                      </div>

                      <div className="metric-grid">
                        <div><span>답변 정확성</span><strong>92</strong><i><b style={{ width: "92%" }} /></i></div>
                        <div><span>브랜드 말투</span><strong>96</strong><i><b style={{ width: "96%" }} /></i></div>
                        <div><span>금지 답변 회피</span><strong>100</strong><i><b style={{ width: "100%" }} /></i></div>
                      </div>

                      <div className="review-note"><span>검증 기준</span><p>“정답”만 보는 것이 아니라 <strong>정확성, 말투, 안전성</strong>을 각각 확인합니다. 이 점수는 고객에게 전달되는 성능 보고서에도 포함돼요.</p></div>

                      <div className="panel-footer"><button className="quiet-button" type="button" onClick={() => setStage(2)}>다시 학습</button><button className="primary-action" type="button" onClick={() => setStage(4)}>고객에게 전달하기 <span>→</span></button></div>
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
                    <div><dt>현재 버전</dt><dd>v1</dd></div>
                    <div><dt>검증 점수</dt><dd>{stage >= 3 ? "92 / 100" : "대기 중"}</dd></div>
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
