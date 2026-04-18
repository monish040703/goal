'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, ChevronRight, Calendar, Target, Sparkles } from 'lucide-react';
import { tasksAPI } from '@/lib/api';
import { Task } from '@/lib/types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316'];

function CircularProgress({ percentage, color }: { percentage: number; color: string }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const dash = (percentage / 100) * circumference;

  return (
    <svg width={70} height={70} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
      <motion.circle
        cx={35} cy={35} r={r}
        fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - dash }}
        transition={{ duration: 1, ease: 'easeOut' }}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text
        x={35} y={39}
        textAnchor="middle"
        fill="white"
        fontSize={12}
        fontWeight={700}
        style={{ transform: 'rotate(90deg) translate(-70px, 0px)' }}
      >
        {/* shown via absolute positioned div below */}
      </text>
    </svg>
  );
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', color: '#6366f1' });
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', color: '#6366f1' });
    setShowModal(true);
  };

  const openEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, color: task.color });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingTask) {
        const res = await tasksAPI.update(editingTask.id, form);
        setTasks(ts => ts.map(t => t.id === editingTask.id ? res.data : t));
      } else {
        const res = await tasksAPI.create(form);
        setTasks(ts => [res.data, ...ts]);
      }
      setShowModal(false);
    } catch (e) {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this task group?')) return;
    try {
      await tasksAPI.delete(id);
      setTasks(ts => ts.filter(t => t.id !== id));
    } catch (e) {}
  };

  const overall = tasks.length
    ? Math.round(tasks.reduce((s, t) => s + t.completion_percentage, 0) / tasks.length)
    : 0;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              Daily Tasks
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <motion.button
            className="btn-primary"
            onClick={openCreate}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            id="create-task-btn"
          >
            <Plus size={18} />
            New Task Group
          </motion.button>
        </div>

        {/* Overall progress */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass"
            style={{ borderRadius: 16, padding: '20px 24px', marginTop: 24, display: 'flex', alignItems: 'center', gap: 20 }}
          >
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Today's Overall Progress</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{overall}%</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${overall}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
            <Sparkles size={20} color="var(--color-accent)" />
          </motion.div>
        )}
      </motion.div>

      {/* Task grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: 80 }}
        >
          <Target size={64} color="var(--color-text-muted)" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No tasks yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Create your first task group and start crushing your goals!</p>
          <button className="btn-primary" onClick={openCreate} id="first-task-btn">
            <Plus size={16} /> Create First Task
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }} className="stagger-children">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layoutId={`task-${task.id}`}
              className="card"
              style={{ cursor: 'pointer', borderLeft: `3px solid ${task.color}` }}
              onClick={() => router.push(`/tasks/${task.id}`)}
              whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${task.color}20` }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, paddingRight: 8 }}>{task.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description || 'No description'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <motion.button
                    onClick={(e) => openEdit(task, e)}
                    style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                    whileTap={{ scale: 0.9 }}
                    id={`edit-task-${task.id}`}
                  >
                    <Edit2 size={14} />
                  </motion.button>
                  <motion.button
                    onClick={(e) => handleDelete(task.id, e)}
                    style={{ padding: 6, borderRadius: 6, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer', color: '#fda4af', display: 'flex' }}
                    whileTap={{ scale: 0.9 }}
                    id={`delete-task-${task.id}`}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Circular progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '16px 0' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <CircularProgress percentage={task.completion_percentage} color={task.color} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: task.color,
                  }}>
                    {task.completion_percentage}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length} done
                  </div>
                  <div className="progress-bar" style={{ width: 120 }}>
                    <motion.div
                      className="progress-fill"
                      style={{ background: `linear-gradient(90deg, ${task.color}, ${task.color}88)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${task.completion_percentage}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: task.color, fontWeight: 600 }}>
                  View details <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              className="glass-strong"
              style={{ borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>
                  {editingTask ? 'Edit Task Group' : 'New Task Group'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block' }}>Task Group Name *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Morning Routine, Work Projects..."
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    autoFocus
                    id="task-title-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block' }}>Description</label>
                  <textarea
                    className="input-field"
                    style={{ resize: 'vertical', minHeight: 80 }}
                    placeholder="What's this task group about?"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    id="task-desc-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 10, display: 'block' }}>Color</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                      <motion.div
                        key={c}
                        className={`color-dot ${form.color === c ? 'selected' : ''}`}
                        style={{ background: c, boxShadow: form.color === c ? `0 0 15px ${c}` : 'none' }}
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)} id="cancel-task-btn">
                    Cancel
                  </button>
                  <motion.button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleSave}
                    disabled={saving || !form.title.trim()}
                    whileTap={{ scale: 0.97 }}
                    id="save-task-btn"
                  >
                    {saving ? (
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <><Check size={16} /> {editingTask ? 'Update' : 'Create'}</>
                    )}
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
