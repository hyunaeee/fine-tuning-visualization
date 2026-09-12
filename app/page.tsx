"use client";

import { useEffect, useMemo, useState } from "react";

type GoalId = "support" | "brand" | "organize";
type AudienceId = "operator" | "web" | "developer" | "agency";
type ModelId =
  | "gpt-5.6-sol"
  | "gpt-5.6-terra"
  | "gpt-5.6-luna"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "o4-mini";

type Recipe = {
  id: string;
  name: string;
  goal: GoalId;
  modelId: ModelId;
  policy: number;
  warmth: number;
  concision: number;
  creativity: number;
  createdAt: string;
};

const RECIPE_STORAGE_KEY = "modely-recipes-v1";

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

const outcomeExamples: Record<GoalId, {
  inputAssets: string[];
  before: string;
  outputs: string[];
  workflowResult: string;
  metrics: Array<{ label: string; before: string; after: string }>;
}> = {
  support: {
    inputAssets: ["교환·환불 정책 PDF", "상담 질문·답변 84개", "피해야 할 표현 12개"],
    before: "교환이 가능할 수 있습니다. 자세한 내용은 고객센터에 문의해주세요.",
    outputs: ["정책형 고객 응대 레시피", "질문별 테스트 결과", "상담팀용 체험 링크"],
    workflowResult: "상담원이 처음부터 쓰지 않고, 검증된 답변 초안을 확인한 뒤 바로 전송합니다.",
    metrics: [
      { label: "정책 일치", before: "64", after: "96" },
      { label: "말투 일치", before: "58", after: "93" },
      { label: "답변 준비", before: "약 4분", after: "약 8초" },
    ],
  },
  brand: {
    inputAssets: ["브랜드 말투 가이드", "기존 카피 120개", "금지 표현 목록"],
    before: "새로운 텀블러가 출시되었습니다. 지금 바로 만나보세요!",
    outputs: ["브랜드 보이스 레시피", "문구 전후 비교표", "마케팅팀용 작성 화면"],
    workflowResult: "누가 작성해도 같은 브랜드 목소리를 유지하고, 검토가 필요한 초안만 골라냅니다.",
    metrics: [
      { label: "문체 일치", before: "49", after: "95" },
      { label: "평균 수정", before: "3회", after: "1회" },
      { label: "초안 작성", before: "약 12분", after: "약 20초" },
    ],
  },
  organize: {
    inputAssets: ["회의록 샘플", "찾을 항목 정의", "정답 예시 60개"],
    before: "김하나 님이 다음 주까지 초안을 공유하기로 했고 검토 일정은 추후 정합니다.",
    outputs: ["문서 추출 레시피", "누락·오류 검증표", "CSV·API 결과"],
    workflowResult: "긴 문서를 넣으면 담당자·기한·할 일이 같은 형식으로 정리되어 후속 업무에 연결됩니다.",
    metrics: [
      { label: "항목 정확도", before: "71", after: "97" },
      { label: "누락 항목", before: "4개", after: "0개" },
      { label: "문서 정리", before: "약 15분", after: "약 30초" },
    ],
  },
};

const stages = [
  { label: "목표", helper: "맡길 일을 설명해요" },
  { label: "예시", helper: "좋은 답변을 보여줘요" },
  { label: "모델·조정", helper: "모델과 레시피를 맞춰요" },
  { label: "실시간 검증", helper: "바꾸는 즉시 확인해요" },
  { label: "전달", helper: "고객에게 바로 넘겨요" },
];

