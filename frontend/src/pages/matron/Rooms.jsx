// src/pages/matron/Rooms.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const MatronRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    floor: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let queryParams = "";

        if (filters.status) queryParams += `?status=${filters.status}`;
        if (filters.floor) {
          queryParams += queryParams
            ? `&floor=${filters.floor}`
            : `?floor=${filters.floor}`;
        }

        const response = await api.get(`/rooms${queryParams}`);
        setRooms(response.data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await api.delete(`/rooms/${roomId}`);
        setRooms(rooms.filter((room) => room._id !== roomId));
        toast.success("Room deleted successfully!");
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to delete room. Please try again."
        );
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Room Management</h1>
        <Link
          to="/matron/rooms/add"
          className="bg-primary-600 text-black px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Room
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Filter Rooms</h2>
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
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="floor"
              className="block text-sm font-medium text-gray-700"
            >
              Floor
            </label>
            <select
              id="floor"
              name="floor"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.floor}
              onChange={handleFilterChange}
            >
              <option value="">All Floors</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
              <option value="4">4th Floor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Floor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Capacity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price/Month
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {room.roomNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.floor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {room.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${room.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          room.status
                        )}`}
                      >
                        {room.status.charAt(0).toUpperCase() +
                          room.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/matron/rooms/${room._id}`}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/matron/rooms/edit/${room._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit className="inline" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No rooms found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatronRooms;
