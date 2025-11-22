import React, { useState } from "react";
import TaskItem from "./TaskItem";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import { toast } from "react-toastify";

export default function TaskList({
    tasks,
    loading,
    onRefresh,
    search,
    setSearch,
    isDoneFilter,
    setIsDoneFilter,
    priorityFilter,
    setPriorityFilter,
}) {
    const [selectedIds, setSelectedIds] = useState([]);

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedIds(tasks.map((task) => task.id));
    };
    const handleDeselectAll = () => {
        setSelectedIds([]);
    };

    const handleBulkDone = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Mark ${selectedIds.length} tasks as done?`))
            return;
        try {
            await API.post(endpoints.bulk_done, { ids: selectedIds });
            const count = selectedIds.length;
            setSelectedIds([]);
            onRefresh();
            toast.success(`${count} tasks marked as completed!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to mark tasks as done.");
        }
    };

    const handleBulkRemove = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Delete ${selectedIds.length} tasks?`)) return;
        try {
            await API.post(endpoints.bulk_delete, { ids: selectedIds });
            const count = selectedIds.length;
            setSelectedIds([]);
            onRefresh();
            toast.info(`${count} tasks deleted.`);
        } catch (error) {
            console.error(error);
            try {
                await Promise.all(
                    selectedIds.map((id) =>
                        API.delete(`${endpoints.tasks}${id}/`)
                    )
                );
                const count = selectedIds.length;
                setSelectedIds([]);
                onRefresh();
                toast.info(`${count} tasks deleted (via fallback).`);
            } catch (e) {
                console.error(e);
                toast.error("Bulk delete failed entirely.");
            }
        }
    };

    // Filled Input Style
    const inputStyle =
        "p-3 bg-gray-100 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all";

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-center font-extrabold text-2xl mb-6 text-gray-800">
                My Tasks
            </h2>

            {/* Search & Filter Row */}
            <div className="mb-4 flex gap-3 flex-wrap sm:flex-nowrap">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`flex-1 min-w-full sm:min-w-0 ${inputStyle}`}
                />
                <select
                    value={isDoneFilter}
                    onChange={(e) => setIsDoneFilter(e.target.value)}
                    className={`${inputStyle} cursor-pointer`}
                >
                    <option value="">Status: All</option>
                    <option value="false">Todo</option>
                    <option value="true">Done</option>
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className={`${inputStyle} cursor-pointer`}
                >
                    <option value="">Priority: All</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                </select>
            </div>

            {/* Count numbers in buttons */}
            {tasks.length > 0 && (
                <div className="flex justify-end gap-4 mb-2">
                    <button
                        onClick={handleSelectAll}
                        disabled={selectedIds.length === tasks.length}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 transition-colors"
                    >
                        Select All ({tasks.length})
                    </button>
                    <button
                        onClick={handleDeselectAll}
                        disabled={selectedIds.length === 0}
                        className="text-xs font-bold text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                    >
                        Deselect All ({selectedIds.length})
                    </button>
                </div>
            )}

            {/* List Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pl-2 border-t border-gray-100 pt-2 min-h-[300px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-400 animate-pulse">
                        Loading...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        No tasks found.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                isSelected={selectedIds.includes(task.id)}
                                onToggleSelect={handleToggleSelect}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="mt-4 bg-gray-900 text-white rounded-2xl p-4 flex flex-wrap justify-between items-center shadow-xl animate-fade-in-up">
                    <span className="font-bold text-sm pl-2">
                        {selectedIds.length} Selected
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBulkDone}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg"
                        >
                            Mark Done
                        </button>
                        <button
                            onClick={handleBulkRemove}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
