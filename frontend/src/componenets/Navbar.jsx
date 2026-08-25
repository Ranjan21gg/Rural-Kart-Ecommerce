import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchProductSuggestions } from "../services/products";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  CreditCard,
  Sparkles,
  Menu,
  X,
  Search,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const searchRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);


  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await searchProductSuggestions(query);

        const products = response.data.results ?? response.data;

        setSuggestions(products.slice(0, 6));
      } catch (error) {
        console.error('Search suggestions failed:', error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  const handleSuggestionClick = (product) => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchFocused(false);

    navigate(`/products/${product.slug}`);
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-sky-100/80 shadow-sm transition-all">
      {/* Top Banner Announcement Strip */}
      <div className="bg-linear-to-r from-sky-600 via-sky-500 to-indigo-600 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>Support Local Artisans & Rural Vendors • 100% Authentic Handcrafted Goods</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sky-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-300" /> Verified Vendors
            </span>
            <span>|</span>
            <span>Razorpay Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-sky-600 via-sky-700 to-slate-900 bg-clip-text text-transparent">
                RuralKart
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-sky-500 -mt-1">
                Direct Market
              </span>
            </div>
          </Link>

          {/* Quick Search Bar in Header */}
          <form
            ref={searchRef}
            onSubmit={handleNavSearch}
            className="hidden md:flex flex-1 max-w-xl relative mx-4"
          >
            <div className="relative w-full">

              {/* Search Input */}
              <div
                className={`flex items-center w-full bg-slate-50 
                  border rounded-full transition-all 
                  ${searchFocused
                    ? 'bg-white border-sky-400 ring-4 ring-sky-100/80'
                    : 'border-slate-400 hover:border-slate-300'
                  }`}
              >
                <Search className="ml-4 w-4 h-4 text-slate-500 shrink-0" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search for products, crafts & more..."
                  className="w-full bg-transparent border-none outline-none
                  py-3 px-3 text-sm text-slate-800 placeholder-slate-500"
                />

                {searchLoading && (
                  <div className="mr-3 w-4 h-4 border-2
                   border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                )}

                {!searchLoading && searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    className="mr-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {searchFocused && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-100">

                  {searchLoading ? (
                    <div className="px-4 py-5 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <div className="w-4 h-4 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                        Searching products...
                      </div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <div className="px-4 pt-3 pb-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Products
                        </p>
                      </div>

                      <div className="max-h-95 overflow-y-auto">
                        {suggestions.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSuggestionClick(product)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sky-50 transition-colors group"
                          >

                            {/* Product Image */}
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-5 h-5 text-slate-300" />
                                </div>
                              )}
                            </div>

                            {/* Product Information */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-sky-700">
                                {product.name}
                              </p>

                              {product.category?.name && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {product.category.name}
                                </p>
                              )}
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-slate-900">
                                ₹{Number(product.price).toLocaleString('en-IN')}
                              </p>
                            </div>

                          </button>
                        ))}
                      </div>

                      {/* View All */}
                      <button
                        type="submit"
                        className="w-full px-4 py-3 border-t border-slate-100 bg-slate-50 hover:bg-sky-50 text-sm font-bold text-sky-600 transition-colors"
                      >
                        View all results for "{searchQuery}"
                        <span className="ml-1">→</span>
                      </button>
                    </>
                  ) : (
                    <div className="px-5 py-7 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                        <Search className="w-4 h-4 text-slate-400" />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        No products found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Try searching for something else
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          </form>

          {/* Desktop Links & Actions */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${isActive('/')
                ? 'bg-sky-50 text-sky-700 font-semibold'
                : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/60'
                }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
            </Link>

            {user && (
              <>
                <Link
                  to="/cart"
                  className={`px-3.5 py-2 rounded-lg transition-colors relative flex items-center gap-1.5 ${isActive('/cart')
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/60'
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 bg-linear-to-r from-sky-500 to-sky-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${isActive('/orders')
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/60'
                    }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>

                {/* Admin Links */}
                {user.role === 'admin' && (
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-3 ml-2">
                    <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md mr-1">
                      Admin
                    </span>
                    <Link
                      to="/admin/products"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${isActive('/admin/products')
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${isActive('/admin/orders')
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/payments"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${isActive('/admin/payments')
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      Payments
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* User Account Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-full pl-2.5 pr-3 py-1.5 text-sm transition"
                >
                  <div className="w-7 h-7 rounded-full bg-linear-to-r from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-30 truncate">
                    {user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-sky-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.username}</p>
                      <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                    >
                      <Package className="w-4 h-4" /> Order History
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/products"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Portal
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-3">
            {user && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-700 hover:text-sky-600"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-sky-600 rounded-lg hover:bg-sky-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-100 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleNavSearch} className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-800 font-medium hover:bg-sky-50"
          >
            <ShoppingBag className="w-5 h-5 text-sky-600" /> Shop Catalog
          </Link>

          {user ? (
            <>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-800 font-medium hover:bg-sky-50"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-sky-600" /> Cart
                </div>
                {cartCount > 0 && (
                  <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount} items
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-800 font-medium hover:bg-sky-50"
              >
                <Package className="w-5 h-5 text-sky-600" /> My Orders
              </Link>

              {user.role === 'admin' && (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="px-3 text-xs font-bold uppercase tracking-wider text-amber-700">Admin Controls</p>
                  <Link
                    to="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-100"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" /> Manage Products
                  </Link>
                  <Link
                    to="/admin/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-100"
                  >
                    <Package className="w-4 h-4 text-slate-500" /> All Customer Orders
                  </Link>
                  <Link
                    to="/admin/payments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-100"
                  >
                    <CreditCard className="w-4 h-4 text-slate-500" /> Payment Transactions
                  </Link>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}