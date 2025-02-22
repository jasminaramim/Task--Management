import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> {/* ✅ Required for rendering child routes */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
