export default function Page() {
  return (
    <p className="flex h-screen flex-col">
      <span>dashboard/Page.tsx 파일</span>
      <span>라우팅 구성은 각 디렉토리안의 page.tsx에서 구성한다.</span>
      <span>page.tsx에 다양한 컴포넌트를 삽입</span>
      <span>page.tsx는 layout.tsx의 children으로 삽입된다.</span>
    </p>
  );
}