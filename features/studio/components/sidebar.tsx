import type { StudioController } from "../hooks/use-studio";
import { modelCatalog } from "../data/catalog";
type Props = Pick<
  StudioController,
  | "resetProject"
  | "openStudio"
  | "savedRecipes"
  | "setStage"
  | "chooseGoal"
  | "stage"
  | "goal"
>;
export function Sidebar({
  resetProject,
  openStudio,
  savedRecipes,
  setStage,
  chooseGoal,
  stage,
  goal,
}: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-glyph">✳</span>
        <strong>modely</strong>
      </div>

      <button className="new-project" type="button" onClick={resetProject}>
        <span>＋</span> 새 AI 만들기
      </button>

      <nav className="sidebar-nav" aria-label="워크스페이스 메뉴">
        <button
          className={stage === 0 ? "nav-item active" : "nav-item"}
          type="button"
          onClick={() => setStage(0)}
        >
          <span>⌂</span> 만들기
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => openStudio("model-library")}
        >
          <span>▦</span> 모델 라이브러리 <i>{modelCatalog.length}</i>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => openStudio("recipe-book")}
        >
          <span>≡</span> 레시피 북 <i>{savedRecipes.length}</i>
        </button>
        <button className="nav-item" type="button" onClick={() => setStage(4)}>
          <span>↗</span> 전달함
        </button>
        <button className="nav-item" type="button" onClick={() => setStage(3)}>
          <span>◫</span> 사용 기록
        </button>
      </nav>

      <div className="sidebar-section">
        <p>프로젝트</p>
        <button
          className={
            goal === "support" ? "project-row selected" : "project-row"
          }
          type="button"
          onClick={() => {
            chooseGoal("support");
            setStage(Math.max(stage, 1));
          }}
        >
          <span className="project-icon">CS</span>
          <span>
            <strong>고객 응대 AI</strong>
            <small>예시 프로젝트</small>
          </span>
          <i className="project-status ready" />
        </button>
        <button
          className={goal === "brand" ? "project-row selected" : "project-row"}
          type="button"
          onClick={() => {
            chooseGoal("brand");
            setStage(1);
          }}
        >
          <span className="project-icon">BR</span>
          <span>
            <strong>브랜드 카피</strong>
            <small>초안</small>
          </span>
          <i className="project-status" />
        </button>
      </div>

      <div className="sidebar-spacer" />
      <div className="plan-card">
        <div>
          <span>내 레시피</span>
          <strong>{savedRecipes.length}개</strong>
        </div>
        <div className="plan-track">
          <i style={{ width: `${Math.min(100, savedRecipes.length * 18)}%` }} />
        </div>
        <small>레시피는 저장 버튼으로 보관</small>
      </div>
      <div className="profile-row">
        <span className="profile-avatar">M</span>
        <span>
          <strong>My workspace</strong>
          <small>개인 워크스페이스</small>
        </span>
        <i>로컬</i>
      </div>
    </aside>
  );
}
