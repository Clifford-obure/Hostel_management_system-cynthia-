// src/pages/tenant/Complaints.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaPlus,
  FaEye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglass,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const TenantComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        let queryParams = "";

        if (filters.status) queryParams += `?status=${filters.status}`;
        if (filters.category) {
          queryParams += queryParams
            ? `&category=${filters.category}`
            : `?category=${filters.category}`;
        }

        const response = await api.get(`/complaints/me${queryParams}`);
        setComplaints(response.data.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error("Failed to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaExclamationTriangle className="mr-1" /> Pending
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaHourglass className="mr-1" /> In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" /> Resolved
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

  const getCategoryLabel = (category) => {
    const categories = {
      water: "Water Issues",
      electricity: "Electricity Issues",
      plumbing: "Plumbing Issues",
      furniture: "Furniture Issues",
      cleanliness: "Cleanliness Issues",
      security: "Security Issues",
      other: "Other",
    };

    return categories[category] || category;
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
        <h1 className="text-2xl font-semibold">My Complaints</h1>
        <Link
          to="/tenant/my-complaints/add"
          className="bg-primary-600 text-black px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Filter Complaints</h2>
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
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

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
              <option value="water">Water Issues</option>
              <option value="electricity">Electricity Issues</option>
              <option value="plumbing">Plumbing Issues</option>
              <option value="furniture">Furniture Issues</option>
              <option value="cleanliness">Cleanliness Issues</option>
              <option value="security">Security Issues</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {complaints.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="p-4 hover:bg-gray-50">
                <Link
                  to={`/tenant/my-complaints/${complaint._id}`}
                  className="block"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-start">
                        <div className="mr-3 pt-1">
                          <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {getCategoryLabel(complaint.category)}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {complaint.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <div className="mb-2">
                        {getStatusBadge(complaint.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Room: {complaint.room.roomNumber} • Reported:{" "}
                        {moment(complaint.createdAt).format("MMM D, YYYY")}
                      </div>
                      {complaint.resolvedAt && (
                        <div className="text-sm text-green-600">
                          Resolved:{" "}
                          {moment(complaint.resolvedAt).format("MMM D, YYYY")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
          <FaExclamationTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Complaints Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't filed any complaints yet or none match your current
            filters.
          </p>
          <Link
            to="/tenant/my-complaints/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary-600 hover:bg-primary-700"
          >
            <FaPlus className="mr-2" /> Submit New Complaint
          </Link>
        </div>
      )}
    </div>
  );
};

export default TenantComplaints;
