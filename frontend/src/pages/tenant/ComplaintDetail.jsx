// src/pages/tenant/ComplaintDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglass,
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        setComplaint(response.data.data);
      } catch (error) {
        console.error("Error fetching complaint details:", error);
        toast.error("Failed to load complaint details. Please try again.");
        navigate("/tenant/my-complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id, navigate]);

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
          onClick={() => navigate("/tenant/my-complaints")}
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
          onClick={() => navigate("/tenant/my-complaints")}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Complaints
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Room: {complaint.room.roomNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Reported:{" "}
                  {moment(complaint.createdAt).format(
                    "MMMM D, YYYY [at] h:mm A"
                  )}
                </p>
                {complaint.resolvedAt && (
                  <p className="text-sm text-green-600">
                    Resolved:{" "}
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

          <div className="mt-6 border-t pt-6">
            <h3 className="text-md font-medium mb-2">Complaint Timeline</h3>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 ml-0.5 w-0.5 bg-gray-200"></div>
              <ul className="space-y-6">
                <li className="relative flex items-start">
                  <div className="absolute -left-3 flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white">
                    <FaCheckCircle />
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-medium">Complaint Submitted</h4>
                    <p className="text-xs text-gray-500">
                      {moment(complaint.createdAt).format(
                        "MMMM D, YYYY [at] h:mm A"
                      )}
                    </p>
                  </div>
                </li>

                {complaint.status === "in-progress" && (
                  <li className="relative flex items-start">
                    <div className="absolute -left-3 flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white">
                      <FaHourglass />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-sm font-medium">
                        Complaint Being Processed
                      </h4>
                      <p className="text-xs text-gray-500">
                        Matron is looking into your complaint
                      </p>
                    </div>
                  </li>
                )}

                {complaint.status === "resolved" && complaint.resolvedAt && (
                  <li className="relative flex items-start">
                    <div className="absolute -left-3 flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white">
                      <FaCheckCircle />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-sm font-medium">
                        Complaint Resolved
                      </h4>
                      <p className="text-xs text-gray-500">
                        {moment(complaint.resolvedAt).format(
                          "MMMM D, YYYY [at] h:mm A"
                        )}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
