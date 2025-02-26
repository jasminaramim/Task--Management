import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";  // ✅ Import SweetAlert2
import { NavLink } from "react-router-dom";
import { FaCheckCircle, FaFlag, FaCalendarAlt, FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "../Hooks/useAuth";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const userEmail = user?.email;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      if (!userEmail) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tasks/email/${userEmail}`
        );

        if (response.status === 200) {
          const allTasks = response.data;
          const todoTasks = allTasks.filter((task) => task.status === "To-Do");

          if (todoTasks.length === 0) {
            toast.info('No "To-Do" tasks found');
          }

          setTasks(todoTasks);
        } else {
          toast.error("No tasks found");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("No tasks available, please add a task.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  // 🗑️ Delete Task Handler with SweetAlert Confirmation
  const handleDeleteTask = async (taskId) => {
    // Show confirmation alert
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`);
          
          if (response.status === 200) {
            toast.success("Task deleted successfully");
            setTasks(tasks.filter((task) => task._id !== taskId)); // Remove from state
          } else {
            toast.error("Failed to delete task");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          toast.error("Error deleting task");
        }
      }
    });
  };

  return (
    <div className="m-11 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        To-Do Tasks
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : (
        <ul className="space-y-4">
          {tasks.length === 0 ? (
            <li className="text-center text-gray-500">
              No tasks with "To-Do" status available.
            </li>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm border-l-4 border-blue-500"
              >
                <div className="sm:w-3/4">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>

                  <div className="flex gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                    {/* Status */}
                    <div className="flex items-center">
                      <FaCheckCircle
                        className={`mr-2 ${
                          task.status === "Completed"
                            ? "text-green-500"
                            : task.status === "In Progress"
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }`}
                      />
                      <strong>Status:</strong> {task.status}
                    </div>

                    {/* Priority */}
                    <div className="flex items-center">
                      <FaFlag
                        className={`mr-2 ${
                          task.priority === "High"
                            ? "text-red-500"
                            : task.priority === "Medium"
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      />
                      <strong>Priority:</strong> {task.priority}
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <strong>Due Date:</strong> {task.dueDate}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-400 mt-2">
                    {task.timestamp}
                  </div>

                  {/* 📝 Update & 🗑️ Delete Buttons */}
                  <div className="flex gap-2 mt-4">
                    <NavLink
                      to={`/dashboard/tasks/update/${task._id}`}
                      className="text-blue-600 hover:text-blue-400 flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </NavLink>

                    <button
                      className="text-red-600 hover:text-red-400 flex items-center"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrashAlt className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Todo;
