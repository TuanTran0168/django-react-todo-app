import React, { useState } from "react";
import TaskItem from "./TaskItem";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import { compareAsc, parseISO } from "date-fns";

export default function TaskList({ tasks, loading, onRefresh }) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const filteredTasks = tasks.filter((t) =>
        (t.title || "").toLowerCase().includes(search.toLowerCase())
    );

    const sortedTasks = filteredTasks.sort((a, b) => {
        if (!a.due_date || !b.due_date) return 0;
        return compareAsc(parseISO(a.due_date), parseISO(b.due_date));
    });

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
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
            // Fallback if the API does not yet support bulk delete
            await Promise.all(selectedIds.map(id => API.delete(`${endpoints.tasks}${id}/`)));
            setSelectedIds([]);
            onRefresh();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-center font-bold text-xl mb-10">To Do List</h2>

            <input
                type="text"
                placeholder="Search ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:border-black"
            />

            {/* List Container with Scroll */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-24 pr-2 custom-scrollbar">
                {loading ? (
                    <p className="text-center text-gray-500">Loading tasks...</p>
                ) : sortedTasks.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No tasks found.</p>
                ) : (
                    sortedTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isSelected={selectedIds.includes(task.id)}
                            onToggleSelect={handleToggleSelect}
                            onRefresh={onRefresh}
                        />
                    ))
                )}
            </div>

            {/* Bulk Action Bar - Absolute Bottom */}
            {selectedIds.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full bg-[#e0e0e0] border-t border-gray-400 p-4 flex justify-between items-center px-8">
                    <span className="text-gray-700 font-medium">Bulk Action:</span>
                    <div className="flex gap-4">
                        <button className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 py-2 rounded text-sm font-medium transition-colors">
                            Done
                        </button>
                        <button
                            onClick={handleBulkRemove}
                            className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-8 py-2 rounded text-sm font-medium transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}