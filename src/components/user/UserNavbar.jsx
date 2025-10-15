import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { useUser, useClerk } from "@clerk/clerk-react";

export default function UserNavbar({ onSearchProductsByTitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const { isSignedIn, user } = useUser();
  const { signOut, openUserProfile, openSignIn } = useClerk();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const clerkUserId = isSignedIn ? user.id : null;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Category", path: "/category", dropdown: true },
    { name: "Shop", path: "/products/all" },
    { name: "About", path: "/about" },
  ];

  const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories/all");
        const responseObject = await response.json();
        setCategories(responseObject.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNavigate = (path) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    navigate(`${path}/${clerkUserId}`);
  };

  const handleSearch = (e) => {
    navigate("/products/all");
    const value = e.target.value;
    setSearchText(value);
    if (onSearchProductsByTitle) {
      onSearchProductsByTitle(value);
    }
  };


  return (
    <header className="bg-white shadow-md px-4 sm:px-6 md:px-10 py-4 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div
          className="text-xl sm:text-2xl font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-blue-600">Wavy</span>Cloths
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 font-semibold text-gray-700 text-[16px] relative">
          {menuItems.map((item) =>
            item.dropdown ? (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
              >
                <span className="cursor-pointer hover:text-blue-600 transition duration-200 border-b-2 border-transparent hover:border-blue-600 pb-1">
                  {item.name} ▾
                </span>
                {categoryOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                    {categories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/products/${cat.id}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {cat.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-blue-600 transition duration-200 border-b-2 border-transparent hover:border-blue-600 pb-1 ${isActive ? "text-blue-600 border-blue-600" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            )
          )}
        </nav>

        {/* Right icons */}
        <div className="relative flex items-center gap-3 sm:gap-5">
          {/* Search box */}
          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Search for products"
              className="border border-gray-300 px-3 py-[6px] rounded-md text-sm focus:outline-none focus:border-blue-500 transition w-32 sm:w-44 md:w-56 shadow-sm"
              value={searchText}
              onChange={handleSearch}
            />

          </div>

          {/* Wishlist */}
          <AiOutlineHeart
            className="cursor-pointer text-lg sm:text-xl md:text-2xl hover:text-red-500 transition"
            title="Wishlist"
            onClick={() => handleNavigate("/wishlist")}
          />

          {/* Cart */}
          <FiShoppingCart
            className="cursor-pointer text-lg sm:text-xl md:text-2xl hover:text-blue-600 transition"
            title="Cart"
            onClick={() => handleNavigate("/cart")}
          />

          {/* User Dropdown */}
          {isSignedIn ? (
            <div className="relative">
              <img
                src={user.imageUrl}
                alt="User"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                  <button
                    onClick={openUserProfile}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Manage Account
                  </button>
                  <NavLink
                    to="/my-orders"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Orders
                  </NavLink>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <img
              onClick={openSignIn}
              src="https://icons.iconarchive.com/icons/iconsmind/outline/512/User-icon.png"
              alt="Sign in"
              className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
              title="Login"
            />
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? (
              <FiX className="text-xl sm:text-2xl" />
            ) : (
              <FiMenu className="text-xl sm:text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden mt-4 flex flex-col gap-4 text-gray-700 font-medium px-2">
          {menuItems.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="flex flex-col">
                <span
                  className="px-2 py-1 cursor-pointer hover:text-blue-600"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  {item.name} ▾
                </span>
                {categoryOpen && (
                  <div className="ml-4 flex flex-col">
                    {categories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/products/${cat.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="px-2 py-1 text-sm hover:text-blue-600"
                      >
                        {cat.name}
                      </NavLink>

                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded ${isActive ? "text-blue-600 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            )
          )}
        </nav>
      )}
    </header>
  );
}
