import React, { useState } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types/index';
import { ASSIGNEES, STATUSES, PRIORITIES } from '../utils/constants';
import { useTaskContext } from '../context/TaskContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Backlog');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: title.trim(),
      description: null,
      assignee: assignee || null,
      dueDate: dueDate || null,
      priority,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTask(newTask);
    onClose();

    setTitle('');
    setAssignee('');
    setDueDate('');
    setPriority('Medium');
    setStatus('Backlog');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Assignee</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
            >
              <option value="">Unassigned</option>
              {ASSIGNEES.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent-50 focus:ring-1 focus:ring-gray-300 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px]"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};