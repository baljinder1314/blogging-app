import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinkClass = "text-sm text-gray-600 hover:text-gray-900 transition";
  const activeLinkClass = "text-sm text-gray-900 font-semibold";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between font-semibold  items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            DevBlog
          </Link>

          <div className="flex items-center gap-6">
            {/* Public Links */}
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/blogs" className={navLinkClass}>
              Blogs
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass}>
                  Dashboard
                </Link>
                <Link to="/profile" className={navLinkClass}>
                  Profile
                </Link>
                <Link
                  to="/create-post"
                  className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                >
                  Write
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            DevBlog
          </Link>

          <button onClick={toggleMobileMenu} className="text-gray-900">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blogs"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/create-post"
                    className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Write
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
