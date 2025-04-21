// src/pages/tenant/Visitors.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaUserFriends,
  FaCalendarAlt,
  FaRegClock,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const TenantVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "all",
  });

  useEffect(() => {
    // const fetchVisitors = async () => {
    //   try {
    //     const response = await api.get(
    //       `/visitors/tenant/${
    //         api.defaults.headers.common["Authorization"].split(" ")[1]
    //       }`
    //     );
    //     setVisitors(response.data.data);
    //   } catch (error) {
    //     console.error("Error fetching visitors:", error);
    //     toast.error("Failed to load visitor information. Please try again.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchVisitors();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredVisitors = () => {
    return visitors.filter((visitor) => {
      // Filter by status
      if (filters.status && visitor.status !== filters.status) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange !== "all") {
        const visitDate = moment(visitor.checkInTime);
        const today = moment();

        switch (filters.dateRange) {
          case "today":
            return visitDate.isSame(today, "day");
          case "week":
            return visitDate.isAfter(moment().subtract(7, "days"));
          case "month":
            return visitDate.isAfter(moment().subtract(30, "days"));
          default:
            return true;
        }
      }

      return true;
    });
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
      <h1 className="text-2xl font-semibold mb-6">My Visitors</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Filter Visitors</h2>
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
              <option value="checked-in">Currently Checked In</option>
              <option value="checked-out">Checked Out</option>
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

      {/* Visitors List */}
      {filteredVisitors().length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {filteredVisitors().map((visitor) => (
              <li key={visitor._id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-start">
                      <FaUserFriends className="h-6 w-6 text-primary-600 mt-1 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {visitor.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {visitor.idNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Phone: {visitor.phone}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Purpose: {visitor.purpose}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          visitor.status === "checked-in"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {visitor.status === "checked-in"
                          ? "Currently Visiting"
                          : "Checked Out"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <FaSignInAlt className="mr-1" />
                      Check-in:{" "}
                      {moment(visitor.checkInTime).format("MMM D, YYYY h:mm A")}
                    </div>

                    {visitor.actualCheckOutTime ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaSignOutAlt className="mr-1" />
                        Check-out:{" "}
                        {moment(visitor.actualCheckOutTime).format(
                          "MMM D, YYYY h:mm A"
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-yellow-600">
                        <FaRegClock className="mr-1" />
                        Expected check-out:{" "}
                        {moment(visitor.expectedCheckOutTime).format("h:mm A")}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
          <FaUserFriends className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Visitors Found
          </h3>
          <p className="text-gray-500">
            You don't have any visitors matching your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default TenantVisitors;
