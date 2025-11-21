import React, { useRef } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  LayoutList,
  Target,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Upload,
  Moon,
  Sun,
  Pencil,
  Columns,
} from "lucide-react";

// --- Utility Functions ---

export const calculateStatus = (progress) => {
  if (progress === 100) return "Completed";
  if (progress >= 60) return "In Progress";
  if (progress > 0) return "Started";
  return "Not Started";
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "High 🔴":
      return "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
    case "Medium 🟡":
      return "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
    case "Low 🟢":
      return "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
    default:
      return "text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:text-slate-400";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800";
    case "Started":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
  }
};

// --- Components ---

export const Header = ({
  view,
  setView,
  onExport,
  onImport,
  isDarkMode,
  toggleDarkMode,
}) => {
  const fileInputRef = useRef(null);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Target size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              TaskFlow
            </h1>
            <p className="hidden sm:block text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Productivity OS
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* View Switcher - Compact on Mobile */}
          <div className="flex items-center gap-0.5 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 mr-1 md:mr-2">
            <NavButton
              active={view === "all"}
              onClick={() => setView("all")}
              icon={<LayoutList size={16} />}
              label="List"
            />
            <NavButton
              active={view === "board"}
              onClick={() => setView("board")}
              icon={<Columns size={16} />}
              label="Board"
            />
            <NavButton
              active={view === "calendar"}
              onClick={() => setView("calendar")}
              icon={<CalendarIcon size={16} />}
              label="Cal"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Data Controls - Hidden on super small screens if needed, or kept compact */}
          <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-700 pl-1 md:pl-2">
            <button
              onClick={onExport}
              title="Export Data"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              title="Import Data"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
            >
              <Upload size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImport}
              className="hidden"
              accept=".json"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper for Nav Buttons - Hides text on mobile
