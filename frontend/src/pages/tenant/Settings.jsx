/* eslint-disable no-unused-vars */
// src/pages/tenant/Settings.jsx
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { FaUser, FaKey, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";

const TenantSettings = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .min(10, "Phone number must be at least 10 digits"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone);

        if (profileImage) {
          formData.append("profilePicture", profileImage);
        }

        const response = await api.put("/auth/me", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success("Profile updated successfully!");
          // Update local storage with new user data
          localStorage.setItem("user", JSON.stringify(response.data.data));
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to update profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        setChangingPassword(true);

        const response = await api.put("/auth/password", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        if (response.data.success) {
          toast.success("Password changed successfully! Please login again.");
          passwordFormik.resetForm();

          // Logout user after password change
          setTimeout(() => {
            logout();
          }, 2000);
        }
      } catch (error) {
        console.error("Error changing password:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to change password. Please try again."
        );
      } finally {
        setChangingPassword(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar - Profile Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4 relative">
              {previewUrl || user.profilePicture ? (
                <img
                  src={
                    previewUrl ||
                    `http://localhost:5000/uploads/${user.profilePicture}`
                  }
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FaUser className="h-16 w-16" />
                </div>
              )}

              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer"
              >
                <FaImage className="h-4 w-4" />
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
        </div>

        {/* Main Content - Settings Forms */}
        <div className="md:col-span-2">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

            <form onSubmit={profileFormik.handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      profileFormik.touched.name && profileFormik.errors.name
                        ? "border-red-500"
                        : ""
                    }`}
                    value={profileFormik.values.name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                  />
                  {profileFormik.touched.name && profileFormik.errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {profileFormik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      profileFormik.touched.email && profileFormik.errors.email
                        ? "border-red-500"
                        : ""
                    }`}
                    value={profileFormik.values.email}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                  />
                  {profileFormik.touched.email &&
                    profileFormik.errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileFormik.errors.email}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      profileFormik.touched.phone && profileFormik.errors.phone
                        ? "border-red-500"
                        : ""
                    }`}
                    value={profileFormik.values.phone}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                  />
                  {profileFormik.touched.phone &&
                    profileFormik.errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileFormik.errors.phone}
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <form onSubmit={passwordFormik.handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      passwordFormik.touched.currentPassword &&
                      passwordFormik.errors.currentPassword
                        ? "border-red-500"
                        : ""
                    }`}
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  {passwordFormik.touched.currentPassword &&
                    passwordFormik.errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordFormik.errors.currentPassword}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      passwordFormik.touched.newPassword &&
                      passwordFormik.errors.newPassword
                        ? "border-red-500"
                        : ""
                    }`}
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  {passwordFormik.touched.newPassword &&
                    passwordFormik.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordFormik.errors.newPassword}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                      passwordFormik.touched.confirmPassword &&
                      passwordFormik.errors.confirmPassword
                        ? "border-red-500"
                        : ""
                    }`}
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  {passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordFormik.errors.confirmPassword}
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSettings;
