import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "모델리 | 다이얼로 조정하고 바로 검증하는 AI 튜닝 콘솔";
const description =
  "다이얼과 스위치로 AI의 규칙, 말투, 길이와 표현을 조정하고 테스트를 바꿀 때마다 결과를 즉시 검증하는 파인튜닝 워크스페이스입니다.";

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
      images: [{ url: `${origin}/og-console.png`, width: 1200, height: 630, alt: "모델리 라이브 튜닝 콘솔" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og-console.png`],
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
