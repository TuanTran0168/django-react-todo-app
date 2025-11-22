import React, { useState } from "react";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import { format } from "date-fns";

export default function AddTaskForm({ onTaskAdded }) {
    const today = format(new Date(), "yyyy-MM-dd");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: today,
        priority: "Normal",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return alert("Task title is required");

        const dataToSend = {
            title: formData.title,
            description: formData.description,
            due_date: formData.dueDate,
            priority: formData.priority,
        };
        try {
            await API.post(endpoints.tasks, dataToSend);
            setFormData({
                title: "",
                description: "",
                dueDate: today,
                priority: "Normal",
            });
            onTaskAdded();
        } catch (error) {
            console.error("Error adding task:", error.response.data);
            alert("Failed to add task");
        }
    };

    const inputStyle =
        "w-full p-3 bg-gray-100 rounded-xl border-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200";
    const labelStyle =
        "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1";

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8 text-center">
                <h2 className="font-extrabold text-2xl text-gray-800 tracking-tight">
                    New Task
                </h2>
                <p className="text-indigo-600 font-medium text-sm mt-1 bg-indigo-50 inline-block px-3 py-1 rounded-full">
                    Tran Dang Tuan
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {/* Title */}
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="What needs to be done?"
                        value={formData.title}
                        onChange={handleChange}
                        className={`${inputStyle} text-lg shadow-sm`}
                        required
                    />
                </div>

                {/* Grouped Fields */}
                <div className="space-y-4">
                    <div>
                        <label className={labelStyle}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add details..."
                            className={`${inputStyle} h-32 resize-none`}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className={labelStyle}>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                min={today}
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={`${inputStyle} cursor-pointer`}
                            />
                        </div>
                        <div className="flex-1">
                            <label className={labelStyle}>Priority</label>
                            <div className="relative">
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className={`${inputStyle} appearance-none cursor-pointer`}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl mt-auto transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
}
