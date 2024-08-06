import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

// 모든 또는 파일에서 metadata객체를 포함하여 제목 및 설명과 같은 추가 페이지 정보를 추가할 수 있음, 모든 메타데이터는 그것을 사용하는 모든 페이지에서 상속됨
import { Metadata } from 'next'; // 메타데이터 객체 가져오기

// 새 메타데이터 객체 만들기, 자동으로 타이틀 반영하도록 적용하기
export const metadata: Metadata = {
  // title: 'Acme Dashboard', // 기본 타이틀
  title: {
    template: '%s | Acme Dashboard',
    // title.template의 필드를 사용하여 metadata페이지 제목에 대한 템플릿을 정의할 수 있음, 각 page.tsx에 설정한 타이틀이 있다면 %s로 분류되어 특정페이지의 타이틀을 반영할 수 있음.
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

// 여기는 루트레이아웃이며, 해당 프로젝트 구성시 필수조건임.
export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
      {/* 객체 점표기접근한 내용을 템플릿리터럴형식으로 삽입  */}
    </html>
  );
}
