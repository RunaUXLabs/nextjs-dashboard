'use server';
// 해당 파일 내의 모든 함수를 서버작업으로 표시

import { z } from 'zod';
// 양식 데이터를 데이터베이스로 보내기 전에 올바른 형식과 올바른 유형인지 확인해야 한다.
// 이를 쉽게 도와주는 TypeScript-first validation library(유형검증라이브러리) zod를 활용하자
// 폼 객체의 모양과 일치하는 스키마 FormSchema 정의
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// 인보이스 생성
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// 이 스키마는 formData데이터베이스에 저장하기 전에 유효성을 검사한다.

import { sql } from '@vercel/postgres';
// DB에 데이터 삽입하기 위해 SQL가져오기
import { revalidatePath } from 'next/cache';
// 재검증을 위한 훅 가져오기
// Next.js에는 경로 세그먼트를 일정 시간 동안 사용자 브라우저에 저장하는 클라이언트 측 라우터 캐시가 있음. 사전 페칭 과 함께 사용자가 서버에 대한 요청 수를 줄이는 동시에 경로 간을 빠르게 탐색할 수 있게 도와줌.
import { redirect } from 'next/navigation';
// 데이터가 업데이트 되면 송장 페이지로 리디렉션하기 위해 훅 가져오기

export async function createInvoice(formData: FormData) {
  // FormData에서 .get(name)을 활용하여 정보를 추출한다.
  // 필드가 많은 양식일 경우엔 FormData의 entries()와 바닐라의 Object.fromEntries()를 활용한다.
  // 예시) const rawFormData = Object.fromEntries(formData.entries())

  // 기본 추출법
  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // };

  // console.log(rawFormData);

  // 구조분해할당하여 추출법
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100; // 센트단위 저장공식 적용
  const date = new Date().toISOString().split('T')[0]; // 송장 생성 날짜에 대해 "YYYY-MM-DD" 형식으로 지정

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  // SQL 쿼리를 만들어 새 송장을 데이터베이스에 삽입하고 변수를 전달

  revalidatePath('/dashboard/invoices');
  // 데이터베이스가 업데이트되면 경로 /dashboard/invoices가 다시 검증되고 서버에서 최신 데이터를 가져옴
  redirect('/dashboard/invoices');
  // 송장페이지로 보내기
}

/**
 * 업데이트 인보이스, 생성로직과 비슷하다
 * 1. formData에서 데이터 추출
 * 2. Zod 사용하여 유형검증하기
 * 3. 금액을 센트로 환산
 * 4. SQL query에 변수 전달
 * 5. revalidatePath의 클라이언트 캐시를 지우고 새로운 서버요청 호출
 * 6. redirect를 이용하여 송장페이지로 리디렉션
 */
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 인보이스 삭제
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}