import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import type { Task, TaskStatus, TaskPriority } from '../types/index';
import { ASSIGNEES, STATUSES, PRIORITIES } from '../utils/constants';

export const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { tasks, loading, error, fetchTasks, updateTask } = useTaskContext();
    const [task, setTask] = useState<Task | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [initialTask, setInitialTask] = useState<Task | null>(null);

    const titleRef = useRef<HTMLTextAreaElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = (ref: React.RefObject<HTMLTextAreaElement>) => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = ref.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        if (loading) return;
        const found = tasks.find(t => t.id === id);
        if (found) {
            setTask(found);
            setInitialTask(found);
            setIsDirty(false);
            setTimeout(() => {
                autoResize(titleRef);
                autoResize(descRef);
            }, 0);
        } else {
            setTask(null);
        }
    }, [id, tasks, loading]);

    const handleChange = <K extends keyof Task>(field: K, value: Task[K]) => {
        if (task) {
            const updated = { ...task, [field]: value, updatedAt: new Date().toISOString() };
            setTask(updated);
            setIsDirty(true);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleChange('title', e.target.value);
        autoResize(titleRef);
    };

    const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleChange('description', e.target.value || null);
        autoResize(descRef);
    };

    const handleSave = () => {
        if (task && isDirty) {
            updateTask(task);
            setInitialTask(task);
            setIsDirty(false);
        }
    };

    const handleCancel = () => {
        if (initialTask) {
            setTask(initialTask);
            setIsDirty(false);
            setTimeout(() => {
                autoResize(titleRef);
                autoResize(descRef);
            }, 0);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 w-24 bg-accent-100 rounded"></div>
                    <div className="h-8 w-full bg-accent-100 rounded"></div>
                    <div className="h-24 w-full bg-accent-100 rounded"></div>
                    <div className="h-4 w-2/3 bg-accent-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-accent-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded p-6 text-center">
                    <p className="text-danger font-medium">Failed to load task: {error}</p>
                    <button
                        onClick={fetchTasks}
                        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold">Task not found</h2>
                <p className="mt-2 text-text-secondary">The task may have been deleted or the link is incorrect.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 min-h-[44px]"
                >
                    Back to list
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <button
                onClick={() => navigate('/')}
                className="mb-4 inline-flex items-center text-sm text-text-secondary hover:text-primary focus:ring-1 focus:ring-primary-300 px-2 py-1 rounded min-h-[44px]"
            >
                ← Back
            </button>
            <div className="bg-surface rounded-md border border-border p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-primary-600">Edit Task</h2>
                    {isDirty && (
                        <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">
                            Unsaved changes
                        </span>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                    <textarea
                        ref={titleRef}
                        value={task.title}
                        onChange={handleTitleChange}
                        className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-300 overflow-hidden resize-none"
                        rows={1}
                        style={{ minHeight: '44px' }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                    <textarea
                        ref={descRef}
                        value={task.description || ''}
                        onChange={handleDescChange}
                        className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-300 overflow-hidden resize-none"
                        rows={1}
                        style={{ minHeight: '44px' }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Assignee</label>
                    <select
                        value={task.assignee || ''}
                        onChange={(e) => handleChange('assignee', e.target.value || null)}
                        className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
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
                        value={task.dueDate || ''}
                        onChange={(e) => handleChange('dueDate', e.target.value || null)}
                        className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                    <select
                        value={task.priority}
                        onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
                        className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    >
                        {PRIORITIES.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                    <select
                        value={task.status}
                        onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
                        className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    >
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    {isDirty && (
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm border border-border rounded hover:bg-accent-50 focus:ring-1 focus:ring-gray-300 min-h-[44px]"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="px-4 py-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDirty ? 'Save Changes' : 'Saved'}
                    </button>
                </div>
            </div>
        </div>
    );
};