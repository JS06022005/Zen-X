import React from 'react';

interface FilterSidebarProps {
  // Gender
  selectedGender: 'all' | 'men' | 'women';
  onSelectGender: (gender: 'all' | 'men' | 'women') => void;
  // Category
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  // Sizes
  selectedSize: string | null;
  onSelectSize: (size: string | null) => void;
  // Colors
  selectedColor: string | null;
  onSelectColor: (color: string | null) => void;
  // Price Range
  priceRange: string | null;
  onSelectPriceRange: (range: string | null) => void;
  // Clear
  onClearAll: () => void;
  activeFilterCount: number;
  // Mobile drawer controls
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const COLOR_OPTIONS = [
  { name: 'Onyx Black', hex: '#111827' },
  { name: 'Off White', hex: '#F3F4F6' },
  { name: 'Sage Green', hex: '#7D8F7B' },
  { name: 'Slate Charcoal', hex: '#475569' },
  { name: 'Warm Sand', hex: '#D7C9B1' },
  { name: 'Heather Grey', hex: '#9CA3AF' },
  { name: 'Navy Blue', hex: '#1E293B' },
  { name: 'Olive Green', hex: '#525E4D' },
  { name: 'Terracotta', hex: '#B85D3B' },
  { name: 'Espresso Brown', hex: '#3E2723' },
  { name: 'Oatmeal Melange', hex: '#E3DFD5' },
  { name: 'Washed Khaki', hex: '#C3B091' },
];

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedGender,
  onSelectGender,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  selectedSize,
  onSelectSize,
  selectedColor,
  onSelectColor,
  priceRange,
  onSelectPriceRange,
  onClearAll,
  activeFilterCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col gap-6">
      {/* Header with Title and Clear button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#edeeef]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#191c1d]">tune</span>
          <span className="font-bold text-[15px] text-[#191c1d]">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[12px] text-[#0051d5] font-semibold hover:underline cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. Gender Target Filter */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[12px] font-bold uppercase tracking-wider text-[#45464c]">
          Gender / Collection
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f3f4f5] rounded-xl">
          <button
            onClick={() => onSelectGender('all')}
            className={`py-1.5 text-[12px] rounded-lg font-medium transition-all cursor-pointer ${
              selectedGender === 'all'
                ? 'bg-white text-black font-bold shadow-2xs'
                : 'text-[#45464c] hover:text-[#191c1d]'
            }`}
          >
            All ({categoryCounts.all || 0})
          </button>
          <button
            onClick={() => onSelectGender('men')}
            className={`py-1.5 text-[12px] rounded-lg font-medium transition-all cursor-pointer ${
              selectedGender === 'men'
                ? 'bg-black text-white font-bold shadow-2xs'
                : 'text-[#45464c] hover:text-[#191c1d]'
            }`}
          >
            Men ({categoryCounts.men || 0})
          </button>
          <button
            onClick={() => onSelectGender('women')}
            className={`py-1.5 text-[12px] rounded-lg font-medium transition-all cursor-pointer ${
              selectedGender === 'women'
                ? 'bg-black text-white font-bold shadow-2xs'
                : 'text-[#45464c] hover:text-[#191c1d]'
            }`}
          >
            Women ({categoryCounts.women || 0})
          </button>
        </div>
      </div>

      {/* 2. Department / Categories */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold uppercase tracking-wider text-[#45464c]">
          Categories ({4})
        </label>
        <div className="flex flex-col gap-1">
          {[
            { id: 'all', name: 'All Departments' },
            { id: 'Oversized T-Shirts', name: 'Oversized T-Shirts' },
            { id: 'Classic Tees', name: 'Classic Tees & Tops' },
            { id: 'Hoodies & Sweatshirts', name: 'Hoodies & Sweatshirts' },
            { id: 'Joggers & Cargo', name: 'Joggers & Cargo Pants' },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = cat.id === 'all' ? categoryCounts.all : categoryCounts[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-black text-white font-semibold'
                    : 'text-[#191c1d] hover:bg-[#f3f4f5]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#f3f4f5] text-[#76777d]'
                  }`}
                >
                  {count || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sizes Filter */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#45464c]">
            Sizes
          </label>
          {selectedSize && (
            <button
              onClick={() => onSelectSize(null)}
              className="text-[11px] text-[#0051d5] font-semibold hover:underline cursor-pointer"
            >
              Clear Size
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZE_OPTIONS.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSelectSize(isSelected ? null : size)}
                className={`h-9 rounded-xl text-[12px] font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-[#191c1d] border-[#e1e3e4] hover:border-black'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Colors Filter */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#45464c]">
            Colors
          </label>
          {selectedColor && (
            <button
              onClick={() => onSelectColor(null)}
              className="text-[11px] text-[#0051d5] font-semibold hover:underline cursor-pointer"
            >
              Clear Color
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
          {COLOR_OPTIONS.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={() => onSelectColor(isSelected ? null : color.name)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0051d5]/10 text-[#0051d5] font-semibold border border-[#0051d5]/30'
                    : 'text-[#191c1d] hover:bg-[#f3f4f5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-[#0051d5]">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Range Filter */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#45464c]">
            Price Range
          </label>
          {priceRange && (
            <button
              onClick={() => onSelectPriceRange(null)}
              className="text-[11px] text-[#0051d5] font-semibold hover:underline cursor-pointer"
            >
              Clear Price
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { id: null, label: 'All Prices' },
            { id: 'under-799', label: 'Under ₹799' },
            { id: '800-1299', label: '₹800 – ₹1,299' },
            { id: '1300-1699', label: '₹1,300 – ₹1,699' },
            { id: '1700+', label: '₹1,700+' },
          ].map((tier) => {
            const isSelected = priceRange === tier.id;
            return (
              <button
                key={tier.label}
                onClick={() => onSelectPriceRange(tier.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e7e8e9]'
                }`}
              >
                <span>{tier.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-[132px] bg-white p-5 rounded-3xl border border-[#e1e3e4] shadow-xs">
          {content}
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
            {/* Mobile Header */}
            <div className="p-4 border-b border-[#edeeef] flex items-center justify-between">
              <span className="font-bold text-[16px] text-[#191c1d]">Filter Products</span>
              <button
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-full bg-[#f3f4f5] flex items-center justify-center text-[#191c1d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto p-5">{content}</div>

            {/* Sticky Mobile Apply Button */}
            <div className="p-4 border-t border-[#edeeef] bg-white">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-black text-white font-semibold rounded-xl text-[14px] shadow-sm hover:bg-[#121c28] cursor-pointer"
              >
                Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
