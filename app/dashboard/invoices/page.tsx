import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchInvoicesPages } from '@/app/lib/data';
// 페이지당 최대 6개의 송장을 반환하라는 데이터 가져옴

/**
 * the useSearchParams() hook vs. the searchParams prop?
 * 언제 훅을 사용하고 언제 프롭을 사용해야할까?
 *  - <Search>클라이언트 구성 요소이므로 useSearchParams()클라이언트에서 매개변수에 액세스하기 위해 훅 사용
 *  - <Table>는 자체 데이터를 가져오는 서버 구성 요소이므로 searchParams페이지에서 구성 요소로 prop을 전달
 */
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }; // searchParams가 props 허용하므로 현재 URL 매개변수를 <Table>구성 요소에 전달가능
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);
  // 송장 데이터를 받아와서 전달받은 query를 인자로 넣어 검색어에 따라 총페이지수 반한하여 변수 할당
  // 페이지당 최대 6개의 송장을 반환하므로, 결과가 13개이면 총 페이지수는 3이 됨

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      {/* <Suspense>로 감싸 스켈레톤UI로 스트리밍 처리 */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        {/* 페이지수 totalPages prop 전달 */}
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}