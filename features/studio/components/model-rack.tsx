import type { StudioController } from "../hooks/use-studio";
import { useState } from "react";

type Props = Pick<
  StudioController,
  | "selectedGoal"
  | "selectedModel"
  | "selectedModelId"
  | "recommendedModels"
  | "setSelectedModelId"
>;
export function ModelRack({
  selectedGoal,
  selectedModel,
  selectedModelId,
  recommendedModels,
  setSelectedModelId,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleModels = expanded
    ? recommendedModels
    : recommendedModels.filter(
        (model, index) => index < 3 || model.id === selectedModelId,
      );
  return (
    <section className="model-library" id="model-library">
      <div className="machine-section-title library-title">
        <div>
          <span>어떤 AI로 시작할까요?</span>
          <small>잘 모르겠다면 추천 설정 그대로 시작하세요.</small>
        </div>
        <strong>{selectedModel.name}</strong>
      </div>
      <div className="model-grid">
        {visibleModels.map((model, index) => (
          <button
            key={model.id}
            type="button"
            aria-pressed={selectedModelId === model.id}
            className={
              selectedModelId === model.id
                ? "model-card selected"
                : "model-card"
            }
            onClick={() => setSelectedModelId(model.id)}
          >
            <span className="model-rank">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`availability ${model.availabilityTone}`}>
              {selectedModelId === model.id ? "✓ 선택됨" : "체험 모델"}
            </span>
            <strong>{model.name}</strong>
            <small>
              {model.role} · {model.speed}
            </small>
            <p>{model.bestFor}</p>
            <div>
              <span>{model.role}</span>
              <b>{selectedModelId === model.id ? "사용 중" : "이 AI 선택"}</b>
            </div>
            {index === 0 && <i>처음이라면 추천</i>}
          </button>
        ))}
      </div>
      <button
        className="model-expand"
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded
          ? "추천 AI만 보기 ↑"
          : `다른 AI ${recommendedModels.length - visibleModels.length}개 더 보기 ↓`}
      </button>
      <details className="model-details">
        <summary>모델 선택과 학습 방식이 궁금해요</summary>
        <p>
          {selectedGoal.title}에 맞춰 정렬한 데모 목록입니다. 실제 지원 여부나
          성능 순위를 뜻하지 않아요. 현재 선택한 {selectedModel.name}의 예시
          방식은 ‘{selectedModel.method}’입니다. 지금은 모델 연결 없이 화면과
          답변 예시를 체험합니다.
        </p>
      </details>
    </section>
  );
}
