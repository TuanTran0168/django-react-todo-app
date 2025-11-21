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

    const inputStyle = "w-full p-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-shadow shadow-inner";


    return (
        <div className="task-detail-container space-y-4">
            <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1 text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1 text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`${inputStyle} h-24 resize-none`}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="font-bold text-sm mb-1 block text-gray-700">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="font-bold text-sm mb-1 block text-gray-700">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className={`${inputStyle} cursor-pointer`}
                        >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={handleUpdate}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
                Update Task
            </button>
        </div>
    );
}