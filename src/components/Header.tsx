import React, { useState } from 'react';
import { Screen } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  cartTotal,
  wishlistCount,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { label: 'All Products', value: 'all' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Oversized T-Shirts', value: 'Oversized T-Shirts' },
    { label: 'Classic Tees', value: 'Classic Tees' },
    { label: 'Hoodies & Sweats', value: 'Hoodies & Sweatshirts' },
    { label: 'Joggers & Cargo', value: 'Joggers & Cargo' },
    { label: 'New Arrivals', value: 'new-arrivals' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Banner */}
      <div className="bg-[#000000] text-[#ffffff] px-4 md:px-8 lg:px-12">
        <div className="w-full flex items-center justify-between h-9 text-[11px] font-semibold uppercase tracking-wider">
          <div className="hidden md:flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span>India-Wide Express Delivery</span>
          </div>
          <div className="flex-1 text-center truncate px-2">
            Free Delivery on all prepaid orders over ₹999 | Standard 2-4 Days Shipping across India
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => onNavigate(user ? 'account' : 'auth')}
              className="hover:underline cursor-pointer"
            >
              Track Order
            </button>
            <span className="opacity-40">/</span>
            {user ? (
              <button
                onClick={() => onNavigate('account')}
                className="hover:underline cursor-pointer text-zinc-300"
              >
                Hi, {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="hover:underline cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-20 w-full px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4 bg-[#ffffff]">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              onSelectCategory('all');
              onNavigate('catalog');
            }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <img
              alt="ZEN X Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1U26kq_Ker2XL1l9R6hTSArJpzyuoAcvGf3v89L8cb7UJ0SCVapM9R8gImHR9QthJes0vdY8VkLlFecONjwn5WHeWcYZZgSgcPQFcde7yvZ_Lg57UNVEXtePSpLJuYXIl-FPnQcOpiX_R6HFCPUhViFk59PlIRPPSLdThbI8f3QtOtrvEE7IWP2y4gr5cFxdnJC1-1Qbnt02WjF8Fr0jSZNl_PoUG7wJ7bduXbnRGstP22qwpOqrHBUu-YA"
            />
            <span className="font-bold text-[16px] tracking-tight text-[#191c1d]">
              ZEN X
            </span>
          </button>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden xl:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentScreen !== 'catalog') onNavigate('catalog');
              }}
              placeholder="Search for oversized t-shirts, joggers, hoodies..."
              className="w-full h-11 pl-10 pr-4 bg-[#f3f4f5] text-[#191c1d] placeholder:text-[#45464c] text-[13px] rounded-xl focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-black"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-3">
          {navItems.map((item) => {
            const isActive =
              currentScreen === 'catalog' && activeCategory === item.value;
            return (
              <button
                key={item.value}
                onClick={() => {
                  onSelectCategory(item.value);
                  onNavigate('catalog');
                }}
                className={`transition-all text-[14px] cursor-pointer ${
                  isActive
                    ? 'text-[#191c1d] font-semibold bg-[#f3f4f5] rounded-lg px-2.5 py-1.5'
                    : 'text-[#45464c] hover:text-[#191c1d] font-medium py-1.5 px-2 hover:bg-black/5 rounded-lg'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone: Search (Mobile), Wishlist, Bag, Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="xl:hidden p-2 rounded-xl text-[#45464c] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors"
            aria-label="Toggle Search"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => {
              onNavigate('catalog');
            }}
            className="relative p-2 rounded-xl text-[#45464c] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
            title="Wishlist"
          >
            <span className="material-symbols-outlined">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#000000] text-[#ffffff] text-[10px] rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'cart'
                ? 'bg-black text-white'
                : 'bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d]'
            }`}
            title="Shopping Cart"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span className="hidden sm:inline font-semibold text-[14px]">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
            <span
              className={`w-5 h-5 text-[11px] rounded-full flex items-center justify-center font-bold ${
                currentScreen === 'cart'
                  ? 'bg-white text-black'
                  : 'bg-[#0051d5] text-white'
              }`}
            >
              {cartCount}
            </span>
          </button>

          {/* User Profile or Sign In */}
          {user ? (
            <div className="relative pl-1">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f3f4f5] transition-colors cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-black/10"
                    src={user.photoURL}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold ring-1 ring-black/10">
                    {(user.displayName?.[0] || user.email?.[0] || 'Z').toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-[13px] text-[#191c1d] font-medium max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="material-symbols-outlined text-[#76777d] text-[16px]">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e1e3e4] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-[#edeeef] mb-1">
                    <p className="font-semibold text-[13px] text-[#191c1d] truncate">
                      {user.displayName || 'Zen X Member'}
                    </p>
                    <p className="text-[11px] text-[#76777d] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('account');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>My Account & Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('cart');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    <span>Active Bag ({cartCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              title="Sign in or register"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#45464c] hover:bg-[#f3f4f5]"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="xl:hidden px-4 pb-3 bg-white border-b border-[#edeeef]">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentScreen !== 'catalog') onNavigate('catalog');
              }}
              placeholder="Search oversized tees, cargo, hoodies..."
              className="w-full h-11 pl-10 pr-4 bg-[#f3f4f5] text-[#191c1d] placeholder:text-[#45464c] text-[13px] rounded-xl focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-white border-b border-[#edeeef] flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onSelectCategory(item.value);
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg text-[14px] font-medium ${
                activeCategory === item.value && currentScreen === 'catalog'
                  ? 'bg-black text-white font-semibold'
                  : 'text-[#191c1d] hover:bg-[#f3f4f5]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#edeeef] flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onNavigate('cart');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 bg-[#f3f4f5] text-[#191c1d] font-semibold text-[13px] rounded-lg text-center"
              >
                Bag ({cartCount})
              </button>
              <button
                onClick={() => {
                  onNavigate('checkout');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 bg-black text-white font-semibold text-[13px] rounded-lg text-center"
              >
                Checkout
              </button>
            </div>
            <button
              onClick={() => {
                onNavigate(user ? 'account' : 'auth');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-zinc-100 text-[#191c1d] font-semibold text-[13px] rounded-lg text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>{user ? `My Account (${user.displayName?.split(' ')[0] || user.email?.split('@')[0]})` : 'Sign In / Register'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
