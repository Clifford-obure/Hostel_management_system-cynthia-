import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="md:ml-64 flex-1 p-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
