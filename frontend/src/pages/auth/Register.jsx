/* eslint-disable no-unused-vars */
// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../../services/authServices";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "tenant",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .min(10, "Phone number must be at least 10 digits"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Remove confirmPassword field before sending to API
        const { confirmPassword, ...userData } = values;

        await register(userData);
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to register. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`form-input ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Full Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.name}
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
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.email}
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
                id="phone"
                name="phone"
                type="text"
                autoComplete="tel"
                required
                className={`form-input ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`form-input ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`form-input ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Register as
              </label>
              <select
                id="role"
                name="role"
                className={`form-input ${
                  formik.touched.role && formik.errors.role
                    ? "border-red-500"
                    : ""
                }`}
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="tenant">Tenant</option>
                <option value="matron">Matron</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.role}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? "Registering..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
