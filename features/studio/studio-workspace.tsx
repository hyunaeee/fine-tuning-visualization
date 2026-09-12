"use client";
import { stages } from "./data/catalog";
import { useStudio } from "./hooks/use-studio";
import { Sidebar } from "./components/sidebar";
import { StartView } from "./components/start-view";
import { ExamplesStep } from "./components/examples-step";
import { TuningConsole } from "./components/tuning-console";
import { TestBench } from "./components/test-bench";
import { DeliveryStep } from "./components/delivery-step";
import { ContextPanel } from "./components/context-panel";

export function StudioWorkspace() {
  const studio = useStudio();
  const { stage, setStage, selectedGoal, recipeNotice, noticeKind } = studio;
  return (
    <main className="app-frame">
      <Sidebar {...studio} />
      <section className="workspace">
        <header className="workspace-header">
          <div className="mobile-brand">
            <span>✳</span> modely
          </div>
          <div className="breadcrumbs">
            <span>개인 워크스페이스</span>
            <i>/</i>
            <strong>{stage === 0 ? "새 AI" : selectedGoal.title}</strong>
          </div>
          <div className="header-actions">
            <span className="demo-label">
              <i /> 제품 데모
            </span>
            <button
              className="share-button"
              type="button"
              onClick={() => setStage(4)}
            >
              전달하기 <span>↗</span>
            </button>
          </div>
        </header>
        <div className="workspace-scroll">
          {recipeNotice && stage !== 2 && (
            <p
              className={"workspace-notice feedback " + noticeKind}
              role={noticeKind === "error" ? "alert" : "status"}
            >
              {recipeNotice}
            </p>
          )}
          {stage === 0 ? (
            <StartView {...studio} />
          ) : (
            <section className="project-view">
              <div className="project-titlebar">
                <div>
                  <span className="project-kicker">
                    PROJECT / {String(stage).padStart(2, "0")}
                  </span>
                  <h1>{selectedGoal.title}</h1>
                  <p>{selectedGoal.description}</p>
                </div>
                <div className="project-meta">
                  <span className="live-dot" /> 로컬 데모 · 레시피 수동 저장
                </div>
              </div>
              <nav className="stage-rail" aria-label="파인튜닝 진행 단계">
                {stages.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className={
                      index === stage
                        ? "current"
                        : index < stage
                          ? "complete"
                          : ""
                    }
                    onClick={() => setStage(index)}
                    aria-current={index === stage ? "step" : undefined}
                  >
                    <span>{index < stage ? "✓" : index + 1}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.helper}</small>
                    </div>
                  </button>
                ))}
              </nav>
              <div className="project-layout">
                <div className="primary-panel">
                  {stage === 1 && <ExamplesStep {...studio} />}
                  {stage === 2 && <TuningConsole {...studio} />}
                  {stage === 3 && <TestBench {...studio} />}
                  {stage === 4 && <DeliveryStep {...studio} />}
                </div>
                <ContextPanel {...studio} />
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
