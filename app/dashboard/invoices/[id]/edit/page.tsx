// Next.js를 사용 하면 정확한 세그먼트 이름을 모르고 데이터를 기반으로 경로를 만들고 싶을 때  폴더 이름을 대괄호로 묶어 동적 경로 세그먼트를 만들 수 있다. 디렉토리/[id]/edit/page.tsx 구조를 지킬 것.

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';
// 송장데이터 가져오기
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
// 특정 송장데이터 가져오기
import { notFound } from 'next/navigation';
// 404 가져오기

export default async function Page({ params }: { params: { id: string } }) {
  // 송장의 데이터를 덮어씌울 템플릿이 될 거라서 양식을 미리 채워놓아야 함
  const id = params.id; // props로 전달한 id를 찾아 변수 할당
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id), //id를 인자로 넣어 찾은 지정된 송장 정보
    fetchCustomers(),
  ]); // Promise.all()을 사용하여 송장과 고객정보를 병렬로 가져와 구조분해 할당

  if (!invoice) notFound(); // 송장이 없으면 404 실행

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}

// 메타데이터로 웹페이지 타이틀 반영
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};