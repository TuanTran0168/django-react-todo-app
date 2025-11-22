import React, { useState } from "react";
import TaskDetail from "./TaskDetail";
import API from "../services/api";
import { endpoints } from "../services/endpoints";

const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    } catch (e) {
        console.error(e);
        return dateString;
    }
};

export default function TaskItem({
    task,
    isSelected,
    onToggleSelect,
    onRefresh,
}) {
    const [showDetail, setShowDetail] = useState(false);

    const handleRemove = async () => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await API.delete(`${endpoints.tasks}${task.id}/`);
            onRefresh();
        } catch (error) {
            console.error(error);
        }
    };

    const statusText = task.is_done ? "✅ Done" : "⏳ Todo";

    // Clean Card Style
    const containerStyle = task.is_done
        ? "bg-gray-50 opacity-80"
        : "bg-white shadow-sm hover:shadow-md";

    const titleStyle = task.is_done
        ? "text-gray-400 line-through"
        : "text-gray-800";

    const badgeStyle =
        {
            High: "bg-red-100 text-red-700",
            Normal: "bg-indigo-50 text-indigo-700",
            Low: "bg-green-100 text-green-700",
        }[task.priority] || "bg-gray-100 text-gray-600";

    return (
        <div
            className={`p-4 transition-all rounded-2xl border border-gray-100 ${containerStyle} ${
                isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
            }`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer accent-indigo-600 rounded-md"
                        checked={isSelected}
                        onChange={() => onToggleSelect(task.id)}
                    />

                    <div className="min-w-0 flex-1 text-left">
                        <span
                            className={`font-bold text-base block truncate ${titleStyle}`}
                            title={task.title}
                        >
                            {task.title}
                        </span>

                        <div className="flex gap-2 items-center text-xs mt-1.5">
                            <span className="font-bold text-gray-500 mr-1">
                                {statusText}
                            </span>

                            <span
                                className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${badgeStyle}`}
                            >
                                {task.priority}
                            </span>
                            <span className="text-gray-400 font-medium">
                                {formatDate(task.due_date)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={() => setShowDetail(!showDetail)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                        Detail
                    </button>
                    <button
                        onClick={handleRemove}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {showDetail && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                    <TaskDetail task={task} onUpdate={onRefresh} />
                </div>
            )}
        </div>
    );
}
