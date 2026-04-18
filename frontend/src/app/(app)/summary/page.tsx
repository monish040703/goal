'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, Lightbulb, RefreshCw, CheckCircle } from 'lucide-react';
import { aiAPI } from '@/lib/api';

interface SummaryData {
  summary: string;
  insights: string[];
  recommendations: string[];
}

export default function SummaryPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await aiAPI.weeklySummary();
      setSummaryData(res.data);
    } catch (e: any) {
      setError('Failed to generate summary. Please try again.');
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
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(245,158,11,0.4)',
          }}>
            <Brain size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              AI Weekly Summary
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
              Powered by LangGraph — get insights on your week
            </p>
          </div>
        </div>
      </motion.div>

      {/* Generate button */}
      {!summaryData && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '60px 40px' }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ marginBottom: 24 }}
          >
            <Sparkles size={64} color="#f59e0b" style={{ margin: '0 auto', filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))' }} />
          </motion.div>

          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Ready for your weekly review?</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Our AI agent will analyze your tasks and business goals, then generate personalized insights and recommendations.
          </p>

          <motion.button
            className="btn-primary"
            style={{ fontSize: 16, padding: '16px 40px' }}
            onClick={generateSummary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            id="generate-summary-btn"
          >
            <Brain size={20} />
            Generate AI Summary
          </motion.button>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ marginBottom: 24 }}>
            <motion.div
              style={{
                width: 80, height: 80, margin: '0 auto',
                border: '4px solid rgba(245,158,11,0.2)',
                borderTopColor: '#f59e0b',
                borderRadius: '50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>AI is analyzing your week...</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            LangGraph agent is processing your goals and generating insights
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {['Analyzing tasks', 'Processing business goals', 'Generating insights'].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.5 }}
                className="badge"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: '16px 20px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 12, marginBottom: 20, color: '#fda4af' }}
        >
          {error}
        </motion.div>
      )}

      {/* Summary Results */}
      <AnimatePresence>
        {summaryData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Main summary */}
            <motion.div
              className="glass"
              style={{ borderRadius: 20, padding: 32, marginBottom: 20, borderLeft: '4px solid #f59e0b' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Sparkles size={20} color="#f59e0b" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Weekly Overview
                </span>
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-text)' }}>{summaryData.summary}</p>
            </motion.div>

            {/* Insights */}
            <motion.div
              className="glass"
              style={{ borderRadius: 20, padding: 28, marginBottom: 20 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <TrendingUp size={20} color="#6366f1" />
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Key Insights</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {summaryData.insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa' }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)' }}>{insight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="glass"
              style={{ borderRadius: 20, padding: 28, marginBottom: 24 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Lightbulb size={20} color="#10b981" />
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Next Week's Recommendations</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {summaryData.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)' }}>{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Regenerate */}
            <div style={{ textAlign: 'center' }}>
              <motion.button
                className="btn-ghost"
                onClick={generateSummary}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="regenerate-summary-btn"
              >
                <RefreshCw size={16} />
                Regenerate Summary
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
