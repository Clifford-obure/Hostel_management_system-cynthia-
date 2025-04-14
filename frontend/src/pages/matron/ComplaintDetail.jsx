// src/pages/matron/ComplaintDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglass,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const MatronComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        setComplaint(response.data.data);

        // Set initial form values
        formik.setValues({
          status: response.data.data.status,
          resolution: response.data.data.resolution || "",
        });
      } catch (error) {
        console.error("Error fetching complaint details:", error);
        toast.error("Failed to load complaint details. Please try again.");
        navigate("/matron/complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id, navigate]);

  const formik = useFormik({
    initialValues: {
      status: "",
      resolution: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      resolution: Yup.string().when("status", {
        is: "resolved",
        then: Yup.string().required(
          "Resolution is required when status is resolved"
        ),
      }),
    }),
    onSubmit: async (values) => {
      try {
        setUpdating(true);

        const response = await api.put(`/complaints/${id}`, values);

        if (response.data.success) {
          toast.success("Complaint updated successfully!");
          setComplaint(response.data.data);
        }
      } catch (error) {
        console.error("Error updating complaint:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to update complaint. Please try again."
        );
      } finally {
        setUpdating(false);
      }
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FaExclamationTriangle className="mr-2" /> Pending
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FaHourglass className="mr-2" /> In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-2" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
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

  if (!complaint) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Complaint not found.</p>
        <button
          onClick={() => navigate("/matron/complaints")}
          className="mt-4 inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/matron/complaints")}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Complaints
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Complaint Details</h1>
          <div>{getStatusBadge(complaint.status)}</div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {getCategoryLabel(complaint.category)}
              </h2>

              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Tenant:</span>{" "}
                  {complaint.tenant.name} ({complaint.tenant.email})
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Room:</span>{" "}
                  {complaint.room.roomNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Reported:</span>{" "}
                  {moment(complaint.createdAt).format(
                    "MMMM D, YYYY [at] h:mm A"
                  )}
                </p>
                {complaint.resolvedAt && (
                  <p className="text-sm text-green-600">
                    <span className="font-medium">Resolved:</span>{" "}
                    {moment(complaint.resolvedAt).format(
                      "MMMM D, YYYY [at] h:mm A"
                    )}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {complaint.resolution && (
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Resolution</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {complaint.resolution}
                  </p>
                </div>
              )}
            </div>

            <div>
              {complaint.images && complaint.images.length > 0 && (
                <div>
                  <h3 className="text-md font-medium mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {complaint.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <img
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Complaint ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Update Complaint Form */}
          {complaint.status !== "resolved" && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Update Complaint</h3>

              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        formik.touched.status && formik.errors.status
                          ? "border-red-500"
                          : ""
                      }`}
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.status}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="resolution"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Resolution Notes{" "}
                      {formik.values.status === "resolved" && "*"}
                    </label>
                    <textarea
                      id="resolution"
                      name="resolution"
                      rows="4"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        formik.touched.resolution && formik.errors.resolution
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Describe how the issue was resolved..."
                      value={formik.values.resolution}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.resolution && formik.errors.resolution && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.resolution}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {updating ? "Updating..." : "Update Complaint"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatronComplaintDetail;
