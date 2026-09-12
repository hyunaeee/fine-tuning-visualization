import type { StudioController } from "../hooks/use-studio";

type Props = Pick<
  StudioController,
  | "selectedGoal"
  | "selectedModel"
  | "selectedModelId"
  | "recommendedModels"
  | "setSelectedModelId"
  | "goal"
>;
export function ModelRack({
  selectedGoal,
  selectedModel,
  selectedModelId,
  recommendedModels,
  setSelectedModelId,
  goal,
}: Props) {
  return (
    <section className="model-library" id="model-library">
      <div className="machine-section-title library-title">
        <div>
          <span>MODEL RACK / 목적별 모델</span>
          <small>{selectedGoal.title}에 맞는 순서로 자동 정렬</small>
        </div>
        <strong>{selectedModel.name}</strong>
      </div>
      <div className="model-grid">
        {recommendedModels.map((model, index) => (
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
              {model.availability}
            </span>
            <strong>{model.name}</strong>
            <small>
              {model.role} · {model.speed}
            </small>
            <p>{model.bestFor}</p>
            <div>
              <span>{model.method}</span>
              <b>{model.fit[goal]}점 · 예시</b>
            </div>
            {index === 0 && <i>이 목적의 추천</i>}
          </button>
        ))}
      </div>
    </section>
  );
}
