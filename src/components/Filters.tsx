import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { TaskStatus, TaskPriority } from '../types/index';
import { STATUSES, PRIORITIES } from '../utils/constants';

interface FiltersProps {
    search: string;
    status: TaskStatus | '';
    priority: TaskPriority | '';
    onSearchChange: (val: string) => void;
    onStatusChange: (val: TaskStatus | '') => void;
    onPriorityChange: (val: TaskPriority | '') => void;
    onClearFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
    search,
    status,
    priority,
    onSearchChange,
    onStatusChange,
    onPriorityChange,
    onClearFilters,
}) => {
    const [searchLocal, setSearchLocal] = useState(search);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const debounceTimer = useRef<number | null>(null);

    useEffect(() => {
        setSearchLocal(search);
    }, [search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchLocal(val);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            onSearchChange(val);
        }, 300);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    const hasActiveFilters = search || status || priority;

    const filterControls = (
        <>
            <div className="w-full">
                <label className="block text-md font-medium text-text-secondary mb-1">Search</label>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchLocal}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    aria-label="Search tasks"
                />
            </div>
            <div className="w-full">
                <label className="block text-md font-medium text-text-secondary mb-1">Status</label>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as TaskStatus | '')}
                    className="w-full px-4 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    aria-label="Filter by status"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            <div className="w-full">
                <label className="block text-md font-medium text-text-secondary mb-1">Priority</label>
                <select
                    value={priority}
                    onChange={(e) => onPriorityChange(e.target.value as TaskPriority | '')}
                    className="w-full px-4 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                    aria-label="Filter by priority"
                >
                    <option value="">All Priorities</option>
                    {PRIORITIES.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="w-full px-4 py-2 text-sm font-medium text-danger border border-red-300 rounded hover:bg-red-50 focus:ring-1 focus:ring-danger min-h-[44px] mt-7"
                >
                    Clear All Filters
                </button>
            )}
        </>
    );

    const desktopFilters = (
        <div className="hidden md:flex flex-row gap-2 items-center w-full mb-2">
            {filterControls}
         
             
                <button
                    onClick={copyLink}
                    className="px-4 py-2 text-sm font-medium text-primary-500 border border-primary-200 rounded hover:bg-accent-50 focus:ring-1 focus:ring-primary-300 min-h-[44px] shrink-0 mt-7"
                >
                    Copy Link
                </button>
          
        </div>
    );

    const mobileFilters = (
        <div className="md:hidden w-full">
            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded hover:bg-primary-600 focus:ring-1 focus:ring-primary-300 min-h-[44px] flex items-center justify-center gap-2"
                    aria-label="Open filters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 0111 18v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    Filters
                    {hasActiveFilters && (
                        <span className="bg-white text-primary-500 text-xs rounded-full px-2 py-0.5 ml-1">
                            {search ? '1' : ''}{status ? '1' : ''}{priority ? '1' : ''}
                        </span>
                    )}
                </button>
                <button
                    onClick={copyLink}
                    className="px-4 py-2 text-sm font-medium text-primary-500 border border-primary-200 rounded hover:bg-accent-50 focus:ring-1 focus:ring-primary-300 min-h-[44px]"
                >
                    Copy Link
                </button>
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {search && (
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                            Search: {search}
                            <button
                                onClick={() => onSearchChange('')}
                                className="ml-2 text-primary-500 hover:text-primary-700 focus:outline-none min-h-[24px] min-w-[24px] flex items-center justify-center"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {status && (
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                            {status}
                            <button
                                onClick={() => onStatusChange('')}
                                className="ml-2 text-primary-500 hover:text-primary-700 focus:outline-none min-h-[24px] min-w-[24px] flex items-center justify-center"
                                aria-label="Clear status filter"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {priority && (
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                            {priority}
                            <button
                                onClick={() => onPriorityChange('')}
                                className="ml-2 text-primary-500 hover:text-primary-700 focus:outline-none min-h-[24px] min-w-[24px] flex items-center justify-center"
                                aria-label="Clear priority filter"
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}

            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsMobileFilterOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-xl p-4 pb-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="p-2 rounded hover:bg-accent-50 focus:ring-1 focus:ring-primary-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Close filters"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {filterControls}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm border border-border rounded hover:bg-accent-50 focus:ring-1 focus:ring-gray-300 min-h-[44px]"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        onClearFilters();
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className="flex-1 px-4 py-2 text-sm text-danger border border-red-300 rounded hover:bg-red-50 focus:ring-1 focus:ring-danger min-h-[44px]"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full">
            {mobileFilters}

            {desktopFilters}
        </div>
    );
};