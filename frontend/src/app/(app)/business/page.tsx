'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, ChevronRight, Building2, Target, TrendingUp } from 'lucide-react';
import { businessAPI } from '@/lib/api';
import { Business } from '@/lib/types';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316'];
const INDUSTRIES = ['Tech', 'Finance', 'Health', 'Education', 'Retail', 'Food', 'Real Estate', 'Other'];

export default function BusinessPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [form, setForm] = useState({ title: '', description: '', industry: '', color: '#10b981' });
  const [saving, setSaving] = useState(false);

  const fetchBusinesses = async () => {
    try {
      const res = await businessAPI.getAll();
      setBusinesses(res.data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBusinesses(); }, []);

  const openCreate = () => {
    setEditingBiz(null);
    setForm({ title: '', description: '', industry: '', color: '#10b981' });
    setShowModal(true);
  };

  const openEdit = (biz: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBiz(biz);
    setForm({ title: biz.title, description: biz.description, industry: biz.industry, color: biz.color });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingBiz) {
        const res = await businessAPI.update(editingBiz.id, form);
        setBusinesses(bs => bs.map(b => b.id === editingBiz.id ? res.data : b));
      } else {
        const res = await businessAPI.create(form);
        setBusinesses(bs => [res.data, ...bs]);
      }
      setShowModal(false);
    } catch (e) {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this business venture?')) return;
    try {
      await businessAPI.delete(id);
      setBusinesses(bs => bs.filter(b => b.id !== id));
    } catch (e) {}
  };

  const overall = businesses.length
    ? Math.round(businesses.reduce((s, b) => s + b.completion_percentage, 0) / businesses.length)
    : 0;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              Business Goals
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
              Track your startup and business ventures
            </p>
          </div>
          <motion.button className="btn-primary" onClick={openCreate} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} id="create-business-btn">
            <Plus size={18} /> New Venture
          </motion.button>
        </div>

        {/* Stats bar */}
        {businesses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}
          >
            {[
              { label: 'Active Ventures', value: businesses.length, color: '#10b981' },
              { label: 'Avg. Goal Completion', value: `${overall}%`, color: '#6366f1' },
              { label: 'Goals Completed', value: businesses.reduce((s, b) => s + b.goals.filter(g => g.completed).length, 0), color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass" style={{ borderRadius: 14, padding: '16px 24px', flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Business grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : businesses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 80 }}>
          <Building2 size={64} color="var(--color-text-muted)" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No ventures yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Add your startup idea or business goal to start tracking.</p>
          <button className="btn-primary" onClick={openCreate} id="first-business-btn">
            <Plus size={16} /> Add First Venture
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }} className="stagger-children">
          {businesses.map((biz) => (
            <motion.div
              key={biz.id}
              className="card"
              style={{ cursor: 'pointer', borderTop: `3px solid ${biz.color}` }}
              onClick={() => router.push(`/business/${biz.id}`)}
              whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${biz.color}20` }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: biz.color, boxShadow: `0 0 8px ${biz.color}` }} />
                    {biz.industry && (
                      <span className="badge" style={{ background: `${biz.color}20`, color: biz.color, border: `1px solid ${biz.color}40` }}>
                        {biz.industry}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{biz.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {biz.description || 'No description'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                  <motion.button onClick={(e) => openEdit(biz, e)} style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }} whileTap={{ scale: 0.9 }} id={`edit-biz-${biz.id}`}>
                    <Edit2 size={14} />
                  </motion.button>
                  <motion.button onClick={(e) => handleDelete(biz.id, e)} style={{ padding: 6, borderRadius: 6, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer', color: '#fda4af', display: 'flex' }} whileTap={{ scale: 0.9 }} id={`delete-biz-${biz.id}`}>
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Goal Progress</span>
                  <span style={{ fontWeight: 700, color: biz.color }}>{biz.completion_percentage}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    style={{ background: `linear-gradient(90deg, ${biz.color}, ${biz.color}88)`, boxShadow: `0 0 10px ${biz.color}60` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${biz.completion_percentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Goals summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {biz.goals.filter(g => g.completed).length} / {biz.goals.length} goals done
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: biz.color, fontWeight: 600 }}>
                  View details <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div className="glass-strong" style={{ borderRadius: 20, padding: 32, width: '100%', maxWidth: 500 }} initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>{editingBiz ? 'Edit Venture' : 'New Business Venture'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block' }}>Business/Startup Name *</label>
                  <input className="input-field" placeholder="e.g. TechVenture AI, GreenEats..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus id="biz-title-input" />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block' }}>Description</label>
                  <textarea className="input-field" style={{ resize: 'vertical', minHeight: 80 }} placeholder="What's this business about?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} id="biz-desc-input" />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8, display: 'block' }}>Industry</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {INDUSTRIES.map(ind => (
                      <button key={ind} onClick={() => setForm(f => ({ ...f, industry: ind }))} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', background: form.industry === ind ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)', border: form.industry === ind ? 'none' : '1px solid rgba(255,255,255,0.12)', color: form.industry === ind ? 'white' : 'var(--color-text-muted)', transition: 'all 0.2s' }}>
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 10, display: 'block' }}>Color</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                      <motion.div key={c} className={`color-dot ${form.color === c ? 'selected' : ''}`} style={{ background: c, boxShadow: form.color === c ? `0 0 15px ${c}` : 'none' }} onClick={() => setForm(f => ({ ...f, color: c }))} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)} id="cancel-biz-btn">Cancel</button>
                  <motion.button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving || !form.title.trim()} whileTap={{ scale: 0.97 }} id="save-biz-btn">
                    {saving ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Check size={16} /> {editingBiz ? 'Update' : 'Create'}</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
