import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  LayoutList,
  Target,
  Clock,
  Trash2,
} from "lucide-react";

// Helper to calculate status based on user rules
const calculateStatus = (progress) => {
  if (progress === 100) return "Completed";
  if (progress >= 60) return "In Progress";
  if (progress > 0) return "Started";
  return "Not Started";
};

// Helper to determine priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High 🔴":
      return "text-red-500 bg-red-50 border-red-200";
    case "Medium 🟡":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Low 🟢":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Started":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export default function ProductivityDashboard() {
  // 1. MODIFIED: Load data from Local Storage on startup
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("my-tasks");
    if (saved) {
      return JSON.parse(saved);
    } else {
      return [
        {
          id: 1,
          name: "Finalize Research Paper",
          category: "Thesis",
          priority: "High 🔴",
          deadline: "2025-11-25",
          progress: 65,
          status: "In Progress",
          notes: "Check citations and formatting",
          reminder: "Daily at 8 PM",
        },
        {
          id: 2,
          name: "Math Problem Set",
          category: "Homework",
          priority: "Medium 🟡",
          deadline: "2025-11-28",
          progress: 0,
          status: "Not Started",
          notes: "Chapter 4-5 exercises",
          reminder: "None",
        },
      ];
    }
  });

  const [view, setView] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    category: "School Project",
    priority: "Medium 🟡",
    deadline: "",
    progress: 0,
    notes: "",
    reminder: "",
  });

  // 2. MODIFIED: Save to Local Storage whenever 'tasks' changes
  useEffect(() => {
    localStorage.setItem("my-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Auto-update status when tasks change (Legacy effect kept for status logic)
  useEffect(() => {
    setTasks((currentTasks) =>
      currentTasks.map((t) => ({
        ...t,
        status: calculateStatus(t.progress),
      }))
    );
  }, []); // Only run on mount to fix initial statuses if needed

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      status: calculateStatus(newTask.progress),
    };
    setTasks([...tasks, taskToAdd]);
    setShowAddForm(false);
    setNewTask({
      name: "",
      category: "School Project",
      priority: "Medium 🟡",
      deadline: "",
      progress: 0,
      notes: "",
      reminder: "",
    });
  };

  const updateProgress = (id, newVal) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, progress: newVal, status: calculateStatus(newVal) }
          : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const breakTask = (task) => {
    const subtasks = [
      {
        ...task,
        id: Date.now() + 1,
        name: `${task.name} - Part 1 (Research)`,
        progress: 0,
        status: "Not Started",
      },
      {
        ...task,
        id: Date.now() + 2,
        name: `${task.name} - Part 2 (Drafting)`,
        progress: 0,
        status: "Not Started",
      },
      {
        ...task,
        id: Date.now() + 3,
        name: `${task.name} - Part 3 (Review)`,
        progress: 0,
        status: "Not Started",
      },
    ];
    setTasks([...tasks.filter((t) => t.id !== task.id), ...subtasks]);
  };

  // Filtering Logic
  const getFilteredTasks = () => {
    if (view === "focus") {
      return tasks.filter(
        (t) => t.priority === "High 🔴" || t.status === "In Progress"
      );
    }
    if (view === "weekly") {
      return [...tasks].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Productivity System
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("all")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setView("focus")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                view === "focus"
                  ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Target size={14} /> Focus Mode
            </button>
            <button
              onClick={() => setView("weekly")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                view === "weekly"
                  ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calendar size={14} /> Weekly View
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">High Priority</p>
            <p className="text-2xl font-bold text-red-600">
              {tasks.filter((t) => t.priority === "High 🔴").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">
              {tasks.filter((t) => t.progress === 100).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-start">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full h-full flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium py-2"
            >
              <Plus size={18} /> Add New Task
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-indigo-100 shadow-md animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-semibold mb-4">New Task Entry</h3>
            <form
              onSubmit={handleAddTask}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <input
                type="text"
                placeholder="Task Name"
                required
                className="col-span-2 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
              <select
                className="p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
              >
                <option>Thesis</option>
                <option>School Project</option>
                <option>Homework</option>
                <option>Exam Review</option>
                <option>Personal</option>
              </select>
              <select
                className="p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>High 🔴</option>
                <option>Medium 🟡</option>
                <option>Low 🟢</option>
              </select>
              <input
                type="date"
                required
                className="p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Notes"
                className="p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTask.notes}
                onChange={(e) =>
                  setNewTask({ ...newTask, notes: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Reminder (e.g. 8 PM)"
                className="p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTask.reminder}
                onChange={(e) =>
                  setNewTask({ ...newTask, reminder: e.target.value })
                }
              />
              <div className="flex items-center gap-2 col-span-1">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Task Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4 w-48">Progress (%)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No tasks found for this view.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {task.name}
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Clock size={10} /> {task.reminder || "No reminder"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {task.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        {task.deadline}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) =>
                              updateProgress(task.id, parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="text-xs font-semibold w-8 text-right">
                            {task.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                        {task.notes}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => breakTask(task)}
                            title="Break into subtasks"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                          >
                            <LayoutList size={16} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            title="Delete task"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          Modern Productivity AI System • Last Updated: Just now
        </div>
      </main>
    </div>
  );
}
