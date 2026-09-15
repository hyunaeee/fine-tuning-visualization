import type { StudioController } from "../hooks/use-studio";
import { purposeBriefs } from "../data/purposes";
type Props = Pick<
  StudioController,
  | "fileName"
  | "fileError"
  | "selectFile"
  | "exampleCount"
  | "selectedGoal"
  | "setStage"
>;
export function ExamplesStep({
  fileName,
  fileError,
  selectFile,
  exampleCount,
  selectedGoal,
  setStage,
}: Props) {
  return (
    <div className="panel-content">
      <div className="assistant-note">
        <span className="assistant-mark">✳</span>
        <div>
          <strong>전문가가 검수한 정답과 예외 사례부터 준비하세요.</strong>
          <p>
            {purposeBriefs[selectedGoal.id].dataRule} 현재는 준비된 예시를 보는
            단계이며 파일 내용은 분석하지 않습니다.
          </p>
        </div>
      </div>
      <div className="panel-heading">
        <div>
          <span>AI에게 보여줄 예시</span>
          <h2>입력과 정답 기준을 맞춰보세요</h2>
        </div>
        <span className="plain-badge">샘플 데이터</span>
      </div>
      <label
        className={fileName ? "upload-card uploaded" : "upload-card"}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          selectFile(event.dataTransfer.files[0] ?? null);
        }}
      >
        <input
          type="file"
          aria-label="예시 데이터 파일"
          accept=".csv,.xlsx,.jsonl"
          onChange={(event) => {
            selectFile(event.target.files?.[0] ?? null);
            event.target.value = "";
          }}
        />
        <span className="upload-symbol">＋</span>
        <div>
          <strong>{fileName || "파일을 선택하거나 여기로 끌어오세요"}</strong>
          <small>
            {fileName
              ? "파일 선택됨 · 내용 분석과 업로드는 아직 연결되지 않았어요"
              : "엑셀, CSV, JSONL · 최대 20MB"}
          </small>
        </div>
        <span className="upload-action">
          {fileName ? "다시 선택" : "파일 선택"}
        </span>
      </label>
      {fileError && (
        <p className="feedback error" role="alert">
          {fileError}
        </p>
      )}
      <div className="data-status">
        <div>
          <span className="status-icon ok">◇</span>
          <strong>{exampleCount}개</strong>
          <small>데모 시나리오의 예시 수</small>
        </div>
        <div>
          <span className="status-icon fix">↻</span>
          <strong>미검사</strong>
          <small>파일 내용·형식</small>
        </div>
        <div>
          <span className="status-icon safe">◇</span>
          <strong>미검사</strong>
          <small>민감정보</small>
        </div>
      </div>
      <div className="example-preview">
        <div className="section-label">
          <strong>질문과 좋은 답변의 샘플</strong>
          <span>선택한 파일의 분석 결과가 아닙니다</span>
        </div>
        <div className="conversation-pair">
          <div>
            <span>업무 입력·조건</span>
            <p>{selectedGoal.example}</p>
          </div>
          <div>
            <span>AI가 배울 좋은 답변</span>
            <p>{selectedGoal.answer}</p>
          </div>
        </div>
      </div>
      <div className="panel-footer">
        <button
          className="quiet-button"
          type="button"
          onClick={() => setStage(0)}
        >
          이전
        </button>
        <button
          className="primary-action"
          type="button"
          onClick={() => setStage(2)}
        >
          이 기준으로 동작 설계하기 <span>→</span>
        </button>
      </div>
    </div>
  );
}
