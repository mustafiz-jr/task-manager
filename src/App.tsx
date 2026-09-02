import { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TaskDetail } from './components/TaskDetail';
import { TaskTable } from './components/TaskTable';
import { TaskBoard } from './components/TaskBoard';
import { Filters } from './components/Filters';
import { Pagination } from './components/Pagination';
import { AddTaskModal } from './components/AddTaskModal';
import { useTasks } from './hooks/useTasks';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useTaskContext } from './context/TaskContext';
import type { Task, TaskStatus, TaskPriority } from './types/index';

function AppContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, error, fetchTasks } = useTaskContext();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const status = (searchParams.get('status') as TaskStatus) || '';
  const priority = (searchParams.get('priority') as TaskPriority) || '';
  const sortBy = (searchParams.get('sortBy') as keyof Task) || '';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  const { paginatedData, totalItems, totalPages } = useTasks({
    search,
    status,
    priority,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearch = (val: string) => {
    updateParams({ search: val, page: '1' });
  };

  const handleStatus = (val: TaskStatus | '') => {
    updateParams({ status: val, page: '1' });
  };

  const handlePriority = (val: TaskPriority | '') => {
    updateParams({ priority: val, page: '1' });
  };

  const handleSort = (key: keyof Task) => {
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    updateParams({ sortBy: key, sortOrder: newOrder, page: '1' });
  };

  const handlePage = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const handleLimit = (newLimit: number) => {
    updateParams({ limit: String(newLimit), page: '1' });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="h-12 w-48 bg-accent-100 rounded animate-pulse mb-4"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-accent-50 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-600 font-medium">Oops! {error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasFilters = search || status || priority;
  const showEmpty = !loading && paginatedData.length === 0;

  return (
    <div className="py-6 px-2 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <h1 className="text-3xl font-bold">Team Tasks</h1>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-end px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px] flex items-center gap-2"
        >
          + Add Task
        </button>
      </div>

      <Filters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={handleSearch}
        onStatusChange={handleStatus}
        onPriorityChange={handlePriority}
        onClearFilters={clearFilters}
      />

      {showEmpty ? (
        <div className="mt-6 bg-surface rounded-md border border-border p-8 text-center">
          <p className="text-text-secondary">No tasks found. Try clearing your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-3 px-4 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px]"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {isMobile ? (
            <TaskBoard tasks={paginatedData} />
          ) : (
            <TaskTable
              tasks={paginatedData}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}
        </>
      )}

      {!showEmpty && (
        <Pagination
          page={page}
          limit={limit}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePage}
          onLimitChange={handleLimit}
        />
      )}

      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <Toaster position="bottom-center" />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/task/:id" element={<TaskDetail />} />
    </Routes>
  );
}

export default App;