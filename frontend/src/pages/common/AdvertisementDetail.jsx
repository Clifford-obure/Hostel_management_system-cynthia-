// src/pages/common/AdvertisementDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../contexts/authContext";
import moment from "moment";

const AdvertisementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [advertisement, setAdvertisement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await api.get(`/advertisements/${id}`);
        setAdvertisement(response.data.data);
      } catch (error) {
        console.error("Error fetching advertisement:", error);
        toast.error("Failed to load advertisement details. Please try again.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await api.delete(`/advertisements/${id}`);
        toast.success("Advertisement deleted successfully!");

        // Navigate back based on user role
        if (user.role === "matron") {
          navigate("/matron/advertisements");
        } else {
          navigate("/tenant/marketplace");
        }
      } catch (error) {
        console.error("Error deleting advertisement:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to delete advertisement. Please try again."
        );
      }
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? advertisement.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === advertisement.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Advertisement not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  const isOwner = user.id === advertisement.user._id;
  const isAnnouncement =
    advertisement.category === "announcement" ||
    advertisement.category === "event" ||
    advertisement.category === "maintenance" ||
    advertisement.category === "rules";
  const backPath =
    user.role === "matron" ? "/matron/advertisements" : "/tenant/marketplace";
  const editPath =
    user.role === "matron"
      ? `/matron/advertisements/edit/${id}`
      : `/tenant/marketplace/edit/${id}`;

  const formatCategory = (category) => {
    return (
      category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
    );
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" />
          {user.role === "matron"
            ? "Back to Advertisements"
            : "Back to Marketplace"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">{advertisement.title}</h1>
            {isAnnouncement && advertisement.isImportant && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                Important
              </span>
            )}
          </div>

          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={editPath}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FaEdit className="mr-1" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              {advertisement.images && advertisement.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000/uploads/${advertisement.images[currentImageIndex]}`}
                      alt={advertisement.title}
                      className="w-full h-full object-contain"
                    />

                    {advertisement.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                          &lt;
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                          &gt;
                        </button>
                      </>
                    )}
                  </div>

                  {advertisement.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {advertisement.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden ${
                            index === currentImageIndex
                              ? "ring-2 ring-primary-500"
                              : ""
                          }`}
                        >
                          <img
                            src={`http://localhost:5000/uploads/${image}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {advertisement.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-gray-700">
                      <FaTag className="mr-2 text-primary-600" />
                      <span className="font-medium">Category:</span>
                    </div>
                    <p className="ml-7 capitalize">
                      {formatCategory(advertisement.category)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-700">
                      <FaCalendarAlt className="mr-2 text-primary-600" />
                      <span className="font-medium">Posted:</span>
                    </div>
                    <p className="ml-7">
                      {moment(advertisement.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>

                  {!isAnnouncement && advertisement.price !== undefined && (
                    <div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium">Price:</span>
                      </div>
                      <p className="ml-7 text-lg font-semibold text-primary-600">
                        {advertisement.price > 0
                          ? `$${advertisement.price}`
                          : "Free"}
                      </p>
                    </div>
                  )}

                  {isAnnouncement && advertisement.expiryDate && (
                    <div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium">Expires:</span>
                      </div>
                      <p className="ml-7">
                        {moment(advertisement.expiryDate).format(
                          "MMMM D, YYYY"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <FaUser className="mt-1 mr-3 text-gray-400" />
                      <div>
                        <p className="font-medium">{advertisement.user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {advertisement.user.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 ml-7">
                      <p className="text-gray-700">
                        {advertisement.contactInfo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user.role === "matron" && !isOwner && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Moderation Actions</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <FaTrash className="inline mr-1" /> Remove Advertisement
            </button>

            <button
              onClick={() => {
                /* Send notification to user */
                toast.success("Notification sent to the user");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaEnvelope className="inline mr-1" /> Contact Poster
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementDetail;
