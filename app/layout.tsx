import type { Metadata } from "next";
import "./globals.css";

const title = "모델리 | 목적별 모델을 고르고 레시피로 저장하는 AI 튜닝 콘솔";
const description =
  "목적에 맞는 AI 모델을 추천받고, 다이얼로 규칙·말투·길이·표현을 조정해 재사용 가능한 레시피로 저장하고 즉시 검증하는 튜닝 워크스페이스입니다.";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = productionHost
  ? `https://${productionHost}`
  : "https://modely-finetune-kr.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og-recipe.png", width: 1200, height: 630, alt: "모델리 모델 랙과 튜닝 레시피 북" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-recipe.png"],
  },
};

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
