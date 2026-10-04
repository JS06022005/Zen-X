import React, { useState, useEffect } from 'react';
import { Product, Screen } from '../types';
import { SizeChartModal } from './SizeChartModal';

interface ProductDetailScreenProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity: number) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  onSelectCategory?: (category: string) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  wishlistIds,
  onToggleWishlist,
  onNavigate,
  onGoBack,
  onSelectCategory,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colorName);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    setSelectedColor(product.colorName);
    setSelectedSize(product.sizes.includes('M') ? 'M' : product.sizes[0] || 'M');
    setQuantity(1);
    setAddedFeedback(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);
  const [pincode, setPincode] = useState('560001');
  const [pincodeStatus, setPincodeStatus] = useState<{
    valid: boolean;
    city?: string;
    message?: string;
  }>({
    valid: true,
    city: 'Bangalore',
    message: 'Delivery by Thursday, 2 days',
  });

  // Accordion states
  const [accordionOpen, setAccordionOpen] = useState({
    desc: true,
    care: false,
    returns: false,
  });

  const isWishlisted = wishlistIds.includes(product.id);
  const totalItemPrice = product.price * quantity;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleCheckPincode = () => {
    const trimmed = pincode.trim();
    if (/^[1-9][0-9]{5}$/.test(trimmed)) {
      setPincodeStatus({
        valid: true,
        city: trimmed.startsWith('56') ? 'Bangalore' : trimmed.startsWith('11') ? 'Delhi' : trimmed.startsWith('40') ? 'Mumbai' : 'Your Location',
        message: 'Delivery in 2-3 Days via Express Courier',
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian postal pincode.',
      });
    }
  };

  const scrollToGalleryImage = (index: number) => {
    const el = document.getElementById(`pdp-gallery-img-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Navigation & Go Back Bar */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-3.5 border-b border-[#edeeef] bg-white flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] text-[13px] font-semibold transition-all cursor-pointer border border-[#e1e3e4] shadow-2xs active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Go Back</span>
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-[13px] text-[#45464c] overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => {
              onSelectCategory?.('all');
              onNavigate('catalog');
            }}
            className="hover:text-[#191c1d] transition-colors cursor-pointer"
          >
            Storefront
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#76777d]">chevron_right</span>
          {product.gender.includes('men') && !product.gender.includes('women') ? (
            <button
              onClick={() => {
                onSelectCategory?.('men');
                onNavigate('catalog');
              }}
              className="hover:text-[#191c1d] transition-colors cursor-pointer"
            >
              Men
            </button>
          ) : product.gender.includes('women') && !product.gender.includes('men') ? (
            <button
              onClick={() => {
                onSelectCategory?.('women');
                onNavigate('catalog');
              }}
              className="hover:text-[#191c1d] transition-colors cursor-pointer"
            >
              Women
            </button>
          ) : (
            <button
              onClick={() => {
                onSelectCategory?.('all');
                onNavigate('catalog');
              }}
              className="hover:text-[#191c1d] transition-colors cursor-pointer"
            >
              Unisex
            </button>
          )}
          <span className="material-symbols-outlined text-[14px] text-[#76777d]">chevron_right</span>
          <button
            onClick={() => {
              onSelectCategory?.(product.category);
              onNavigate('catalog');
            }}
            className="hover:text-[#191c1d] text-[#0051d5] font-semibold transition-colors cursor-pointer"
          >
            {product.category}
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#76777d]">chevron_right</span>
          <span className="text-[#191c1d] font-medium truncate max-w-[200px] md:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main PDP Grid */}
      <div className="w-full px-4 md:px-8 lg:px-12 pb-14">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Product Gallery (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* 2x2 Clean Image Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {product.gallery.map((img, idx) => (
                <div
                  key={idx}
                  id={`pdp-gallery-img-${idx}`}
                  className="relative group bg-[#f3f4f5] rounded-xl overflow-hidden aspect-[4/5] shadow-sm border border-[#e1e3e4]"
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-[#191c1d] shadow-xs border border-white/60">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Thumbnail Preview Strip */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToGalleryImage(idx)}
                    className="w-14 h-16 rounded-lg bg-[#f3f4f5] overflow-hidden shrink-0 shadow-xs border border-[#e1e3e4] hover:border-black focus:outline-none focus:ring-2 focus:ring-[#0051d5] transition-all cursor-pointer"
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[#45464c] text-[13px] font-medium">
                <span className="material-symbols-outlined text-[18px] text-[#0051d5]">verified</span>
                <span>Laboratory Tested Pre-Shrunk</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details & Buying Actions (5 cols on desktop, sticky) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-[128px]">
            {/* Header Info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#0051d5] font-bold">
                    ZEN X ESSENTIALS
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0051d5] bg-[#0051d5]/10 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
                <span className="bg-[#e7e8e9] px-2 py-0.5 rounded text-[11px] uppercase text-[#45464c] font-semibold">
                  {product.fitTag}
                </span>
              </div>

              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#191c1d] tracking-tight leading-snug">
                {product.name} - {selectedColor}
              </h1>

              {/* Rating block */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center bg-[#e7e8e9] px-2.5 py-1 rounded-lg gap-1.5">
                  <span className="text-[13px] font-bold text-[#191c1d]">{product.rating}</span>
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star_half
                    </span>
                  </div>
                </div>
                <span className="text-[#c6c6cd]">|</span>
                <a
                  href="#reviews"
                  className="text-[13px] text-[#45464c] hover:text-[#191c1d] transition-colors underline underline-offset-2"
                >
                  {product.verifiedRatingsCount} Verified Ratings
                </a>
                <span className="text-[#c6c6cd]">/</span>
                <a
                  href="#reviews"
                  className="text-[13px] text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  {product.reviewCount} Reviews
                </a>
              </div>
            </div>

            {/* Pricing Block */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e1e3e4] flex flex-col gap-1.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[32px] text-[#191c1d] font-bold">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[18px] line-through text-[#76777d] font-normal">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="bg-[#dbe1ff] text-[#00174b] text-[12px] font-bold px-2.5 py-0.5 rounded-full">
                  Save {product.discountPercent}% (₹{(product.mrp - product.price).toLocaleString('en-IN')} OFF)
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-[#45464c] pt-0.5">
                <span>Inclusive of all taxes</span>
                <span className="text-[#0051d5] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span> Fastest Dispatch: Ships in 24 Hrs
                </span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#191c1d] font-semibold">
                  Color: <span className="font-normal text-[#45464c]">{selectedColor}</span>
                </p>
                <span className="text-[12px] text-[#45464c]">{product.colors.length} Colors Available</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={c.name}
                      title={c.name}
                      className={`w-9 h-9 rounded-full shadow-xs relative transition-all focus:outline-none cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-black ring-offset-2 scale-105'
                          : 'hover:scale-105 border border-black/10'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    ></button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#191c1d] font-semibold">Select Size</p>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="text-[13px] text-[#0051d5] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  <span>Size Chart (Inches/cm)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[50px] h-11 px-3 rounded-lg text-[15px] font-semibold transition-all shadow-xs cursor-pointer border ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-[#191c1d] border-[#e1e3e4] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Sizing Hint */}
              <div className="flex items-center gap-2 bg-[#f3f4f5] p-2.5 px-3 rounded-lg text-[13px] text-[#45464c] border border-[#e1e3e4]">
                <span className="material-symbols-outlined text-[16px] text-[#0051d5] shrink-0">info</span>
                <span>Model is 5'11" wearing Size M for a relaxed boxy fit.</span>
              </div>
            </div>

            {/* Quantity & Primary Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-white rounded-lg shadow-xs border border-[#e1e3e4] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#f3f4f5] transition-colors text-[#191c1d] disabled:opacity-30 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-9 text-center font-bold text-[15px] text-[#191c1d]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#f3f4f5] transition-colors text-[#191c1d] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCartClick}
                  className={`flex-1 h-12 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                    addedFeedback
                      ? 'bg-[#0051d5] text-white'
                      : 'bg-black text-white hover:bg-[#121c28]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {addedFeedback ? 'check' : 'shopping_bag'}
                  </span>
                  <span>
                    {addedFeedback
                      ? 'Added to Cart ✓'
                      : `Add to Cart - ₹${totalItemPrice.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNowClick}
                  className="flex-1 h-12 bg-white text-[#191c1d] border border-black hover:bg-[#f3f4f5] transition-all rounded-xl text-[15px] font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Buy Now</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Add to Wishlist"
                  className="w-12 h-12 bg-white rounded-xl shadow-xs border border-[#e1e3e4] flex items-center justify-center hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[22px] transition-colors ${
                      isWishlisted ? 'text-red-600' : 'text-[#191c1d]'
                    }`}
                    style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {isWishlisted ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e1e3e4] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#191c1d] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0051d5]">local_shipping</span>
                  <span>Check Delivery & COD Availability</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="w-full h-11 px-3 bg-[#f3f4f5] text-[#191c1d] placeholder:text-[#45464c] text-[13px] rounded-lg focus:outline-none focus:bg-white border border-[#e1e3e4]"
                  />
                  {pincodeStatus.valid && pincodeStatus.city && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#45464c] uppercase">
                      {pincodeStatus.city}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCheckPincode}
                  className="h-11 px-5 bg-black text-white text-[13px] font-semibold rounded-lg hover:bg-black/85 transition-colors shrink-0 cursor-pointer"
                >
                  Check
                </button>
              </div>

              {/* Pincode Result Notification */}
              {pincodeStatus.valid ? (
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#f3f4f5] text-[13px] text-[#191c1d] border border-[#e1e3e4]">
                  <div className="flex items-center gap-2 text-[#0051d5] font-semibold">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{pincodeStatus.message}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[#45464c] text-[12px] pl-6 pt-0.5">
                    <span>✓ Cash on Delivery available</span>
                    <span>✓ Free Shipping on this order</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-red-50 text-[13px] text-red-600 flex items-center gap-2 border border-red-200">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{pincodeStatus.message}</span>
                </div>
              )}
            </div>

            {/* Key Bullet Highlights */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e1e3e4]">
              <h2 className="text-[12px] font-bold text-[#191c1d] uppercase tracking-wider mb-3">
                Key Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-[#191c1d]">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#0051d5] text-[18px] shrink-0 mt-0.5">
                      check
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collapsible Accordions */}
            <div className="flex flex-col gap-2">
              {/* Accordion 1: Description */}
              <div className="bg-white rounded-xl shadow-xs border border-[#e1e3e4] overflow-hidden">
                <button
                  onClick={() =>
                    setAccordionOpen((prev) => ({ ...prev, desc: !prev.desc }))
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-[14px] font-semibold text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                >
                  <span>Product Description & Fit</span>
                  <span
                    className={`material-symbols-outlined text-[#76777d] transition-transform duration-300 ${
                      accordionOpen.desc ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.desc && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-[#45464c] flex flex-col gap-2.5 leading-relaxed">
                    {product.description.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: Care */}
              <div className="bg-white rounded-xl shadow-xs border border-[#e1e3e4] overflow-hidden">
                <button
                  onClick={() =>
                    setAccordionOpen((prev) => ({ ...prev, care: !prev.care }))
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-[14px] font-semibold text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                >
                  <span>Fabric & Care Instructions</span>
                  <span
                    className={`material-symbols-outlined text-[#76777d] transition-transform duration-300 ${
                      accordionOpen.care ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.care && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-[#45464c]">
                    <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                      {product.careInstructions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Returns */}
              <div className="bg-white rounded-xl shadow-xs border border-[#e1e3e4] overflow-hidden">
                <button
                  onClick={() =>
                    setAccordionOpen((prev) => ({ ...prev, returns: !prev.returns }))
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-[14px] font-semibold text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                >
                  <span>7-Day Free Returns & Exchange Policy</span>
                  <span
                    className={`material-symbols-outlined text-[#76777d] transition-transform duration-300 ${
                      accordionOpen.returns ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.returns && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-[#45464c] flex flex-col gap-2 leading-relaxed">
                    {product.returnsPolicy.map((r, i) => (
                      <p key={i}>{r}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal isOpen={isSizeModalOpen} onClose={() => setIsSizeModalOpen(false)} />
    </div>
  );
};
