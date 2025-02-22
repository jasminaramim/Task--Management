import { createHashRouter } from "react-router-dom";
import Home from "../HomePage/Home";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import Dashboard from "../Dashboard/Dashboard";
import Profile from "../Sidebars/Profile";
import Tasks from "../Sidebars/Tasks";
import Settings from "../Sidebars/Settings";
import UserDashboard from "../Dashboard/UserDashboard";
import Todo from "../Sidebars/Todo";
import InProgress from "../Sidebars/InProgress";
import Done from "../Sidebars/Done";
import UpdateTask from "../Sidebars/UpdateTask";

export const router = createHashRouter([
  {
    path: '/dashboard',
    element: <Dashboard />, // Dashboard layout as the parent
    children: [
      {
        path: '', // Default path, renders when /dashboard is visited
        element: < UserDashboard />,
      },
      {
        path: 'profile', // Path is relative, no leading '/'
        element: <Profile />,
      },
      {
        path: 'tasks',
        element: <Tasks />,
      },
      {
        path: 'tasks/update/:id',  // Correct path with dynamic `id`
        element: <UpdateTask />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'todo',
        element: <Todo />,
      },
      {
        path: 'in-progress',
        element: <InProgress />,
      },
      {
        path: 'done',
        element: <Done />,
      },
    ]
  },
  {
    path: '/',
    children: [
      {
        path: '',
        element: <Home />,
      },
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/registration',
    element: <Registration />,
  },
]);

