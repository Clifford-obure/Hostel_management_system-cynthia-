import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isMatron } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-950 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold">
                Ladies Hostel
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-white">Welcome, {user.name}</span>
                  <div className="relative group">
                    <button className="flex items-center text-white">
                      <FaUserCircle className="h-6 w-6" />
                    </button>
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                      <Link
                        to={
                          isMatron ? "/matron/dashboard" : "/tenant/dashboard"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <div className="text-white px-3 py-2">Welcome, {user.name}</div>
                <Link
                  to={isMatron ? "/matron/dashboard" : "/tenant/dashboard"}
                  className="text-white hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:bg-primary-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
