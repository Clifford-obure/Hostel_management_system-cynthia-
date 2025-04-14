// src/pages/tenant/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import api from "../../services/api";
import {
  FaBed,
  FaCalendarAlt,
  FaUserFriends,
  FaExclamationTriangle,
} from "react-icons/fa";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    hasRoom: false,
    roomDetails: null,
    visitorCount: 0,
    complaintsCount: { total: 0, pending: 0, resolved: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch booking data to check if tenant has a room
        const bookingResponse = await api.get("/bookings/me");

        let roomDetails = null;
        let hasRoom = false;

        if (bookingResponse.data.data.length > 0) {
          // Get the active booking
          const activeBooking = bookingResponse.data.data.find(
            (booking) => booking.status === "confirmed"
          );

          if (activeBooking) {
            hasRoom = true;
            roomDetails = activeBooking.room;
          }
        }
        console.log("Booking Response:", bookingResponse.data.data);
        // Fetch visitor count
        const visitorResponse = await api.get(`/visitors/tenant/${user.id}`);
        const visitorCount = visitorResponse.data.count;

        // Fetch complaints count
        const complaintsResponse = await api.get("/complaints/me");
        const complaints = complaintsResponse.data.data;

        const complaintsCount = {
          total: complaints.length,
          pending: complaints.filter((c) => c.status === "pending").length,
          inProgress: complaints.filter((c) => c.status === "in-progress")
            .length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
        };

        setStats({
          hasRoom,
          roomDetails,
          visitorCount,
          complaintsCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            {stats.hasRoom
              ? "You currently have an active room booking. Manage your stay using the dashboard options below."
              : "You don't have an active room booking. Browse available rooms to book one."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Room Status Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBed className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Room Status</h3>
              <p className="text-gray-600">
                {stats.hasRoom
                  ? `Room ${stats.roomDetails.roomNumber}`
                  : "No active booking"}
              </p>
              <Link
                to={stats.hasRoom ? "/tenant/my-booking" : "/tenant/rooms"}
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                {stats.hasRoom ? "View Details" : "Book a Room"}
              </Link>
            </div>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Booking</h3>
              <p className="text-gray-600">
                {stats.hasRoom ? "Active booking" : "No current booking"}
              </p>
              <Link
                to="/tenant/my-booking"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Visitors Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaUserFriends className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Visitors</h3>
              <p className="text-gray-600">
                {stats.visitorCount} total visitors
              </p>
              <Link
                to="/tenant/my-visitors"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                View History
              </Link>
            </div>
          </div>
        </div>

        {/* Complaints Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Complaints</h3>
              <p className="text-gray-600">
                {stats.complaintsCount.pending} pending,{" "}
                {stats.complaintsCount.resolved} resolved
              </p>
              <Link
                to="/tenant/my-complaints"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                Manage Complaints
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="p-6">
          {/* This would be populated with actual activity data */}
          <p className="text-gray-600">No recent activities to show.</p>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
