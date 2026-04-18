'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Target, TrendingUp, Lock, Mail, User } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAppStore } from '@/lib/store';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 10,
}));

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setTheme, token } = useAppStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    if (token) router.replace('/welcome');
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let res;
      if (mode === 'register') {
        res = await authAPI.register({ username: form.username, email: form.email, password: form.password });
      } else {
        res = await authAPI.login({ username: form.username, password: form.password });
      }
      const { access_token, user } = res.data;
      setToken(access_token);
      setUser(user);
      setTheme(user.theme || 'dark-purple');
      router.push('/welcome');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Target, text: 'Daily goal tracking with AI insights' },
    { icon: TrendingUp, text: 'Business goal management' },
    { icon: Zap, text: 'Weekly AI-powered summaries' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          zIndex: 1,
        }}
        className="hidden-mobile"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60 }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99,102,241,0.5)'
          }}>
            <Zap size={24} color="white" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            GoalFlow
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: 'Space Grotesk, Inter, sans-serif' }}
        >
          Achieve more,{' '}
          <span className="gradient-text">every single day.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 18, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 48 }}
        >
          Your AI-powered companion for daily goals, business ambitions,
          and weekly insights that move the needle.
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} color="var(--color-primary)" />
              </div>
              <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>{text}</span>
            </motion.div>
          ))}
        </div>

        {/* Animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ display: 'flex', gap: 40, marginTop: 60 }}
        >
          {[['10K+', 'Goals Tracked'], ['94%', 'Completion Rate'], ['5★', 'User Rating']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>{num}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right panel - Auth form */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="glass-strong"
          style={{
            width: '100%',
            borderRadius: 24,
            padding: '40px',
          }}
        >
          {/* Mode toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 32,
          }}>
            {(['login', 'register'] as const).map(m => (
              <motion.button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.3s',
                  background: mode === m ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'transparent',
                  color: mode === m ? 'white' : 'var(--color-text-muted)',
                  boxShadow: mode === m ? '0 4px 15px rgba(99,102,241,0.4)' : 'none',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </motion.button>
            ))}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            {mode === 'login' ? 'Welcome back 👋' : 'Join GoalFlow 🚀'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 28 }}>
            {mode === 'login'
              ? "Sign in to continue your journey"
              : "Start tracking your goals with AI"}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 44 }}
                placeholder="Username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                id="username-input"
              />
            </div>

            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', position: 'relative' }}
                >
                  <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1 }} />
                  <input
                    className="input-field"
                    style={{ paddingLeft: 44 }}
                    placeholder="Email address"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required={mode === 'register'}
                    id="email-input"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 44, paddingRight: 44 }}
                placeholder="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                id="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(244,63,94,0.15)',
                    border: '1px solid rgba(244,63,94,0.3)',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#fda4af',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              id="submit-btn"
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--color-text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
