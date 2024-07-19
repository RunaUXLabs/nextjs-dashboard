'use client';
// 활성화된 링크를 표현하기 위해 사용자의 현재 경로를 가져와야 한다.
// Next.js는 경로를 확인하고 이 패턴을 구현하는 데 사용할 수 있는 훅 usePathname()을 제공한다.
// 이를 사용하기 위해서는 클라이언트 컴포넌트로 변환해야한다.
import { usePathname } from 'next/navigation';
import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link'; // 네비게이션을 위한 링크컴포넌트 가져오기
import clsx from 'clsx'; // 토글 스타일을 위한 함수가져오기

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

//  기존 React SPA와 달리, 브라우저가 초기 로드 시에 모든 애플리케이션 코드를 로드한다.
//  라우트로 코드를 분할하면 페이지가 격리되며,  <Link>컴포넌트가 뷰포트에 구성 요소가 나타날 때마다
//  Next.js는 자동으로 백그라운드에서 연결된 경로의 코드를 미리 가져옴.
//  사용자가 링크를 클릭할 때쯤이면 대상 페이지의 코드가 이미 백그라운드에 로드되어 페이지 전환된다. 

const links = [
  {
    name: 'Home', // 컴포넌트 이름
    href: '/dashboard', // 라우터 경로
    icon: HomeIcon // heroicons 컴포넌트 사용
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: UserGroupIcon
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {/* .map()을 활용하여 라우터 데이터 순환하여 링크 만듦 */}
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
