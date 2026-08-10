import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모델리 | 누구나 쉽게 만드는 나만의 AI",
  description:
    "좋은 예시만 준비하면 데이터 확인부터 학습 설정, 결과 비교까지 쉽게 안내하는 파인튜닝 스튜디오입니다.",
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
