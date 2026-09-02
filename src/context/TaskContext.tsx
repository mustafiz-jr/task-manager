
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Task } from '../types/index';
import { fetchTasks as fetchTasksData } from '../data/seed';

const STORAGE_KEY = 'team_tasks_data';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (updated: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromStorage = (): Task[] | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Task[];
    } catch (e) {
      console.error('Failed to load tasks from localStorage:', e);
    }
    return null;
  };

  const saveToStorage = (tasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage:', e);
    }
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = loadFromStorage();
      if (stored && stored.length > 0) {
        setTasks(stored);
      } else {
        const data = await fetchTasksData();
        setTasks(data);
        saveToStorage(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => {
      const updated = [task, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateTask = useCallback((updated: Task) => {
    setTasks(prev => {
      const newTasks = prev.map(t => (t.id === updated.id ? updated : t));
      saveToStorage(newTasks);
      return newTasks;
    });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, fetchTasks, addTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};