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
    title: "정책을 준수하는 상담 AI",
    description:
      "처리 조건을 확인하고, 승인되지 않은 약속과 예외 누락을 줄이는 방향을 설계합니다.",
    prompt:
      "제공된 정책과 승인된 상담 사례를 기준으로 환불 조건을 확인하고, 예외는 담당자에게 이관하는 AI를 설계하고 싶어요.",
    example:
      "예시 정책: 일반 교환은 수령 7일 이내, 사용 상품은 담당자 검토. 수령 10일째인 사용 상품을 교환해 달라는 문의에 답해줘.",
    answer:
      "일반 교환 조건에 해당하지 않아 즉시 교환을 약속할 수 없습니다. 주문 정보와 상품 상태를 확인한 뒤 예외 검토 담당자에게 이관하겠습니다.",
  },
  {
    id: "technical",
    title: "기술지원 티켓을 분류하는 AI",
    description:
      "제품 용어와 증상으로 담당 팀·우선순위를 분류하고 정보 부족은 검토 요청으로 남깁니다.",
    prompt:
      "전문가가 분류한 지원 티켓으로 장애 유형, 담당 팀, 우선순위를 일관되게 분류하고 정보가 부족하면 확인을 요청하는 AI를 설계하고 싶어요.",
    example:
      "예시 분류 기준: 다수 고객의 결제 실패는 P1·결제팀. 결제 API에서 500 오류가 나고 여러 고객의 결제가 모두 실패합니다. 티켓을 분류해줘.",
    answer:
      "분류: 결제 장애 · 우선순위: P1 · 담당 팀: 결제팀\n근거: 다수 고객의 결제 실패. 다음 조치: 장애 대응 담당자에게 즉시 이관.",
  },
  {
    id: "brand",
    title: "브랜드 콘텐츠를 검수하는 AI",
    description:
      "승인된 사실과 표현 기준으로 과장 문구를 고치고 반복 검수 항목을 표준화합니다.",
    prompt:
      "상품 정보와 승인·반려 문구를 기준으로 과장 표현을 수정하고, 필수 정보를 유지하는 브랜드 콘텐츠 AI를 설계하고 싶어요.",
    example:
      "승인 정보는 텀블러 용량 500mL·스테인리스 소재뿐입니다. '세계 최고 보온력, 건강까지 좋아지는 텀블러'라는 출시 문구를 검수해줘.",
    answer:
      "수정안: 일상에 함께하는 500mL 스테인리스 텀블러.\n검수: 근거가 없는 최상급·건강 효능 표현을 제거했습니다. 보온 성능은 확인 전까지 기재하지 않습니다.",
  },
  {
    id: "organize",
    title: "업무 문서를 구조화하는 AI",
    description:
      "필드별 정답 기준으로 정보를 추출하고 원문에 없는 값은 미확인으로 구분합니다.",
    prompt:
      "업무 문서에서 담당자·기한·작업을 정해진 필드로 추출하고, 원문에 없는 값은 null로 남기는 AI를 설계하고 싶어요.",
    example:
      "회의 기록: 김하나는 9월 18일까지 온보딩 초안을 공유합니다. 디자인 검토 담당자는 미정입니다. 담당자·기한·작업을 추출해줘.",
    answer:
      '{"owner":"김하나","due_date":"09-18","task":"온보딩 초안 공유","reviewer":null}',
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
      "적용할 정책·예외 처리 기준",
      "익명화한 승인·이관 상담 사례",
      "학습과 분리한 정상·예외 평가셋",
    ],
    before: "수령일과 사용 여부에 관계없이 무료 교환해드리겠습니다.",
    outputs: [
      "정책 준수 레시피·설정 JSON",
      "정상·예외 사례의 예시 답변",
      "이관·오응대 검증 계획",
    ],
    workflowResult:
      "상담 담당자가 조건 누락과 임의 약속을 확인한 뒤 답변하거나 예외 검토로 이관하는 흐름입니다.",
    metrics: [
      { label: "처리 조건", before: "누락", after: "명시" },
      { label: "예외 처리", before: "임의 약속", after: "담당자 검토" },
      { label: "실제 성능", before: "미측정", after: "평가 필요" },
    ],
  },
  technical: {
    inputAssets: [
      "장애 유형·우선순위 정의",
      "전문가 라벨이 있는 익명 티켓",
      "드문 장애·정보 부족 평가 사례",
    ],
    before: "일반 오류 문의입니다. 고객지원팀에 배정합니다.",
    outputs: [
      "티켓 분류 레시피·설정 JSON",
      "분류·근거·이관 예시",
      "클래스별 검증 계획",
    ],
    workflowResult:
      "분류·배정 제안을 지원 담당자가 확인하고, 긴급 장애는 대응 팀에 우선 전달하는 흐름입니다.",
    metrics: [
      { label: "문의 분류", before: "일반 문의", after: "결제 장애" },
      { label: "배정 근거", before: "없음", after: "영향 범위" },
      { label: "실제 성능", before: "미측정", after: "평가 필요" },
    ],
  },
  brand: {
    inputAssets: [
      "승인된 상품 사실·표현 기준",
      "검수 전후 문구·반려 사유",
      "별도 상품의 블라인드 검수셋",
    ],
    before: "세계 최고의 보온력! 쓰기만 해도 건강해지는 텀블러.",
    outputs: [
      "콘텐츠 검수 레시피·설정 JSON",
      "문구 수정·검수 사유 예시",
      "사실·표현 기준 검증 계획",
    ],
    workflowResult:
      "콘텐츠 담당자가 수정 사유와 상품 근거를 확인한 뒤 최종 승인합니다. 자동 게시나 법적 적합성 판정을 대신하지 않습니다.",
    metrics: [
      { label: "상품 주장", before: "과장", after: "승인 사실" },
      { label: "수정 사유", before: "없음", after: "표시" },
      { label: "실제 성능", before: "미측정", after: "평가 필요" },
    ],
  },
  organize: {
    inputAssets: [
      "익명화한 업무 문서",
      "필드 정의·정규화 규칙",
      "원문·정답·근거 위치 쌍",
    ],
    before:
      "김하나가 초안을 공유하고, 디자인팀장이 검토합니다. 기한은 다음 주입니다.",
    outputs: [
      "필드 추출 레시피·설정 JSON",
      "구조화 출력 예시",
      "필드·스키마 검증 계획",
    ],
    workflowResult:
      "실무자가 필드와 원문을 대조해 확인한 뒤 업무 시스템으로 전달하는 흐름입니다. 미확인 값은 임의로 채우지 않습니다.",
    metrics: [
      { label: "출력 형식", before: "자유 문장", after: "고정 필드" },
      { label: "없는 정보", before: "추측", after: "null" },
      { label: "실제 성능", before: "미측정", after: "평가 필요" },
    ],
  },
};

