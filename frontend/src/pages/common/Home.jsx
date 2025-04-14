/* eslint-disable no-unused-vars */
// src/pages/common/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Home = () => {
  const { isAuthenticated, isMatron, isTenant } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary-700 text-black">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to Ladies Hostel Management
                </h1>
                <p className="text-xl mb-8">
                  A safe, comfortable, and modern living experience for female
                  students.
                </p>

                {!isAuthenticated ? (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="bg-white text-primary-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-secondary-600 text-black px-6 py-3 rounded-md font-medium hover:bg-secondary-700"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      to={isMatron ? "/matron/dashboard" : "/tenant/dashboard"}
                      className="bg-white text-primary-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                )}
              </div>

              <div className="md:w-1/2">
                <div className="bg-gray-200 h-64 md:h-full rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Hostel Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-primary-600 text-4xl mb-4">
                  <i className="fas fa-bed"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Comfortable Rooms
                </h3>
                <p className="text-gray-600">
                  Well-furnished rooms with all the necessary amenities for a
                  comfortable stay.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-primary-600 text-4xl mb-4">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Environment
                </h3>
                <p className="text-gray-600">
                  24/7 security and visitor management system to ensure your
                  safety.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-primary-600 text-4xl mb-4">
                  <i className="fas fa-wifi"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Modern Facilities
                </h3>
                <p className="text-gray-600">
                  High-speed internet, laundry services, and study areas for
                  your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
