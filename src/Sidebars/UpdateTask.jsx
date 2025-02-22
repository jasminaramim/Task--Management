import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'To-Do',
    priority: 'Medium',
    dueDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the task by ID
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/tasks/${id}`);
        console.log('Fetched Task:', response.data); // Debugging the fetched task
        if (response.status === 200) {
          setTask(response.data); // Pre-populate form with the current task data
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to fetch task for update');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    // Log the current task data before submitting
    console.log('Updated Task Data before sending to API:', task);

    try {
      const response = await axios.put(`http://localhost:9000/tasks/${id}`, task);
      if (response.status === 200) {
        toast.success('Task updated successfully!');

        // Fetch updated data after update and log it
        const updatedResponse = await axios.get(`http://localhost:9000/tasks/${id}`);
        console.log('Updated Task Data:', updatedResponse.data);
        setTask(updatedResponse.data);

        navigate('/dashboard/tasks'); // Navigate back to the task list
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Update Task</h2>
      <form onSubmit={handleUpdateTask} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={task.task.title} // Directly use the task data
            onChange={(e) => setTask((prevTask) => ({ ...prevTask, title: e.target.value }))}
            placeholder="Enter task title"
            className="px-3 py-2 border rounded w-full"
            maxLength="50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={task.task.description} // Directly use the task data
            onChange={(e) => setTask((prevTask) => ({ ...prevTask, description: e.target.value }))}
            placeholder="Enter task description"
            className="px-3 py-2 border rounded w-full"
            maxLength="200"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={task.task.status} // Directly use the task data
              onChange={(e) => setTask((prevTask) => ({ ...prevTask, status: e.target.value }))}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={task.task.priority} // Directly use the task data
              onChange={(e) => setTask((prevTask) => ({ ...prevTask, priority: e.target.value }))}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={task.task.dueDate} // Directly use the task data
            onChange={(e) => setTask((prevTask) => ({ ...prevTask, dueDate: e.target.value }))}
            className="px-3 py-2 border rounded w-full"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard/tasks')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTask;
