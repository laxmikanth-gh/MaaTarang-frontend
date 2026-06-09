import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, LogOut, Settings, LogIn, Menu, X, Shield } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar({
  user,
  wishlistCount = 0,
  onOpenLogin,
  onLogout,
  onOpenWishlist,
  isAdmin = false,
  showAdminDashboard,
  setShowAdminDashboard,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "py-3 glassmorphism shadow-md"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3.5 group">
          <img
            src={logo}
            alt="MaaTarang Logo"
            className="h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h1 className="font-serif text-2xl font-black tracking-wide text-teal-800 flex items-center gap-1.5">
              MaaTarang
            </h1>
            <p className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
              Tradition meets artistry
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-teal-700 transition-colors">Home</a>
          <a href="#featured" className="hover:text-teal-700 transition-colors">Designs</a>
          <a href="#about" className="hover:text-teal-700 transition-colors">About Us</a>
          <a href="#contact" className="hover:text-teal-700 transition-colors">Contact</a>
        </div>

        {/* Right Actions Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Wishlist Button (only active/visible when logged in) */}
          {user && (
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-all"
              title="Open Wishlist"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-800 text-gold-accent text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile Account Trigger */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-teal-800 text-gold-accent flex items-center justify-center font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 truncate max-w-[100px]">
                  {user.username}
                </span>
              </button>

              {/* Account Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Overlay Click-Away */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2.5 z-50 overflow-hidden"
                    >
                      <div className="px-4.5 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-semibold uppercase">Account</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.username}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            setShowAdminDashboard(!showAdminDashboard);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4.5 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2.5 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          {showAdminDashboard ? "Hide Admin Panel" : "Admin Dashboard"}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenWishlist();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-slate-500" />
                        My Wishlist ({wishlistCount})
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 border-t border-slate-50 transition-colors mt-1.5"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-600"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-teal-800 text-gold-accent text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-700 hover:text-teal-800"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-5 space-y-4 text-slate-700 font-semibold flex flex-col">
              <a href="#" onClick={() => setMenuOpen(false)} className="hover:text-teal-700 py-1 transition-colors">Home</a>
              <a href="#featured" onClick={() => setMenuOpen(false)} className="hover:text-teal-700 py-1 transition-colors">Designs</a>
              <a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-teal-700 py-1 transition-colors">About Us</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-teal-700 py-1 transition-colors">Contact</a>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-9 h-9 rounded-full bg-teal-800 text-gold-accent flex items-center justify-center font-bold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setShowAdminDashboard(!showAdminDashboard);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left py-2 text-sm font-semibold text-teal-800 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        {showAdminDashboard ? "Hide Admin Dashboard" : "Admin Dashboard"}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left py-2 text-sm font-semibold text-rose-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-teal-800 text-white font-semibold py-3 rounded-xl hover:bg-teal-900 transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
