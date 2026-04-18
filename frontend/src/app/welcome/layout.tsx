'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

  return <>{children}</>;
}
