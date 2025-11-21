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

    const inputStyle = "w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-shadow shadow-inner";

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-center font-bold text-2xl mb-8 text-gray-800">
                New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task title (required)"
                        value={formData.title}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                    />
                </div>
                
                <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm mb-2 text-gray-600">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`${inputStyle} h-32 resize-none`}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="font-semibold text-sm mb-2 block text-gray-600">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                min={today}
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold text-sm mb-2 block text-gray-600">
                                Priority
                            </label>
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
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl mt-8 transition-all shadow-lg hover:shadow-xl active:shadow-md"
                >
                    Add Task
                </button>
            </form>
        </div>
    );
}