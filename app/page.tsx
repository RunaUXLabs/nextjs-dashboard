import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'; // 네비게이션을 위한 링크컴포넌트 가져오기
import styles from '@/app/ui/home.module.css';
// css를 모듈식으로 가져오면 로컬(지역)적용으로 충돌방지 가능
import { lusitana } from '@/app/ui/fonts';
// 보조글꼴
import Image from 'next/image';
// 이미지 컴포넌트 활용하기

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-end p-4">
        <div className={styles.shape} />
        {/* 모듈식으로 가져올 경우 객체접근, 일반 css 작성방식 모두 사용가능함 */}
        {/* <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black" /> */}
        <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
          Vercel
        </p>
      </div>
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* 히어로 이미지 컴포넌트 반응형 구분삽입, md이상 block 그 외 hidden, md이상 hidden 그 외 block" */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>

      </div>
    </main>
  );
}
