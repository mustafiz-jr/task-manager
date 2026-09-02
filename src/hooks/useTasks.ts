import { useMemo } from 'react';
import type { Task, TaskFilters } from '../types/index';
import { useTaskContext } from '../context/TaskContext';

const priorityOrder: Record<string, number> = {
    Urgent: 0,
    High: 1,
    Medium: 2,
    Low: 3,
};

export const useTasks = (filters: Omit<TaskFilters, 'page' | 'limit'> & { page: number; limit: number }) => {
    const { tasks, loading, error } = useTaskContext();
    const { search, status, priority, sortBy, sortOrder, page, limit } = filters;

    const filtered = useMemo(() => {
        let result = [...tasks];

        if (search.trim()) {
            const q = search.toLowerCase().trim();
            result = result.filter(
                t =>
                    t.title.toLowerCase().includes(q) ||
                    (t.assignee && t.assignee.toLowerCase().includes(q))
            );
        }

        if (status) {
            result = result.filter(t => t.status === status);
        }

        if (priority) {
            result = result.filter(t => t.priority === priority);
        }

        if (sortBy) {
            const sortKey = sortBy as keyof Task;
            result.sort((a, b) => {
                const aVal = a[sortKey] ?? '';
                const bVal = b[sortKey] ?? '';
                if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            result.sort((a, b) => {
                if (a.dueDate === null && b.dueDate !== null) return -1;
                if (a.dueDate !== null && b.dueDate === null) return 1;
                if (a.dueDate === null && b.dueDate === null) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return a.dueDate!.localeCompare(b.dueDate!);
            });
        }

        const totalItems = result.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = result.slice(start, end);
        const totalPages = Math.ceil(totalItems / limit);

        return { paginatedData, totalItems, totalPages };
    }, [tasks, search, status, priority, sortBy, sortOrder, page, limit]);

    return { ...filtered, loading, error };
};