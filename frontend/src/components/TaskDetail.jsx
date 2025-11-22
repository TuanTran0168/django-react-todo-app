import React, { useState } from "react";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import "./TaskDetail.css";
import { format } from "date-fns";

export default function TaskDetail({ task, onUpdate }) {
    const today = format(new Date(), "yyyy-MM-dd");

    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description || "",
        due_date: task.due_date,
        priority: task.priority,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await API.patch(`${endpoints.tasks}${task.id}/`, formData);
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Failed to update");
        }
    };

    const inputStyle =
        "w-full p-2.5 bg-gray-100 rounded-lg border-none text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all";
    const labelStyle =
        "text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block ml-1";

    return (
        <div className="space-y-3">
            <div>
                <label className={labelStyle}>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputStyle}
                />
            </div>

            <div>
                <label className={labelStyle}>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`${inputStyle} h-20 resize-none`}
                />
            </div>

            <div className="flex gap-3">
                <div className="flex-1">
                    <label className={labelStyle}>Due Date</label>
                    <input
                        type="date"
                        name="due_date"
                        min={today}
                        value={formData.due_date}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>
                <div className="flex-1">
                    <label className={labelStyle}>Priority</label>
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

            <button
                onClick={handleUpdate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all mt-2 shadow-md"
            >
                Save Changes
            </button>
        </div>
    );
}
