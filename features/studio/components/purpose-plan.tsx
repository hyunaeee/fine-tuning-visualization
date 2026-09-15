import {
  evaluationProtocol,
  optimizationSources,
  purposeBriefs,
} from "../data/purposes";
import type { GoalId } from "../domain/types";
import styles from "./purpose-plan.module.css";

export function PurposePlan({
  goal,
  evaluationOnly = false,
}: {
  goal: GoalId;
  evaluationOnly?: boolean;
}) {
  const brief = purposeBriefs[goal];
  return (
    <section
      className={styles.plan}
      aria-label={`${brief.shortTitle} 목적과 검증 계획`}
    >
      <header className={styles.heading}>
        <div>
          <span>
            {evaluationOnly
              ? "평가할 기준"
              : "왜 이 업무에 파인튜닝을 검토하나요?"}
          </span>
          <h2>
            {evaluationOnly
              ? "좋은 결과의 기준부터 확인하세요"
              : brief.shortTitle}
          </h2>
        </div>
        <small className={styles.status}>검증 설계 · 미실행</small>
      </header>
      {!evaluationOnly && (
        <div className={styles.cards}>
          {[
            ["01 / 해결할 문제", brief.problem],
            ["02 / 맞출 동작", brief.trainingTarget],
            ["03 / 먼저 비교할 방법", brief.baseline],
          ].map(([label, text]) => (
            <article key={label}>
              <strong>{label}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      )}
      <ul className={styles.criteria}>
        {brief.evaluation.map((item) => (
          <li key={item.label}>
            <span aria-hidden="true">◇</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.check}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.protocol}>{evaluationProtocol}</p>
      {!evaluationOnly && (
        <details className={styles.methods}>
          <summary>프롬프트·검색·파인튜닝, 어떻게 구분하나요?</summary>
          <p>
            지시와 말투는 프롬프트, 최신 사실과 문서는 검색(RAG), 반복되는
            분류·추출·지시 준수 실패는 검수된 예시를 이용한 학습을 검토합니다.
            정해진 JSON 형식은 구조화 출력부터 적용하세요. 파인튜닝만으로
            정확성이나 정책 준수가 보장되지는 않습니다.
          </p>
          <p>
            이 화면의 다이얼은 응답 예시를 바꾸는 제품 데모입니다.
            학습률·에포크를 조정하거나 모델 가중치를 업데이트하지 않습니다.
          </p>
          <a
            href={optimizationSources.workflow}
            target="_blank"
            rel="noreferrer"
          >
            공식 최적화 가이드 ↗
          </a>
          {" · "}
          <a href={optimizationSources.sft} target="_blank" rel="noreferrer">
            SFT·평가 우선 원칙 ↗
          </a>
        </details>
      )}
    </section>
  );
}
