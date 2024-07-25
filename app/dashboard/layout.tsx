import SideNav from '@/app/ui/dashboard/sidenav';
// 모바일이하에선 top nav, 태블릿 이상에선 side nav 컴포넌트 가져오기 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
      {/* children은 page.tsx임, layout.tsx에서는 각 컴포넌트 조합을 구성하면 된다.
        partial rendering: layout은 최초 렌더링 이후 페이지의 컴포넌트에서
        업데이트가 일어나도 재렌더링이 되지 않는다. */}
    </div>
  );
}
export const experimental_ppr = true;
/**
 * 부분사전 렌더링 구현을 위한 PPR활성화
 * 부분 사전 렌더링은 React의 Suspense를 사용한다.
 * 특정 조건(데이터 로드 등)이 충족될 때까지애플리케이션의 일부 렌더링을 연기함.
 * <Suspense></Suspense>로 감싸서 폴백 처리해놓고 해당 옵션을 활성화하면
 * 부분적으로 정적 셸을 사전렌더링 한다.
 * 정적 셸은 동적 콘텐츠가 비동기적으로 로드되는 곳에 구멍(홀)을 내어 자리를 마련해 놓음.
 * 동적 콘텐츠의 렌더링은 사용자가 경로를 요청할 때까지 연기됨.
 * Next.js는 경로의 정적 부분을 미리 렌더링하고 사용자가 요청할 때까지 동적 부분을 연기하여
 * 프로덕션 단계에서는 성능 향상을 시킨다.
 */