import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { FaCheckCircle, FaFlag, FaCalendarAlt, FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "../Hooks/useAuth";

const InProgress = () => {
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
          `http://localhost:9000/tasks/email/${userEmail}`
        );

        if (response.status === 200) {
          const allTasks = response.data;
          const inProgressTasks = allTasks.filter((task) => task.status === "In Progress");

          if (inProgressTasks.length === 0) {
            toast.info('No "In Progress" tasks found');
          }

          setTasks(inProgressTasks);
        } else {
          toast.error("No tasks found");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Error fetching tasks, please try again");
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

  // 🗑️ Delete Task Handler with SweetAlert confirmation
  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:9000/tasks/${taskId}`);
          
          if (response.status === 200) {
            toast.success("Task deleted successfully");
            setTasks(tasks.filter((task) => task._id !== taskId));
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
        In Progress Tasks
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : (
        <ul className="space-y-4">
          {tasks.length === 0 ? (
            <li className="text-center text-gray-500">
              No tasks with "In Progress" status available.
            </li>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm border-l-4 border-yellow-500"
              >
                <div className="sm:w-3/4">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>

                  <div className="flex gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                    {/* Status */}
                    <div className="flex items-center">
                      <FaCheckCircle className="mr-2 text-yellow-500" />
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

export default InProgress;
