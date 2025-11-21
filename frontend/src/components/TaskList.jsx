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

    const inputStyle = "p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-shadow shadow-inner cursor-pointer";

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-center font-bold text-2xl mb-6 text-gray-800">
                To Do List
            </h2>

            <div className="mb-4 flex gap-3 flex-wrap sm:flex-nowrap">
                <input
                    type="text"
                    placeholder="Search all tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`flex-1 min-w-full sm:min-w-0 ${inputStyle}`}
                />

                <select
                    value={isDoneFilter}
                    onChange={(e) => setIsDoneFilter(e.target.value)}
                    className={`${inputStyle}`}
                >
                    <option value="">Status: All</option>
                    <option value="false">Todo</option>
                    <option value="true">Done</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className={`${inputStyle}`}
                >
                    <option value="">Priority: All</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                </select>
            </div>

            {tasks.length > 0 && (
                <div className="flex justify-end gap-4 mb-2">
                    <button
                        onClick={handleSelectAll}
                        disabled={selectedIds.length === tasks.length}
                        className={`text-sm text-indigo-600 font-semibold transition-colors p-1 hover:text-indigo-800
                            ${
                                selectedIds.length === tasks.length
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:text-indigo-800"
                            }`}
                    >
                        Select All ({tasks.length})
                    </button>
                    <button
                        onClick={handleDeselectAll}
                        disabled={selectedIds.length === 0}
                        className={`text-sm text-gray-600 font-semibold transition-colors p-1 hover:text-gray-800
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
                <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 shadow-lg animate-fade-in-up">
                    <span className="text-gray-800 font-bold text-sm shrink-0">
                        {selectedIds.length} Selected
                    </span>
                    <div className="flex gap-3 flex-1 justify-end">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Clear
                        </button>

                        <button
                            onClick={handleBulkDone}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Mark Done
                        </button>

                        <button
                            onClick={handleBulkRemove}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}