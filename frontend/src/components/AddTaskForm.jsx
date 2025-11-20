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

        try {
            await API.post(endpoints.tasks, {
                title: formData.title,
                description: formData.description,
                due_date: formData.dueDate,
                priority: formData.priority,
            });
            
            setFormData({
                title: "",
                description: "",
                dueDate: today,
                priority: "Normal",
            });
            onTaskAdded(); 
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task");
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-center font-bold text-xl mb-10">New Task</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {/* Title Input */}
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Add new task ..."
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                        required
                    />
                </div>

                {/* Description Input */}
                <div className="flex flex-col">
                    <label className="font-bold text-sm mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded h-40 resize-none focus:outline-none focus:border-black"
                    />
                </div>

                {/* Due Date & Priority Row */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <label className="font-bold text-sm mb-2 block">Due Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="dueDate"
                                min={today}
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded pr-2"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="font-bold text-sm mb-2 block">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded bg-white cursor-pointer"
                        >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                {/* Add Button */}
                <button
                    type="submit"
                    className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-3 px-4 rounded mt-8 transition-colors shadow-sm"
                >
                    Add
                </button>
            </form>
        </div>
    );
}