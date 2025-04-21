// src/pages/tenant/Booking.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaBed,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaRegClock,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const TenantBooking = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get("/bookings/me");

        // Check if there's an active booking
        if (response.data.count > 0) {
          // Get the most recent booking
          const bookings = response.data.data;
          const activeBooking =
            bookings.find((b) => b.status === "confirmed") || bookings[0];
          setBooking(activeBooking);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);

  const handleCancelBooking = async () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      try {
        await api.put(`/bookings/${booking._id}`, { status: "cancelled" });
        toast.success("Booking successfully cancelled.");
        navigate("/tenant/rooms");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to cancel booking. Please try again."
        );
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaExclamationCircle className="mr-1" /> Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimes className="mr-1" /> Cancelled
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

  if (!booking) {
    return (
      <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
        <FaBed className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Active Booking
        </h3>
        <p className="text-gray-500 mb-6">
          You don't have any active room bookings at the moment.
        </p>
        <Link
          to="/tenant/rooms"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse Available Rooms
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Booking</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Booking Information</h2>
          <div>{getStatusBadge(booking.status)}</div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Room Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaBed className="text-primary-600 mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        Room {booking.room.roomNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Floor {booking.room.floor}
                      </p>
                      <p className="text-sm text-gray-600">
                        Capacity: {booking.room.capacity} person
                        {booking.room.capacity > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Booking Period</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-primary-600 mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        From:{" "}
                        {moment(booking.checkInDate).format("MMMM D, YYYY")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {booking.duration} month
                        {booking.duration > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-gray-600">
                        Until:{" "}
                        {moment(booking.checkInDate)
                          .add(booking.duration, "months")
                          .format("MMMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaMoneyBillWave className="text-primary-600 mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        ${booking.room.price} per month
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ${booking.totalAmount}
                      </p>
                      <p className="text-sm text-gray-600">
                        Payment Status:
                        <span
                          className={`ml-1 ${
                            booking.paymentStatus === "paid"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {booking.paymentStatus.charAt(0).toUpperCase() +
                            booking.paymentStatus.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Booking Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaRegClock className="text-primary-600 mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        Booking ID: {booking._id.substring(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created:{" "}
                        {moment(booking.createdAt).format("MMMM D, YYYY")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status:{" "}
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {booking.status === "pending" && (
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel Booking
              </button>
            )}

            {booking.status === "confirmed" && (
              <div className="flex space-x-4">
                <Link
                  to="/tenant/my-complaints/add"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Report an Issue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {booking.room.images && booking.room.images.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Room Images</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {booking.room.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg h-48">
                  <img
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`Room ${booking.room.roomNumber} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantBooking;
