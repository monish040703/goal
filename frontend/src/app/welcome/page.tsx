'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, CheckSquare, Building2, Brain, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const WORDS = ['Goals', 'Dreams', 'Ambitions', 'Vision', 'Success'];

function TypewriterText() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="gradient-text" style={{ minWidth: 200, display: 'inline-block' }}>
      {displayed}<span style={{ opacity: Math.sin(Date.now() / 500) > 0 ? 1 : 0 }}>|</span>
    </span>
  );
}

const cards = [
  {
    icon: CheckSquare,
    title: 'Daily Task Tracking',
    desc: 'Create task groups with subtasks, track completion percentage in real-time.',
    color: '#6366f1',
    delay: 0.3,
  },
  {
    icon: Building2,
    title: 'Business Goals',
    desc: 'Manage your startup or business milestones with detailed action plans.',
    color: '#10b981',
    delay: 0.5,
  },
  {
    icon: Brain,
    title: 'AI Weekly Summary',
    desc: 'Get personalized insights and recommendations powered by LangGraph AI.',
    color: '#f59e0b',
    delay: 0.7,
  },
  {
    icon: Sparkles,
    title: 'AI Theme Designer',
    desc: 'Tell the AI your vibe and watch it transform the entire interface in seconds.',
    color: '#ec4899',
    delay: 0.9,
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const { user, token } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    setMounted(true);
  }, [token, router]);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>
      {/* Animated orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 40px',
          background: 'rgba(15,10,30,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif' }}>GoalFlow</span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            className="btn-ghost"
            onClick={() => router.push('/tasks')}
            whileTap={{ scale: 0.97 }}
            id="goto-tasks-btn"
          >
            <CheckSquare size={16} />
            My Tasks
          </motion.button>
          <motion.button
            className="btn-primary"
            onClick={() => router.push('/business')}
            whileTap={{ scale: 0.97 }}
            id="goto-business-btn"
          >
            <Building2 size={16} />
            Business
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        padding: '120px 40px 80px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Welcome badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 20,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            fontSize: 13, fontWeight: 600, color: 'var(--color-accent)',
            marginBottom: 32,
          }}
        >
          <Sparkles size={14} />
          Welcome back, {user?.username}! Ready to crush it today?
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 88px)',
            fontWeight: 900,
            lineHeight: 1.05,
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            marginBottom: 24,
            letterSpacing: '-2px',
          }}
        >
          Conquer Your{' '}
          <br />
          <TypewriterText />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            fontSize: 20, color: 'var(--color-text-muted)', lineHeight: 1.6,
            maxWidth: 600, marginBottom: 48,
          }}
        >
          Track daily tasks, manage business goals, and let AI guide your weekly review —
          all in one beautifully designed flow.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button
            className="btn-primary"
            style={{ fontSize: 16, padding: '16px 36px' }}
            onClick={() => router.push('/tasks')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            id="start-tasks-btn"
          >
            Start Tracking Tasks
            <ArrowRight size={18} />
          </motion.button>
          <motion.button
            className="btn-ghost"
            style={{ fontSize: 16, padding: '16px 36px' }}
            onClick={() => router.push('/summary')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            id="view-summary-btn"
          >
            <Brain size={18} />
            AI Weekly Summary
          </motion.button>
        </motion.div>

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24, marginTop: 100,
          width: '100%', maxWidth: 1100,
        }}>
          {cards.map(({ icon: Icon, title, desc, color, delay }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => router.push(i < 2 ? (i === 0 ? '/tasks' : '/business') : (i === 2 ? '/summary' : '/settings'))}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${color}20`,
                border: `1px solid ${color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 600 }}>
                Explore <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated rings */}
        <motion.div
          style={{
            position: 'absolute', width: 600, height: 600,
            border: '1px solid rgba(99,102,241,0.1)',
            borderRadius: '50%', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 0,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            position: 'absolute', width: 800, height: 800,
            border: '1px solid rgba(99,102,241,0.06)',
            borderRadius: '50%', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 0,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
