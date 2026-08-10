import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "모델리 | 만들고, 검증하고, 고객에게 전달하는 AI";
const description =
  "전문 용어 없이 파인튜닝하고, 결과를 검증한 뒤 링크·웹 위젯·API·인계 문서로 전달하는 AI 워크스페이스입니다.";

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
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "모델리 파인튜닝 워크스페이스" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
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
