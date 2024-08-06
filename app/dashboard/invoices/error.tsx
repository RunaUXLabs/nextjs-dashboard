'use client' // 에러 컴포넌트에서는 무조건 클라이언트 구성요소여야 한다.

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
  // 오류 경계를 재설정하는 함수, 실행시 경로 세그먼트 리렌더링 시킴
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}