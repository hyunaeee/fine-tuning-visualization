import type { RecipeSettings, DialSettings, GoalId } from "./types.ts";
import { testQuestions } from "../data/catalog.ts";

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
      ? "정책 상담"
      : goal === "brand"
        ? "콘텐츠 검수"
        : goal === "technical"
          ? "티켓 분류"
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
    if (testQuestion.startsWith("예시 정책:")) {
      if (testQuestion.includes("수령 3일째"))
        return `${friendlyOpen}${policy >= 70 ? "제공된 정책의 기간·미사용 조건을 충족하므로 일반 교환 절차로 안내합니다. 주문 번호와 원하는 사이즈를 확인하겠습니다." : "사이즈 교환 문의를 접수하겠습니다."}`;
      const detail =
        concision < 72
          ? " 확인한 근거와 이관 사유를 상담 기록에 남깁니다."
          : "";
      if (testQuestion.includes("배송"))
        return `${friendlyOpen}${policy >= 70 ? "지연 보상은 담당자 승인이 필요하므로 즉시 지급을 약속하지 않습니다. 주문 정보와 배송 상태를 확인해 승인 담당자에게 전달하겠습니다." : "배송이 지연되어 불편하셨겠습니다. 보상 문의를 접수하겠습니다."}${detail}`;
      if (testQuestion.includes("환불"))
        return `${friendlyOpen}${policy >= 70 ? "수령일과 사용 여부가 확인되지 않아 환불 가능 여부는 보류합니다. 수령일·상품 상태·주문 정보를 먼저 확인하겠습니다." : "환불 문의를 접수하겠습니다. 주문 정보를 보내주세요."}${detail}`;
      return `${friendlyOpen}${policy >= 70 ? "수령 10일째인 사용 상품은 예시의 일반 교환 조건에 해당하지 않습니다. 즉시 교환을 약속하지 않고 예외 검토 담당자에게 이관하겠습니다." : "교환 문의를 접수하겠습니다. 상품 상태를 알려주세요."}${detail}`;
    }
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
    if (/승인|검수/.test(testQuestion)) {
      if (/할인|세일/.test(testQuestion))
        return policy >= 70
          ? "수정안: 일부 상품 최대 20% 할인.\n검수: 전 상품·50%라는 주장은 승인 정보와 달라 수정했습니다. 행사 기간과 제외 상품은 별도 확인이 필요합니다."
          : "일부 상품의 할인 안내 문구를 작성합니다. 대상과 할인 조건을 확인해주세요.";
      if (/환영|첫 구매/.test(testQuestion))
        return `${warmth >= 65 ? "첫 구매를 환영해요. " : "구매해주셔서 감사합니다. "}제품 사용 안내를 확인해주세요.${policy >= 70 ? "\n검수: 확인되지 않은 적립금·쿠폰 혜택은 추가하지 않았습니다." : ""}`;
      return `${creativity >= 55 ? "일상에 함께하는" : "500mL 용량의"} ${creativity >= 55 ? "500mL " : ""}스테인리스 텀블러.${policy >= 70 ? "\n검수: 근거 없는 최상급·건강 효능 표현을 제거했습니다. 보온 성능은 확인 전까지 기재하지 않습니다." : ""}`;
    }
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

  if (goal === "technical") {
    if (/비밀번호|단일 사용자/.test(testQuestion))
      return policy >= 70
        ? "분류: 계정 접근 · 우선순위: P3 · 담당 팀: 계정지원팀\n근거: 단일 사용자의 비밀번호 분실. 다음 조치: 본인 확인 후 비밀번호 재설정 안내."
        : "계정 문의로 접수합니다. 로그인 상태를 확인해주세요.";
    if (/가끔|영향 범위 없이/.test(testQuestion))
      return policy >= 70
        ? "분류: 검토 필요 · 우선순위: 미정 · 담당 팀: 1차 지원\n추가 확인: 제품명, 재현 절차, 오류 코드, 영향 범위가 필요합니다. 근거 없이 장애 유형을 단정하지 않습니다."
        : "증상 문의로 접수합니다. 자세한 내용을 알려주세요.";
    return policy >= 70
      ? `분류: 결제 장애 · 우선순위: P1 · 담당 팀: 결제팀${concision < 72 ? "\n근거: 다수 고객의 결제 실패. 다음 조치: 장애 대응 담당자에게 즉시 이관." : ""}`
      : "결제 오류 문의입니다. 지원팀에서 확인하도록 전달합니다.";
  }

  if (/인터뷰|요구사항/.test(testQuestion))
    return policy >= 70
      ? '{"repeated_request":"가입 절차 단축","mentions":2,"other_request":"검색 필터 추가"}'
      : "가입 절차 단축과 검색 필터 추가가 요청되었습니다.";
  if (/아직 정하지|API 명세/.test(testQuestion))
    return policy >= 70
      ? '{"owner":null,"due_date":null,"task":"API 명세 정리"}'
      : "API 명세 정리가 필요하며 담당자와 일정은 미정입니다.";
  const format =
    policy >= 70
      ? '{"owner":"김하나","due_date":"09-18","task":"온보딩 초안 공유","reviewer":null}'
      : "김하나가 9월 18일까지 온보딩 초안을 공유합니다. 디자인 검토 담당자는 미정입니다.";
  return format;
}
// Preserve known earlier demo prompts without pretending to parse arbitrary inputs.
const legacyQuestions: Record<GoalId, string[]> = {
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
  technical: [],
};
export function simulate(settings: RecipeSettings) {
  const question = settings.testQuestion.trim();
  const supported =
    Boolean(question) &&
    (testQuestions[settings.goal].includes(question) ||
      legacyQuestions[settings.goal].includes(question));
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
