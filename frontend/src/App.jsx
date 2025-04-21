// src/App.jsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Context
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Tenant Pages
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantRooms from "./pages/tenant/Rooms";
import TenantRoomDetails from "./pages/tenant/RoomDetail";
import TenantBooking from "./pages/tenant/Booking";
import TenantVisitors from "./pages/tenant/Visitors";
import TenantComplaints from "./pages/tenant/Complaints";
import TenantMarketplace from "./pages/tenant/Marketplace";
import TenantSettings from "./pages/tenant/Settings";

// Matron Pages
import MatronDashboard from "./pages/matron/Dashboard";
import MatronRooms from "./pages/matron/Rooms";
import MatronBookings from "./pages/matron/Bookings";
import MatronVisitors from "./pages/matron/Visitors";
import MatronComplaints from "./pages/matron/Complaints";
import MatronAdvertisements from "./pages/matron/Advertisements";
import MatronSettings from "./pages/matron/Settings";
import MatronRoomsForm from "./pages/matron/RoomForm";
// import ODD from "./pages/tenant/DDD";

// Home Page
import Home from "./pages/common/Home";
import MatronRoomDetail from "./pages/matron/RoomDetail";
import BookRoom from "./pages/tenant/BookRoom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Tenant routes */}
          <Route element={<ProtectedRoute roles={["tenant"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/tenant/dashboard" element={<TenantDashboard />} />
              <Route path="/tenant/rooms" element={<TenantRooms />} />
              <Route
                path="/tenant/rooms/:roomId"
                element={<TenantRoomDetails />}
              />

              <Route path="/tenant/my-booking" element={<TenantBooking />} />
              <Route path="/tenant/book-room/:roomId" element={<BookRoom />} />
              <Route path="/tenant/my-visitors" element={<TenantVisitors />} />
              <Route
                path="/tenant/my-complaints"
                element={<TenantComplaints />}
              />
              <Route
                path="/tenant/marketplace"
                element={<TenantMarketplace />}
              />
              <Route path="/tenant/settings" element={<TenantSettings />} />
            </Route>
          </Route>

          {/* Matron routes */}
          <Route element={<ProtectedRoute roles={["matron"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/matron/dashboard" element={<MatronDashboard />} />
              <Route path="/matron/rooms" element={<MatronRooms />} />
              <Route path="/matron/rooms/:id" element={<MatronRoomDetail />} />
              <Route path="/matron/rooms/add" element={<MatronRoomsForm />} />
              <Route path="/matron/bookings" element={<MatronBookings />} />
              <Route path="/matron/visitors" element={<MatronVisitors />} />
              <Route path="/matron/complaints" element={<MatronComplaints />} />
              <Route
                path="/matron/advertisements"
                element={<MatronAdvertisements />}
              />
              <Route path="/matron/settings" element={<MatronSettings />} />
            </Route>
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
