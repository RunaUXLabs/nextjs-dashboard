import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// 비밀번호 해싱을 위한 전처리

import Credentials from 'next-auth/providers/credentials';
// 자격 증명 공급자를 사용하고 있지만 일반적으로 OAuth 와 같은 대체 공급자를 사용할 것
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// 자격 증명을 검증한 후 getUser데이터베이스에서 사용자에게 쿼리를 보내는 함수
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig, // 전개구문을 거친 authConfig를 객체 인자로 삼고 NextAuth()가 반환하는 값을 구조분해 할당
  providers: [
    Credentials({
      // 사용자가 데이터베이스에 있는지 확인하기 전에 이메일과 비밀번호를 검증하는 데 authorize사용
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          // 비밀번호가 일치하는지 bcrypt.compare 콜링

          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
        // 비밀번호가 일치하면 사용자를 반환하고, 일치하지 않으면 null사용자가 로그인하는 것을 방지하기 위해 null반환
      },
    })
  ], // 자격 증명 공급자 추가
});