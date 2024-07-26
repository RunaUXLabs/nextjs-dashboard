'use client';
// 클라이언트 구성요소라고 선언. 이벤트 리스너와 훅을 사용할 수 있다.

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
// 훅 가져오기

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname(); // URL문자열 구성용
  const searchParams = useSearchParams(); // 새 페이지 번호 설정
  const currentPage = Number(searchParams.get('page')) || 1;

  // PageURL을 생성하는 함수
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    // 현재 검색 매개변수로 인스턴스 생성
    params.set('page', pageNumber.toString());
    // 인스턴스에 페이지 번호 업데이트
    return `${pathname}?${params.toString()}`;
    // 구성된 URL 반환
  };
}