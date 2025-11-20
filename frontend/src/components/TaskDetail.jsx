import React, { useState } from "react";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import "./TaskDetail.css";

export default function TaskDetail({ task, onUpdate }) {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description || "",
        dueDate: task.due_date,
        priority: task.priority,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await API.patch(`${endpoints.tasks}${task.id}/`, {
                title: formData.title,
                description: formData.description,
                due_date: formData.dueDate,
                priority: formData.priority,
            });
            onUpdate(); // Refresh list
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task");
        }
    };

    return (
        <div className="task-detail-container space-y-3">
             <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
            />

            <div className="flex flex-col">
                <label className="font-bold text-sm mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded h-24 resize-none"
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="font-bold text-sm mb-1 block">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex-1">
                    <label className="font-bold text-sm mb-1 block">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleUpdate}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                Update
            </button>
        </div>
    );
}