import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

// 여기는 루트레이아웃이며, 해당 프로젝트 구성시 필수조건임.
export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
      {/* 객체 점표기접근한 내용을 템플릿리터럴형식으로 삽입  */}
    </html>
  );
}
