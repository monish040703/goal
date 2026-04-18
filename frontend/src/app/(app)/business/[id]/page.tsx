'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Edit2, Check, X, CheckCircle2, Circle, Building2 } from 'lucide-react';
import { businessAPI } from '@/lib/api';
import { Business, BusinessGoal } from '@/lib/types';

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bizId = Number(params.id);
  const [biz, setBiz] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [desc, setDesc] = useState('');
  const [editingGoal, setEditingGoal] = useState<BusinessGoal | null>(null);
  const [editGoalForm, setEditGoalForm] = useState({ title: '', description: '' });

  const fetchBiz = async () => {
    try {
      const res = await businessAPI.get(bizId);
      setBiz(res.data);
      setDesc(res.data.description);
    } catch (e) { router.push('/business'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBiz(); }, [bizId]);

  const toggleGoal = async (goal: BusinessGoal) => {
    try {
      const res = await businessAPI.updateGoal(bizId, goal.id, { completed: !goal.completed });
      setBiz(b => b ? { ...b, goals: b.goals.map(g => g.id === goal.id ? res.data : g) } : b);
      setTimeout(fetchBiz, 300);
    } catch (e) {}
  };

  const addGoal = async () => {
    if (!newGoalTitle.trim()) return;
    setAddingGoal(true);
    try {
      await businessAPI.addGoal(bizId, { title: newGoalTitle, description: newGoalDesc });
      setNewGoalTitle('');
      setNewGoalDesc('');
      setShowAddGoal(false);
      await fetchBiz();
    } catch (e) {}
    finally { setAddingGoal(false); }
  };

  const deleteGoal = async (goalId: number) => {
    try {
      await businessAPI.deleteGoal(bizId, goalId);
      setBiz(b => b ? { ...b, goals: b.goals.filter(g => g.id !== goalId) } : b);
      setTimeout(fetchBiz, 300);
    } catch (e) {}
  };

  const saveDesc = async () => {
    try {
      await businessAPI.update(bizId, { description: desc });
      setBiz(b => b ? { ...b, description: desc } : b);
      setEditingDesc(false);
    } catch (e) {}
  };

  const saveGoalEdit = async () => {
    if (!editingGoal) return;
    try {
      const res = await businessAPI.updateGoal(bizId, editingGoal.id, editGoalForm);
      setBiz(b => b ? { ...b, goals: b.goals.map(g => g.id === editingGoal.id ? res.data : g) } : b);
      setEditingGoal(null);
    } catch (e) {}
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!biz) return null;

  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = (biz.completion_percentage / 100) * circumference;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <motion.button className="btn-ghost" style={{ marginBottom: 24 }} onClick={() => router.push('/business')} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.97 }} id="back-to-business-btn">
        <ArrowLeft size={16} /> Back to Business
      </motion.button>

      {/* Header */}
      <motion.div className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 24, borderTop: `4px solid ${biz.color}` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          {/* Circular progress */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
              <motion.circle
                cx={65} cy={65} r={r} fill="none" stroke={biz.color} strokeWidth={8}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - dash }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${biz.color})` }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: biz.color }}>{biz.completion_percentage}%</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>done</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {biz.industry && (
                <span className="badge" style={{ background: `${biz.color}20`, color: biz.color, border: `1px solid ${biz.color}40` }}>
                  {biz.industry}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif' }}>{biz.title}</h1>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              {biz.goals.filter(g => g.completed).length} of {biz.goals.length} goals completed
            </div>

            {/* Description */}
            {editingDesc ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea className="input-field" style={{ flex: 1, resize: 'vertical', minHeight: 80 }} value={desc} onChange={e => setDesc(e.target.value)} autoFocus id="biz-desc-textarea" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <motion.button onClick={saveDesc} style={{ padding: 8, borderRadius: 8, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer', color: '#6ee7b7', display: 'flex' }} whileTap={{ scale: 0.9 }}>
                    <Check size={16} />
                  </motion.button>
                  <motion.button onClick={() => { setEditingDesc(false); setDesc(biz.description); }} style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }} whileTap={{ scale: 0.9 }}>
                    <X size={16} />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div onClick={() => setEditingDesc(true)} style={{ fontSize: 14, color: biz.description ? 'var(--color-text)' : 'var(--color-text-muted)', padding: '10px 12px', borderRadius: 8, cursor: 'text', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.6, minHeight: 40 }} id="biz-description-field">
                {biz.description || 'Click to add a business description...'} <Edit2 size={12} style={{ marginLeft: 8, opacity: 0.4 }} />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Goals section */}
      <motion.div className="glass" style={{ borderRadius: 20, padding: 28 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Business Goals</h2>
          <motion.button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setShowAddGoal(s => !s)} whileTap={{ scale: 0.97 }} id="add-goal-btn">
            <Plus size={16} /> Add Goal
          </motion.button>
        </div>

        {/* Add goal form */}
        <AnimatePresence>
          {showAddGoal && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
              <div className="glass" style={{ borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input className="input-field" placeholder="Goal title *" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} id="goal-title-input" />
                <textarea className="input-field" style={{ resize: 'vertical', minHeight: 60 }} placeholder="Goal description (optional)" value={newGoalDesc} onChange={e => setNewGoalDesc(e.target.value)} id="goal-desc-input" />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setShowAddGoal(false); setNewGoalTitle(''); setNewGoalDesc(''); }} id="cancel-goal-btn">Cancel</button>
                  <motion.button className="btn-primary" style={{ flex: 1 }} onClick={addGoal} disabled={addingGoal || !newGoalTitle.trim()} whileTap={{ scale: 0.97 }} id="save-goal-btn">
                    {addingGoal ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Check size={14} /> Add Goal</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals list */}
        <AnimatePresence>
          {biz.goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
              No goals yet. Add your first business goal above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {biz.goals.map((goal, idx) => (
                <motion.div key={goal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: idx * 0.04 }}>
                  {editingGoal?.id === goal.id ? (
                    <div className="glass" style={{ borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input className="input-field" value={editGoalForm.title} onChange={e => setEditGoalForm(f => ({ ...f, title: e.target.value }))} id={`edit-goal-title-${goal.id}`} />
                      <textarea className="input-field" style={{ resize: 'vertical', minHeight: 60 }} value={editGoalForm.description} onChange={e => setEditGoalForm(f => ({ ...f, description: e.target.value }))} id={`edit-goal-desc-${goal.id}`} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => setEditingGoal(null)}>Cancel</button>
                        <motion.button className="btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={saveGoalEdit} whileTap={{ scale: 0.97 }} id={`save-edit-goal-${goal.id}`}>
                          <Check size={14} /> Save
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12,
                      background: goal.completed ? `${biz.color}10` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${goal.completed ? `${biz.color}30` : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.3s',
                    }}>
                      <motion.button onClick={() => toggleGoal(goal)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexShrink: 0, marginTop: 2 }} whileTap={{ scale: 0.8 }} id={`toggle-goal-${goal.id}`}>
                        {goal.completed
                          ? <CheckCircle2 size={22} color={biz.color} style={{ filter: `drop-shadow(0 0 6px ${biz.color})` }} />
                          : <Circle size={22} color="rgba(255,255,255,0.25)" />}
                      </motion.button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, textDecoration: goal.completed ? 'line-through' : 'none', color: goal.completed ? 'var(--color-text-muted)' : 'var(--color-text)', marginBottom: goal.description ? 4 : 0 }}>
                          {goal.title}
                        </div>
                        {goal.description && (
                          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{goal.description}</div>
                        )}
                      </div>
                      {goal.completed && (
                        <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', flexShrink: 0 }}>
                          Done
                        </span>
                      )}
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <motion.button onClick={() => { setEditingGoal(goal); setEditGoalForm({ title: goal.title, description: goal.description }); }} style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }} whileTap={{ scale: 0.9 }} id={`edit-goal-${goal.id}`}>
                          <Edit2 size={13} />
                        </motion.button>
                        <motion.button onClick={() => deleteGoal(goal.id)} style={{ padding: 6, borderRadius: 6, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer', color: '#fda4af', display: 'flex' }} whileTap={{ scale: 0.9 }} id={`delete-goal-${goal.id}`}>
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {biz.goals.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Overall Goal Progress</span>
              <span style={{ fontWeight: 700, color: biz.color }}>{biz.completion_percentage}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <motion.div
                className="progress-fill"
                style={{ height: '100%', background: `linear-gradient(90deg, ${biz.color}, ${biz.color}88)`, boxShadow: `0 0 10px ${biz.color}60` }}
                initial={{ width: 0 }}
                animate={{ width: `${biz.completion_percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
