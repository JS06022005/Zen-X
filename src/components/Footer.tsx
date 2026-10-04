import React from 'react';
import { Screen } from '../types';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="w-full bg-[#ffffff] shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-12">
      {/* 3-Column Reassurance Strip */}
      <div className="bg-[#f3f4f5] py-4 px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <span className="material-symbols-outlined text-[#0051d5] text-[22px]">check_circle</span>
            <div>
              <p className="text-[14px] font-semibold text-[#191c1d]">100% Pure Combed Cotton</p>
              <p className="text-[13px] text-[#45464c]">Sustainably farmed, ultra-soft long staple yarn</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <span className="material-symbols-outlined text-[#0051d5] text-[22px]">autorenew</span>
            <div>
              <p className="text-[14px] font-semibold text-[#191c1d]">7-Day Hassle-Free Returns</p>
              <p className="text-[13px] text-[#45464c]">Doorstep reverse pickups across 19,000+ pin codes</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <span className="material-symbols-outlined text-[#0051d5] text-[22px]">verified_user</span>
            <div>
              <p className="text-[14px] font-semibold text-[#191c1d]">100% Secure SSL Checkout</p>
              <p className="text-[13px] text-[#45464c]">Encrypted transactions with zero-fraud liability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold tracking-tight text-[#191c1d]">
                ZEN X APPAREL
              </span>
            </div>
            <p className="text-[14px] text-[#45464c] leading-relaxed max-w-sm">
              Everyday modern minimalist essentials crafted for comfort and durability. Precision patterns, heavyweight weaves, and enduring craftsmanship.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="material-symbols-outlined text-[#45464c] text-[18px]">support_agent</span>
              <span className="text-[13px] text-[#45464c]">care@zenxapparel.in (Mon-Sat, 9AM-8PM)</span>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-[#191c1d] mb-4 uppercase tracking-wider">
              Shop Essentials
            </p>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('men');
                    onNavigate('catalog');
                  }}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Shop Men
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('women');
                    onNavigate('catalog');
                  }}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Shop Women
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Oversized T-Shirts');
                    onNavigate('catalog');
                  }}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Oversized T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Classic Tees');
                    onNavigate('catalog');
                  }}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Classic Tees & Tops
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Hoodies & Sweatshirts');
                    onNavigate('catalog');
                  }}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Hoodies & Sweatshirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Joggers & Cargo');
                    onNavigate('catalog');
                  }}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Joggers & Cargo Pants
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-[#191c1d] mb-4 uppercase tracking-wider">
              Customer Care
            </p>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <button
                  onClick={() => onNavigate('checkout')}
                  className="text-[#45464c] hover:text-[#191c1d] transition-colors"
                >
                  Track Order
                </button>
              </li>
              <li>
                <a href="#return" className="text-[#45464c] hover:text-[#191c1d] transition-colors">
                  Return & Exchange Policy
                </a>
              </li>
              <li>
                <a href="#shipping" className="text-[#45464c] hover:text-[#191c1d] transition-colors">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="#faqs" className="text-[#45464c] hover:text-[#191c1d] transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#support" className="text-[#45464c] hover:text-[#191c1d] transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-[#191c1d] mb-4 uppercase tracking-wider">
              Accepted Payments
            </p>
            <div className="flex flex-wrap gap-2">
              {['UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'Cash on Delivery'].map(
                (p) => (
                  <span
                    key={p}
                    className="px-2 py-1 bg-[#edeeef] text-[#191c1d] text-[11px] font-semibold rounded"
                  >
                    {p}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#edeeef] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#45464c]">
          <p>© 2025 ZEN X APPAREL Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#191c1d] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#191c1d] transition-colors">
              Terms of Service
            </a>
            <a href="#sitemap" className="hover:text-[#191c1d] transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
