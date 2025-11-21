import React, { useState } from "react";
import TaskItem from "./TaskItem";
import API from "../services/api";
import { endpoints } from "../services/endpoints";

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
        const allIds = tasks.map((task) => task.id);
        setSelectedIds(allIds);
    };

    const handleDeselectAll = () => {
        setSelectedIds([]);
    };

    const handleBulkDone = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Mark ${selectedIds.length} tasks as done?`))
            return;

        try {
            await API.post(endpoints.bulk_done, {
                ids: selectedIds,
            });

            setSelectedIds([]);
            onRefresh();
        } catch (error) {
            console.error("Bulk mark done error:", error);
            alert("Failed to mark tasks as done. Check console for details.");
        }
    };

    const handleBulkRemove = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Delete ${selectedIds.length} tasks?`)) return;

        try {
            await API.post(endpoints.bulk_delete, { ids: selectedIds });
            setSelectedIds([]);
            onRefresh();
        } catch (error) {
            console.error("Bulk delete error:", error);
            try {
                await Promise.all(
                    selectedIds.map((id) =>
                        API.delete(`${endpoints.tasks}${id}/`)
                    )
                );
                setSelectedIds([]);
                onRefresh();
            } catch (innerError) {
                console.error("Fallback delete failed", innerError);
            }
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-center font-bold text-xl mb-6">To Do List</h2>

            <div className="mb-4 flex gap-3">
                <input
                    type="text"
                    placeholder="Search all tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                />

                {/* Is Done Filter */}
                <select
                    value={isDoneFilter}
                    onChange={(e) => setIsDoneFilter(e.target.value)}
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                >
                    <option value="">Status: All</option>
                    <option value="false">Todo</option>
                    <option value="true">Done</option>
                </select>

                {/* Priority Filter */}
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                >
                    <option value="">Priority: All</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                </select>
            </div>

            {tasks.length > 0 && (
                <div className="flex justify-end gap-3 mb-2">
                    <button
                        onClick={handleSelectAll}
                        disabled={selectedIds.length === tasks.length}
                        className={`text-sm text-blue-600 font-medium transition-colors p-1 
                            ${
                                selectedIds.length === tasks.length
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:text-blue-800"
                            }`}
                    >
                        Select All ({tasks.length})
                    </button>
                    <button
                        onClick={handleDeselectAll}
                        disabled={selectedIds.length === 0}
                        className={`text-sm text-gray-600 font-medium transition-colors p-1 
                            ${
                                selectedIds.length === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:text-gray-800"
                            }`}
                    >
                        Deselect All ({selectedIds.length})
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 border-t border-gray-100 pt-2 min-h-[300px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 animate-pulse">
                        Loading...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        {search || isDoneFilter || priorityFilter
                            ? "No tasks match your filter criteria."
                            : "No tasks found."}
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

            {selectedIds.length > 0 && (
                <div className="mt-4 bg-gray-100 border border-gray-300 rounded-md p-4 flex justify-between items-center animate-fade-in-up">
                    <span className="text-gray-800 font-bold text-sm">
                        {selectedIds.length} Selected
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Clear
                        </button>

                        <button
                            onClick={handleBulkDone}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Mark Done
                        </button>

                        <button
                            onClick={handleBulkRemove}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
