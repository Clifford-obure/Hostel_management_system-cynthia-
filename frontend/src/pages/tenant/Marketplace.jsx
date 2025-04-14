// src/pages/tenant/Marketplace.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FaPlus, FaSearch, FaTags, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const TenantMarketplace = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    priceRange: "",
  });

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        let queryParams = "";

        if (filters.category) queryParams += `?category=${filters.category}`;
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split("-");
          queryParams += queryParams
            ? `&minPrice=${min}&maxPrice=${max}`
            : `?minPrice=${min}&maxPrice=${max}`;
        }

        const response = await api.get(`/advertisements${queryParams}`);
        setAdvertisements(response.data.data);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Failed to load marketplace items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [filters.category, filters.priceRange]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Apply search filter to current advertisements
  };

  const filteredAdvertisements = () => {
    return advertisements.filter((ad) => {
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          ad.title.toLowerCase().includes(searchTerm) ||
          ad.description.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <Link
          to="/tenant/marketplace/add"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Post Advertisement
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="services">Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priceRange"
              className="block text-sm font-medium text-gray-700"
            >
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="">Any Price</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200 - $500</option>
              <option value="500-1000">$500+</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <form
              onSubmit={handleSearchSubmit}
              className="mt-1 flex rounded-md shadow-sm"
            >
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md border-gray-300"
                placeholder="Search advertisements..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Advertisements Grid */}
      {filteredAdvertisements().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvertisements().map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {ad.images && ad.images.length > 0 ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000/uploads/${ad.images[0]}`}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {ad.title}
                  </h3>
                  {ad.price > 0 && (
                    <span className="text-primary-600 font-semibold">
                      ${ad.price}
                    </span>
                  )}
                </div>

                <div className="flex items-center mb-2">
                  <FaTags className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500 capitalize">
                    {ad.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {ad.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Posted {moment(ad.createdAt).fromNow()}
                  </span>
                  <Link
                    to={`/tenant/marketplace/${ad._id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow py-12 px-6 text-center">
          <FaTags className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Items Found
          </h3>
          <p className="text-gray-500 mb-6">
            There are no advertisements matching your current filters.
          </p>
          <Link
            to="/tenant/marketplace/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <FaPlus className="mr-2" /> Post an Advertisement
          </Link>
        </div>
      )}
    </div>
  );
};

export default TenantMarketplace;
