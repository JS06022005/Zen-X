import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Screen, CartItem } from '../types';
import { getUserOrders, PlacedOrder } from '../services/orderService';

interface AccountScreenProps {
  onNavigate: (screen: Screen) => void;
  wishlistCount: number;
  cartCount: number;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onNavigate,
  wishlistCount,
  cartCount,
}) => {
  const { user, userProfile, logout } = useAuth();
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (user) {
      getUserOrders(user.uid)
        .then((data) => {
          setOrders(data);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] pt-32 pb-16 px-4 max-w-md mx-auto text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#f3f4f5] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px] text-[#76777d]">person</span>
        </div>
        <h2 className="text-2xl font-bold text-[#191c1d]">You are not signed in</h2>
        <p className="text-sm text-[#76777d] mt-2 mb-6">
          Sign in or create an account to view your past orders, active orders, and member perks.
        </p>
        <button
          onClick={() => onNavigate('auth')}
          className="w-full bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await logout();
    onNavigate('catalog');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header navigation */}
        <div className="flex items-center justify-between py-6">
          <div>
            <button
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#76777d] hover:text-black tracking-wider uppercase transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Catalog
            </button>
            <h1 className="text-3xl font-extrabold text-[#191c1d] tracking-tight mt-2">
              My Account
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#eceeed] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold overflow-hidden ring-4 ring-black/5 shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                (user.displayName?.[0] || user.email?.[0] || 'Z').toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#191c1d]">
                  {user.displayName || 'Zen X Member'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#f3f4f5] text-zinc-700">
                  Member
                </span>
              </div>
              <p className="text-xs text-[#76777d] mt-0.5">{user.email}</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Firebase ID: <span className="font-mono">{user.uid.slice(0, 10)}...</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('cart')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-xs font-semibold text-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Bag ({cartCount})</span>
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-xs font-semibold text-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span>Wishlist ({wishlistCount})</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#eceeed] mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-sm font-semibold tracking-wide cursor-pointer transition-all border-b-2 ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-[#76777d] hover:text-black'
            }`}
          >
            Orders & Shipments ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-sm font-semibold tracking-wide cursor-pointer transition-all border-b-2 ${
              activeTab === 'profile'
                ? 'border-black text-black'
                : 'border-transparent text-[#76777d] hover:text-black'
            }`}
          >
            Personal Details
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="py-16 text-center">
                <span className="inline-block w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mb-3" />
                <p className="text-xs text-[#76777d]">Retrieving order history from Firestore...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#eceeed]">
                <div className="w-16 h-16 rounded-full bg-[#f3f4f5] flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[28px] text-[#76777d]">
                    receipt_long
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#191c1d]">No orders placed yet</h3>
                <p className="text-xs text-[#76777d] mt-1 max-w-sm mx-auto mb-6">
                  Your ordered apparel, delivery timeline, and invoices will show up here as soon as you checkout.
                </p>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="bg-black text-white font-semibold text-xs py-3 px-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-[#eceeed] p-5 shadow-xs overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#f3f4f5]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#191c1d]">{ord.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#76777d] mt-0.5">
                          Paid via {ord.paymentMethod.toUpperCase()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#76777d]">Total Amount:</span>
                        <p className="text-base font-bold text-[#191c1d]">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="py-4 divide-y divide-gray-50">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-14 object-cover rounded-lg bg-zinc-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-[#191c1d] truncate">
                              {item.productName}
                            </h4>
                            <p className="text-[11px] text-[#76777d]">
                              Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold text-[#191c1d]">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Footer */}
                    <div className="mt-2 pt-3 border-t border-[#f3f4f5] flex items-center justify-between text-xs text-[#76777d]">
                      <div className="truncate pr-4">
                        <span className="font-medium text-[#191c1d]">Deliver to: </span>
                        {ord.deliveryAddress.fullName}, {ord.deliveryAddress.city} - {ord.deliveryAddress.pincode}
                      </div>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        Standard 2-4 Days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Personal Details */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eceeed]">
            <h3 className="text-base font-bold text-[#191c1d] mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#f8f9fa] rounded-xl">
                <span className="text-[#76777d] block uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Full Name
                </span>
                <p className="font-semibold text-sm text-[#191c1d]">
                  {user.displayName || 'Not provided'}
                </p>
              </div>

              <div className="p-4 bg-[#f8f9fa] rounded-xl">
                <span className="text-[#76777d] block uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Email Address
                </span>
                <p className="font-semibold text-sm text-[#191c1d]">{user.email}</p>
              </div>

              <div className="p-4 bg-[#f8f9fa] rounded-xl">
                <span className="text-[#76777d] block uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Authentication Provider
                </span>
                <p className="font-semibold text-sm text-[#191c1d] capitalize">
                  {user.providerData?.[0]?.providerId === 'google.com' ? 'Google Sign-In' : 'Email & Password'}
                </p>
              </div>

              <div className="p-4 bg-[#f8f9fa] rounded-xl">
                <span className="text-[#76777d] block uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Security Status
                </span>
                <p className="font-semibold text-sm text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Verified Account
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
