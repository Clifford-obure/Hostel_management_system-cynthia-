// src/pages/tenant/ComplaintForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Fetch tenant's room on component mount
  useState(() => {
    const fetchTenantRoom = async () => {
      try {
        const response = await api.get("/bookings/me");

        if (response.data.data.length > 0) {
          // Get the active booking
          const activeBooking = response.data.data.find(
            (booking) => booking.status === "confirmed"
          );

          if (activeBooking) {
            setRooms([activeBooking.room]);
            formik.setFieldValue("room", activeBooking.room._id);
          }
        }
      } catch (error) {
        console.error("Error fetching tenant room:", error);
      }
    };

    fetchTenantRoom();
  }, []);

  const formik = useFormik({
    initialValues: {
      room: "",
      category: "",
      description: "",
    },
    validationSchema: Yup.object({
      room: Yup.string().required("Room is required"),
      category: Yup.string().required("Category is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("room", values.room);
        formData.append("category", values.category);
        formData.append("description", values.description);

        // Append images
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append("images", imageFiles[i]);
        }

        const response = await api.post("/complaints", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success("Complaint submitted successfully!");
          navigate("/tenant/my-complaints");
        }
      } catch (error) {
        console.error("Error submitting complaint:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to submit complaint. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

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
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold">Submit New Complaint</h1>
        </div>

        <div className="p-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700"
              >
                Room *
              </label>
              <select
                id="room"
                name="room"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  formik.touched.room && formik.errors.room
                    ? "border-red-500"
                    : ""
                }`}
                value={formik.values.room}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={rooms.length === 1} // Disable if only one room
              >
                <option value="">Select a Room</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </select>
              {formik.touched.room && formik.errors.room && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.room}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  formik.touched.category && formik.errors.category
                    ? "border-red-500"
                    : ""
                }`}
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select a Category</option>
                <option value="water">Water Issues</option>
                <option value="electricity">Electricity Issues</option>
                <option value="plumbing">Plumbing Issues</option>
                <option value="furniture">Furniture Issues</option>
                <option value="cleanliness">Cleanliness Issues</option>
                <option value="security">Security Issues</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.category && formik.errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.category}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Please describe your issue in detail..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Supporting Images (Optional)
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm text-center text-gray-700 bg-white hover:bg-gray-50"
                >
                  Upload Images
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Image Previews:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
