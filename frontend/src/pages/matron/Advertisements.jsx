// src/pages/matron/Advertisements.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTags,
  FaUserAlt,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const MatronAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    userType: "",
  });

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        let queryParams = "";

        if (filters.category) queryParams += `?category=${filters.category}`;

        const response = await api.get(`/advertisements${queryParams}`);
        let ads = response.data.data;

        // Filter by user type if specified
        if (filters.userType === "matron") {
          ads = ads.filter((ad) => ad.user.role === "matron");
        } else if (filters.userType === "tenant") {
          ads = ads.filter((ad) => ad.user.role === "tenant");
        }

        setAdvertisements(ads);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Failed to load advertisements. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await api.delete(`/advertisements/${adId}`);
        setAdvertisements((prev) => prev.filter((ad) => ad._id !== adId));
        toast.success("Advertisement deleted successfully!");
      } catch (error) {
        console.error("Error deleting advertisement:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to delete advertisement. Please try again."
        );
      }
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
        <h1 className="text-2xl font-semibold">Advertisements Management</h1>
        <Link
          to="/matron/advertisements/add"
          className="bg-primary-600  px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Post Advertisement
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Filter Advertisements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="services">Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-gray-700"
            >
              Posted By
            </label>
            <select
              id="userType"
              name="userType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.userType}
              onChange={handleFilterChange}
            >
              <option value="">All Users</option>
              <option value="matron">Matron</option>
              <option value="tenant">Tenants</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advertisements Grid */}
      {advertisements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {ad.images && ad.images.length > 0 ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000/uploads/${ad.images[0]}`}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {ad.title}
                  </h3>
                  {ad.price > 0 && (
                    <span className="text-primary-600 font-semibold">
                      ${ad.price}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <FaTags className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500 capitalize">
                      {ad.category}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FaUserAlt className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      {ad.user.name}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {ad.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Posted {moment(ad.createdAt).fromNow()}
                  </span>

                  <div className="flex space-x-2">
                    <Link
                      to={`/matron/advertisements/${ad._id}`}
                      className="text-primary-600 hover:text-primary-700"
                      title="View Details"
                    >
                      <FaEye />
                    </Link>

                    {ad.user.role === "matron" && (
                      <>
                        <Link
                          to={`/matron/advertisements/edit/${ad._id}`}
                          className="text-indigo-600 hover:text-indigo-700"
                          title="Edit Advertisement"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Advertisement"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
          <FaTags className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Advertisements Found
          </h3>
          <p className="text-gray-500 mb-6">
            There are no advertisements matching your current filters.
          </p>
          <Link
            to="/matron/advertisements/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-primary-600 hover:bg-primary-700"
          >
            <FaPlus className="mr-2" /> Post an Advertisement
          </Link>
        </div>
      )}
    </div>
  );
};

export default MatronAdvertisements;
