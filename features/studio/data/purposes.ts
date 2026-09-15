import type { GoalId } from "../domain/types.ts";

export type PurposeBrief = {
  shortTitle: string;
  subtitle: string;
  icon: string;
  badge: string;
  problem: string;
  trainingTarget: string;
  baseline: string;
  dataRule: string;
  evaluation: Array<{ label: string; check: string }>;
};

/** Product briefs, not measured outcomes. Shared by the UI and handoff export. */
export const purposeBriefs: Record<GoalId, PurposeBrief> = {
  support: {
    shortTitle: "정책 준수 상담",
    subtitle: "임의 약속을 줄이고 예외는 담당자에게",
    icon: "☏",
    badge: "CS",
    problem:
      "같은 문의에도 처리 조건이 달라지고, 확인 없이 환불이나 보상을 약속합니다.",
    trainingTarget:
      "승인된 사례로 조건 확인 → 답변 보류 → 담당자 이관이라는 응대 패턴을 일관되게 맞춥니다.",
    baseline:
      "최신 정책은 검색(RAG)으로 제공하고, 프롬프트로도 반복되는 지시 누락이 남을 때 SFT를 검토합니다.",
    dataRule:
      "개인정보를 제거한 상담 기록에 적용 정책, 승인 답변, 이관 사유를 함께 표시합니다.",
    evaluation: [
      {
        label: "정책 준수율",
        check:
          "별도 평가셋에서 제공된 정책 조건을 빠뜨리거나 임의로 약속한 답변을 셉니다.",
      },
      {
        label: "예외 이관 재현율",
        check: "담당자 확인이 필요한 사례 중 실제로 이관한 비율을 확인합니다.",
      },
      {
        label: "불필요한 보류",
        check:
          "답할 수 있는 정상 문의까지 거부하거나 이관하지 않는지 함께 검사합니다.",
      },
    ],
  },
  technical: {
    shortTitle: "기술지원 티켓 분류",
    subtitle: "증상에서 담당 팀과 우선순위를 일관되게",
    icon: "⌘",
    badge: "OPS",
    problem:
      "제품 용어와 증상 표현이 제각각이라 티켓이 잘못 배정되고 긴급 장애가 일반 문의에 섞입니다.",
    trainingTarget:
      "전문가가 라벨링한 티켓으로 분류 체계, 담당 팀, 불확실할 때의 검토 요청 패턴을 맞춥니다.",
    baseline:
      "규칙 기반 분류와 프롬프트를 먼저 비교합니다. 도메인 표현에서 반복되는 오분류가 SFT 검토 대상입니다.",
    dataRule:
      "익명화한 증상·영향 범위와 전문가 라벨을 쌍으로 만들고, 같은 장애의 중복 티켓은 한 분할에만 둡니다.",
    evaluation: [
      {
        label: "분류 Macro-F1",
        check:
          "흔한 문의뿐 아니라 드문 장애 유형도 클래스별로 동일하게 평가합니다.",
      },
      {
        label: "긴급 장애 재현율",
        check:
          "정답이 긴급인 티켓을 놓친 사례와 과도하게 긴급 처리한 사례를 함께 봅니다.",
      },
      {
        label: "미확인 처리",
        check:
          "영향 범위나 근거가 부족한 입력에서 분류를 단정하지 않는지 확인합니다.",
      },
    ],
  },
  organize: {
    shortTitle: "업무 문서 구조화",
    subtitle: "필수 항목은 정확히, 없는 정보는 미확인으로",
    icon: "▤",
    badge: "DOC",
    problem:
      "문서마다 표현과 양식이 달라 필수 항목이 누락되고, 없는 날짜나 담당자를 추측해 채웁니다.",
    trainingTarget:
      "검수된 정답으로 필드 매핑, 용어 정규화, 미확인 값 처리 규칙을 반복 학습하는 방향입니다.",
    baseline:
      "JSON 형식은 구조화 출력으로 먼저 제한합니다. 형식이 맞아도 필드의 의미를 계속 틀리는 경우 SFT를 검토합니다.",
    dataRule:
      "원문·정답 필드·근거 위치를 묶고, 같은 문서나 유사 양식이 학습·평가 양쪽에 섞이지 않게 나눕니다.",
    evaluation: [
      {
        label: "필드 Exact Match",
        check: "담당자·기한·작업 항목을 정답과 필드 단위로 비교합니다.",
      },
      {
        label: "미확인 값 정확도",
        check:
          "원문에 없는 정보는 null로 남기고, 있는 정보를 누락하지 않는지 검사합니다.",
      },
      {
        label: "스키마 통과율",
        check:
          "필수 키와 자료형을 자동 검사합니다. 형식 통과와 내용 정확도는 별개입니다.",
      },
    ],
  },
  brand: {
    shortTitle: "브랜드 콘텐츠 검수",
    subtitle: "승인된 사실과 표현 기준을 지키는 초안",
    icon: "✎",
    badge: "BR",
    problem:
      "상품 소개마다 근거 없는 효능·최상급 표현이 섞여 검수자가 같은 수정을 반복합니다.",
    trainingTarget:
      "승인·반려 사례로 표현 기준, 필수 고지, 과장 표현을 수정하는 패턴을 일관되게 맞춥니다.",
    baseline:
      "단순 말투는 프롬프트부터 조정합니다. 승인된 상품 사실은 별도로 제공하고, 반복되는 검수 실패가 남을 때 튜닝을 검토합니다.",
    dataRule:
      "검수 전·후 문구, 반려 사유와 사용 가능한 상품 사실을 함께 기록합니다. 학습셋과 평가 상품은 분리합니다.",
    evaluation: [
      {
        label: "금지 표현 검출",
        check:
          "금지·과장 표현이 남은 사례를 검사하고, 정상 표현을 과도하게 지우는지도 봅니다.",
      },
      {
        label: "사실 근거 일치",
        check:
          "가격·성능·효능 등 각 주장에 제공된 상품 정보의 근거가 있는지 확인합니다.",
      },
      {
        label: "검수 통과율",
        check: "고정된 검수표와 블라인드 검토로 기준 모델과 후보를 비교합니다.",
      },
    ],
  },
};

export const evaluationProtocol =
  "학습에 쓰지 않은 고정 평가셋으로 기준 모델과 후보를 같은 조건에서 비교하세요. 정상·예외·정보 부족 사례를 나누고, 품질뿐 아니라 지연시간·비용·과도한 거부도 함께 확인합니다.";

export const optimizationSources = {
  sft: "https://developers.openai.com/api/docs/guides/supervised-fine-tuning",
  workflow: "https://developers.openai.com/api/docs/guides/model-optimization",
};
