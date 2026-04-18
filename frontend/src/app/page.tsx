'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const { token } = useAppStore();

  useEffect(() => {
    if (token) {
      router.replace('/welcome');
    } else {
      router.replace('/login');
    }
  }, [token, router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );
}
