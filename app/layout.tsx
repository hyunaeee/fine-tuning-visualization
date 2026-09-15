import type { Metadata } from "next";
import "./globals.css";

const title = "모델리 | 업무 특화 AI를 설계하는 파인튜닝 작업실";
const description =
  "정책 준수, 기술지원 분류, 문서 구조화, 콘텐츠 검수를 위한 데이터·출력·검증 기준을 설계합니다. 업무별 레시피와 평가 계획을 공유하는 프런트엔드 제품 데모입니다.";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = productionHost
  ? `https://${productionHost}`
  : "https://fine-tuning-visualization.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: "/og-recipe.png",
        width: 1200,
        height: 630,
        alt: "모델리 모델 랙과 튜닝 레시피 북",
      },
    ],
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
