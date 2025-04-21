/* eslint-disable no-unused-vars */
// src/pages/tenant/Rooms.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FaBed, FaWifi, FaShower, FaSnowflake } from "react-icons/fa";
import { toast } from "react-toastify";

const TenantRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    floor: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
  });
  console.log(rooms);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let queryParams = "?status=available";

        if (filters.floor) queryParams += `&floor=${filters.floor}`;
        if (filters.minPrice) queryParams += `&price[gte]=${filters.minPrice}`;
        if (filters.maxPrice) queryParams += `&price[lte]=${filters.maxPrice}`;
        if (filters.capacity) queryParams += `&capacity=${filters.capacity}`;

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

  const handleBookRoom = async (roomId) => {
    try {
      // Navigate to booking page with room ID
      window.location.href = `/tenant/book-room/${roomId}`;
    } catch (error) {
      toast.error("Failed to book room. Please try again.");
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
      <h1 className="text-2xl font-semibold mb-6">Available Rooms</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Filter Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700"
            >
              Capacity
            </label>
            <select
              id="capacity"
              name="capacity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.capacity}
              onChange={handleFilterChange}
            >
              <option value="">Any Capacity</option>
              <option value="1">Single</option>
              <option value="2">Double</option>
              <option value="3">Triple</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${room.images[0]}`}
                    alt={`Room ${room.roomNumber}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image Available</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold">
                    Room {room.roomNumber}
                  </h3>
                  <span className="text-primary-600 font-semibold">
                    ${room.price}/month
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Floor {room.floor} • Capacity: {room.capacity} person
                  {room.capacity > 1 ? "s" : ""}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities &&
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
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm flex items-center"
                        >
                          <span className="mr-1">{icon}</span>
                          {amenity}
                        </span>
                      );
                    })}
                </div>

                <div className="flex justify-between">
                  <Link
                    to={`/tenant/rooms/${room._id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleBookRoom(room._id)}
                    className="bg-primary-600 text-black px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              No rooms available matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantRooms;