const modelCatalog: Array<{
  id: ModelId;
  name: string;
  role: string;
  bestFor: string;
  method: string;
  availability: string;
  availabilityTone: "current" | "legacy";
  speed: string;
  fit: Record<GoalId, number>;
}> = [
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    role: "최고 품질",
    bestFor: "복잡한 판단 · 교사 답변 · 최종 평가",
    method: "프롬프트 + 평가",
    availability: "현재 API",
    availabilityTone: "current",
    speed: "정밀",
    fit: { support: 92, brand: 97, organize: 91 },
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    role: "균형형",
    bestFor: "고객 응대 · 브랜드 문체 · 일반 업무",
    method: "프롬프트 + 평가",
    availability: "현재 API",
    availabilityTone: "current",
    speed: "균형",
    fit: { support: 98, brand: 96, organize: 96 },
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    role: "대량 처리",
    bestFor: "분류 · 추출 · 반복 문의",
    method: "프롬프트 + 평가",
    availability: "현재 API",
    availabilityTone: "current",
    speed: "고속",
    fit: { support: 95, brand: 86, organize: 98 },
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    role: "정교한 SFT",
    bestFor: "특정 형식 · 번역 · 지시 준수 보정",
    method: "SFT",
    availability: "기존 FT 계정만",
    availabilityTone: "legacy",
    speed: "정밀",
    fit: { support: 90, brand: 92, organize: 88 },
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 mini",
    role: "SFT 균형형",
    bestFor: "응대 자동화 · 문체 · 고정 형식",
    method: "SFT",
    availability: "기존 FT 계정만",
    availabilityTone: "legacy",
    speed: "빠름",
    fit: { support: 93, brand: 90, organize: 92 },
  },
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 nano",
    role: "SFT 경량형",
    bestFor: "분류 · 필드 추출 · 짧은 구조화",
    method: "SFT",
    availability: "기존 FT 계정만",
    availabilityTone: "legacy",
    speed: "매우 빠름",
    fit: { support: 84, brand: 78, organize: 94 },
  },
  {
    id: "o4-mini",
    name: "o4-mini",
    role: "전문 추론 RFT",
    bestFor: "채점 가능한 전문 판단 · 도메인 추론",
    method: "RFT",
    availability: "기존 FT 계정만",
    availabilityTone: "legacy",
    speed: "추론",
    fit: { support: 86, brand: 74, organize: 88 },
  },
];

