'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Check, Wand2, RefreshCw } from 'lucide-react';
import { aiAPI } from '@/lib/api';
import { useAppStore, THEMES } from '@/lib/store';

const THEME_PREVIEWS: Record<string, { name: string; description: string; emoji: string }> = {
  'dark-purple': { name: 'Cosmic Purple', description: 'Mysterious & creative', emoji: '🔮' },
  'dark-cyan': { name: 'Ocean Depth', description: 'Calm & professional', emoji: '🌊' },
  'dark-green': { name: 'Forest Sage', description: 'Natural & growth-focused', emoji: '🌿' },
  'dark-rose': { name: 'Sunset Rose', description: 'Passionate & bold', emoji: '🌹' },
  'dark-amber': { name: 'Golden Hour', description: 'Energetic & warm', emoji: '✨' },
  'dark-blue': { name: 'Midnight Blue', description: 'Corporate & trustworthy', emoji: '💼' },
  'midnight': { name: 'Deep Midnight', description: 'Luxury & mysterious', emoji: '🌙' },
  'neon-city': { name: 'Neon City', description: 'Cyberpunk & electric', emoji: '⚡' },
};

const PROMPTS = [
  'I love calm ocean vibes',
  'Give me something energetic and warm',
  'Make it feel luxurious and dark',
  'I need something for business meetings',
  'I want cyberpunk neon vibes',
  'Nature and growth theme please',
];

export default function SettingsPage() {
  const { theme, setTheme } = useAppStore();
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ theme: string; message: string } | null>(null);
  const [error, setError] = useState('');

  const applyTheme = async (themeName: string) => {
    setTheme(themeName);
  };

  const applyAITheme = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await aiAPI.changeTheme(aiPrompt);
      const { theme: newTheme, message } = res.data;
      setTheme(newTheme);
      setResult({ theme: newTheme, message });
    } catch (e: any) {
      setError('Failed to apply AI theme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
          }}>
            <Palette size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              AI Theme Designer
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
              Tell the AI your vibe — it'll design your perfect theme
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI Theme Section */}
      <motion.div
        className="glass"
        style={{ borderRadius: 20, padding: 32, marginBottom: 28, borderLeft: '4px solid var(--color-primary)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Wand2 size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>AI Theme Generator</h2>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          Describe your mood, personality, or aesthetic — our LangGraph AI will pick the perfect theme for you.
        </p>

        {/* Prompt suggestions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {PROMPTS.map(p => (
            <motion.button
              key={p}
              onClick={() => setAiPrompt(p)}
              style={{
                padding: '7px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                background: aiPrompt === p ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                border: aiPrompt === p ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: aiPrompt === p ? 'var(--color-accent)' : 'var(--color-text-muted)',
                transition: 'all 0.2s',
              }}
              whileTap={{ scale: 0.95 }}
              id={`prompt-${p.slice(0,10).replace(/\s/g,'-')}`}
            >
              {p}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="input-field"
            style={{ flex: 1 }}
            placeholder="Describe your ideal theme vibe..."
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyAITheme()}
            id="theme-prompt-input"
          />
          <motion.button
            className="btn-primary"
            style={{ padding: '12px 24px', flexShrink: 0 }}
            onClick={applyAITheme}
            disabled={loading || !aiPrompt.trim()}
            whileTap={{ scale: 0.97 }}
            id="apply-ai-theme-btn"
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <><Sparkles size={16} /> Apply</>
            )}
          </motion.button>
        </div>

        {/* AI Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 16, padding: '14px 18px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <Check size={18} color="#10b981" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#6ee7b7', marginBottom: 2 }}>
                  Theme Applied: {THEME_PREVIEWS[result.theme]?.name || result.theme}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{result.message}</div>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 16, padding: '14px 18px', borderRadius: 12, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', fontSize: 14, color: '#fda4af' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Manual theme picker */}
      <motion.div
        className="glass"
        style={{ borderRadius: 20, padding: 28 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <Palette size={20} color="var(--color-accent)" />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Choose Theme</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {Object.entries(THEME_PREVIEWS).map(([key, { name, description, emoji }]) => {
            const colors = THEMES[key];
            const isActive = theme === key;
            return (
              <motion.button
                key={key}
                onClick={() => applyTheme(key)}
                style={{
                  padding: '20px 16px',
                  borderRadius: 16,
                  border: isActive ? `2px solid ${colors.primary}` : '2px solid rgba(255,255,255,0.08)',
                  background: isActive ? `${colors.primary}15` : 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isActive ? `0 0 20px ${colors.primary}40` : 'none',
                }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                id={`theme-${key}`}
              >
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 20, height: 20, borderRadius: '50%',
                      background: colors.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color="white" />
                  </motion.div>
                )}

                {/* Color swatches */}
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 12 }}>
                  {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
                    <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}80` }} />
                  ))}
                </div>

                <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? colors.primary : 'var(--color-text)', marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{description}</div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
