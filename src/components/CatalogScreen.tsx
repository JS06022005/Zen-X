import React, { useState, useMemo } from 'react';
import { Product, Screen } from '../types';
import { FilterSidebar } from './FilterSidebar';

interface CatalogScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onNavigate: (screen: Screen) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onNavigate,
}) => {
  const [columns, setColumns] = useState<3 | 4>(3);
  const [sortBy, setSortBy] = useState<'popularity' | 'low-high' | 'high-low' | 'newest' | 'rating'>('popularity');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'categorized' | 'grid'>('categorized');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Defined Category Departments Metadata
  const CATEGORY_SECTIONS = [
    {
      id: 'Oversized T-Shirts',
      name: 'Oversized T-Shirts',
      shortName: 'Oversized Tees',
      tagline: 'Calibrated cuts, drop-shoulder posture, and 240 GSM organic combed weave.',
      badge: '240 GSM Heavyweight',
      icon: 'checkroom',
    },
    {
      id: 'Classic Tees',
      name: 'Classic Tees & Long Sleeves',
      shortName: 'Classic Tees',
      tagline: '100% Peruvian Pima long-staple cotton and tactile thermal waffle weaves.',
      badge: 'Peruvian Pima Cotton',
      icon: 'styler',
    },
    {
      id: 'Hoodies & Sweatshirts',
      name: 'Hoodies & Sweatshirts',
      shortName: 'Hoodies & Sweats',
      tagline: 'Heavyweight 380-400 GSM loopback French terry with double-lined architectural hoods.',
      badge: '380-400 GSM Loopback',
      icon: 'layers',
    },
    {
      id: 'Joggers & Cargo',
      name: 'Joggers & Cargo Pants',
      shortName: 'Joggers & Cargo',
      tagline: '280-340 GSM heavy twill canvas and brushed fleece with streamlined flat pockets.',
      badge: 'Twill & Brushed Fleece',
      icon: 'straighten',
    },
  ];

  // Dynamic category counts
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      'Oversized T-Shirts': products.filter((p) => p.category === 'Oversized T-Shirts').length,
      'Classic Tees': products.filter((p) => p.category === 'Classic Tees').length,
      'Hoodies & Sweatshirts': products.filter((p) => p.category === 'Hoodies & Sweatshirts').length,
      'Joggers & Cargo': products.filter((p) => p.category === 'Joggers & Cargo').length,
      men: products.filter((p) => p.gender.includes('men')).length,
      women: products.filter((p) => p.gender.includes('women')).length,
    };
  }, [products]);

  // Synchronize category or gender if activeCategory is 'men' or 'women'
  const effectiveGender = useMemo(() => {
    if (activeCategory === 'men') return 'men';
    if (activeCategory === 'women') return 'women';
    return selectedGender;
  }, [activeCategory, selectedGender]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.name.toLowerCase().includes(q);
          const matchColor = p.colorName.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchColor && !matchCat) return false;
        }

        // Gender filter
        if (effectiveGender !== 'all') {
          if (!p.gender.includes(effectiveGender)) return false;
        }

        // Category filter
        if (
          activeCategory !== 'all' &&
          activeCategory !== 'men' &&
          activeCategory !== 'women'
        ) {
          if (activeCategory === 'new-arrivals') {
            if (p.discountPercent < 35) return false;
          } else if (p.category !== activeCategory) {
            return false;
          }
        }

        // Size filter
        if (selectedSize && !p.sizes.includes(selectedSize)) {
          return false;
        }

        // Color filter
        if (selectedColor && !p.colorName.toLowerCase().includes(selectedColor.toLowerCase())) {
          return false;
        }

        // Price filter
        if (priceRange === 'under-799' && p.price > 799) return false;
        if (priceRange === '800-1299' && (p.price < 800 || p.price > 1299)) return false;
        if (priceRange === '1300-1699' && (p.price < 1300 || p.price > 1699)) return false;
        if (priceRange === '1700+' && p.price < 1700) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price - b.price;
        if (sortBy === 'high-low') return b.price - a.price;
        if (sortBy === 'newest') return b.verifiedRatingsCount - a.verifiedRatingsCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount; // Popularity
      });
  }, [products, searchQuery, effectiveGender, activeCategory, selectedSize, selectedColor, priceRange, sortBy]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (effectiveGender !== 'all') count++;
    if (activeCategory !== 'all' && activeCategory !== 'men' && activeCategory !== 'women') count++;
    if (selectedSize) count++;
    if (selectedColor) count++;
    if (priceRange) count++;
    return count;
  }, [effectiveGender, activeCategory, selectedSize, selectedColor, priceRange]);

  const clearAllFilters = () => {
    setSelectedGender('all');
    onSelectCategory('all');
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange(null);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, product.sizes[0], product.colorName);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  const handleShopCategory = (cat: 'men' | 'women') => {
    setSelectedGender(cat);
    onSelectCategory(cat);
    setTimeout(() => {
      const el = document.getElementById('catalog-products-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Reusable Product Card Component
  const renderProductCard = (product: Product) => {
    const isWishlisted = wishlistIds.includes(product.id);
    const isJustAdded = addedProductId === product.id;

    return (
      <article
        key={product.id}
        onClick={() => onSelectProduct(product)}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-[#e1e3e4] cursor-pointer"
      >
        {/* Product Card Image Container */}
        <div className="relative aspect-[4/5] bg-[#f3f4f5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Discount Badge */}
          <span
            className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              product.discountPercent >= 35
                ? 'bg-[#0051d5] text-white'
                : 'bg-black text-white'
            }`}
          >
            {product.badge || `${product.discountPercent}% OFF`}
          </span>

          {/* Gender Pill Badge */}
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#191c1d] shadow-2xs">
            {product.gender.includes('men') && !product.gender.includes('women')
              ? 'Men'
              : product.gender.includes('women') && !product.gender.includes('men')
              ? 'Women'
              : 'Unisex'}
          </span>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label="Add to Wishlist"
            className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-white text-red-600 shadow-sm'
                : 'bg-white/80 text-[#191c1d] hover:bg-white hover:text-red-500'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>

          {/* Hover Quick Add Overlay */}
          <div className="absolute bottom-3 right-3 hidden group-hover:flex items-center justify-center transition-all">
            <button
              onClick={(e) => handleQuickAdd(e, product)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isJustAdded
                  ? 'bg-[#0051d5] text-white'
                  : 'bg-black text-white hover:bg-[#121c28]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isJustAdded ? 'check' : 'shopping_bag'}
              </span>
              <span>{isJustAdded ? 'Added' : 'Quick Add'}</span>
            </button>
          </div>
        </div>

        {/* Product Metadata & Price */}
        <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
          <div className="flex flex-col gap-1.5">
            {/* Category tag & Rating */}
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0051d5] bg-[#0051d5]/8 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[#0051d5]">
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-[12px] font-bold text-[#191c1d]">{product.rating}</span>
                <span className="text-[11px] text-[#76777d]">({product.verifiedRatingsCount})</span>
              </div>
            </div>

            <h2 className="text-[14px] sm:text-[15px] font-semibold text-[#191c1d] line-clamp-1 group-hover:text-[#0051d5] transition-colors">
              {product.name}
            </h2>

            <p className="text-[12px] text-[#45464c] line-clamp-1">
              {product.colorName} • {product.subtitle}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2 border-t border-[#f0f1f2]">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[16px] sm:text-[18px] text-[#191c1d] font-bold">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[12px] sm:text-[13px] text-[#76777d] line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Color Swatch Indicators */}
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 3).map((col, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full shadow-2xs border ${
                      idx === 0 ? 'ring-1 ring-black' : 'border-black/20'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[#45464c] text-[11px] uppercase tracking-wide">
              <span>
                Sizes: <strong className="text-[#191c1d]">{product.sizes.slice(0, 4).join(', ')}</strong>
              </span>
              <span className="text-[11px] text-[#0051d5] font-semibold">{product.specs.gsm}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const isSpecificCategory =
    activeCategory !== 'all' &&
    activeCategory !== 'men' &&
    activeCategory !== 'women';

  return (
    <div className="flex flex-col w-full">
      {/* Minimalist Hero Banner */}
      <section className="relative w-full bg-[#f3f4f5] px-4 md:px-8 lg:px-12 py-8 md:py-12 overflow-hidden border-b border-[#e7e8e9]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#191c1d] rounded-full shadow-xs border border-[#e1e3e4]">
              <span className="w-2 h-2 rounded-full bg-[#0051d5]"></span>
              <span className="text-[11px] uppercase tracking-wider text-[#45464c] font-semibold">
                SS/25 Drop Live • {products.length} Curated Essentials
              </span>
            </div>

            <h1 className="text-[34px] sm:text-[44px] lg:text-[48px] leading-[1.1] text-[#191c1d] font-bold tracking-tight">
              Everyday Modern Streetwear
            </h1>

            <p className="text-[15px] sm:text-[17px] text-[#45464c] max-w-xl leading-relaxed">
              Crafted with 100% Combed Cotton, calibrated cuts, and ultra-heavyweight knit architecture. Starting at ₹649.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleShopCategory('men')}
                className={`inline-flex items-center justify-center h-11 px-5 text-[13px] font-semibold rounded-xl transition-all active:scale-[0.99] shadow-sm cursor-pointer ${
                  effectiveGender === 'men'
                    ? 'bg-[#0051d5] text-white ring-2 ring-offset-2 ring-[#0051d5]'
                    : 'bg-black text-white hover:bg-[#121c28]'
                }`}
              >
                Shop Men ({categoryCounts.men})
                <span className="material-symbols-outlined text-[16px] ml-1.5">arrow_forward</span>
              </button>
              <button
                onClick={() => handleShopCategory('women')}
                className={`inline-flex items-center justify-center h-11 px-5 text-[13px] font-semibold rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                  effectiveGender === 'women'
                    ? 'bg-[#0051d5] text-white border-[#0051d5] ring-2 ring-offset-2 ring-[#0051d5]'
                    : 'bg-white text-[#191c1d] border-[#e1e3e4] hover:bg-[#e7e8e9]'
                }`}
              >
                Shop Women ({categoryCounts.women})
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div
              onClick={() => onSelectProduct(products[0])}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-[#edeeef] cursor-pointer group"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Minimalist lookbook shot featuring neutral streetwear cotton essentials"
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-between shadow-sm border border-white/60">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#f3f4f5] text-[#191c1d] material-symbols-outlined text-[18px]">
                    local_fire_department
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-[#191c1d]">New Heavyweight Drop</p>
                    <p className="text-[11px] text-[#45464c]">100% Combed Cotton Architecture</p>
                  </div>
                </div>
                <span className="text-[14px] text-[#191c1d] font-bold">₹649+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Container with Left Filtering Sidebar */}
      <section id="catalog-products-section" className="w-full px-4 md:px-8 lg:px-12 py-8 scroll-mt-28">
        <div className="max-w-[1440px] mx-auto flex items-start gap-8">
          {/* Desktop Left Filtering Sidebar */}
          <FilterSidebar
            selectedGender={effectiveGender}
            onSelectGender={(g) => {
              setSelectedGender(g);
              if (activeCategory === 'men' || activeCategory === 'women') {
                onSelectCategory('all');
              }
            }}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
            categoryCounts={categoryCounts}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            priceRange={priceRange}
            onSelectPriceRange={setPriceRange}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar: Search, Sort Dropdown & Layout */}
            <div className="mb-6 p-4 bg-white rounded-2xl border border-[#e1e3e4] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Mobile Filters button & Active Counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-black text-white text-[13px] font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>

                <p className="text-[13px] text-[#45464c]">
                  Showing <strong className="text-[#191c1d]">{filteredProducts.length}</strong> styles
                  {effectiveGender !== 'all' ? ` for ${effectiveGender === 'men' ? "Men" : "Women"}` : ''}
                </p>
              </div>

              {/* Right: Sorting Dropdown & View Mode Switcher */}
              <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
                {/* View Mode: Categorized vs Grid */}
                <div className="flex items-center gap-1 bg-[#f3f4f5] p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('categorized')}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'categorized'
                        ? 'bg-white text-black shadow-xs font-semibold'
                        : 'text-[#45464c] hover:text-[#191c1d]'
                    }`}
                    title="View categorized by department"
                  >
                    <span className="material-symbols-outlined text-[16px]">category</span>
                    <span className="hidden sm:inline">By Department</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-black shadow-xs font-semibold'
                        : 'text-[#45464c] hover:text-[#191c1d]'
                    }`}
                    title="View all in compact grid"
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                    <span className="hidden sm:inline">Compact Grid</span>
                  </button>
                </div>

                {/* Sorting Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="catalog-sort" className="text-[12px] font-bold uppercase tracking-wider text-[#45464c] hidden sm:inline">
                    Sort:
                  </label>
                  <div className="relative">
                    <select
                      id="catalog-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="h-10 pl-3 pr-8 bg-[#f3f4f5] text-[#191c1d] text-[13px] font-semibold rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer border-0"
                    >
                      <option value="popularity">Popularity (Recommended)</option>
                      <option value="low-high">Price: Low to High</option>
                      <option value="high-low">Price: High to Low</option>
                      <option value="newest">Newest Drops</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-[#76777d] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Grid Columns Toggle (3 vs 4) */}
                <div className="hidden xl:flex items-center gap-1 bg-[#f3f4f5] p-1 rounded-xl">
                  <button
                    onClick={() => setColumns(3)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      columns === 3
                        ? 'bg-white text-black shadow-xs font-semibold'
                        : 'text-[#45464c] hover:text-[#191c1d]'
                    }`}
                    title="3 Column View"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_column</span>
                  </button>
                  <button
                    onClick={() => setColumns(4)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      columns === 4
                        ? 'bg-white text-black shadow-xs font-semibold'
                        : 'text-[#45464c] hover:text-[#191c1d]'
                    }`}
                    title="4 Column View"
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Summary Chips */}
            {activeFilterCount > 0 && (
              <div className="mb-6 flex items-center gap-2 flex-wrap bg-white p-3 rounded-2xl border border-[#e1e3e4]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464c]">
                  Active Filters:
                </span>
                {effectiveGender !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f5] text-[#191c1d] rounded-lg text-[12px] font-medium">
                    <span>{effectiveGender === 'men' ? 'Men' : 'Women'}</span>
                    <button
                      onClick={() => {
                        setSelectedGender('all');
                        if (activeCategory === 'men' || activeCategory === 'women') {
                          onSelectCategory('all');
                        }
                      }}
                      className="material-symbols-outlined text-[14px] hover:text-red-600 cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                )}
                {isSpecificCategory && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f5] text-[#191c1d] rounded-lg text-[12px] font-medium">
                    <span>{activeCategory}</span>
                    <button
                      onClick={() => onSelectCategory('all')}
                      className="material-symbols-outlined text-[14px] hover:text-red-600 cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                )}
                {selectedSize && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f5] text-[#191c1d] rounded-lg text-[12px] font-medium">
                    <span>Size: {selectedSize}</span>
                    <button
                      onClick={() => setSelectedSize(null)}
                      className="material-symbols-outlined text-[14px] hover:text-red-600 cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                )}
                {selectedColor && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f5] text-[#191c1d] rounded-lg text-[12px] font-medium">
                    <span>Color: {selectedColor}</span>
                    <button
                      onClick={() => setSelectedColor(null)}
                      className="material-symbols-outlined text-[14px] hover:text-red-600 cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                )}
                {priceRange && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f5] text-[#191c1d] rounded-lg text-[12px] font-medium">
                    <span>
                      {priceRange === 'under-799'
                        ? 'Under ₹799'
                        : priceRange === '800-1299'
                        ? '₹800–₹1,299'
                        : priceRange === '1300-1699'
                        ? '₹1,300–₹1,699'
                        : '₹1,700+'}
                    </span>
                    <button
                      onClick={() => setPriceRange(null)}
                      className="material-symbols-outlined text-[14px] hover:text-red-600 cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-[12px] text-[#0051d5] font-semibold hover:underline cursor-pointer ml-auto"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-[#e1e3e4] p-8 shadow-xs">
                <span className="material-symbols-outlined text-[48px] text-[#76777d] mb-3">search_off</span>
                <h3 className="text-[18px] font-bold text-[#191c1d] mb-2">No matching products found</h3>
                <p className="text-[14px] text-[#45464c] mb-6 max-w-md mx-auto">
                  Try clearing some of your active size or color filters to discover more items in the collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-black text-white font-semibold rounded-xl text-[13px] hover:bg-[#121c28] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'categorized' && (activeCategory === 'all' || activeCategory === 'men' || activeCategory === 'women') ? (
              /* Categorized Department Sections */
              <div className="flex flex-col gap-10">
                {CATEGORY_SECTIONS.map((section) => {
                  const sectionProducts = filteredProducts.filter(
                    (p) => p.category === section.id
                  );

                  if (sectionProducts.length === 0) return null;

                  return (
                    <div
                      key={section.id}
                      className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e1e3e4] shadow-xs"
                    >
                      {/* Department Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#edeeef]">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#191c1d] tracking-tight">
                                {section.name}
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0051d5]/10 text-[#0051d5] border border-[#0051d5]/20">
                                {section.badge}
                              </span>
                              <span className="text-[12px] text-[#76777d] font-medium">
                                ({sectionProducts.length} styles)
                              </span>
                            </div>
                            <p className="text-[13px] text-[#45464c] mt-0.5 leading-relaxed">
                              {section.tagline}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectCategory(section.id);
                            const el = document.getElementById('catalog-products-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0051d5] hover:text-[#003da8] hover:underline self-start sm:self-auto cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#f3f4f5]"
                        >
                          <span>Filter Only {section.shortName}</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>

                      {/* Products Grid */}
                      <div
                        className={`grid grid-cols-2 md:grid-cols-2 ${
                          columns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
                        } gap-3 md:gap-5`}
                      >
                        {sectionProducts.map((product) => renderProductCard(product))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Flat Continuous Grid */
              <div
                className={`grid grid-cols-2 md:grid-cols-2 ${
                  columns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
                } gap-3 md:gap-5`}
              >
                {filteredProducts.map((product) => renderProductCard(product))}
              </div>
            )}

            {/* Pagination Bar */}
            <div className="mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#e1e3e4]">
              <p className="text-[13px] text-[#45464c]">
                Showing <strong className="text-[#191c1d]">{filteredProducts.length}</strong> of{' '}
                <strong className="text-[#191c1d]">{products.length}</strong> curated styles
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePage(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  className="w-9 h-9 rounded-xl bg-[#f3f4f5] text-[#191c1d] flex items-center justify-center hover:bg-[#e7e8e9] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {[1, 2].map((page) => (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className={`w-9 h-9 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                      activePage === page
                        ? 'bg-black text-white'
                        : 'bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e7e8e9]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setActivePage(Math.min(2, activePage + 1))}
                  disabled={activePage === 2}
                  className="w-9 h-9 rounded-xl bg-[#f3f4f5] text-[#191c1d] flex items-center justify-center hover:bg-[#e7e8e9] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Features Strip */}
      <section className="w-full px-4 md:px-8 lg:px-12 pt-6 pb-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#e1e3e4]">
            <div className="w-12 h-12 rounded-xl bg-[#f3f4f5] flex items-center justify-center text-black shrink-0">
              <span className="material-symbols-outlined text-[24px]">eco</span>
            </div>
            <div>
              <h3 className="text-[14px] text-[#191c1d] font-bold">100% Combed Cotton</h3>
              <p className="text-[12px] text-[#45464c]">Sustainably sourced, zero chemical irritation</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#e1e3e4]">
            <div className="w-12 h-12 rounded-xl bg-[#f3f4f5] flex items-center justify-center text-black shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <h3 className="text-[14px] text-[#191c1d] font-bold">Free Delivery &gt; ₹999</h3>
              <p className="text-[12px] text-[#45464c]">Express courier to 19,000+ PIN codes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#e1e3e4]">
            <div className="w-12 h-12 rounded-xl bg-[#f3f4f5] flex items-center justify-center text-black shrink-0">
              <span className="material-symbols-outlined text-[24px]">sync</span>
            </div>
            <div>
              <h3 className="text-[14px] text-[#191c1d] font-bold">7-Day Easy Returns</h3>
              <p className="text-[12px] text-[#45464c]">Doorstep size exchange and UPI refund</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#e1e3e4]">
            <div className="w-12 h-12 rounded-xl bg-[#f3f4f5] flex items-center justify-center text-black shrink-0">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div>
              <h3 className="text-[14px] text-[#191c1d] font-bold">Cash on Delivery</h3>
              <p className="text-[12px] text-[#45464c]">Pay upon package delivery at your door</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