const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-2 md:px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
      active
        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
    }`}
  >
    {icon} <span className="hidden md:inline">{label}</span>
  </button>
);

export const StatsOverview = ({ tasks, onAddClick }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 animate-in slide-in-from-bottom-2 duration-500">
    <StatCard
      title="Total Tasks"
      value={tasks.length}
      icon={<LayoutList size={16} />}
      colorClass="text-slate-400"
      bgClass="bg-slate-50 dark:bg-slate-800"
    />
    <StatCard
      title="High Priority"
      value={tasks.filter((t) => t.priority === "High 🔴").length}
      icon={<AlertCircle size={16} />}
      colorClass="text-rose-500"
      bgClass="bg-rose-50 dark:bg-rose-900/20"
    />
    <StatCard
      title="Completed"
      value={tasks.filter((t) => t.progress === 100).length}
      icon={<CheckCircle2 size={16} />}
      colorClass="text-emerald-500"
      bgClass="bg-emerald-50 dark:bg-emerald-900/20"
    />
    <button
      onClick={onAddClick}
      className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 p-4 md:p-5 rounded-2xl shadow-lg shadow-indigo-500/30 flex flex-col items-center justify-center text-white transition-all hover:scale-[1.02] active:scale-[0.98] group col-span-1"
    >
      <Plus
        size={28}
        className="mb-1 md:mb-2 group-hover:rotate-90 transition-transform"
      />
      <span className="font-semibold text-sm md:text-base">Add New</span>
    </button>
  </div>
);

const StatCard = ({ title, value, icon, colorClass, bgClass }) => (
  <div
    className={`bg-white dark:bg-slate-800 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm`}
  >
    <div className="flex items-center justify-between mb-2">
      <p
        className={`text-[10px] md:text-xs font-semibold ${colorClass} uppercase tracking-wider`}
      >
        {title}
      </p>
      <div className={`p-1.5 ${bgClass} rounded-lg ${colorClass}`}>{icon}</div>
    </div>
    <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
      {value}
    </p>
  </div>
);

// --- KANBAN BOARD (Responsive: Stack on mobile, Grid on Desktop) ---
export const KanbanBoard = ({ tasks, onUpdateProgress }) => {
  const columns = [
    {
      title: "To Do",
      status: "Not Started",
      color: "bg-slate-100 dark:bg-slate-800/50",
    },
    {
      title: "In Progress",
      status: "In Progress",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Completed",
      status: "Completed",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  const getTasksByStatus = (status) => {
    if (status === "Not Started") return tasks.filter((t) => t.progress === 0);
    if (status === "Completed") return tasks.filter((t) => t.progress === 100);
    return tasks.filter((t) => t.progress > 0 && t.progress < 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:h-[calc(100vh-250px)] overflow-visible md:overflow-hidden pb-20 md:pb-0">
      {columns.map((col) => (
        <div
          key={col.title}
          className={`flex flex-col rounded-xl ${col.color} p-3 md:p-4 border border-slate-200 dark:border-slate-700/50`}
        >
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 md:mb-4 flex items-center justify-between">
            {col.title}
            <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs shadow-sm">
              {getTasksByStatus(col.status).length}
            </span>
          </h3>
          <div className="flex-1 md:overflow-y-auto custom-scrollbar space-y-3">
            {getTasksByStatus(col.status).map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-800 p-3 md:p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(task.deadline).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h4 className="font-medium text-sm md:text-base text-slate-900 dark:text-white mb-2">
                  {task.name}
                </h4>
                <div className="flex items-center gap-2 mt-3">
                  {/* Mobile-friendly controls */}
                  {col.status !== "Not Started" && (
                    <button
                      onClick={() => onUpdateProgress(task.id, 0)}
                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-slate-300"
                    >
                      Reset
                    </button>
                  )}
                  {col.status !== "Completed" && (
                    <button
                      onClick={() =>
                        onUpdateProgress(
                          task.id,
                          col.status === "Not Started" ? 50 : 100
                        )
                      }
                      className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 ml-auto"
                    >
                      {col.status === "Not Started" ? "Start" : "Finish"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {getTasksByStatus(col.status).length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 opacity-50 italic">
                Empty
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const CalendarView = ({ tasks, currentDate, setCurrentDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 md:h-32 bg-slate-50/50 dark:bg-slate-800/30 border-b border-r border-slate-100 dark:border-slate-700"
        />
      );
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(d).padStart(2, "0")}`;
      const dayTasks = tasks.filter((t) => t.deadline === dateString);
      const isToday = new Date().toISOString().split("T")[0] === dateString;

      days.push(
        <div
          key={d}
          className={`h-24 md:h-32 border-b border-r border-slate-100 dark:border-slate-700 p-1 md:p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 overflow-hidden group ${
            isToday ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-xs md:text-sm font-medium h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full ${
                isToday
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {d}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400">
                {dayTasks.length}
              </span>
            )}
          </div>
          <div className="space-y-1 overflow-y-auto custom-scrollbar max-h-[60px] md:max-h-[90px]">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className={`text-[9px] md:text-[10px] px-1 py-0.5 rounded border truncate font-medium cursor-pointer shadow-sm ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          {monthNames[month]}{" "}
          <span className="text-slate-400 font-normal">{year}</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-medium px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div
            key={day}
            className="py-2 md:py-3 text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-white dark:bg-slate-800">
        {renderDays()}
      </div>
    </div>
  );
};

export const TaskTable = ({
  tasks,
  onUpdateProgress,
  onDeleteTask,
  onEditTask,
}) => {
  if (tasks.length === 0)
    return (
      <div className="text-center p-10 text-slate-400 dark:text-slate-500">
        No tasks found.
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 min-w-[800px]">
          <thead className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                Task Details
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                Category
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                Priority
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                Due Date
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 w-40">
                Progress
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {task.name}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-2">
                    {task.notes && (
                      <span className="truncate max-w-[150px]">
                        {task.notes}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    {task.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {new Date(task.deadline).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                          task.progress === 100
                            ? "bg-emerald-500"
                            : "bg-indigo-500"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={task.progress}
                      onChange={(e) =>
                        onUpdateProgress(task.id, parseInt(e.target.value))
                      }
                      className="absolute w-24 opacity-0 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AddTaskModal = ({
  show,
  onClose,
  onSubmit,
  newTask,
  setNewTask,
  isEditing,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border-t sm:border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {isEditing ? "Edit Task" : "New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Task Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                <option>Work</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>High 🔴</option>
                <option>Medium 🟡</option>
                <option>Low 🟢</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Deadline
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Notes
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newTask.notes || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, notes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/30"
            >
              {isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
