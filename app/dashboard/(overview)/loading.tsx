/**
 * 스트리밍 구현하기
 * 1. loading.tsx라는 이름의 파일을 쓰는 것 만으로도 Next.js의 Suspense를 기반으로
 *    페이지 콘텐츠가 로드되는 동안 대체 UI로 표시되는 폴백 UI를 구축할 수 있다.
 * 2. 정적렌더링이며, 동적콘텐츠가 로딩되는 동안 정적 콘텐츠를 작동시킬 수 있다.
 * 3. 사용자는 모든 로딩이 다 끝날 때 까지 기다릴 필요가 없다(interruptable navigation).
 * 
 * 로딩스켈레톤 폴더 디렉토링에 관련된 버그해결하기:
 * 렌더링 되는 페이지와 동일한 형제급으로 loading.tsx를 만들면 된다.
 * 상위폴더에 해당 파일이 위치하게 되면 다른폴더 하위 레벨에도 영향을 미치는 버그가 있다.
 * 이런경우 Route Groups를 통해 해결해야하는데, 로딩스켈레톤을 사용하려는 위치를
 * /(overview)/파일들 구성으로 그룹핑한다.
 * Route Groups을 사용하면 ()안의 이름이 URL에 포함되지 않아서 섹션구분 팀구분 용으로도 쓰인다.
 */
import DashboardSkeleton from '@/app/ui/skeletons';
export default function Loading() {
  // return <div>Loading...</div>;
  return <DashboardSkeleton />;
  // 로딩스켈레톤을 통해 추가된 UI는 정적파일의 일부로 임베딩 후 => 동적 콘텐츠는 서버에서 클라이언트로 스트리밍
  // 기다리는 동안 출력하려는 UI의 간소화된 버전(사각사각)으로 보이다가 데이터 렌더링
}