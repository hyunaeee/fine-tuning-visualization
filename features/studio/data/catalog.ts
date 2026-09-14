import type {
  AudienceId,
  GoalId,
  ModelId,
  PresetRecipe,
} from "../domain/types.ts";

export const goals: Array<{
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
    prompt:
      "우리 쇼핑몰의 교환·환불 정책을 익혀서 고객 문의에 친절하게 답하는 AI를 만들고 싶어요.",
    example: "주문한 운동화 사이즈를 바꾸고 싶어요.",
    answer:
      "물론이에요. 상품 수령 후 7일 안이라면 무료 교환이 가능합니다. 주문 번호를 알려주시면 바로 도와드릴게요.",
  },
  {
    id: "brand",
    title: "브랜드 문체로 쓰는 AI",
    description: "캠페인과 상품 문구를 한결같은 목소리로 작성합니다.",
    prompt:
      "우리 브랜드의 차분하고 솔직한 말투를 익혀서 상품 소개 문구를 쓰는 AI를 만들고 싶어요.",
    example: "신제품 텀블러 출시 안내 문구를 작성해줘.",
    answer:
      "매일 손이 가는 물건은 가볍고 오래가야 하니까. 새로운 데일리 텀블러를 만나보세요.",
  },
  {
    id: "organize",
    title: "문서를 정리하는 AI",
    description: "긴 기록에서 담당자와 마감일, 할 일을 정확히 추출합니다.",
    prompt:
      "회의록에서 담당자, 마감일, 다음 할 일을 찾아 표로 정리하는 AI를 만들고 싶어요.",
    example: "이번 주 회의 기록에서 결정된 할 일을 정리해줘.",
    answer: "담당자: 김하나 · 마감일: 8월 16일 · 할 일: 온보딩 초안 공유",
  },
];

export const outcomeExamples: Record<
  GoalId,
  {
    inputAssets: string[];
    before: string;
    outputs: string[];
    workflowResult: string;
    metrics: Array<{ label: string; before: string; after: string }>;
  }
> = {
  support: {
    inputAssets: [
      "교환·환불 정책 PDF",
      "상담 질문·답변 84개",
      "피해야 할 표현 12개",
    ],
    before: "교환이 가능할 수 있습니다. 자세한 내용은 고객센터에 문의해주세요.",
    outputs: [
      "정책형 고객 응대 레시피",
      "질문별 테스트 결과",
      "상담팀용 체험 링크",
    ],
    workflowResult:
      "상담원이 처음부터 쓰지 않고, 검증된 답변 초안을 확인한 뒤 바로 전송합니다.",
    metrics: [
      { label: "정책 일치", before: "64", after: "96" },
      { label: "말투 일치", before: "58", after: "93" },
      { label: "답변 준비", before: "약 4분", after: "약 8초" },
    ],
  },
  brand: {
    inputAssets: ["브랜드 말투 가이드", "기존 카피 120개", "금지 표현 목록"],
    before: "새로운 텀블러가 출시되었습니다. 지금 바로 만나보세요!",
    outputs: [
      "브랜드 보이스 레시피",
      "문구 전후 비교표",
      "마케팅팀용 작성 화면",
    ],
    workflowResult:
      "누가 작성해도 같은 브랜드 목소리를 유지하고, 검토가 필요한 초안만 골라냅니다.",
    metrics: [
      { label: "문체 일치", before: "49", after: "95" },
      { label: "평균 수정", before: "3회", after: "1회" },
      { label: "초안 작성", before: "약 12분", after: "약 20초" },
    ],
  },
  organize: {
    inputAssets: ["회의록 샘플", "찾을 항목 정의", "정답 예시 60개"],
    before:
      "김하나 님이 다음 주까지 초안을 공유하기로 했고 검토 일정은 추후 정합니다.",
    outputs: ["문서 추출 레시피", "누락·오류 검증표", "CSV·API 결과"],
    workflowResult:
      "긴 문서를 넣으면 담당자·기한·할 일이 같은 형식으로 정리되어 후속 업무에 연결됩니다.",
    metrics: [
      { label: "항목 정확도", before: "71", after: "97" },
      { label: "누락 항목", before: "4개", after: "0개" },
      { label: "문서 정리", before: "약 15분", after: "약 30초" },
    ],
  },
};

export const stages = [
  { label: "할 일 선택", helper: "무엇을 도와드릴까요?" },
  { label: "자료 보기", helper: "준비된 예시로 시작해요" },
  { label: "말투 조절", helper: "내 취향으로 맞춰요" },
  { label: "답변 확인", helper: "직접 물어보고 확인해요" },
  { label: "저장·공유", helper: "같은 설정을 나눠요" },
];

export const modelCatalog: Array<{
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
    availability: "데모 카탈로그",
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
    availability: "데모 카탈로그",
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
    availability: "데모 카탈로그",
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
    availability: "학습 방식 예시",
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
    availability: "학습 방식 예시",
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
    availability: "학습 방식 예시",
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
    availability: "학습 방식 예시",
    availabilityTone: "legacy",
    speed: "추론",
    fit: { support: 86, brand: 74, organize: 88 },
  },
];

export const presetRecipes: PresetRecipe[] = [
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

export const testQuestions: Record<GoalId, string[]> = {
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

export const audiences: Record<
  AudienceId,
  {
    label: string;
    description: string;
    headline: string;
    detail: string;
    action: string;
    badge: string;
  }
> = {
  operator: {
    label: "실무 담당자",
    description: "개발 지식 없이 바로 사용",
    headline: "비공개 체험 링크",
    detail:
      "로그인 후 질문을 입력하고 결과를 확인하는 전용 페이지를 전달합니다.",
    action: "체험 링크 복사",
    badge: "가장 쉬운 전달",
  },
  web: {
    label: "웹사이트 운영팀",
    description: "홈페이지에 채팅으로 설치",
    headline: "웹 채팅 위젯",
    detail:
      "브랜드 색상과 환영 문구가 적용된 설치 코드와 운영 화면을 전달합니다.",
    action: "설치 패키지 만들기",
    badge: "웹사이트용",
  },
  developer: {
    label: "개발팀",
    description: "제품과 시스템에 연결",
    headline: "API 연결 정보",
    detail:
      "모델 ID, 인증 키 발급 안내, 요청 예시와 오류 처리 문서를 전달합니다.",
    action: "개발자 패키지 만들기",
    badge: "제품 연동용",
  },
  agency: {
    label: "고객사 납품",
    description: "완성 결과를 공식 인계",
    headline: "고객 인계 패키지",
    detail:
      "화이트라벨 체험 링크, 성능 보고서, 운영 가이드와 변경 이력을 한 번에 전달합니다.",
    action: "인계 패키지 만들기",
    badge: "에이전시·컨설턴트",
  },
};
