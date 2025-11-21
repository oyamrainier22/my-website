import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

// Import updated components
import {
  Header,
  StatsOverview,
  CalendarView,
  TaskTable,
  KanbanBoard,
  AddTaskModal,
  calculateStatus,
} from "./DashboardComponents";

export default function ProductivityDashboard() {
  // 1. LOAD SAVED DATA
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
          notes: "Check citations",
          reminder: "Daily",
        },
        {
          id: 2,
          name: "Math Problem Set",
          category: "Homework",
          priority: "Medium 🟡",
          deadline: "2025-11-28",
          progress: 0,
          status: "Not Started",
          notes: "Chapter 4-5",
          reminder: "None",
        },
      ];
    }
  });

  const [view, setView] = useState("all"); // 'all', 'board', 'calendar'
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Editing State
  const [isEditingId, setIsEditingId] = useState(null);

  const [newTask, setNewTask] = useState({
    name: "",
    category: "School Project",
    priority: "Medium 🟡",
    deadline: new Date().toISOString().split("T")[0],
    progress: 0,
    notes: "",
    reminder: "",
  });

  // 2. EFFECTS
  useEffect(() => {
    localStorage.setItem("my-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // --- HANDLERS ---

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleExportData = () => {
    const jsonString = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `taskflow_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (Array.isArray(importedTasks)) {
          setTasks(importedTasks);
          alert("Success! Data restored.");
        }
      } catch (error) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();

    if (isEditingId) {
      // Update Existing Task
      setTasks(
        tasks.map((t) =>
          t.id === isEditingId
            ? { ...t, ...newTask, status: calculateStatus(newTask.progress) }
            : t
        )
      );
    } else {
      // Create New Task
      const taskToAdd = {
        id: Date.now(),
        ...newTask,
        status: calculateStatus(newTask.progress),
      };
      setTasks([...tasks, taskToAdd]);
    }

    // Reset Form
    setShowAddForm(false);
    setIsEditingId(null);
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

  const openEditModal = (task) => {
    setNewTask(task);
    setIsEditingId(task.id);
    setShowAddForm(true);
  };

  const openCreateModal = () => {
    setIsEditingId(null);
    setNewTask({
      name: "",
      category: "School Project",
      priority: "Medium 🟡",
      deadline: new Date().toISOString().split("T")[0],
      progress: 0,
      notes: "",
      reminder: "",
    });
    setShowAddForm(true);
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

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-10">
      <Header
        view={view}
        setView={setView}
        onExport={handleExportData}
        onImport={handleImportData}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats */}
        {view === "all" && (
          <StatsOverview tasks={tasks} onAddClick={openCreateModal} />
        )}

        {/* VIEW CONTROLLER */}
        {view === "calendar" ? (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
              >
                <Plus size={16} /> Quick Add
              </button>
            </div>
            <CalendarView
              tasks={tasks}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
          </>
        ) : view === "board" ? (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
              >
                <Plus size={16} /> Quick Add
              </button>
            </div>
            <KanbanBoard tasks={tasks} onUpdateProgress={updateProgress} />
          </>
        ) : (
          <TaskTable
            tasks={tasks}
            onUpdateProgress={updateProgress}
            onDeleteTask={deleteTask}
            onEditTask={openEditModal}
          />
        )}

        <AddTaskModal
          show={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleSaveTask}
          newTask={newTask}
          setNewTask={setNewTask}
          isEditing={!!isEditingId}
        />

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-600 pb-8">
          <span>TaskFlow AI v3.5 Mobile</span>
        </div>
      </main>
    </div>
  );
}
