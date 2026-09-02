import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus, TaskPriority } from '../types/index';
import { isOverdue, formatDate } from '../utils/dateUtils';
import { STATUSES, PRIORITIES, ASSIGNEES } from '../utils/constants';
import { useTaskContext } from '../context/TaskContext';

interface Props {
  tasks: Task[];
  sortBy: keyof Task | '';
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Task) => void;
}

export const TaskTable: React.FC<Props> = ({ tasks, sortBy, sortOrder, onSort }) => {
  const navigate = useNavigate();
  const { updateTask } = useTaskContext();

  // Priority badge classes using custom theme colors
  const getPriorityBadgeClasses = (priority: TaskPriority) => {
    const base = 'px-2.5 py-0.5 rounded-full text-xs font-medium text-white';
    const map: Record<TaskPriority, string> = {
      Urgent: 'bg-[var(--color-priority-urgent)]',
      High: 'bg-[var(--color-priority-high)]',
      Medium: 'bg-[var(--color-priority-medium)]',
      Low: 'bg-[var(--color-priority-low)]',
    };
    return `${base} ${map[priority]}`;
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString() });
    }
  };

  const handleAssigneeChange = (taskId: string, newAssignee: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({
        ...task,
        assignee: newAssignee || null,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleRowClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick(taskId);
    }
  };

  const SortableHeader = ({ label, sortKey, className }: { label: string; sortKey: keyof Task; className?: string }) => (
    <th className={`px-4 py-3 text-left text-base font-semibold text-text-primary select-none ${className}`}>
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 w-full text-left hover:text-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-300 px-2 py-1 rounded min-h-[44px]"
        aria-label={`Sort by ${label}`}
      >
        {label}
        {sortBy === sortKey && (
          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
        )}
      </button>
    </th>
  );

  const assigneeOptions = ASSIGNEES.filter(name => name !== 'Unassigned');

  return (
    <div className="rounded-t border border-border overflow-x-auto">
      <table className="w-full table-fixed divide-y divide-border">
        <thead className="bg-primary-100 border-b border-border">
          <tr>
            <SortableHeader label="Title" sortKey="title" />
            <SortableHeader className='w-45' label="Assignee" sortKey="assignee" />
            <SortableHeader className='w-40' label="Due Date" sortKey="dueDate" />
            <SortableHeader className='w-25' label="Priority" sortKey="priority" />
            <th className="px-4 py-3 text-left text-base font-semibold text-text-primary w-40">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {tasks.map((task) => (
            <tr
              key={task.id}
              onClick={() => handleRowClick(task.id)}
              onKeyDown={(e) => handleRowKeyDown(e, task.id)}
              tabIndex={0}
              role="button"
              className="hover:bg-priority-medium/15 hover:text-primary-700 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-primary-300"
              title="Click to see details or edit this item"
            >
              <td className="px-4 py-3 text-md">
                <div className="truncate" title={task.title}>{task.title}</div>
              </td>
              <td className="px-4 py-3 text-sm">
                <div
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <select
                    value={task.assignee || ''}
                    onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                    className="px-2 py-1 text-xs rounded border-0 bg-surface focus:ring-1 focus:ring-primary-300 min-h-[36px] w-full max-w-[180px] truncate"
                    aria-label={`Assignee for ${task.title}`}
                  >
                    <option value="">Unassigned</option>
                    {assigneeOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                {task.dueDate ? (
                  <span className={isOverdue(task.dueDate) ? 'text-danger font-medium' : ''}>
                    {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && ' ⚠️'}
                  </span>
                ) : (
                  <span className="text-priority-low">No due date</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={getPriorityBadgeClasses(task.priority)}>
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <div
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className="px-2 py-1 text-xs rounded border-0 bg-surface focus:ring-1 focus:ring-primary-300 min-h-[36px] w-full"
                    aria-label={`Status for ${task.title}`}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                No tasks match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};