import { useEffect, useState } from "react";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await API.get(endpoints.tasks);
            const data = response.data.results || response.data; 
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="min-h-screen bg-white p-10 flex justify-center items-start font-sans">
            {/* Main Container: Black border, subtle shadow, split into 2 columns */}
            <div className="w-full max-w-7xl border-2 border-black flex flex-col md:flex-row min-h-[800px]">
                
                {/* Left Column: New Task (Occupies 50% or fixed width) */}
                <div className="w-full md:w-[50%] border-b-2 md:border-b-0 md:border-r-2 border-black p-8">
                    <AddTaskForm onTaskAdded={fetchTasks} />
                </div>

                {/* Right Column: To-Do List (Occupies the remaining space) */}
                <div className="w-full md:flex-1 p-8 relative bg-white">
                    <TaskList 
                        tasks={tasks} 
                        loading={loading} 
                        onRefresh={fetchTasks} 
                    />
                </div>
            </div>
        </div>
    );
}