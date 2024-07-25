/** @type {import('next').NextConfig} */

const nextConfig = {
  // 부분사전 렌더링 구현을 위한 PPR활성화, 특정 경로에 PPR을 사용할 수 있다.
  experimental: {
    ppr: 'incremental',
  },
};

export default nextConfig;
