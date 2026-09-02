export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  dueDate: string | null; 
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  sortBy: keyof Task | '';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}