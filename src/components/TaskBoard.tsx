import React from 'react';
import type { Task, TaskStatus } from '../types/index';
import { TaskCard } from './TaskCard';
import { STATUSES } from '../utils/constants';

interface Props {
  tasks: Task[];
}

export const TaskBoard: React.FC<Props> = ({ tasks }) => {
  const grouped = STATUSES.reduce<Record<TaskStatus, Task[]>>((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const getColumnBg = (status: TaskStatus) => {
    const map: Record<TaskStatus, string> = {
      Backlog: 'bg-accent-50',
      Todo: 'bg-accent-50',
      'In Progress': 'bg-accent-50',
      Review: 'bg-accent-50',
      Done: 'bg-accent-50',
    };
    return map[status] || 'bg-accent-50';
  };

  return (
    <div className="space-y-6">
      {STATUSES.map((status) => (
        <div key={status} className={`rounded-md p-3 ${getColumnBg(status)} border border-border`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-text-secondary">{status}</h3>
            <span className="text-sm text-text-secondary bg-surface px-2 py-1 rounded-full border border-border">
              {grouped[status].length}
            </span>
          </div>
          <div className="space-y-2">
            {grouped[status].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {grouped[status].length === 0 && (
              <div className="text-sm text-priority-low italic py-2">No tasks</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};