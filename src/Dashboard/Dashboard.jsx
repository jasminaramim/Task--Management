import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebars/Sidebar';

const Dashboard = () => {
  return (
    <div className="relative flex min-h-screen">
      {/* Left Side: Sidebar Component */}
      <Sidebar />

      {/* Right Side: Dashboard Dynamic Content */}
      <div className="flex-1  ">
        <div className="max-w-screen-xl mx-auto">
          {/* Outlet for dynamic contents */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
