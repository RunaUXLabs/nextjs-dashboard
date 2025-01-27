'use server';
// 해당 파일 내의 모든 함수를 서버작업으로 표시

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
// 인증 로직을 로그인 폼과 연결하기 위해 함수가져오기

import { z } from 'zod';
// 양식 데이터를 데이터베이스로 보내기 전에 올바른 형식과 올바른 유형인지 확인해야 한다.
// 이를 쉽게 도와주는 TypeScript-first validation library(유형검증라이브러리) zod를 활용하자
// 폼 객체의 모양과 일치하는 스키마 FormSchema 정의
const FormSchema = z.object({
  id: z.string(),
  // customerId: z.string(), //  customer 필드가 비어 있으면 type을 예상하기 때문에 오류를 발생
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  // amount: z.coerce.number(), // amount 유형을 string에서 number로 강제 변환하기 때문에, 비어 있으면 기본값이 0, 0보다 큰 amount를 입력하게끔 유도
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  // status: z.enum(['pending', 'paid']), // status 필드는 "보류 중" 또는 "지불됨"이란 값을 예상하는데, 비어 있으면 오류발생
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
}); // Zod를 사용하여 폼 데이터 세밀하게 경고문구 추가하여 검증체크 보완

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


export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
// createInvoice()에 파라미터 2개 허용되도록 설정, prevState: 후크에서 전달된 상태 포함, formData: 폼에서 넘어오는 데이터
// 해당 예제에선 useActionState 훅을 쓰고 있지 않지만, 필수 prop이니 알아둘 것
export async function createInvoice(prevState: State, formData: FormData) {
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
  // const { customerId, amount, status } = CreateInvoice.parse({
  const validatedFields = CreateInvoice.safeParse({
    // parse()를 safeParse()로 업그레이드, success/error 중 하나를 포함하는 객체를 반환함.
    // try/catch block 내부 검증문을 넣지 않고도 유효성 검사를 보다 우아하게 처리 가능
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // 유효성 검사에 실패하면 오류를 조기에 반환
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  // 위의 구조분해할당 추출을 validatedFields 반환값의 data키에서 진행

  const amountInCents = amount * 100; // 센트단위 저장공식 적용
  const date = new Date().toISOString().split('T')[0]; // 송장 생성 날짜에 대해 "YYYY-MM-DD" 형식으로 지정


  // try/catch문으로 SQL 쿼리를 만들어 새 송장을 데이터베이스에 삽입하고 변수를 전달
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

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

// lint 접근성 검증 추가한 인보이스 업데이트
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  } // try/catch문으로 기존 송장에서 변경되는 정보를 전달

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// 인보이스 삭제
export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice'); // 에러 일부러 던지고 메시지 확인

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }// try/catch문으로 SQL 쿼리로 데이터베이스 삭제 후, /dashboard/invoices가 다시 검증하고 서버에서 최신 데이터를 가져옴
}


// 인증로직에 의해 오류처리하기
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}