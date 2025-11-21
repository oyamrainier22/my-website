import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

// Import components and utility functions from your JSX file
import {
  Header,
  StatsOverview,
  CalendarView,
  TaskTable,
  AddTaskModal,
  calculateStatus,
} from "./DashboardComponents";

export default function ProductivityDashboard() {
  // 1. State Structure
  const [tasks, setTasks] = useState([
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
    {
      id: 3,
      name: "Buy Groceries",
      category: "Personal",
      priority: "Low 🟢",
      deadline: "2025-11-24",
      progress: 0,
      status: "Not Started",
      notes: "Milk, Eggs, Bread, Coffee",
      reminder: "Saturday Morning",
    },
    {
      id: 4,
      name: "Physics Lab Report",
      category: "Homework",
      priority: "High 🔴",
      deadline: "2025-11-22",
      progress: 100,
      status: "Completed",
      notes: "Submit via portal",
      reminder: "None",
    },
  ]);

  const [view, setView] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));

  const [newTask, setNewTask] = useState({
    name: "",
    category: "School Project",
    priority: "Medium 🟡",
    deadline: new Date().toISOString().split("T")[0],
    progress: 0,
    notes: "",
    reminder: "",
  });

  // 2. Effects
  useEffect(() => {
    setTasks((currentTasks) =>
      currentTasks.map((t) => ({ ...t, status: calculateStatus(t.progress) }))
    );
  }, []);

  // 3. Logic Handlers
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
      deadline: new Date().toISOString().split("T")[0],
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
        name: `${task.name} - Phase 1`,
        progress: 0,
        status: "Not Started",
      },
      {
        ...task,
        id: Date.now() + 2,
        name: `${task.name} - Phase 2`,
        progress: 0,
        status: "Not Started",
      },
    ];
    setTasks([...tasks.filter((t) => t.id !== task.id), ...subtasks]);
  };

  const getFilteredTasks = () => {
    if (view === "focus") {
      return tasks.filter(
        (t) => t.priority === "High 🔴" || t.status === "In Progress"
      );
    }
    return tasks;
  };

  // 4. Final Render
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <Header view={view} setView={setView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Conditionally render Stats only in non-calendar views */}
        {view !== "calendar" && (
          <StatsOverview
            tasks={tasks}
            onAddClick={() => setShowAddForm(true)}
          />
        )}

        {/* View Switcher Logic */}
        {view === "calendar" ? (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} /> Quick Add Task
              </button>
            </div>
            <CalendarView
              tasks={tasks}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
          </>
        ) : (
          <TaskTable
            tasks={getFilteredTasks()}
            onUpdateProgress={updateProgress}
            onBreakTask={breakTask}
            onDeleteTask={deleteTask}
          />
        )}

        <AddTaskModal
          show={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddTask}
          newTask={newTask}
          setNewTask={setNewTask}
        />

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>TaskFlow AI v2.0</span>
          <span>•</span>
          <span>Syncing enabled</span>
        </div>
      </main>
    </div>
  );
}
