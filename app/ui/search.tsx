'use client';
// 클라이언트 구성요소라고 선언. 이벤트 리스너와 훅을 사용할 수 있다.

import { useDebouncedCallback } from 'use-debounce';
// 디바운스 콜백함함수 가져오기

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// Next.js APIs 훅 가져오기

/**
 * the useSearchParams() hook vs. the searchParams prop?
 * 언제 훅을 사용하고 언제 프롭을 사용해야할까?
 *  - <Search>클라이언트 구성 요소이므로 useSearchParams()클라이언트에서 매개변수에 액세스하기 위해 훅 사용
 *  - <Table>는 자체 데이터를 가져오는 서버 구성 요소이므로 searchParams페이지에서 구성 요소로 prop을 전달
 */
export default function Search({ placeholder }: { placeholder: string }) {
  // 훅 리턴값 변수에 할당
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter(); // 구조분해할당

  // 디바운스래핑하기  
  const handleSearch = useDebouncedCallback((term) => {
    // function handleSearch(term: string) {
    // console.log(term);
    // console.log(`Searching... ${term}`);
    // 사용자 입력을 캡쳐하여 찍어줌, 타이핑마다 찍히게 되면 과부하가 걸릴 수 있다.

    // 디바운싱을 이용하여 사용자가 타이핑을 멈췄을 때만 데이터베이스를 쿼리하도록 개선해 보자!
    // use-debounce 라이브러리 활용

    /**
     * 디바운싱 작동 방식
     * 트리거 이벤트 : 디바운스되어야 하는 이벤트(예: 검색 상자의 키 입력)가 발생하면 타이머 시작
     * 대기 : 타이머가 만료되기 전에 새로운 이벤트가 발생하면 타이머 재설정
     * 실행 : 타이머가 카운트다운 끝에 도달하면, 디바운스된 함수 실행
     */

    const params = new URLSearchParams(searchParams);
    // 새 searchParams 변수를 URLSearchParams에 넣고 쿵짝!
    // URLSearchParams는 URL 쿼리 매개변수를 조작하기 위한 유틸리티 메서드를 제공하는 웹 API이다.

    params.set('page', '1');
    // 사용자가 새로운 검색 쿼리를 입력하면 페이지 번호를 1로 재설정
    if (term) {
      params.set('query', term);
      // input에 문자열 들엉있으면 쿼리로 등록
    } else {
      params.delete('query');
      // 없으면 쿼리 쿼리 자체를 삭제
    }

    replace(`${pathname}?${params.toString()}`);
    // 현재나의경로?사용자검색데이터
    // /dashboard/invoices?query=검색어
    // Next.js의 클라이언트 측 탐색 기능 덕분에 페이지를 다시 로드하지 않고도 URL이 업데이트됨
  }, 300);


  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
          // value가 변경될 때마다 handleSearch() 콜링
        }}
        defaultValue={searchParams.get('query')?.toString()}
      // input의 기본값을 URL입력과 동기화
      // 걍 value는 컨트롤이 안되고, defaultValue는 컨트롤 가능
      // 상태값 state를 사용할 땐 value를 쓴다, 하지만 여기선 state를 쓰지 않으니 대체재를 쓰는 것이다.
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
