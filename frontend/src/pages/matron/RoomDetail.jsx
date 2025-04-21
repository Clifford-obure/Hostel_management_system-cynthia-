// src/pages/matron/RoomDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaArrowLeft,
  FaBed,
  FaEdit,
  FaTrash,
  FaKey,
  FaUserAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const MatronRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // Fetch room details
        const roomResponse = await api.get(`/rooms/${id}`);
        setRoom(roomResponse.data.data);

        // Fetch bookings for this room
        const bookingsResponse = await api.get(`/bookings?room=${id}`);
        const bookings = bookingsResponse.data.data;

        // Check if there's a current active booking
        const active = bookings.find(
          (booking) => booking.status === "confirmed"
        );
        if (active) {
          setCurrentBooking(active);
        }

        // Set booking history (exclude active booking)
        setBookingHistory(bookings.filter((booking) => booking !== active));
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error("Failed to load room details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleDeleteRoom = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this room? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/rooms/${id}`);
        toast.success("Room deleted successfully!");
        navigate("/matron/rooms");
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to delete room. Please try again."
        );
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      available: "bg-green-100 text-green-800",
      occupied: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Room not found.</p>
        <button
          onClick={() => navigate("/matron/rooms")}
          className="mt-4 inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/matron/rooms")}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/matron/rooms/edit/${id}`)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaEdit className="mr-2" /> Edit Room
          </button>

          <button
            onClick={handleDeleteRoom}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaTrash className="mr-2" /> Delete Room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Room {room.roomNumber} Details
          </h1>
          <div>{getStatusBadge(room.status)}</div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Room Details */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Room Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium">{room.roomNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Floor</p>
                    <p className="font-medium">{room.floor}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium">
                      {room.capacity} person{room.capacity > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${room.price} / month</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{room.status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {moment(room.createdAt).format("MMM D, YYYY")}
                    </p>
                  </div>
                </div>
              </div>

              {room.description && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{room.description}</p>
                </div>
              )}

              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Images */}
            <div>
              {room.images && room.images.length > 0 ? (
                <div>
                  <h2 className="text-lg font-medium mb-4">Room Images</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {room.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <img
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Room ${room.roomNumber} - ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-64">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Tenant Information (if room is occupied) */}
      {currentBooking && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Current Tenant</h2>
          </div>

          <div className="p-6">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUserAlt className="h-6 w-6" />
              </div>

              <div className="ml-4">
                <h3 className="font-medium text-lg">
                  {currentBooking.tenant.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Email: {currentBooking.tenant.email} | Phone:{" "}
                  {currentBooking.tenant.phone}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" /> Check-in
                      Date
                    </p>
                    <p className="font-medium">
                      {moment(currentBooking.checkInDate).format("MMM D, YYYY")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaKey className="mr-2 text-gray-400" /> Duration
                    </p>
                    <p className="font-medium">
                      {currentBooking.duration} month
                      {currentBooking.duration > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaMoneyBillWave className="mr-2 text-gray-400" /> Payment
                      Status
                    </p>
                    <p
                      className={`font-medium ${
                        currentBooking.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {currentBooking.paymentStatus.charAt(0).toUpperCase() +
                        currentBooking.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking History */}
      {bookingHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Booking History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Check-in Date
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
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookingHistory.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.tenant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(booking.checkInDate).format("MMM D, YYYY")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.duration} month
                        {booking.duration > 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          booking.paymentStatus === "paid"
                            ? "text-green-600"
                            : booking.paymentStatus === "refunded"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() +
                          booking.paymentStatus.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${booking.totalAmount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatronRoomDetail;
