"use client";

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <main className="start-view" role="alert">
      <h1>작업 화면을 불러오지 못했어요</h1>
      <p className="lead">
        다시 열어주세요. 브라우저에 저장한 레시피는 삭제되지 않습니다.
      </p>
      <button className="primary-action" type="button" onClick={reset}>
        다시 시도
      </button>
    </main>
  );
}
