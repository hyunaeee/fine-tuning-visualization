"use client";
import { useState } from "react";
import { buildHandoff, shareFragment } from "../domain/handoff";
import { copyText, downloadJson } from "../browser/actions";
import type { AudienceId, Notice, RecipeSettings } from "../domain/types";

export function useHandoff(settings: RecipeSettings, audience: AudienceId) {
  const fragment = shareFragment(settings);
  const key = audience + fragment;
  const [feedback, setFeedback] = useState<{
    key: string;
    notice: Notice;
    link?: string;
  } | null>(null);
  async function copyLink() {
    const link = window.location.origin + window.location.pathname + fragment;
    const success = await copyText(link, (value) =>
      navigator.clipboard.writeText(value),
    );
    setFeedback({
      key,
      link,
      notice: {
        kind: success ? "success" : "error",
        message: success
          ? "현재 설정을 여는 링크를 복사했어요."
          : "링크를 복사하지 못했어요. 아래 주소를 직접 복사해주세요.",
      },
    });
  }
  function downloadBundle() {
    try {
      downloadJson(
        buildHandoff(settings, audience, new Date().toISOString()),
        "modely-" + settings.goal + "-demo.json",
      );
      setFeedback({
        key,
        notice: {
          kind: "success",
          message: "설정과 예시 결과를 담은 JSON 파일의 다운로드를 시작했어요.",
        },
      });
    } catch {
      setFeedback({
        key,
        notice: {
          kind: "error",
          message:
            "파일을 만들지 못했어요. 브라우저의 다운로드 설정을 확인해주세요.",
        },
      });
    }
  }
  return {
    copyLink,
    downloadBundle,
    feedback: feedback?.key === key ? feedback : null,
  };
}
