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
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
// 데이터에서 수익과 송장번호 함수 가져오기


export default async function Page() {
  // 함수 콜링하여 변수 저장
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish

  // fetchCardData 반환값을 구조분해 할당
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Customers" value={numberOfCustomers} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}