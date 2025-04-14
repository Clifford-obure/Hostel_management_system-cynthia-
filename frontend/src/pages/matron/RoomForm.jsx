// src/pages/matron/RoomForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const isEditMode = !!id;

  useEffect(() => {
    const fetchRoomDetail = async () => {
      if (isEditMode) {
        try {
          const response = await api.get(`/rooms/${id}`);
          const roomData = response.data.data;

          formik.setValues({
            roomNumber: roomData.roomNumber,
            floor: roomData.floor,
            capacity: roomData.capacity,
            price: roomData.price,
            status: roomData.status,
            amenities: roomData.amenities.join(", "),
            description: roomData.description || "",
            keepExistingImages: true,
          });

          // Set preview images if there are existing images
          if (roomData.images && roomData.images.length > 0) {
            const previews = roomData.images.map(
              (img) => `http://localhost:5000/uploads/${img}`
            );
            setPreviewUrls(previews);
          }
        } catch (error) {
          console.error("Error fetching room details:", error);
          toast.error("Failed to load room details. Please try again.");
          navigate("/matron/rooms");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoomDetail();
  }, [id, isEditMode, navigate]);

  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      floor: "",
      capacity: 1,
      price: "",
      status: "available",
      amenities: "",
      description: "",
      keepExistingImages: true,
    },
    validationSchema: Yup.object({
      roomNumber: Yup.string().required("Room number is required"),
      floor: Yup.number()
        .required("Floor is required")
        .min(1, "Minimum floor is 1"),
      capacity: Yup.number()
        .required("Capacity is required")
        .min(1, "Minimum capacity is 1"),
      price: Yup.number()
        .required("Price is required")
        .min(1, "Price must be greater than 0"),
      status: Yup.string().required("Status is required"),
      amenities: Yup.string(),
      description: Yup.string(),
      keepExistingImages: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Convert amenities from comma-separated string to array
        const amenitiesArray = values.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);

        // Create form data for file upload
        const formData = new FormData();
        formData.append("roomNumber", values.roomNumber);
        formData.append("floor", values.floor);
        formData.append("capacity", values.capacity);
        formData.append("price", values.price);
        formData.append("status", values.status);
        formData.append("amenities", JSON.stringify(amenitiesArray));
        formData.append("description", values.description);

        if (isEditMode) {
          formData.append("keepExistingImages", values.keepExistingImages);
        }

        // Append images
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i]);
        }

        let response;

        if (isEditMode) {
          response = await api.put(`/rooms/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          response = await api.post("/rooms", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (response.data.success) {
          toast.success(
            `Room ${isEditMode ? "updated" : "created"} successfully!`
          );
          navigate("/matron/rooms");
        }
      } catch (error) {
        console.error("Error saving room:", error);
        toast.error(
          error.response?.data?.error ||
            `Failed to ${
              isEditMode ? "update" : "create"
            } room. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 0, 1);
    setSelectedFiles(newFiles);

    const newUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newUrls[index]);

    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
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
      <div className="mb-6">
        <button
          onClick={() => navigate("/matron/rooms")}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "Edit Room" : "Add New Room"}
          </h1>
        </div>

        <div className="p-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="roomNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Room Number *
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      formik.touched.roomNumber && formik.errors.roomNumber
                        ? "border-red-500"
                        : ""
                    }`}
                    value={formik.values.roomNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.roomNumber && formik.errors.roomNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.roomNumber}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="floor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Floor *
                  </label>
                  <input
                    type="number"
                    id="floor"
                    name="floor"
                    min="1"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      formik.touched.floor && formik.errors.floor
                        ? "border-red-500"
                        : ""
                    }`}
                    value={formik.values.floor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.floor && formik.errors.floor && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.floor}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      formik.touched.capacity && formik.errors.capacity
                        ? "border-red-500"
                        : ""
                    }`}
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.capacity && formik.errors.capacity && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.capacity}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price per Month ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="1"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      formik.touched.price && formik.errors.price
                        ? "border-red-500"
                        : ""
                    }`}
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status *
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
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.status}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="amenities"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amenities (comma separated)
                  </label>
                  <input
                    type="text"
                    id="amenities"
                    name="amenities"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Wifi, Air Conditioning, Private Bathroom, etc."
                    value={formik.values.amenities}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Room Images
              </label>

              {isEditMode && previewUrls.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="keepExistingImages"
                      name="keepExistingImages"
                      checked={formik.values.keepExistingImages}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="keepExistingImages"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Keep existing images
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-2">
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                      >
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Image Previews:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        {index >= previewUrls.length - selectedFiles.length && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/matron/rooms")}
                className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Room"
                  : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;
