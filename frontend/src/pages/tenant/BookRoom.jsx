/* eslint-disable no-unused-vars */
// src/pages/tenant/BookRoom.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [duration, setDuration] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data.data);
      } catch (err) {
        toast.error("Failed to load room details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    console.log("we are here");
    if (!duration || duration < 1) {
      return toast.error("Please enter a valid duration.");
    }

    if (!checkInDate) {
      return toast.error("Please select a check-in date.");
    }

    try {
      setSubmitting(true);
      const bookingData = {
        room: roomId,
        duration: parseInt(duration),
        checkInDate,
      };

      await api.post("/bookings", bookingData);
      console.log("booked successfully");
      toast.success("Room booked successfully!");
      navigate("tenant/rooms");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to book room.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!room) {
    return <p className="text-center text-red-600">Room not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">
        Book Room {room.roomNumber}
      </h2>
      <p className="text-gray-600 mb-2">
        Price per month: <span className="font-medium">${room.price}</span>
      </p>
      <p className="text-gray-600 mb-4">Capacity: {room.capacity}</p>

      <form onSubmit={handleBooking}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (in months)
          </label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <p className="font-medium">
            Total: ${duration && room.price ? duration * room.price : 0}
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary-600 hover:bg-primary-700  font-medium px-6 py-2 rounded-md"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookRoom;
