import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;
// NextAuth객체를 authConfig로 초기화하여 auth속성 내보내기

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // 미들웨어 옵션 matcher를 사용하여 특정경로에서 실행되도록 지정
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// 미들웨어가 인증을 확인할 때까지 보호된 경로가 렌더링을 시작하지 않는점을 활용하면 애플리케이션의 보안과 성능이 모두 향상된다.