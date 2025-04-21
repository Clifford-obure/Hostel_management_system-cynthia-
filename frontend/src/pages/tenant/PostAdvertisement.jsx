// src/pages/tenant/PostAdvertisement.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaArrowLeft, FaBullhorn, FaImage, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

const PostAdvertisement = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      contactInfo: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .max(50, "Title must be 50 characters or less"),
      description: Yup.string()
        .required("Description is required")
        .max(500, "Description must be 500 characters or less"),
      price: Yup.number().min(0, "Price cannot be negative"),
      category: Yup.string().required("Category is required"),
      contactInfo: Yup.string().required("Contact information is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("price", values.price || 0);
        formData.append("category", values.category);
        formData.append("contactInfo", values.contactInfo);

        // Add images if any
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }

        const response = await api.post("/advertisements", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success("Advertisement created successfully!");
          navigate("/tenant/marketplace");
        }
      } catch (error) {
        console.error("Error creating advertisement:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to create advertisement. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.warning("Maximum 5 images allowed");
      return;
    }

    setImages([...images, ...files]);

    // Preview new images
    const newPreviewUrls = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result);
        if (newPreviewUrls.length === files.length) {
          setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviewUrls];
    newPreviews.splice(index, 1);
    setImagePreviewUrls(newPreviews);
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/tenant/marketplace")}
          className="inline-flex items-center text-primary-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Marketplace
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center">
          <FaBullhorn className="text-primary-600 mr-2" />
          <h1 className="text-2xl font-semibold">Post New Advertisement</h1>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Share items or services with other residents. Your advertisement
            will be reviewed by the matron before being published.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter a title for your advertisement"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.title}
                </p>
              )}
            </div>

            <div>
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
                <option value="">Select a category</option>
                <option value="books">Books</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="clothing">Clothing</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.category && formik.errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter a price (leave empty for free items)"
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

            <div>
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
                placeholder="Describe your item or service in detail"
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

            <div>
              <label
                htmlFor="contactInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Information *
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  formik.touched.contactInfo && formik.errors.contactInfo
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="How can people contact you? (e.g., phone, email, room number)"
                value={formik.values.contactInfo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.contactInfo && formik.errors.contactInfo && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.contactInfo}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images (Maximum 5)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
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
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={imagePreviewUrls.length >= 5}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Image Previews:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => navigate("/tenant/marketplace")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSubmitting ? "Posting..." : "Post Advertisement"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-gray-50 mt-8 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Marketplace Guidelines</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Keep your advertisements appropriate and respectful</li>
          <li>Be accurate and honest about the condition of items</li>
          <li>Price items fairly</li>
          <li>Respond promptly to inquiries</li>
          <li>Meet in public spaces within the hostel for transactions</li>
          <li>Remove your listing once the item is sold</li>
        </ul>
      </div>
    </div>
  );
};

export default PostAdvertisement;
