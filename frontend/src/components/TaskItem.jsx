import React, { useState } from "react";
import TaskDetail from "./TaskDetail";
import API from "../services/api";
import { endpoints } from "../services/endpoints";

export default function TaskItem({ task, isSelected, onToggleSelect, onRefresh }) {
    const [showDetail, setShowDetail] = useState(false);

    const handleRemove = async () => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await API.delete(`${endpoints.tasks}${task.id}/`);
            onRefresh();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="border border-black p-4 bg-white transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer accent-black"
                        checked={isSelected}
                        onChange={() => onToggleSelect(task.id)}
                    />
                    <span className="font-medium text-gray-800 truncate text-base">
                        {task.title}
                    </span>
                </div>
                
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={() => setShowDetail(!showDetail)}
                        className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-1.5 rounded text-sm font-medium min-w-[90px] transition-colors"
                    >
                        Detail
                    </button>
                    <button
                        onClick={handleRemove}
                        className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-6 py-1.5 rounded text-sm font-medium min-w-[90px] transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Detail Section */}
            {showDetail && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <TaskDetail task={task} onUpdate={onRefresh} />
                </div>
            )}
        </div>
    );
}