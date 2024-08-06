import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();
  // 서버 구성 요소로 고객정보를 페치하여 반환한 값을 변수에 저장

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
      {/* 서버 구성 요소로 고객정보를 페치하여 반환한 값 <Form>의 prop으로 전달 */}
    </main>
  );
}

// 메타데이터로 웹페이지 타이틀 반영
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};