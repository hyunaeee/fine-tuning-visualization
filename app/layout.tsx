import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "모델리 | 목적별 모델을 고르고 레시피로 저장하는 AI 튜닝 콘솔";
const description =
  "목적에 맞는 AI 모델을 추천받고, 다이얼로 규칙·말투·길이·표현을 조정해 재사용 가능한 레시피로 저장하고 즉시 검증하는 튜닝 워크스페이스입니다.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? (host?.includes("localhost") ? "http" : "https");
  const origin = host
    ? `${protocol}://${host}`
    : "https://modely-finetune-kr.likecorp817.chatgpt.site";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: `${origin}/og-recipe.png`, width: 1200, height: 630, alt: "모델리 모델 랙과 튜닝 레시피 북" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og-recipe.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
