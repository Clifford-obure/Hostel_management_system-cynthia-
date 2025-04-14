import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import {
  FaHome,
  FaBed,
  FaUserFriends,
  FaClipboardList,
  FaBullhorn,
  FaExclamationTriangle,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const { isMatron } = useAuth();

  // Define sidebar items based on user role
  const sidebarItems = isMatron
    ? [
        { name: "Dashboard", path: "/matron/dashboard", icon: <FaHome /> },
        { name: "Rooms", path: "/matron/rooms", icon: <FaBed /> },
        {
          name: "Bookings",
          path: "/matron/bookings",
          icon: <FaClipboardList />,
        },
        { name: "Visitors", path: "/matron/visitors", icon: <FaUserFriends /> },
        {
          name: "Complaints",
          path: "/matron/complaints",
          icon: <FaExclamationTriangle />,
        },
        {
          name: "Advertisements",
          path: "/matron/advertisements",
          icon: <FaBullhorn />,
        },
        { name: "Settings", path: "/matron/settings", icon: <FaCog /> },
      ]
    : [
        { name: "Dashboard", path: "/tenant/dashboard", icon: <FaHome /> },
        { name: "Rooms", path: "/tenant/rooms", icon: <FaBed /> },
        {
          name: "My Booking",
          path: "/tenant/my-booking",
          icon: <FaClipboardList />,
        },
        {
          name: "My Visitors",
          path: "/tenant/my-visitors",
          icon: <FaUserFriends />,
        },
        {
          name: "My Complaints",
          path: "/tenant/my-complaints",
          icon: <FaExclamationTriangle />,
        },
        {
          name: "Marketplace",
          path: "/tenant/marketplace",
          icon: <FaBullhorn />,
        },
        { name: "Settings", path: "/tenant/settings", icon: <FaCog /> },
      ];

  return (
    <div className="bg-gray-800 text-white  min-h-screen w-64 fixed hidden md:block">
      <div className="p-4">
        <h2 className="text-xl font-semibold">
          {isMatron ? "Matron Panel" : "Tenant Portal"}
        </h2>
      </div>

      <nav className="mt-8">
        <div className="px-2 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <div className="mr-4 h-6 w-6">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
