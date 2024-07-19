import { Inter, Lusitana } from 'next/font/google'; // 기본폰트 설정

export const inter = Inter({ subsets: ['latin'] }); // 메인글꼴 셋팅값
// 보조글꼴 셋팅값
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});