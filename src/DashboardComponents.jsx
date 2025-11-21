import React from "react";
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
} from "lucide-react";

// --- Utility / Style Functions (Exported so App.js can use them too) ---

export const calculateStatus = (progress) => {
  if (progress === 100) return "Completed";
  if (progress >= 60) return "In Progress";
  if (progress > 0) return "Started";
  return "Not Started";
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "High 🔴":
      return "text-rose-600 bg-rose-50 border-rose-100 ring-rose-500/20";
    case "Medium 🟡":
      return "text-amber-600 bg-amber-50 border-amber-100 ring-amber-500/20";
    case "Low 🟢":
      return "text-emerald-600 bg-emerald-50 border-emerald-100 ring-emerald-500/20";
    default:
      return "text-slate-600 bg-slate-50 border-slate-100";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Started":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

// --- Presentational Components ---

export const Header = ({ view, setView }) => (
  <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Target size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            TaskFlow
          </h1>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Productivity OS
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
        <NavButton
          active={view === "all"}
          onClick={() => setView("all")}
          icon={null}
          label="List View"
        />
        <NavButton
          active={view === "focus"}
          onClick={() => setView("focus")}
          icon={<Target size={14} />}
          label="Focus"
        />
        <NavButton
          active={view === "calendar"}
          onClick={() => setView("calendar")}
          icon={<CalendarIcon size={14} />}
          label="Calendar"
        />
      </div>
    </div>
  </header>
);

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
      active
        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
    }`}
  >
    {icon} {label}
  </button>
);

export const StatsOverview = ({ tasks, onAddClick }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-bottom-2 duration-500">
    <StatCard
      title="Total Tasks"
      value={tasks.length}
      icon={<LayoutList size={16} />}
      colorClass="text-slate-400"
      bgClass="bg-slate-50"
      borderClass="border-slate-100"
      textClass="text-slate-800"
    />
    <StatCard
      title="High Priority"
      value={tasks.filter((t) => t.priority === "High 🔴").length}
      icon={<AlertCircle size={16} />}
      colorClass="text-rose-500"
      bgClass="bg-rose-50"
      borderClass="border-rose-50"
      textClass="text-rose-600"
    />
    <StatCard
      title="Completed"
      value={tasks.filter((t) => t.progress === 100).length}
      icon={<CheckCircle2 size={16} />}
      colorClass="text-emerald-500"
      bgClass="bg-emerald-50"
      borderClass="border-emerald-50"
      textClass="text-emerald-600"
    />
    <button
      onClick={onAddClick}
      className="bg-indigo-600 hover:bg-indigo-700 p-5 rounded-2xl shadow-lg shadow-indigo-500/30 flex flex-col items-center justify-center text-white transition-all hover:scale-[1.02] active:scale-[0.98] group"
    >
      <Plus
        size={32}
        className="mb-2 group-hover:rotate-90 transition-transform"
      />
      <span className="font-semibold">Add New Task</span>
    </button>
  </div>
);

const StatCard = ({
  title,
  value,
  icon,
  colorClass,
  bgClass,
  borderClass,
  textClass,
}) => (
  <div
    className={`bg-white p-5 rounded-2xl border ${borderClass} shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="flex items-center justify-between mb-2">
      <p
        className={`text-xs font-semibold ${colorClass} uppercase tracking-wider`}
      >
        {title}
      </p>
      <div className={`p-1.5 ${bgClass} rounded-lg ${colorClass}`}>{icon}</div>
    </div>
    <p className={`text-3xl font-bold ${textClass}`}>{value}</p>
  </div>
);

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
          className="h-32 bg-slate-50/50 border-b border-r border-slate-100"
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
          className={`h-32 border-b border-r border-slate-100 p-2 hover:bg-slate-50 overflow-hidden group ${
            isToday ? "bg-blue-50/30" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${
                isToday ? "bg-indigo-600 text-white" : "text-slate-700"
              }`}
            >
              {d}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-xs font-bold text-slate-400">
                {dayTasks.length}
              </span>
            )}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)] custom-scrollbar">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className={`text-[10px] px-1.5 py-1 rounded border truncate font-medium cursor-pointer shadow-sm ${getPriorityColor(
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          {monthNames[month]}{" "}
          <span className="text-slate-400 font-normal">{year}</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center border-b border-slate-200 bg-slate-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-white">{renderDays()}</div>
    </div>
  );
};

export const TaskTable = ({
  tasks,
  onUpdateProgress,
  onBreakTask,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-20 text-center">
        <div className="flex flex-col items-center text-slate-400">
          <LayoutList size={48} className="mb-4 opacity-20" />
          <p className="text-base font-medium text-slate-500">No tasks found</p>
          <p className="text-sm">Adjust your filters or add a new task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Task Details
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
                Progress
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{task.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    {task.notes && (
                      <span className="truncate max-w-[150px]">
                        {task.notes}
                      </span>
                    )}
                    {task.reminder && (
                      <span className="flex items-center gap-1 text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">
                        <Clock size={10} /> {task.reminder}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {task.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  {new Date(task.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onBreakTask(task)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <LayoutList size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">New Task Entry</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Task Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Deadline
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Reminder
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newTask.reminder}
                onChange={(e) =>
                  setNewTask({ ...newTask, reminder: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02]"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
