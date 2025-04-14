// src/pages/matron/Complaints.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglass,
  FaEye,
  FaFilter,
  FaWater,
  FaBolt,
  FaToilet,
  FaCouch,
  FaBroom,
  FaShieldAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const MatronComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    dateRange: "all",
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

        const response = await api.get(`/complaints${queryParams}`);
        let filteredComplaints = response.data.data;

        // Apply date range filter client-side
        if (filters.dateRange !== "all") {
          filteredComplaints = filteredComplaints.filter((complaint) => {
            const complaintDate = moment(complaint.createdAt);
            const today = moment();

            switch (filters.dateRange) {
              case "today":
                return complaintDate.isSame(today, "day");
              case "week":
                return complaintDate.isAfter(moment().subtract(7, "days"));
              case "month":
                return complaintDate.isAfter(moment().subtract(30, "days"));
              default:
                return true;
            }
          });
        }

        setComplaints(filteredComplaints);
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "water":
        return <FaWater className="text-blue-500" />;
      case "electricity":
        return <FaBolt className="text-yellow-500" />;
      case "plumbing":
        return <FaToilet className="text-indigo-500" />;
      case "furniture":
        return <FaCouch className="text-orange-500" />;
      case "cleanliness":
        return <FaBroom className="text-green-500" />;
      case "security":
        return <FaShieldAlt className="text-red-500" />;
      default:
        return <FaEllipsisH className="text-gray-500" />;
    }
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
      <h1 className="text-2xl font-semibold mb-6">Complaints Management</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900">Total</h2>
          <p className="text-3xl font-semibold">{complaints.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-yellow-600">Pending</h2>
          <p className="text-3xl font-semibold">
            {complaints.filter((c) => c.status === "pending").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-blue-600">In Progress</h2>
          <p className="text-3xl font-semibold">
            {complaints.filter((c) => c.status === "in-progress").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-green-600">Resolved</h2>
          <p className="text-3xl font-semibold">
            {complaints.filter((c) => c.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaFilter className="text-gray-500 mr-2" />
          <h2 className="text-lg font-medium">Filter Complaints</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Complaints Table */}
      {complaints.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
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
                    Reported Date
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
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          {getCategoryIcon(complaint.category)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getCategoryLabel(complaint.category)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Room {complaint.room.roomNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        Floor {complaint.room.floor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {complaint.tenant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {complaint.tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(complaint.createdAt).format("MMM D, YYYY")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment(complaint.createdAt).format("h:mm A")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment(complaint.createdAt).fromNow()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/matron/complaints/${complaint._id}`}
                        className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                      >
                        <FaEye className="mr-1" /> View & Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
          <FaExclamationTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Complaints Found
          </h3>
          <p className="text-gray-500">
            There are no complaints matching your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default MatronComplaints;
