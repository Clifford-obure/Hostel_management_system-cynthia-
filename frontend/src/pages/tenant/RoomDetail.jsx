// src/pages/tenant/RoomDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import {
  FaBed,
  FaWifi,
  FaShower,
  FaSnowflake,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data.data);
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error("Failed to load room details. Please try again.");
        navigate("/tenant/rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id, navigate]);

  const bookingFormik = useFormik({
    initialValues: {
      checkInDate: "",
      duration: 1,
    },
    validationSchema: Yup.object({
      checkInDate: Yup.date()
        .required("Check-in date is required")
        .min(new Date(), "Check-in date cannot be in the past"),
      duration: Yup.number()
        .required("Duration is required")
        .min(1, "Minimum duration is 1 month")
        .max(12, "Maximum duration is 12 months"),
    }),
    onSubmit: async (values) => {
      try {
        setIsBooking(true);

        const bookingData = {
          room: id,
          checkInDate: values.checkInDate,
          duration: values.duration,
        };

        const response = await api.post("/bookings", bookingData);

        if (response.data.success) {
          toast.success("Room booked successfully!");
          navigate("/tenant/my-booking");
        }
      } catch (error) {
        console.error("Error booking room:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to book room. Please try again."
        );
      } finally {
        setIsBooking(false);
      }
    },
  });

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
        <p className="text-gray-500">Room not found or has been booked.</p>
        <button
          onClick={() => navigate("/tenant/rooms")}
          className="mt-4 inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/tenant/rooms")}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Room Images */}
        <div className="h-64 bg-gray-200">
          {room.images && room.images.length > 0 ? (
            <img
              src={`http://localhost:5000/uploads/${room.images[0]}`}
              alt={`Room ${room.roomNumber}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">
              Room {room.roomNumber}
            </h1>
            <p className="text-gray-600">
              Floor {room.floor} • Capacity: {room.capacity} person
              {room.capacity > 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Room Details</h2>
              <p className="text-gray-700 mb-4">
                {room.description || "No description available."}
              </p>

              <h3 className="font-medium mb-2">Amenities:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, index) => {
                    let icon;

                    switch (amenity.toLowerCase()) {
                      case "wifi":
                        icon = <FaWifi />;
                        break;
                      case "air conditioning":
                        icon = <FaSnowflake />;
                        break;
                      case "private bathroom":
                        icon = <FaShower />;
                        break;
                      default:
                        icon = <FaBed />;
                    }

                    return (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center"
                      >
                        <span className="mr-2">{icon}</span>
                        {amenity}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-500">No specified amenities</span>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-medium">Price:</h3>
                <p className="text-2xl font-bold text-primary-600">
                  ${room.price}{" "}
                  <span className="text-sm font-normal text-gray-600">
                    per month
                  </span>
                </p>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Book This Room</h2>
                <form onSubmit={bookingFormik.handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="checkInDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      min={new Date().toISOString().split("T")[0]}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        bookingFormik.touched.checkInDate &&
                        bookingFormik.errors.checkInDate
                          ? "border-red-500"
                          : ""
                      }`}
                      value={bookingFormik.values.checkInDate}
                      onChange={bookingFormik.handleChange}
                      onBlur={bookingFormik.handleBlur}
                    />
                    {bookingFormik.touched.checkInDate &&
                      bookingFormik.errors.checkInDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {bookingFormik.errors.checkInDate}
                        </p>
                      )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration (months)
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        bookingFormik.touched.duration &&
                        bookingFormik.errors.duration
                          ? "border-red-500"
                          : ""
                      }`}
                      value={bookingFormik.values.duration}
                      onChange={bookingFormik.handleChange}
                      onBlur={bookingFormik.handleBlur}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                        <option key={month} value={month}>
                          {month} month{month > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    {bookingFormik.touched.duration &&
                      bookingFormik.errors.duration && (
                        <p className="mt-1 text-sm text-red-500">
                          {bookingFormik.errors.duration}
                        </p>
                      )}
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="text-xl font-semibold">
                        ${room.price * bookingFormik.values.duration}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isBooking}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {isBooking ? "Processing..." : "Book Now"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
