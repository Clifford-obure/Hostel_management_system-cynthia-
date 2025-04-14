const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Ladies Hostel Management</h2>
            <p className="text-gray-300">
              Your comfortable home away from home
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium mb-2">Contact</h3>
              <p className="text-gray-300">Email: info@ladieshostel.com</p>
              <p className="text-gray-300">Phone: +123 456 7890</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Address</h3>
              <p className="text-gray-300">123 University Road</p>
              <p className="text-gray-300">Campus Area, City - 12345</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Ladies Hostel Management. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
