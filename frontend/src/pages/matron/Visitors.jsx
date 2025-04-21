// src/pages/matron/Visitors.jsx
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { FaUserFriends, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const MatronVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [tenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all visitors
        const visitorsResponse = await api.get("/visitors");
        setVisitors(visitorsResponse.data.data);

        // Fetch all tenants for the form
        // const tenantsResponse = await api.get("/auth/tenants");
        // setTenants(tenantsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const visitorFormik = useFormik({
    initialValues: {
      name: "",
      idNumber: "",
      phone: "",
      tenant: "",
      purpose: "",
      expectedCheckOutTime: moment().add(2, "hours").format("YYYY-MM-DDTHH:mm"),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Visitor name is required"),
      idNumber: Yup.string().required("ID number is required"),
      phone: Yup.string().required("Phone number is required"),
      tenant: Yup.string().required("Please select a tenant"),
      purpose: Yup.string().required("Purpose of visit is required"),
      expectedCheckOutTime: Yup.string().required(
        "Expected check-out time is required"
      ),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.post("/visitors", values);

        if (response.data.success) {
          toast.success("Visitor registered successfully!");
          setVisitors([response.data.data, ...visitors]);
          visitorFormik.resetForm();
          setShowVisitorForm(false);
        }
      } catch (error) {
        console.error("Error registering visitor:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to register visitor. Please try again."
        );
      }
    },
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (visitorId) => {
    try {
      const response = await api.put(`/visitors/${visitorId}/checkout`);

      if (response.data.success) {
        // Update the visitor status in the state
        setVisitors((prevVisitors) =>
          prevVisitors.map((visitor) =>
            visitor._id === visitorId
              ? {
                  ...visitor,
                  status: "checked-out",
                  actualCheckOutTime: new Date(),
                }
              : visitor
          )
        );

        toast.success("Visitor checked out successfully!");
      }
    } catch (error) {
      console.error("Error checking out visitor:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to check out visitor. Please try again."
      );
    }
  };

  const filteredVisitors = () => {
    return visitors.filter((visitor) => {
      // Filter by status
      if (filters.status && visitor.status !== filters.status) {
        return false;
      }

      // Filter by date
      if (filters.date) {
        const visitDate = moment(visitor.checkInTime).format("YYYY-MM-DD");
        return visitDate === filters.date;
      }

      return true;
    });
  };

  // Current visitors (checked-in)
  const currentVisitors = filteredVisitors().filter(
    (visitor) => visitor.status === "checked-in"
  );

  // Past visitors (checked-out)
  const pastVisitors = filteredVisitors().filter(
    (visitor) => visitor.status === "checked-out"
  );

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
        <h1 className="text-2xl font-semibold">Visitors Management</h1>
        <button
          onClick={() => setShowVisitorForm(!showVisitorForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Register New Visitor
        </button>
      </div>

      {/* New Visitor Form */}
      {showVisitorForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Register New Visitor</h2>

          <form onSubmit={visitorFormik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Visitor Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    visitorFormik.touched.name && visitorFormik.errors.name
                      ? "border-red-500"
                      : ""
                  }`}
                  value={visitorFormik.values.name}
                  onChange={visitorFormik.handleChange}
                  onBlur={visitorFormik.handleBlur}
                />
                {visitorFormik.touched.name && visitorFormik.errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {visitorFormik.errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  ID Number *
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    visitorFormik.touched.idNumber &&
                    visitorFormik.errors.idNumber
                      ? "border-red-500"
                      : ""
                  }`}
                  value={visitorFormik.values.idNumber}
                  onChange={visitorFormik.handleChange}
                  onBlur={visitorFormik.handleBlur}
                />
                {visitorFormik.touched.idNumber &&
                  visitorFormik.errors.idNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {visitorFormik.errors.idNumber}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number *
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    visitorFormik.touched.phone && visitorFormik.errors.phone
                      ? "border-red-500"
                      : ""
                  }`}
                  value={visitorFormik.values.phone}
                  onChange={visitorFormik.handleChange}
                  onBlur={visitorFormik.handleBlur}
                />
                {visitorFormik.touched.phone && visitorFormik.errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {visitorFormik.errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="tenant"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tenant to Visit *
                </label>
                <select
                  id="tenant"
                  name="tenant"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    visitorFormik.touched.tenant && visitorFormik.errors.tenant
                      ? "border-red-500"
                      : ""
                  }`}
                  value={visitorFormik.values.tenant}
                  onChange={visitorFormik.handleChange}
                  onBlur={visitorFormik.handleBlur}
                >
                  <option value="">Select a Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.name} - Room {tenant.room?.roomNumber || "N/A"}
                    </option>
                  ))}
                </select>
                {visitorFormik.touched.tenant &&
                  visitorFormik.errors.tenant && (
                    <p className="mt-1 text-sm text-red-500">
                      {visitorFormik.errors.tenant}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="purpose"
                  className="block text-sm font-medium text-gray-700"
                >
                  Purpose of Visit *
                </label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    visitorFormik.touched.purpose &&
                    visitorFormik.errors.purpose
                      ? "border-red-500"
                      : ""
                  }`}
                  value={visitorFormik.values.purpose}
                  onChange={visitorFormik.handleChange}
                  onBlur={visitorFormik.handleBlur}
                />
                {visitorFormik.touched.purpose &&
                  visitorFormik.errors.purpose && (
                    <p className="mt-1 text-sm text-red-500">
                      {visitorFormik.errors.purpose}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="expectedCheckOutTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expected Check-out Time *
                </label>
                <input
                  type="datetime-local"
                  id="expectedCheckOutTime"
                  name="expectedCheckOutTime"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    visitorFormik.touched.expectedCheckOutTime &&
                    visitorFormik.errors.expectedCheckOutTime
                      ? "border-red-500"
                      : ""
                  }`}
                  value={visitorFormik.values.expectedCheckOutTime}
                  onChange={visitorFormik.handleChange}
                  onBlur={visitorFormik.handleBlur}
                />
                {visitorFormik.touched.expectedCheckOutTime &&
                  visitorFormik.errors.expectedCheckOutTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {visitorFormik.errors.expectedCheckOutTime}
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowVisitorForm(false);
                  visitorFormik.resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Register Visitor
              </button>
            </div>
          </form>
        </div>
      )}

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
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Visit Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Current Visitors Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Currently Checked-In Visitors</h2>
        </div>

        {currentVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Visitor
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
                    Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-In Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expected Check-Out
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
                {currentVisitors.map((visitor) => (
                  <tr key={visitor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visitor.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {visitor.idNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        Phone: {visitor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {visitor.tenant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Room {visitor.tenant.room?.roomNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {visitor.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(visitor.checkInTime).format("MMM D, YYYY")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment(visitor.checkInTime).format("h:mm A")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(visitor.expectedCheckOutTime).format(
                          "MMM D, YYYY"
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment(visitor.expectedCheckOutTime).format("h:mm A")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCheckout(visitor._id)}
                        className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                      >
                        <FaSignOutAlt className="mr-1" /> Check Out
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No visitors currently checked in.</p>
          </div>
        )}
      </div>

      {/* Past Visitors Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Past Visitors</h2>
        </div>

        {pastVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Visitor
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
                    Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-In Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-Out Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastVisitors.map((visitor) => (
                  <tr key={visitor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visitor.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {visitor.idNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        Phone: {visitor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {visitor.tenant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Room {visitor.tenant.room?.roomNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {visitor.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(visitor.checkInTime).format("MMM D, YYYY")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment(visitor.checkInTime).format("h:mm A")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(visitor.actualCheckOutTime).format(
                          "MMM D, YYYY"
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment(visitor.actualCheckOutTime).format("h:mm A")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              No past visitors found matching your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatronVisitors;
