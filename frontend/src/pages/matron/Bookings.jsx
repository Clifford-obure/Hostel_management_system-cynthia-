// src/pages/matron/Bookings.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import { FaCheck, FaTimes, FaEye, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const MatronBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "all",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let queryParams = "";

        if (filters.status) queryParams += `?status=${filters.status}`;

        const response = await api.get(`/bookings${queryParams}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });

      // Update the booking status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      toast.success(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to update booking. Please try again."
      );
    }
  };

  const filteredBookings = () => {
    return bookings.filter((booking) => {
      // Filter by date range
      if (filters.dateRange !== "all") {
        const bookingDate = moment(booking.createdAt);
        const today = moment();

        switch (filters.dateRange) {
          case "today":
            return bookingDate.isSame(today, "day");
          case "week":
            return bookingDate.isAfter(moment().subtract(7, "days"));
          case "month":
            return bookingDate.isAfter(moment().subtract(30, "days"));
          default:
            return true;
        }
      }

      return true;
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Bookings Management</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900">Total</h2>
          <p className="text-3xl font-semibold">{bookings.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-yellow-600">Pending</h2>
          <p className="text-3xl font-semibold">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-green-600">Confirmed</h2>
          <p className="text-3xl font-semibold">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-red-600">Cancelled</h2>
          <p className="text-3xl font-semibold">
            {bookings.filter((b) => b.status === "cancelled").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Filter Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dateRange"
              className="block text-sm font-medium text-gray-700"
            >
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.dateRange}
              onChange={handleFilterChange}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings().length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tenant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-in Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings().map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Room {booking.room.roomNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        Floor {booking.room.floor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.tenant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.duration} month
                        {booking.duration > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${booking.totalAmount} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(booking.checkInDate).format("MMM D, YYYY")}
                      </div>
                      <div className="text-xs text-gray-500">
                        Until:{" "}
                        {moment(booking.checkInDate)
                          .add(booking.duration, "months")
                          .format("MMM D, YYYY")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() +
                          booking.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "confirmed")
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Approve Booking"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "cancelled")
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Reject Booking"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            (window.location.href = `/matron/bookings/${booking._id}`)
                          }
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
          <FaCalendarAlt className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Bookings Found
          </h3>
          <p className="text-gray-500">
            There are no bookings matching your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default MatronBookings;