export const stages = [
  { label: "목적 선택", helper: "줄이고 싶은 오류는 무엇인가요?" },
  { label: "자료·기준", helper: "좋은 결과의 기준을 정해요" },
  { label: "동작 설계", helper: "업무 기준에 맞춰 조절해요" },
  { label: "검증 설계", helper: "예시와 평가 항목을 확인해요" },
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
    fit: { support: 92, brand: 97, organize: 91, technical: 95 },
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    role: "균형형",
    bestFor: "정책 응대 · 콘텐츠 검수 · 티켓 분류",
    method: "프롬프트 + 평가",
    availability: "데모 카탈로그",
    availabilityTone: "current",
    speed: "균형",
    fit: { support: 98, brand: 96, organize: 96, technical: 98 },
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
    fit: { support: 95, brand: 86, organize: 98, technical: 97 },
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
    fit: { support: 90, brand: 92, organize: 88, technical: 91 },
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
    fit: { support: 93, brand: 90, organize: 92, technical: 94 },
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
    fit: { support: 84, brand: 78, organize: 94, technical: 90 },
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
    fit: { support: 86, brand: 74, organize: 88, technical: 89 },
  },
];

export const presetRecipes: PresetRecipe[] = [
  {
    id: "preset-support",
    name: "정책 확인·예외 이관",
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
    name: "승인 사실·표현 검수",
    goal: "brand",
    modelId: "gpt-5.6-sol",
    policy: 92,
    warmth: 68,
    concision: 58,
    creativity: 62,
    createdAt: "기본 레시피",
  },
  {
    id: "preset-organize",
    name: "필드 추출·미확인 값 보존",
    goal: "organize",
    modelId: "gpt-5.6-luna",
    policy: 96,
    warmth: 34,
    concision: 88,
    creativity: 8,
    createdAt: "기본 레시피",
  },
  {
    id: "preset-technical",
    name: "장애 분류·우선순위 배정",
    goal: "technical",
    modelId: "gpt-5.6-terra",
    policy: 94,
    warmth: 35,
    concision: 60,
    creativity: 8,
    createdAt: "기본 레시피",
  },
];

export const testQuestions: Record<GoalId, string[]> = {
  support: [
    goals.find((goal) => goal.id === "support")!.example,
    "예시 정책: 환불은 수령 7일 이내·미사용 상품만 일반 처리. 주문일과 상품 상태를 모르는 환불 문의에 답해줘.",
    "예시 정책: 배송 지연 보상은 담당자 승인 필요. 배송이 늦었으니 즉시 보상해 달라는 문의에 답해줘.",
    "예시 정책: 일반 교환은 수령 7일 이내·미사용 상품. 수령 3일째인 미사용 상품의 사이즈 교환 문의에 답해줘.",
  ],
  brand: [
    goals.find((goal) => goal.id === "brand")!.example,
    "승인된 할인율은 일부 상품 최대 20%입니다. '전 상품 50% 세일' 문구를 검수해줘.",
    "첫 구매 환영 문구를 써줘. 승인된 정보는 사용 안내 제공뿐이고 적립금이나 쿠폰 지급은 확인되지 않았어.",
  ],
  organize: [
    goals.find((goal) => goal.id === "organize")!.example,
    "업무 메모: API 명세를 정리해야 합니다. 담당자와 마감일은 아직 정하지 않았습니다. 필드를 추출해줘.",
    "인터뷰 기록: A와 B는 가입 절차 단축을 요청했고 C는 검색 필터 추가를 요청했습니다. 반복 요구사항을 추출해줘.",
  ],
  technical: [
    goals.find((goal) => goal.id === "technical")!.example,
    "예시 분류 기준: 단일 사용자 비밀번호 분실은 P3·계정지원팀. 비밀번호를 잊어 로그인할 수 없다는 티켓을 분류해줘.",
    "제품명·오류 코드·영향 범위 없이 '가끔 안 됩니다'라고만 적힌 티켓을 분류해줘.",
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
