import React from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FaClipboardList, FaUserFriends } from "react-icons/fa";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Mock Data
const summary = {
  totalTasks: 50,
  tasks: {
    completed: 20,
    "in progress": 15,
    todo: 15,
  },
  last10Task: [
    { title: "Fix Navbar Issue", priority: "high", createdAt: "2025-02-18" },
    { title: "Update User Profile", priority: "medium", createdAt: "2025-02-17" },
    { title: "Deploy to Production", priority: "low", createdAt: "2025-02-16" },
  ],
  users: [
    { name: "Jasmin", role: "Admin", isActive: true, createdAt: "2025-01-01" },
    { name: "Pushpo", role: "Moderator", isActive: false, createdAt: "2025-01-10" },
  ],
};

// Chart.js Registration
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ICONS = {
  high: <MdKeyboardDoubleArrowUp className="text-red-500" />,
  medium: <MdKeyboardArrowUp className="text-yellow-500" />,
  low: <MdKeyboardArrowDown className="text-green-500" />,
};

const UserDashboard = () => {
  const { totalTasks, tasks, last10Task, users } = summary;

  // Chart Data
  const chartData = {
    labels: ["Completed", "In Progress", "To-Do"],
    datasets: [
      {
        label: "Task Progress",
        data: [tasks.completed, tasks["in progress"], tasks.todo],
        backgroundColor: ["#38b2ac", "#ecc94b", "#e53e3e"],
        borderColor: ["#2c7a7b", "#b7791f", "#c53030"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-5">
      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" count={totalTasks} icon={<FaClipboardList />} color="bg-blue-500" />
        <StatCard label="Completed" count={tasks.completed} icon={<FaClipboardList />} color="bg-green-500" />
        <StatCard label="In Progress" count={tasks["in progress"]} icon={<FaClipboardList />} color="bg-yellow-500" />
        <StatCard label="To-Do" count={tasks.todo} icon={<FaClipboardList />} color="bg-red-500" />
      </div>

      {/* Task Table */}
      <div className="mt-10 bg-white shadow-md p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Task Title</th>
              <th className="p-2 text-left">Priority</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {last10Task.map((task, index) => (
              <tr key={index} className="border-t hover:bg-gray-100">
                <td className="p-2">{task.title}</td>
                <td className="p-2 flex items-center gap-2">{ICONS[task.priority]} {task.priority}</td>
                <td className="p-2">{moment(task.createdAt).fromNow()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Table */}
      <div className="mt-10 bg-white shadow-md p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">User Overview</h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-t hover:bg-gray-100">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className={`p-2 ${user.isActive ? "text-green-500" : "text-red-500"}`}>
                  {user.isActive ? "Active" : "Disabled"}
                </td>
                <td className="p-2">{moment(user.createdAt).fromNow()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Progress Chart */}
      <div className="mt-10 bg-white shadow-md p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Task Progress Chart</h2>
        <div className="h-60">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component
const StatCard = ({ label, count, icon, color }) => (
  <div className={`p-4 rounded shadow-md text-white ${color} flex justify-between`}>
    <div>
      <h3 className="text-lg">{label}</h3>
      <p className="text-2xl font-bold">{count}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default UserDashboard;
