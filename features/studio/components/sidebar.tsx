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
          <span>⌂</span> 시작하기
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => openStudio("model-library")}
        >
          <span>▦</span> AI 고르기 <i>{modelCatalog.length}</i>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => openStudio("recipe-book")}
        >
          <span>≡</span> 저장한 레시피 <i>{savedRecipes.length}</i>
        </button>
        <button className="nav-item" type="button" onClick={() => setStage(4)}>
          <span>↗</span> 결과 공유
        </button>
        <button className="nav-item" type="button" onClick={() => setStage(3)}>
          <span>◫</span> 답변 미리보기
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
            <strong>정책 준수 상담</strong>
            <small>예시 프로젝트</small>
          </span>
          <i className="project-status ready" />
        </button>
        <button
          className={
            goal === "technical" ? "project-row selected" : "project-row"
          }
          type="button"
          onClick={() => {
            chooseGoal("technical");
            setStage(1);
          }}
        >
          <span className="project-icon">OPS</span>
          <span>
            <strong>기술지원 분류</strong>
            <small>예시 프로젝트</small>
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
          <strong>나의 AI 작업실</strong>
          <small>이 브라우저에 저장돼요</small>
        </span>
        <i>로컬</i>
      </div>
    </aside>
  );
}
