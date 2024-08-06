import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // 로그인여부 확인
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // 로그인하면 대시보드록 이동하게 패스 설정

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // 로그인을 하지 않은 사용자는 대시보드에 접근할 수 없도록 Redirect 처리
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // NextAuth 구성을 충족하기 위한 빈 배열, 추후 다양한 로그인 옵션(자격증명공급자) 추가
} satisfies NextAuthConfig;