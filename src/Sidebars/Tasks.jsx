import React, { useState, useEffect } from 'react';
import { FaList, FaTh, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaExclamationCircle, FaClock, FaFlag, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';  // Import useNavigate hook
import useAuth from '../Hooks/useAuth';

const Tasks = () => {
    const [viewMode, setViewMode] = useState('list');
    const [tasks, setTasks] = useState([]);  // State to store the tasks
    const [newTask, setNewTask] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskCategory, setTaskCategory] = useState('To-Do');
    const [taskPriority, setTaskPriority] = useState('Medium');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();  // Assuming the user object contains the email
    const userEmail = user?.email;
    const navigate = useNavigate();  // Initialize the useNavigate hook
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
          setLoading(true);  // Start loading state
          
          if (!user?.email) {
            toast.error('User not authenticated');
            setLoading(false);
            return;  // If there's no authenticated user, stop fetching tasks
          }
      
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/email/${user?.email}`);
            
            // Handle successful response
            if (response.status === 200) {
              const tasks = response.data;  // Assuming the response contains the tasks directly
              if (tasks.length === 0) {
                toast.info('No tasks found');
              } else {
                setTasks(tasks);  // Set tasks state with the fetched tasks
              }
            } else {
              toast.error('No tasks found');
            }
          } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
          } finally {
            setLoading(false);  // End loading state
          }
        };
      
        if (user?.email) {
          fetchTasks();  // Fetch tasks only if the user is authenticated
        } else {
          setLoading(false);  // No tasks if no user email is present
        }
      }, [user]);  // Re-fetch tasks whenever the user changes
      
    
    if (loading) {
        return <div>Loading...</div>;  // Display loading state
    }
    
   
    
    

    const handleViewToggle = () => {
        setViewMode(viewMode === 'list' ? 'board' : 'list');
    };

 
    const handleCreateTask = async (e) => {
        e.preventDefault();  // Prevent the form from refreshing the page
    
        // Validate title length before proceeding
        if (newTask.length > 50) {
            toast.error('Title cannot exceed 50 characters');
            return;
        }
    
        const newTaskObj = {
            title: newTask,
            description: taskDescription,
            status: taskCategory,  // Status will be "To-Do", "In Progress", or "Completed"
            priority: taskPriority,
            dueDate: taskDueDate,
            timestamp: new Date().toLocaleString(),  // Auto-generated timestamp
            email: userEmail,  // Add user email to the task object
        };
    
        // Optimistic update: add the task to the tasks state before making the API call
        setTasks((prevTasks) => [...prevTasks, { ...newTaskObj, _id: 'temp-id' }]);  // You can add a temporary ID or leave it until the server responds
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, newTaskObj);
    
            if (response.status === 200) {
                toast.success('Task created successfully!');
                // After the server confirms the task, update the task list with the correct ID from the response
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === 'temp-id' ? { ...task, _id: response.data._id } : task
                    )
                );
                // Reset form fields
                setNewTask('');
                setTaskDescription('');
                setTaskCategory('To-Do');
                setTaskPriority('Medium');
                setTaskDueDate('');
                setIsModalOpen(false);
            } else {
                toast.error('Error creating task.');
            }
        } catch (error) {
            console.error('Error submitting the task:', error);
            toast.error('Failed to create task.');
            // Revert the optimistic update in case of failure
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== 'temp-id'));
        }
    };
    
    

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const handleDeleteTask = async (id) => {
        // First, check if the task ID exists
        if (!id) {
            toast.error('Invalid task ID');
            return;
        }

        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            // Proceed with task deletion if confirmed
            try {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`);
                if (response.status === 200) {
                    toast.success('Task deleted successfully!');
                    // Remove the task from the tasks list in both views (list and board)
                    setTasks(tasks.filter(task => task._id !== id));
                } else {
                    toast.error('Error deleting task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task');
            }
        } else {
            // If user cancels the deletion
            toast.info('Task deletion was canceled');
        }
    };




    return (
        <div className="p-5 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleViewToggle} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
                    {viewMode === 'list' ? <FaList /> : <FaTh />}
                    {viewMode === 'list' ? 'list' : 'board'} View
                </button>

                <button onClick={handleModalOpen} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
                    <FaPlus />
                    Create Task
                </button>
            </div>

            {viewMode === 'list' ? (
        <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <ul>
            {tasks.map((task) => (
                <li key={task._id} className="border-b py-4 flex flex-col sm:flex-row justify-between items-start">
                    <div className="sm:w-3/4">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                            <div className="flex items-center">
                                <FaCheckCircle className={`mr-2 ${task.status === 'Completed' ? 'text-green-500' : task.status === 'In Progress' ? 'text-yellow-500' : 'text-gray-500'}`} />
                                <strong>Status:</strong> {task.status}
                            </div>
                            <div className="flex items-center">
                                <FaFlag className={`mr-2 ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`} />
                                <strong>Priority:</strong> {task.priority}
                            </div>
                            <div className="flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-500" />
                                <strong>Due Date:</strong> {task.dueDate}
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">{task.timestamp}</div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4">
                        <NavLink
                            to={`/dashboard/tasks/update/${task._id}`}
                            className="text-blue-600 hover:text-blue-400"
                        >
                            <FaEdit />
                        </NavLink>
    
                        <button
                            className="text-red-600 hover:text-red-400"
                            onClick={() => handleDeleteTask(task._id)}  // Pass the task ID to the delete handler
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
    ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shadow-md p-4 rounded-lg">
        {/* All Tasks in Cards (without dividing into categories) */}
        {tasks.map((task) => (
            <div key={task._id} className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="font-bold">{task.title}</span>
                    <div className="flex gap-2">
                        <NavLink
                            to={`/dashboard/tasks/update/${task._id}`}
                            className="text-blue-600 hover:text-blue-400"
                        >
                            <FaEdit />
                        </NavLink>
    
                        <button
                            className="text-red-600 hover:text-red-400"
                            onClick={() => handleDeleteTask(task._id)}  // Pass the task ID to the delete handler
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                            <FaCheckCircle className={`mr-2 ${task.status === 'Completed' ? 'text-green-500' : task.status === 'In Progress' ? 'text-yellow-500' : 'text-gray-500'}`} />
                            <strong>Status:</strong> {task.status}
                        </div>
                        <div className="flex items-center">
                            <FaFlag className={`mr-2 ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`} />
                            <strong>Priority:</strong> {task.priority}
                        </div>
                        <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" />
                            <strong>Due Date:</strong> {task.dueDate}
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{task.timestamp}</div>
                </div>
            </div>
        ))}
    </div>
    )}
    

            {/* Modal for creating new tasks */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                        <form onSubmit={handleCreateTask}>
    <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task Title"
            className="px-3 py-2 border rounded w-full"
            maxLength="50"  // Max 50 characters
            required
        />
    </div>
    <div className="flex gap-4">
        <div className="mb-4 w-1/2">
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task Description"
                className="px-3 py-2 border rounded w-full"
                maxLength="200"  // Max 200 characters
            />
        </div>
        <div className="mb-4 w-1/2">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                className="px-3 py-2 border rounded w-full"
            >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>  {/* Change to 'Done' if preferred */}
            </select>
        </div>
    </div>
    <div className="flex gap-4">
        <div className="mb-4 w-1/2">
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="px-3 py-2 border rounded w-full"
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
        <div className="mb-4 w-1/2">
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="px-3 py-2 border rounded w-full"
                required
            />
        </div>
    </div>
    <div className="flex justify-between">
        <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
            Create Task
        </button>
    </div>
</form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
