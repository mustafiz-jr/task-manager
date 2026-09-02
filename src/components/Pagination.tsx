import React from 'react';

interface Props {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<Props> = ({
  page,
  limit,
  totalPages,
  totalItems,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 py-3 px-4 bg-surface border border-t-0 border-border rounded-b-md">
      <div className="text-sm text-text-secondary">
        Showing {totalItems === 0 ? 0 : (page - 1) * limit + 1}-
        {Math.min(page * limit, totalItems)} of {totalItems}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <label htmlFor="limit-select" className="sr-only">Items per page</label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-2 border border-priority-medium/15 rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-priority-medium/15 min-h-[44px] text-text-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 text-sm border border-priority-medium/15 rounded-md hover:bg-priority-medium/15 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-text-primary"
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="text-sm px-2 text-text-primary">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 text-sm border border-priority-medium/15 rounded-md hover:bg-priority-medium/15 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-text-primary"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};