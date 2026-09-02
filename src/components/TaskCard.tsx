import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/index';
import { isOverdue, formatDate } from '../utils/dateUtils';

interface Props {
    task: Task;
}

export const TaskCard: React.FC<Props> = ({ task }) => {
    const navigate = useNavigate();

    const getPriorityBgClass = (priority: Task['priority']) => {
        const map = {
            Urgent: 'bg-[#DC2626]',
            High: 'bg-[#F97316]',
            Medium: 'bg-[#EAB308]',
            Low: 'bg-[#9CA3AF]',
        };
        return map[priority];
    };

    const handleClick = () => navigate(`/task/${task.id}`);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            className="bg-surface rounded border border-border p-2 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-300"
        >
            <div className="font-medium text-md">{task.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-accent-800 font-medium">
                    {task.assignee || 'Unassigned'}
                </span>
                <span className="text-text-secondary">•</span>
                <span className={isOverdue(task.dueDate) ? 'text-danger font-medium' : 'text-text-secondary'}>
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    {isOverdue(task.dueDate) && ' ⚠️'}
                </span>
                <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium text-white ${getPriorityBgClass(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
        </div>
    );
};