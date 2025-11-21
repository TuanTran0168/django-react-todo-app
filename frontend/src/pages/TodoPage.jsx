import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { endpoints } from "../services/endpoints";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: currentPage,
                page_size: pageSize,
                search: search,
            });

            const response = await API.get(
                `${endpoints.tasks}?${params.toString()}`
            );
            const data = response.data;

            if (data.results) {
                setTasks(data.results);
                setNextPageUrl(data.next);
                setPrevPageUrl(data.previous);
                setTotalCount(data.count);
            } else {
                setTasks(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, search]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleNext = () => {
        if (nextPageUrl) setCurrentPage((prev) => prev + 1);
    };
    const handlePrev = () => {
        if (prevPageUrl) setCurrentPage((prev) => prev - 1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleTaskAdded = () => {
        setCurrentPage(1);
        setSearch("");
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-10 flex justify-center items-start font-sans">
            <div className="w-full max-w-7xl h-[750px] bg-white border-2 border-black flex flex-col md:flex-row shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Left Column: Add Task */}
                <div className="w-full md:w-[450px] border-b-2 md:border-b-0 md:border-r-2 border-black p-8 overflow-y-auto">
                    <AddTaskForm onTaskAdded={handleTaskAdded} />
                </div>

                {/* Right Column: Task List & Controls */}
                <div className="w-full md:w-[600px] p-8 flex flex-col h-full">
                    <div className="flex-grow flex flex-col min-h-0">
                        <TaskList
                            tasks={tasks}
                            loading={loading}
                            onRefresh={fetchTasks}
                            search={search}
                            setSearch={handleSearchChange}
                        />
                    </div>

                    <div className="mt-4 pt-4 border-t-2 border-gray-100 flex flex-wrap justify-between items-center gap-4 shrink-0">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                                Total: <b>{totalCount}</b>
                            </span>

                            <div className="flex items-center gap-2">
                                <label htmlFor="pageSize">Rows:</label>
                                <select
                                    id="pageSize"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="border border-gray-300 rounded p-1 cursor-pointer hover:border-black focus:outline-none bg-white"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <button
                                onClick={handlePrev}
                                disabled={!prevPageUrl || loading}
                                className={`px-4 py-2 border-2 border-black font-bold text-sm transition-colors
                                    ${
                                        !prevPageUrl
                                            ? "opacity-30 cursor-not-allowed bg-gray-100 border-gray-300"
                                            : "hover:bg-black hover:text-white active:translate-y-1"
                                    }
                                `}
                            >
                                Prev
                            </button>

                            <span className="font-mono font-bold mx-2 w-16 text-center">
                                Page {currentPage}
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={!nextPageUrl || loading}
                                className={`px-4 py-2 border-2 border-black font-bold text-sm transition-colors
                                    ${
                                        !nextPageUrl
                                            ? "opacity-30 cursor-not-allowed bg-gray-100 border-gray-300"
                                            : "hover:bg-black hover:text-white active:translate-y-1"
                                    }
                                `}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
