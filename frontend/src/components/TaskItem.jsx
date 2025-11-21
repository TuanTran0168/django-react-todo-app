import React, { useState } from "react";
import TaskDetail from "./TaskDetail";
import API from "../services/api";
import { endpoints } from "../services/endpoints";

const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
};

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

    // Task Item container style update: Soft shadow, rounded corners.
    const containerStyle = task.is_done 
        ? "bg-green-50 shadow-md" // Done tasks are lighter green, subtle shadow
        : "bg-white shadow-md hover:shadow-xl"; // Todo tasks are white, more pronounced hover shadow for iOS feel

    const titleStyle = task.is_done 
        ? "text-gray-400 line-through" 
        : "text-gray-800";
        
    const statusText = task.is_done ? "✅ Done" : "⏳ Todo";

    let priorityBadgeStyle = "bg-gray-100 text-gray-600 border border-gray-200";
    if (task.priority === 'High') {
        priorityBadgeStyle = "bg-red-100 text-red-800 border border-red-200";
    } else if (task.priority === 'Normal') {
        priorityBadgeStyle = "bg-blue-100 text-blue-800 border border-blue-200";
    } else if (task.priority === 'Low') {
        priorityBadgeStyle = "bg-green-100 text-green-800 border border-green-200";
    }

    return (
        <div className={`p-4 transition-all rounded-xl ${containerStyle}`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer accent-indigo-500"
                        checked={isSelected}
                        onChange={() => onToggleSelect(task.id)}
                    />
                    <div className="min-w-0 flex-1 text-left">
                        <span 
                            title={task.title}
                            className={`font-medium truncate text-base block max-w-full ${titleStyle}`} 
                        >
                            {task.title}
                        </span>
                        
                        <div className="flex gap-3 items-center text-xs mt-1">
                            <span className="font-semibold text-gray-500">
                                {statusText}
                            </span>
                            
                            {task.priority && (
                                <span 
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${priorityBadgeStyle}`}
                                >
                                    {task.priority}
                                </span>
                            )}

                            <span className="text-gray-500">
                                Due: <strong>{formatDate(task.due_date)}</strong>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={() => setShowDetail(!showDetail)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold min-w-[90px] transition-colors"
                    >
                        Detail
                    </button>
                    <button
                        onClick={handleRemove}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold min-w-[90px] transition-colors"
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