const presetRecipes: Recipe[] = [
  {
    id: "preset-support",
    name: "정책 먼저, 친절하게",
    goal: "support",
    modelId: "gpt-5.6-terra",
    policy: 92,
    warmth: 78,
    concision: 64,
    creativity: 16,
    createdAt: "기본 레시피",
  },
  {
    id: "preset-brand",
    name: "차분한 브랜드 보이스",
    goal: "brand",
    modelId: "gpt-5.6-sol",
    policy: 72,
    warmth: 68,
    concision: 58,
    creativity: 62,
    createdAt: "기본 레시피",
  },
  {
    id: "preset-organize",
    name: "JSON처럼 정확한 정리",
    goal: "organize",
    modelId: "gpt-5.6-luna",
    policy: 96,
    warmth: 34,
    concision: 88,
    creativity: 8,
    createdAt: "기본 레시피",
  },
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
  const [selectedModelId, setSelectedModelId] = useState<ModelId>("gpt-5.6-terra");
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [recipeNotice, setRecipeNotice] = useState("");

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === goal) ?? goals[0],
    [goal],
  );
  const selectedOutcome = outcomeExamples[goal];

  const selectedModel = useMemo(
    () => modelCatalog.find((item) => item.id === selectedModelId) ?? modelCatalog[1],
    [selectedModelId],
  );

  const recommendedModels = useMemo(
    () => [...modelCatalog].sort((a, b) => b.fit[goal] - a.fit[goal]),
    [goal],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(RECIPE_STORAGE_KEY);
        if (stored) setSavedRecipes(JSON.parse(stored) as Recipe[]);
      } catch {
        setSavedRecipes([]);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setVerifying(true), 0);
    const endTimer = window.setTimeout(() => setVerifying(false), 420);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
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
    return `${mode} ${task} 레시피`;
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
    setSelectedModelId("gpt-5.6-terra");
    setCopied(false);
    setBundleReady(false);
    setRecipeNotice("");
  }

  function chooseGoal(id: GoalId) {
    const item = goals.find((candidate) => candidate.id === id) ?? goals[0];
    setGoal(id);
    setPrompt(item.prompt);
    setTestQuestion(testQuestions[id][0]);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/?demo=customer-support-v1`);
    } catch {
      // The UI still confirms what would be included in this product prototype.
    }
    setCopied(true);
  }

  function createBundle() {
    setBundleReady(true);
    if (audience === "operator") void copyLink();
  }

  function openStudio(anchor: "model-library" | "recipe-book") {
    setStage(2);
    window.setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function persistRecipes(next: Recipe[]) {
    setSavedRecipes(next);
    try {
      window.localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The prototype still works when browser storage is unavailable.
    }
  }

  function saveCurrentRecipe() {
    const now = new Date();
    const recipe: Recipe = {
      id: `${Date.now()}`,
      name: `${selectedGoal.title.replace(" AI", "")} · ${selectedModel.name}`,
      goal,
      modelId: selectedModelId,
      policy,
      warmth,
      concision,
      creativity,
      createdAt: now.toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
    };
    persistRecipes([recipe, ...savedRecipes]);
    setRecipeNotice(`“${recipe.name}” 레시피를 이 기기에 저장했어요.`);
  }

  function loadRecipe(recipe: Recipe) {
    chooseGoal(recipe.goal);
    setSelectedModelId(recipe.modelId);
    setPolicy(recipe.policy);
    setWarmth(recipe.warmth);
    setConcision(recipe.concision);
    setCreativity(recipe.creativity);
    setStage(2);
    setRecipeNotice(`“${recipe.name}” 레시피를 조리대에 불러왔어요.`);
  }

  function deleteRecipe(id: string) {
    persistRecipes(savedRecipes.filter((recipe) => recipe.id !== id));
    setRecipeNotice("저장한 레시피를 삭제했어요.");
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
          <button className="nav-item" type="button" onClick={() => openStudio("model-library")}><span>▦</span> 모델 라이브러리 <i>7</i></button>
          <button className="nav-item" type="button" onClick={() => openStudio("recipe-book")}><span>≡</span> 레시피 북 <i>{savedRecipes.length}</i></button>
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
          <div><span>내 레시피</span><strong>{savedRecipes.length}개</strong></div>
          <div className="plan-track"><i style={{ width: `${Math.min(100, savedRecipes.length * 18)}%` }} /></div>
          <small>설정은 이 기기에 안전하게 저장</small>
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

              <section className="io-showcase" aria-labelledby="io-showcase-title">
                <div className="showcase-heading">
                  <div><span>INPUT → OUTPUT</span><h2 id="io-showcase-title">무엇을 넣고, 무엇을 받나요?</h2></div>
                  <small>선택한 목적에 따라 아래 예시가 바뀝니다</small>
                </div>

                <div className="io-pipeline">
                  <article className="io-card input-card">
                    <div className="io-card-head"><span>01 / INPUT</span><strong>내 업무를 설명하는 재료</strong></div>
                    <div className="input-prompt-sample">
                      <span>하고 싶은 일</span>
                      <p>{selectedGoal.prompt}</p>
                    </div>
                    <ul>
                      {selectedOutcome.inputAssets.map((asset) => <li key={asset}><span>＋</span>{asset}</li>)}
                    </ul>
                  </article>

                  <div className="pipeline-engine" aria-label="모델리가 입력을 처리해 출력으로 변환">
                    <span>✳</span><strong>MODELY</strong><small>모델 선택 · 레시피 조정 · 검증</small><i>→</i>
                  </div>

                  <article className="io-card output-card">
                    <div className="io-card-head"><span>02 / OUTPUT</span><strong>바로 사용할 수 있는 결과물</strong></div>
                    <div className="output-answer-sample">
                      <span>검증된 AI 답변</span>
                      <p>{selectedGoal.answer}</p>
                      <small><i /> 규칙·말투·형식 검사 통과</small>
                    </div>
                    <ul>
                      {selectedOutcome.outputs.map((output) => <li key={output}><span>✓</span>{output}</li>)}
                    </ul>
                  </article>
                </div>
              </section>

              <section className="outcome-showcase" aria-labelledby="outcome-showcase-title">
                <div className="showcase-heading">
                  <div><span>BEFORE → AFTER</span><h2 id="outcome-showcase-title">실제 사용하면 이렇게 달라집니다</h2></div>
                  <small>제품 데모 기준 예상 결과 · 실제 수치는 데이터에 따라 달라져요</small>
                </div>

                <div className="outcome-tabs" role="tablist" aria-label="사용 결과 예시 선택">
                  {goals.map((item) => (
                    <button key={item.id} type="button" role="tab" aria-selected={goal === item.id} className={goal === item.id ? "selected" : ""} onClick={() => chooseGoal(item.id)}>
                      <span>{item.id === "support" ? "CS" : item.id === "brand" ? "BR" : "DOC"}</span>
                      <div><strong>{item.title}</strong><small>{item.description}</small></div>
                    </button>
                  ))}
                </div>

                <div className="result-comparison">
                  <article className="result-before">
                    <header><span>BEFORE</span><small>기본 AI 답변</small></header>
                    <p>{selectedOutcome.before}</p>
                    <footer><i>!</i> 회사 기준과 결과 형식이 매번 달라질 수 있어요</footer>
                  </article>
                  <article className="result-after">
                    <header><span>AFTER</span><small>레시피 적용 답변</small></header>
                    <p>{selectedGoal.answer}</p>
                    <footer><i>✓</i> 원하는 규칙·말투·형식을 반복해서 유지해요</footer>
                  </article>
                </div>

                <div className="usage-result">
                  <div className="usage-copy"><span>사용 결과</span><strong>{selectedOutcome.workflowResult}</strong></div>
                  <div className="result-metrics">
                    {selectedOutcome.metrics.map((metric) => (
                      <div key={metric.label}><span>{metric.label}</span><p><del>{metric.before}</del><i>→</i><strong>{metric.after}</strong></p></div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setStage(1)}>이 예시로 시작하기 <span>→</span></button>
                </div>
              </section>

              <div className="start-explainer">
                <div className="explainer-title"><span>이후에는 이렇게 진행돼요</span><small>각 단계마다 모델리가 설명합니다</small></div>
                <div className="explainer-grid">
                  <article><span>01</span><strong>좋은 예시를 모아요</strong><p>질문과 기대 답변을 올리면 형식과 품질을 자동으로 확인해요.</p></article>
                  <article><span>02</span><strong>모델을 고르고 레시피로 저장해요</strong><p>목적별 추천 모델을 고른 뒤 규칙, 말투, 길이를 맞춰 다시 쓸 수 있는 레시피로 보관해요.</p></article>
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

                      <div className="platform-update">
                        <span>OFFICIAL UPDATE · 2026.08</span>
                        <div><strong>새 프로젝트는 ‘프롬프트 + 평가 레시피’가 기본입니다</strong><p>OpenAI의 기존 SFT·RFT는 현재 신규 사용자가 시작할 수 없어요. 기존 파인튜닝 고객용 모델은 별도로 표시하고, 나머지는 현재 API에서 재사용 가능한 레시피로 조정합니다.</p></div>
                        <a href="https://developers.openai.com/api/docs/guides/supervised-fine-tuning" target="_blank" rel="noreferrer">공식 기준 ↗</a>
                      </div>

                      <section className="model-library" id="model-library">
                        <div className="machine-section-title library-title">
                          <div><span>MODEL RACK / 목적별 모델</span><small>{selectedGoal.title}에 맞는 순서로 자동 정렬</small></div>
                          <strong>{selectedModel.name}</strong>
                        </div>
                        <div className="model-grid">
                          {recommendedModels.map((model, index) => (
                            <button
                              key={model.id}
                              type="button"
                              className={selectedModelId === model.id ? "model-card selected" : "model-card"}
                              onClick={() => setSelectedModelId(model.id)}
                            >
                              <span className="model-rank">{String(index + 1).padStart(2, "0")}</span>
                              <span className={`availability ${model.availabilityTone}`}>{model.availability}</span>
                              <strong>{model.name}</strong>
                              <small>{model.role} · {model.speed}</small>
                              <p>{model.bestFor}</p>
                              <div><span>{model.method}</span><b>{model.fit[goal]}% 적합</b></div>
                              {index === 0 && <i>이 목적의 추천</i>}
                            </button>
                          ))}
                        </div>
                      </section>

                      <div className="active-recipe-strip">
                        <span className="stove-light" />
                        <div><small>NOW COOKING</small><strong>{selectedModel.name} × {tuningName}</strong></div>
                        <span>{selectedModel.method}</span>
                        <button type="button" onClick={saveCurrentRecipe}>현재 레시피 저장 ＋</button>
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

                      <section className="recipe-book" id="recipe-book">
                        <div className="recipe-book-head">
                          <div><span>RECIPE BOOK</span><h3>잘 맞춘 조리법은 저장해두세요</h3><p>모델, 목적, 네 개의 다이얼 값을 한 번에 저장하고 언제든 다시 불러옵니다.</p></div>
                          <button type="button" onClick={saveCurrentRecipe}>이 조합 저장</button>
                        </div>

                        <div className="recipe-formula">
                          <div><span>BASE</span><strong>{selectedModel.name}</strong><small>{selectedModel.method}</small></div>
                          <i>＋</i>
                          <div><span>INGREDIENTS</span><strong>{exampleCount}개 예시</strong><small>{selectedGoal.title}</small></div>
                          <i>＋</i>
                          <div><span>SEASONING</span><strong>{policy} · {warmth} · {concision} · {creativity}</strong><small>규칙 · 말투 · 길이 · 다양성</small></div>
                          <i>＝</i>
                          <div className="formula-score"><span>TASTE TEST</span><strong>{verification.overall}점</strong><small>실시간 검증 예상</small></div>
                        </div>

                        {recipeNotice && <div className="recipe-notice"><span>✓</span>{recipeNotice}</div>}

                        <div className="recipe-shelf">
                          <div className="shelf-title"><strong>바로 쓰는 기본 레시피</strong><span>목적에 맞게 미리 조리됨</span></div>
                          <div className="recipe-cards">
                            {presetRecipes.map((recipe) => (
                              <article className="recipe-card" key={recipe.id}>
                                <span>{recipe.goal === "support" ? "CS" : recipe.goal === "brand" ? "BR" : "DOC"}</span>
                                <div><strong>{recipe.name}</strong><small>{modelCatalog.find((model) => model.id === recipe.modelId)?.name}</small></div>
                                <button type="button" onClick={() => loadRecipe(recipe)}>불러오기</button>
                              </article>
                            ))}
                          </div>
                        </div>

                        <div className="recipe-shelf saved-shelf">
                          <div className="shelf-title"><strong>내가 저장한 레시피</strong><span>{savedRecipes.length}개 · 이 기기에 저장됨</span></div>
                          {savedRecipes.length === 0 ? (
                            <button className="empty-recipe" type="button" onClick={saveCurrentRecipe}><span>＋</span><strong>첫 레시피 저장하기</strong><small>현재 모델과 다이얼 설정이 그대로 담깁니다.</small></button>
                          ) : (
                            <div className="recipe-cards">
                              {savedRecipes.map((recipe) => (
                                <article className="recipe-card saved" key={recipe.id}>
                                  <span>MY</span>
                                  <div><strong>{recipe.name}</strong><small>{recipe.createdAt} · {recipe.policy}/{recipe.warmth}/{recipe.concision}/{recipe.creativity}</small></div>
                                  <button type="button" onClick={() => loadRecipe(recipe)}>적용</button>
                                  <button className="delete-recipe" type="button" aria-label={`${recipe.name} 삭제`} onClick={() => deleteRecipe(recipe.id)}>×</button>
                                </article>
                              ))}
                            </div>
                          )}
                        </div>
                      </section>

                      <div className="instant-preview">
                        <div className="preview-terminal-head"><span><i /> INSTANT PREVIEW</span><small>{verifying ? "설정 반영 중…" : "0.2초 전 검증됨"}</small></div>
                        <div className="preview-terminal-body"><span>TEST INPUT</span><p>{testQuestion}</p><span>TUNED OUTPUT</span><strong>{liveAnswer}</strong></div>
                        <div className="preview-score"><span>예상 검증 점수</span><strong>{verification.overall}</strong><i><b style={{ width: `${verification.overall}%` }} /></i></div>
                      </div>

                      <div className="fine-tune-explainer">
                        <span>이 레시피의 효과</span>
                        <p>{selectedModel.availabilityTone === "current" ? "모델 자체를 다시 학습시키지 않아도, " : "기존 파인튜닝 계정이라면 학습 설정으로 활용하고, "}<strong>같은 상황에서 회사가 원하는 방식으로 판단하고 말하는 패턴</strong>을 프롬프트와 평가 기준으로 반복 재현합니다.</p>
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
                            <header><span>TUNED OUTPUT</span><small>{selectedModel.name} / {goal}-v1</small></header>
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
                        {audience === "operator" && <div className="link-preview"><span>fine-tuning-visualization.vercel.app/</span><strong>?demo=customer-support-v1</strong><button type="button" onClick={copyLink}>{copied ? "복사됨 ✓" : "복사"}</button></div>}
                        {audience === "web" && <div className="code-preview"><span>&lt;script</span> src=&quot;modely.ai/widget.js&quot; data-model=&quot;cs-v1&quot;<span>&gt;&lt;/script&gt;</span></div>}
                        {audience === "developer" && <div className="code-preview"><span>POST</span> https://api.modely.ai/v1/respond <i>model: cs-v1</i></div>}
                        {audience === "agency" && <div className="handoff-preview"><span>ZIP</span><div><strong>고객사명_AI_인계패키지</strong><small>체험 링크 · 보고서 · 운영 문서 · 변경 이력</small></div></div>}
                      </div>

                      <div className="universal-package">
                        <div className="section-label"><strong>모든 고객에게 기본으로 전달</strong><span>누락 없이 자동 구성</span></div>
                        <div className="package-list">
                          <div><span>✓</span><p><strong>AI 사용 방법</strong><small>할 수 있는 일과 질문 예시</small></p></div>
                          <div><span>✓</span><p><strong>성능 검증 보고서</strong><small>정확성·말투·안전성 점수</small></p></div>
                          <div><span>✓</span><p><strong>입력·출력 명세</strong><small>넣을 자료와 받게 되는 결과 형식</small></p></div>
                          <div><span>✓</span><p><strong>실제 사용 예시</strong><small>대표 질문과 적용 전·후 답변</small></p></div>
                          <div><span>✓</span><p><strong>주의사항과 금지 예시</strong><small>잘못 쓰기 쉬운 상황 안내</small></p></div>
                          <div><span>✓</span><p><strong>버전과 변경 이력</strong><small>언제 무엇이 달라졌는지 기록</small></p></div>
                          <div><span>✓</span><p><strong>운영·문의 안내</strong><small>담당자와 업데이트 방법</small></p></div>
                          <div><span>✓</span><p><strong>모델·튜닝 레시피</strong><small>{selectedModel.name}과 조정값을 다시 쓸 수 있게 보관</small></p></div>
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
                    <div><dt>선택 모델</dt><dd>{selectedModel.name}</dd></div>
                    <div><dt>적용 방식</dt><dd>{selectedModel.method}</dd></div>
                    <div><dt>튜닝 유형</dt><dd>{policy >= 75 ? "규칙 준수형" : "균형형"}</dd></div>
                    <div><dt>현재 버전</dt><dd>v1</dd></div>
                    <div><dt>검증 점수</dt><dd>{stage >= 2 ? `${verification.overall} / 100` : "대기 중"}</dd></div>
                    <div><dt>저장 레시피</dt><dd>{savedRecipes.length}개</dd></div>
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
