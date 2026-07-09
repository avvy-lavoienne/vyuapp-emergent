'use client';

import dynamic from 'next/dynamic';

const DiscoveryForm = dynamic(() => import('@/components/DiscoveryForm'), {
  ssr: false,
});

export default function DiscoveryTestPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Discovery Form Test</h1>
        <DiscoveryForm />
      </div>
    </main>
  );
}
