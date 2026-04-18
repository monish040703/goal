'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare, Building2, Brain, Settings, Zap,
  LogOut, Menu, X, Home, BarChart2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const NAV_ITEMS = [
  { icon: Home, label: 'Welcome', href: '/welcome' },
  { icon: CheckSquare, label: 'Daily Tasks', href: '/tasks' },
  { icon: Building2, label: 'Business Goals', href: '/business' },
  { icon: Brain, label: 'AI Summary', href: '/summary' },
  { icon: Settings, label: 'AI Themes', href: '/settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout, themeColors } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    setMounted(true);
    // Apply theme CSS vars from store
    if (themeColors) {
      document.documentElement.style.setProperty('--color-primary', themeColors.primary);
      document.documentElement.style.setProperty('--color-secondary', themeColors.secondary);
      document.documentElement.style.setProperty('--color-accent', themeColors.accent);
      document.documentElement.style.setProperty('--color-bg', themeColors.background);
    }
  }, [token, router, themeColors]);

  if (!mounted) return null;

  return (
    <div className="main-layout" style={{ background: 'var(--color-bg)' }}>
      <div className="orb orb-1" style={{ opacity: 0.08 }} />
      <div className="orb orb-2" style={{ opacity: 0.08 }} />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        style={{ zIndex: 50 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif' }}>GoalFlow</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 16 }}>
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(href + '/') && href !== '/welcome';
            return (
              <motion.button
                key={href}
                onClick={() => { router.push(href); setSidebarOpen(false); }}
                className={`nav-link ${active ? 'active' : ''}`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', textAlign: 'left' }}
                id={`nav-${label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon size={18} />
                {label}
              </motion.button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Free Plan</div>
            </div>
          </div>

          <motion.button
            className="nav-link"
            style={{ width: '100%', color: '#fda4af' }}
            onClick={() => { logout(); router.push('/login'); }}
            whileTap={{ scale: 0.97 }}
            id="logout-btn"
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile header */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '16px 20px',
        background: 'rgba(15,10,30,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        alignItems: 'center', justifyContent: 'space-between',
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={20} color="var(--color-primary)" />
          <span style={{ fontWeight: 700 }}>GoalFlow</span>
        </div>
        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Main content */}
      <main className="page-content" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
