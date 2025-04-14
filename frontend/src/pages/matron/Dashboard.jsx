// src/pages/matron/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaHome,
  FaUserFriends,
  FaClipboardList,
  FaExclamationTriangle,
} from "react-icons/fa";

const MatronDashboard = () => {
  const [stats, setStats] = useState({
    rooms: { total: 0, occupied: 0, available: 0, maintenance: 0 },
    bookings: { total: 0, pending: 0, confirmed: 0 },
    visitors: { total: 0, currentCheckedIn: 0 },
    complaints: { total: 0, pending: 0, inProgress: 0, resolved: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch rooms stats
        const roomsResponse = await api.get("/rooms");
        const rooms = roomsResponse.data.data;

        const roomStats = {
          total: rooms.length,
          occupied: rooms.filter((room) => room.status === "occupied").length,
          available: rooms.filter((room) => room.status === "available").length,
          maintenance: rooms.filter((room) => room.status === "maintenance")
            .length,
        };

        // Fetch bookings stats
        const bookingsResponse = await api.get("/bookings");
        const bookings = bookingsResponse.data.data;

        const bookingStats = {
          total: bookings.length,
          pending: bookings.filter((booking) => booking.status === "pending")
            .length,
          confirmed: bookings.filter(
            (booking) => booking.status === "confirmed"
          ).length,
        };

        // Fetch visitors stats
        const visitorsResponse = await api.get("/visitors");
        const visitors = visitorsResponse.data.data;

        const visitorStats = {
          total: visitors.length,
          currentCheckedIn: visitors.filter(
            (visitor) => visitor.status === "checked-in"
          ).length,
        };

        // Fetch complaints stats
        const complaintsResponse = await api.get("/complaints");
        const complaints = complaintsResponse.data.data;

        const complaintStats = {
          total: complaints.length,
          pending: complaints.filter((c) => c.status === "pending").length,
          inProgress: complaints.filter((c) => c.status === "in-progress")
            .length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
        };

        setStats({
          rooms: roomStats,
          bookings: bookingStats,
          visitors: visitorStats,
          complaints: complaintStats,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Matron Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Rooms Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaHome className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Rooms</h3>
              <p className="text-gray-600">
                {stats.rooms.total} total ({stats.rooms.available} available)
              </p>
              <Link
                to="/matron/rooms"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                Manage Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaClipboardList className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Bookings</h3>
              <p className="text-gray-600">
                {stats.bookings.pending} pending approval
              </p>
              <Link
                to="/matron/bookings"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                Manage Bookings
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
                {stats.visitors.currentCheckedIn} currently checked in
              </p>
              <Link
                to="/matron/visitors"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                Manage Visitors
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
                {stats.complaints.pending} pending,{" "}
                {stats.complaints.inProgress} in progress
              </p>
              <Link
                to="/matron/complaints"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
              >
                Manage Complaints
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
          </div>
          <div className="p-6">
            {/* This would be populated with actual booking data */}
            <p className="text-gray-600">No recent bookings to show.</p>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Recent Complaints</h3>
          </div>
          <div className="p-6">
            {/* This would be populated with actual complaint data */}
            <p className="text-gray-600">No recent complaints to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatronDashboard;
