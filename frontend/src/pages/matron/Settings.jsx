/* eslint-disable no-unused-vars */
// src/pages/matron/Settings.jsx
import { useState, useEffect } from "react";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import {
  FaUser,
  FaKey,
  FaImage,
  FaCog,
  FaBell,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";

const MatronSettings = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

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

  // For notification settings (example)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    complaintAlerts: true,
    bookingNotifications: true,
    visitorAlerts: true,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
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
            <p className="text-gray-500 text-sm mt-1 capitalize">{user.role}</p>
          </div>

          <div className="mt-6">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "profile"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaUser
                  className={`flex-shrink-0 mr-3 h-5 w-5 ${
                    activeTab === "profile"
                      ? "text-primary-500"
                      : "text-gray-400"
                  }`}
                />
                <span>Personal Information</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "security"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaShieldAlt
                  className={`flex-shrink-0 mr-3 h-5 w-5 ${
                    activeTab === "security"
                      ? "text-primary-500"
                      : "text-gray-400"
                  }`}
                />
                <span>Security</span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "notifications"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaBell
                  className={`flex-shrink-0 mr-3 h-5 w-5 ${
                    activeTab === "notifications"
                      ? "text-primary-500"
                      : "text-gray-400"
                  }`}
                />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab("system")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "system"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaCog
                  className={`flex-shrink-0 mr-3 h-5 w-5 ${
                    activeTab === "system"
                      ? "text-primary-500"
                      : "text-gray-400"
                  }`}
                />
                <span>System Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content - Settings Tabs */}
        <div className="md:col-span-2">
          {/* Personal Information Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Personal Information
              </h2>

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
                    {profileFormik.touched.name &&
                      profileFormik.errors.name && (
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
                        profileFormik.touched.email &&
                        profileFormik.errors.email
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
                        profileFormik.touched.phone &&
                        profileFormik.errors.phone
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
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Change Password</h3>
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

                  <div className="mt-4">
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

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-md font-medium mb-2">Login Sessions</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Current Session
                      </p>
                      <p className="text-sm text-gray-500">
                        Started {moment().subtract(3, "hours").fromNow()}
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Notification Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="emailNotifications"
                      className="font-medium text-gray-700"
                    >
                      Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications for important updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="complaintAlerts"
                      name="complaintAlerts"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={notificationSettings.complaintAlerts}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="complaintAlerts"
                      className="font-medium text-gray-700"
                    >
                      Complaint Alerts
                    </label>
                    <p className="text-gray-500">
                      Get notified when a new complaint is submitted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="bookingNotifications"
                      name="bookingNotifications"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={notificationSettings.bookingNotifications}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="bookingNotifications"
                      className="font-medium text-gray-700"
                    >
                      Booking Notifications
                    </label>
                    <p className="text-gray-500">
                      Get notified when a tenant books a room.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="visitorAlerts"
                      name="visitorAlerts"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={notificationSettings.visitorAlerts}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="visitorAlerts"
                      className="font-medium text-gray-700"
                    >
                      Visitor Alerts
                    </label>
                    <p className="text-gray-500">
                      Get notified when a visitor is checked-in.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === "system" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">System Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">
                    Hostel Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="hostelName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Hostel Name
                      </label>
                      <input
                        type="text"
                        id="hostelName"
                        name="hostelName"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="Ladies Hostel"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="hostelAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Hostel Address
                      </label>
                      <input
                        type="text"
                        id="hostelAddress"
                        name="hostelAddress"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="123 University Road, Campus Area"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="info@ladieshostel.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        id="contactPhone"
                        name="contactPhone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="+123 456 7890"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium mb-2">Booking Settings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="defaultBookingDuration"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Default Booking Duration (months)
                      </label>
                      <select
                        id="defaultBookingDuration"
                        name="defaultBookingDuration"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="3"
                      >
                        <option value="1">1 month</option>
                        <option value="2">2 months</option>
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="autoApproveBookings"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Auto-approve Bookings
                      </label>
                      <select
                        id="autoApproveBookings"
                        name="autoApproveBookings"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="no"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium mb-2">Visitor Rules</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="visitorHours"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Visiting Hours
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label
                            htmlFor="visitingHoursStart"
                            className="block text-xs text-gray-500"
                          >
                            Start Time
                          </label>
                          <input
                            type="time"
                            id="visitingHoursStart"
                            name="visitingHoursStart"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            defaultValue="08:00"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="visitingHoursEnd"
                            className="block text-xs text-gray-500"
                          >
                            End Time
                          </label>
                          <input
                            type="time"
                            id="visitingHoursEnd"
                            name="visitingHoursEnd"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            defaultValue="20:00"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="maxVisitDuration"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Maximum Visit Duration (hours)
                      </label>
                      <input
                        type="number"
                        id="maxVisitDuration"
                        name="maxVisitDuration"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="4"
                        min="1"
                        max="12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save System Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatronSettings;
