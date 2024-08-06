// 기본형
// export default function Page() {
//   return (
//     <p className="flex h-screen flex-col">
//       <span>dashboard/Page.tsx 파일</span>
//       <span>라우팅 구성은 각 디렉토리안의 page.tsx에서 구성한다.</span>
//       <span>page.tsx에 다양한 컴포넌트를 삽입</span>
//       <span>page.tsx는 layout.tsx의 children으로 삽입된다.</span>
//     </p>
//   );
// }

// import { Card } from '@/app/ui/dashboard/cards';
import CardWrapper from '@/app/ui/dashboard/cards';
// 챕터9, Suspense에서 구성 요소를 래핑하기위해 변경
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
// //챕터7, 데이터에서 수익과 송장번호 함수 가져오기

// 챕터9, 스켈레톤 UI 부분적용하기 위해서 데이터에서 수익 fetchRevenue와 송장번호 fetchLatestInvoices, 카드 fetchCardData는 RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton으로 대체됨
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton
} from '@/app/ui/skeletons';
// 챕터9, 스켈레톤 UI 부분적용하기


export default async function Page() {
  // // 챕터7, 함수 콜링하여 변수 저장
  // const revenue = await fetchRevenue();
  // const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish

  // 챕터9, 스켈레톤 UI부분 적용하기위해 불필요한 함수 fetchRevenue, fetchLatestInvoices 제거후 리턴값 변경

  // 챕터7, fetchCardData 반환값을 구조분해 할당
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();
  // 챕터9, card.tsx로 이동

  /**
   * 데이터 요청은 의도치 않게 서로를 차단하여 request waterfall현상이 일어나게 된다.
   * Next.js는 이부분의 성능을 개선하기 위해 경로를 사전 렌더링하는데, 이를 정적 렌더링이라 한다.
   * 따라서 데이터가 변경되어도 대시보드에 반영되지 않는다.
   * 
   * waterfall현상(직렬식일때 생기는 문제점):
   * 이전 요청의 완료에 따라 달라지는 일련의 네트워크 요청을 말하며,
   * data fetching의 경우 넘겨 받아야지만 내 실행을 할 수 있다.
   */

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {/* 데이터 페치를 필요한 구성 요소로 옮긴 다음 해당 구성 요소를 Suspense로 래핑 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Customers" value={numberOfCustomers} type="customers" /> */}
        {/* 챕터9, card.tsx로 보내고 래핑한거 가져오기 */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 챕터7용 화면 */}
        {/* <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}

        {/* 챕터9용 화면
        <Suspense>로 <RevenueChart />를 감싸 넣으면 폴백 컴포넌트로 <RevenueChartSkeleton />를 넘길 수 있다. */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        {/* <Suspense>로 <LatestInvoices />를 감싸 넣으면 폴백 컴포넌트로 <LatestInvoicesSkeleton />를 넘길 수 있다. */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

// 메타데이터로 웹페이지 타이틀 반영
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};