'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Edit2, Check, X, CheckCircle2, Circle } from 'lucide-react';
import { tasksAPI } from '@/lib/api';
import { Task, Subtask } from '@/lib/types';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = Number(params.id);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSubtask, setNewSubtask] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [desc, setDesc] = useState('');

  const fetchTask = async () => {
    try {
      const res = await tasksAPI.get(taskId);
      setTask(res.data);
      setDesc(res.data.description);
    } catch (e) { router.push('/tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTask(); }, [taskId]);

  const toggleSubtask = async (subtask: Subtask) => {
    try {
      const res = await tasksAPI.updateSubtask(taskId, subtask.id, { completed: !subtask.completed });
      setTask(t => t ? {
        ...t,
        subtasks: t.subtasks.map(s => s.id === subtask.id ? res.data : s),
        completion_percentage: Math.round(
          (t.subtasks.filter(s => s.id === subtask.id ? !subtask.completed : s.completed).length / t.subtasks.length) * 100
        )
      } : t);
      // Refetch to get accurate percentage
      setTimeout(fetchTask, 300);
    } catch (e) {}
  };

  const addSubtask = async () => {
    if (!newSubtask.trim()) return;
    setAddingSubtask(true);
    try {
      await tasksAPI.addSubtask(taskId, { title: newSubtask });
      setNewSubtask('');
      await fetchTask();
    } catch (e) {}
    finally { setAddingSubtask(false); }
  };

  const deleteSubtask = async (subtaskId: number) => {
    try {
      await tasksAPI.deleteSubtask(taskId, subtaskId);
      setTask(t => t ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId) } : t);
      setTimeout(fetchTask, 300);
    } catch (e) {}
  };

  const saveDesc = async () => {
    try {
      await tasksAPI.update(taskId, { description: desc });
      setTask(t => t ? { ...t, description: desc } : t);
      setEditingDesc(false);
    } catch (e) {}
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!task) return null;

  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = (task.completion_percentage / 100) * circumference;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back */}
      <motion.button
        className="btn-ghost"
        style={{ marginBottom: 24 }}
        onClick={() => router.push('/tasks')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={{ scale: 0.97 }}
        id="back-to-tasks-btn"
      >
        <ArrowLeft size={16} /> Back to Tasks
      </motion.button>

      {/* Header card */}
      <motion.div
        className="glass"
        style={{ borderRadius: 20, padding: 32, marginBottom: 24, borderLeft: `4px solid ${task.color}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          {/* Circular progress */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
              <motion.circle
                cx={65} cy={65} r={r}
                fill="none" stroke={task.color} strokeWidth={8}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - dash }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${task.color})` }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: task.color }}>{task.completion_percentage}%</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>done</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
              {task.title}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              {task.subtasks.filter(s => s.completed).length} of {task.subtasks.length} subtasks completed
            </div>

            {/* Description */}
            {editingDesc ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea
                  className="input-field"
                  style={{ flex: 1, resize: 'vertical', minHeight: 80 }}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  autoFocus
                  id="desc-textarea"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <motion.button onClick={saveDesc} style={{ padding: 8, borderRadius: 8, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer', color: '#6ee7b7', display: 'flex' }} whileTap={{ scale: 0.9 }}>
                    <Check size={16} />
                  </motion.button>
                  <motion.button onClick={() => { setEditingDesc(false); setDesc(task.description); }} style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }} whileTap={{ scale: 0.9 }}>
                    <X size={16} />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingDesc(true)}
                style={{
                  fontSize: 14, color: task.description ? 'var(--color-text)' : 'var(--color-text-muted)',
                  padding: '10px 12px', borderRadius: 8, cursor: 'text',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                  lineHeight: 1.6, transition: 'all 0.2s',
                  minHeight: 40,
                }}
                id="description-field"
              >
                {task.description || 'Click to add a description...'}
                <Edit2 size={12} style={{ marginLeft: 8, opacity: 0.4 }} />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subtasks */}
      <motion.div
        className="glass"
        style={{ borderRadius: 20, padding: 28 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Subtasks</h2>

        {/* Add subtask */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            className="input-field"
            placeholder="Add a new subtask..."
            value={newSubtask}
            onChange={e => setNewSubtask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSubtask()}
            id="new-subtask-input"
          />
          <motion.button
            className="btn-primary"
            style={{ padding: '12px 20px', flexShrink: 0 }}
            onClick={addSubtask}
            disabled={addingSubtask || !newSubtask.trim()}
            whileTap={{ scale: 0.95 }}
            id="add-subtask-btn"
          >
            {addingSubtask ? (
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : <Plus size={18} />}
          </motion.button>
        </div>

        {/* Subtask list */}
        <AnimatePresence>
          {task.subtasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
              No subtasks yet. Add your first subtask above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {task.subtasks.map((subtask, idx) => (
                <motion.div
                  key={subtask.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 10,
                    background: subtask.completed ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${subtask.completed ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.3s',
                  }}
                >
                  <motion.button
                    onClick={() => toggleSubtask(subtask)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexShrink: 0 }}
                    whileTap={{ scale: 0.8 }}
                    id={`toggle-subtask-${subtask.id}`}
                  >
                    {subtask.completed ? (
                      <CheckCircle2 size={22} color={task.color} style={{ filter: `drop-shadow(0 0 6px ${task.color})` }} />
                    ) : (
                      <Circle size={22} color="rgba(255,255,255,0.25)" />
                    )}
                  </motion.button>

                  <span style={{
                    flex: 1, fontSize: 15,
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    color: subtask.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
                    transition: 'all 0.3s',
                  }}>
                    {subtask.title}
                  </span>

                  {subtask.completed && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="badge"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      Done
                    </motion.span>
                  )}

                  <motion.button
                    onClick={() => deleteSubtask(subtask.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', display: 'flex', padding: 4, borderRadius: 6 }}
                    whileHover={{ color: '#fda4af' }}
                    whileTap={{ scale: 0.9 }}
                    id={`delete-subtask-${subtask.id}`}
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Progress summary */}
        {task.subtasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Progress</span>
              <span style={{ fontWeight: 700, color: task.color }}>{task.completion_percentage}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <motion.div
                className="progress-fill"
                style={{ height: '100%', background: `linear-gradient(90deg, ${task.color}, ${task.color}88)` }}
                initial={{ width: 0 }}
                animate={{ width: `${task.completion_percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
