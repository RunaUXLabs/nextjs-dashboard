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