import React, { useState } from 'react';
import { CartItem, Screen } from '../types';

interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onNavigate,
  onGoBack,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Financial calculations
  const totalMrp = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const totalSellingPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bagDiscount = totalMrp - totalSellingPrice;
  const couponDiscount = appliedCoupon ? (appliedCoupon === 'ZENFIRST10' ? 299 : Math.round(totalSellingPrice * 0.1)) : 0;
  const totalPayable = Math.max(0, totalSellingPrice - couponDiscount);
  const totalSavings = bagDiscount + couponDiscount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponError(null);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try ZENFIRST10 or ZENESSENTIALS');
    }
  };

  const handleShareBag = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#f3f4f5] flex items-center justify-center text-[#76777d]">
          <span className="material-symbols-outlined text-[36px]">shopping_bag</span>
        </div>
        <h2 className="text-[24px] font-bold text-[#191c1d]">Your Shopping Bag is empty</h2>
        <p className="text-[14px] text-[#45464c] max-w-md">
          Explore our collection of heavyweight 240 GSM organic cotton essentials, relaxed hoodies, and utilitarian pants.
        </p>
        <button
          onClick={onGoBack}
          className="mt-4 px-8 py-3 bg-black text-white font-semibold text-[14px] rounded-xl hover:bg-black/85 cursor-pointer inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Go Back to Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top Bar with Go Back */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-3 border-b border-[#edeeef] bg-white flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] text-[13px] font-semibold transition-all cursor-pointer border border-[#e1e3e4] shadow-2xs active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Go Back to Shopping</span>
        </button>
        <span className="text-[13px] text-[#45464c] font-medium hidden sm:inline">
          Fast Pan-India Express Delivery
        </span>
      </div>
      {/* Free Delivery Celebration Banner */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-xs border border-[#e1e3e4] flex flex-col gap-3 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e7e8e9] flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#0051d5] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_shipping
                </span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#191c1d]">
                  You've unlocked FREE Delivery on this order! 🎉
                </p>
                <p className="text-[13px] text-[#45464c]">
                  Eligible for expedited 2-3 day pan-India shipping with zero checkout friction.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#f3f4f5] px-3 py-1 rounded-full border border-[#e1e3e4]">
              <span className="material-symbols-outlined text-[#0051d5] text-[16px]">verified</span>
              <span className="text-[11px] uppercase text-[#0051d5] font-bold tracking-wider">
                Offer Applied
              </span>
            </div>
          </div>

          {/* Meter Component */}
          <div className="w-full bg-[#e7e8e9] rounded-full h-2 overflow-hidden relative mt-1">
            <div className="bg-[#0051d5] h-full rounded-full w-full transition-all duration-500"></div>
          </div>

          <div className="flex justify-between items-center text-[#45464c] text-[12px]">
            <span>₹0 cart baseline</span>
            <span className="text-[#191c1d] font-semibold">
              Unlocked ₹999 tier (Current Bag: ₹{totalSellingPrice.toLocaleString('en-IN')})
            </span>
          </div>
        </div>
      </div>

      {/* Primary Cart Experience Grid */}
      <div className="w-full px-4 md:px-8 lg:px-12 pb-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Inventory List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between pb-1 border-b border-[#edeeef]">
              <div className="flex items-baseline gap-2">
                <h1 className="text-[24px] font-bold text-[#191c1d]">Shopping Bag</h1>
                <span className="text-[14px] text-[#45464c]">({itemCount} items)</span>
              </div>
              <button
                onClick={handleShareBag}
                className="text-[13px] text-[#0051d5] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>{copiedShare ? 'Link Copied!' : 'Share Bag'}</span>
              </button>
            </div>

            {/* Cart Items List Container */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-[#e1e3e4] flex flex-col sm:flex-row gap-4 relative transition-all duration-200"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-28 sm:h-36 h-48 rounded-xl overflow-hidden bg-[#f3f4f5] shrink-0 relative border border-[#e1e3e4]">
                    <img
                      src={item.customImage || item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {item.product.bestseller && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Details & Controls */}
                  <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[16px] font-semibold text-[#191c1d] leading-snug">
                          {item.product.name}
                        </h2>
                        <div className="text-right shrink-0">
                          <p className="text-[16px] font-bold text-[#191c1d]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[13px] text-[#76777d] line-through">
                            ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#edeeef] text-[#191c1d] text-[12px] font-medium">
                          Size: {item.selectedSize}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#edeeef] text-[#191c1d] text-[12px] font-medium">
                          Color: {item.selectedColor}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#e7e8e9] text-[#45464c] text-[11px] font-semibold">
                          {item.product.discountPercent}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Bottom Bar: Stepper & Action Triggers */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f3f4f5]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#f3f4f5] rounded-lg p-0.5 border border-[#e1e3e4]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#45464c] hover:text-[#191c1d] hover:bg-white rounded transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-8 text-center font-bold text-[14px] text-[#191c1d]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#45464c] hover:text-[#191c1d] hover:bg-white rounded transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      {/* Secondary Actions */}
                      <div className="flex items-center gap-4 text-[#45464c]">
                        <button
                          onClick={() => onMoveToWishlist(item)}
                          className="flex items-center gap-1 text-[13px] hover:text-[#191c1d] transition-colors py-1 cursor-pointer font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px]">favorite</span>
                          <span>Move to Wishlist</span>
                        </button>
                        <span className="text-[#e7e8e9]">•</span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="flex items-center gap-1 text-[13px] hover:text-[#ba1a1a] transition-colors py-1 cursor-pointer font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons & Offers Section */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e3e4] flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#0051d5] text-[22px]">
                  confirmation_number
                </span>
                <p className="text-[16px] font-bold text-[#191c1d]">Coupons & Offers</p>
              </div>

              {/* Coupon Input Form */}
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
                    sell
                  </span>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    placeholder="Enter coupon code (e.g. ZENFIRST10)"
                    className="w-full h-11 pl-11 pr-4 bg-[#f3f4f5] text-[#191c1d] placeholder:text-[#45464c] text-[13px] font-medium uppercase rounded-xl focus:outline-none focus:bg-white border border-[#e1e3e4]"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 bg-black text-white hover:bg-black/85 text-[13px] font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  Apply Coupon
                </button>
              </form>

              {couponError && <p className="text-[12px] text-red-600 pl-1">{couponError}</p>}

              {/* Active Applied Coupon Pill */}
              {appliedCoupon && (
                <div className="bg-[#f3f4f5] rounded-xl p-3 sm:px-4 flex items-center justify-between gap-3 border border-[#e1e3e4]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#dbe1ff] text-[#0051d5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-wider text-[#0051d5] bg-[#dbe1ff]/60 px-2 py-0.5 rounded">
                          {appliedCoupon}
                        </span>
                        <span className="text-[13px] text-[#191c1d] font-semibold truncate">
                          Applied Successfully
                        </span>
                      </div>
                      <p className="text-[12px] text-[#45464c] truncate">
                        Extra instant discount applied • ₹{couponDiscount} saved
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-[12px] text-[#ba1a1a] hover:underline shrink-0 px-2 py-1 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Inline Value Adds / Delivery Timeline */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e1e3e4] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#76777d] mt-0.5">schedule</span>
                <div>
                  <p className="text-[13px] font-semibold text-[#191c1d]">
                    Standard Dispatch: Tomorrow, 11 AM
                  </p>
                  <p className="text-[12px] text-[#45464c]">
                    Carefully inspected & dispatched in 100% plastic-free packaging.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#76777d] mt-0.5">lock</span>
                <div>
                  <p className="text-[13px] font-semibold text-[#191c1d]">Pay Online or on Delivery</p>
                  <p className="text-[12px] text-[#45464c]">
                    Zero hidden fees at checkout. Transparent billing guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Bill Details & Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-[128px] flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e3e4] flex flex-col gap-4">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#edeeef]">
                <h3 className="text-[16px] font-bold text-[#191c1d]">Order Summary</h3>
                <span className="text-[11px] uppercase bg-[#edeeef] px-2 py-0.5 rounded text-[#45464c] font-semibold">
                  Pricing Details
                </span>
              </div>

              {/* Savings Badge */}
              <div className="bg-[#dbe1ff]/50 text-[#00174b] p-3 rounded-xl flex items-center gap-2.5 border border-[#dbe1ff]">
                <span className="material-symbols-outlined text-[20px] text-[#0051d5]">savings</span>
                <p className="text-[13px] font-semibold">
                  You are saving ₹{totalSavings.toLocaleString('en-IN')} on this order! 🥳
                </p>
              </div>

              {/* Cost Breakdown Rows */}
              <div className="flex flex-col gap-2.5 text-[13px]">
                <div className="flex items-center justify-between text-[#45464c]">
                  <span>Total MRP (Incl. all taxes)</span>
                  <span className="text-[#191c1d] font-semibold">
                    ₹{totalMrp.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#45464c]">
                  <span>Bag Discount</span>
                  <span className="text-[#0051d5] font-semibold">
                    -₹{bagDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[#45464c]">
                    <span className="flex items-center gap-1.5">
                      <span>Coupon Discount</span>
                      <span className="text-[10px] bg-[#dbe1ff] text-[#0051d5] px-1.5 py-0.5 rounded font-bold">
                        {appliedCoupon}
                      </span>
                    </span>
                    <span className="text-[#0051d5] font-semibold">
                      -₹{couponDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#45464c]">
                  <span className="flex items-center gap-1">
                    <span>Estimated Delivery</span>
                    <span
                      className="material-symbols-outlined text-[14px] text-[#76777d]"
                      title="Free on orders above ₹999"
                    >
                      info
                    </span>
                  </span>
                  <span className="text-[#0051d5] font-bold">
                    <span className="line-through text-[#76777d] font-normal mr-1.5">₹99</span>FREE
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-[#edeeef]"></div>

              {/* Total Bill Payable */}
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[16px] font-bold text-[#191c1d]">Total Amount</p>
                  <p className="text-[11px] text-[#76777d] uppercase font-medium">Taxes included</p>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-[#191c1d]">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Primary Call to Action */}
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full h-12 bg-black hover:bg-black/90 active:scale-[0.99] text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout ({itemCount} Items)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              {/* Back Link */}
              <div className="text-center pt-1">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="text-[13px] text-[#45464c] hover:text-[#191c1d] transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>

            {/* Trust & Security Highlights */}
            <div className="bg-[#f3f4f5] rounded-2xl p-4 flex flex-col gap-2.5 border border-[#e1e3e4]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5] text-[20px]">shield</span>
                <p className="text-[13px] font-semibold text-[#191c1d]">ZEN X Purchase Assurance</p>
              </div>
              <ul className="flex flex-col gap-1.5 text-[12px] text-[#45464c]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#76777d]">
                    verified
                  </span>
                  <span>100% Safe & Secure Payments (UPI, Cards, NetBanking, COD)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#76777d]">
                    published_with_changes
                  </span>
                  <span>7-Day Hassle-Free Exchange & Return</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#76777d]">
                    award_star
                  </span>
                  <span>Genuine Quality Checked Products</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
