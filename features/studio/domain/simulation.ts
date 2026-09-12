import type { RecipeSettings, DialSettings, GoalId } from "./types.ts";

export function calculateIndicators({
  policy,
  warmth,
  creativity,
}: DialSettings) {
  const accuracy = Math.min(
    99,
    Math.round(58 + policy * 0.38 + (100 - creativity) * 0.06),
  );
  const tone = Math.min(99, Math.round(52 + warmth * 0.47 + creativity * 0.04));
  const consistency = Math.min(
    99,
    Math.round(61 + policy * 0.24 + (100 - creativity) * 0.17),
  );
  const safety = Math.min(100, Math.round(66 + policy * 0.37));
  return {
    accuracy,
    tone,
    consistency,
    safety,
    overall: Math.round((accuracy + tone + consistency + safety) / 4),
  };
}
export function tuningLabel({
  goal,
  policy,
  creativity,
}: Pick<RecipeSettings, "goal" | "policy" | "creativity">) {
  const mode =
    policy >= 75 ? "규칙 준수형" : creativity >= 60 ? "표현 확장형" : "균형형";
  const task =
    goal === "support"
      ? "고객 응대"
      : goal === "brand"
        ? "브랜드 문체"
        : "문서 구조화";
  return `${mode} ${task} 레시피`;
}
function exampleAnswer({
  goal,
  testQuestion,
  policy,
  warmth,
  concision,
  creativity,
}: RecipeSettings) {
  const friendlyOpen =
    warmth >= 65
      ? warmth >= 85
        ? "걱정하지 마세요. 바로 도와드릴게요. "
        : "물론이에요. "
      : "";
  const friendlyClose =
    warmth >= 62 && concision < 78
      ? " 필요한 내용을 알려주시면 이어서 도와드릴게요."
      : "";

  if (goal === "support") {
    if (testQuestion.includes("환불")) {
      const rule =
        policy >= 70
          ? "상품 수령 후 7일 안이며 사용하지 않은 상태라면 환불할 수 있어요."
          : "환불 가능 여부를 확인해드릴게요.";
      return `${friendlyOpen}${rule}${concision < 70 ? " 주문 번호와 상품 상태를 알려주세요." : ""}${friendlyClose}`;
    }
    if (testQuestion.includes("배송")) {
      const rule =
        policy >= 70
          ? "주문 내역의 배송 조회에서 현재 위치를 확인할 수 있어요."
          : "배송 상태를 확인해드릴게요.";
      return `${friendlyOpen}${rule}${concision < 70 ? " 주문 번호를 보내주시면 지연 여부도 함께 확인하겠습니다." : ""}${friendlyClose}`;
    }
    return `${friendlyOpen}${policy >= 70 ? "상품 수령 후 7일 안이라면 무료 교환이 가능합니다." : "사이즈 교환을 도와드릴게요."}${concision < 72 ? " 주문 번호와 원하는 사이즈를 알려주세요." : ""}${friendlyClose}`;
  }

  if (goal === "brand") {
    if (/세일|할인/.test(testQuestion))
      return creativity >= 55
        ? "여름을 가볍게 준비하는 시간. 마음에 두었던 물건을 여름 세일에서 만나보세요."
        : "여름 세일을 시작합니다. 대상 상품과 할인 조건을 확인해주세요.";
    if (/환영|첫 구매/.test(testQuestion))
      return warmth >= 65
        ? "처음 만나 반가워요. 당신의 일상에 오래 함께할 물건을 소개할게요."
        : "첫 구매를 환영합니다. 주문 안내와 제품 사용 방법을 확인해주세요.";
    const lead =
      creativity >= 55
        ? "매일의 장면을 조금 더 가볍게."
        : "매일 쓰기 좋은 제품을 소개합니다.";
    const body =
      concision >= 70
        ? " 새로운 데일리 텀블러를 만나보세요."
        : " 가볍고 오래가는 새로운 데일리 텀블러를 지금 만나보세요.";
    return `${lead}${body}${warmth >= 75 ? " 당신의 하루에 자연스럽게 어울릴 거예요." : ""}`;
  }

  if (/인터뷰|요구사항/.test(testQuestion))
    return concision >= 72
      ? "반복 요구: 가입 절차 단축 · 알림 설정 개선 · 검색 필터 추가"
      : "예시 인터뷰에서 반복된 요구는 가입 절차 단축, 알림 설정 개선, 검색 필터 추가입니다. 실제 문서 분석은 연결되지 않았습니다.";
  const format =
    policy >= 70
      ? "담당자: 김하나 · 마감일: 8월 16일 · 할 일: 온보딩 초안 공유"
      : "김하나 님이 8월 16일까지 온보딩 초안을 공유하기로 했습니다.";
  return concision >= 72
    ? format
    : `${format}\n추가 확인: 디자인팀 검토 일정은 아직 정해지지 않았습니다.`;
}
const supportedPatterns: Record<GoalId, RegExp> = {
  support: /교환|사이즈|환불|배송/,
  brand: /텀블러|출시|세일|할인|환영|첫 구매/,
  organize: /회의|할 일|담당자|마감일|인터뷰|요구사항/,
};
export function simulate(settings: RecipeSettings) {
  const question = settings.testQuestion.trim();
  const supported =
    Boolean(question) && supportedPatterns[settings.goal].test(question);
  const answer = !question
    ? "테스트 질문을 입력해주세요."
    : supported
      ? exampleAnswer(settings)
      : "이 질문에 대한 데모 예시가 아직 없어요. 아래 테스트 예시를 선택해주세요. 실제 자유 질문 답변에는 모델 API 연결이 필요합니다.";
  return {
    answer,
    supported,
    indicators: calculateIndicators(settings),
    tuningName: tuningLabel(settings),
  };
}
export type SimulationResult = ReturnType<typeof simulate>;
