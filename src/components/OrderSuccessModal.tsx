import React from 'react';
import { DeliveryAddress, Screen } from '../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: DeliveryAddress;
  totalAmount: number;
  onNavigate: (screen: Screen) => void;
  orderId?: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  address,
  totalAmount,
  onNavigate,
  orderId: propOrderId,
}) => {
  if (!isOpen) return null;

  const orderId = propOrderId || 'ZX-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-[#e1e3e4]">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-[#dbe1ff] text-[#0051d5] flex items-center justify-center mb-4 ring-8 ring-[#dbe1ff]/30">
          <span className="material-symbols-outlined text-[36px]">check</span>
        </div>

        <span className="text-[11px] uppercase tracking-widest text-[#0051d5] font-bold">
          Payment Successful
        </span>
        <h2 className="text-[24px] font-bold text-[#191c1d] mt-1 mb-2">Order Confirmed!</h2>
        <p className="text-[13px] text-[#45464c] max-w-sm mb-6">
          Thank you for choosing ZEN X APPAREL. Your package is scheduled for express courier pickup in plastic-free packaging.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-[#f3f4f5] rounded-xl p-4 text-left flex flex-col gap-2.5 text-[13px] border border-[#e1e3e4] mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#e7e8e9]">
            <span className="text-[#45464c]">Order Reference</span>
            <span className="font-bold text-[#191c1d] font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#45464c]">Estimated Delivery</span>
            <span className="font-semibold text-[#191c1d]">Thursday (2-3 Days)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#45464c]">Delivering To</span>
            <span className="font-semibold text-[#191c1d] truncate max-w-[200px]">
              {address.fullName}, {address.city}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#e7e8e9]">
            <span className="text-[#45464c]">Amount Paid</span>
            <span className="font-bold text-[#0051d5] text-[15px]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => {
              onClose();
              onNavigate('catalog');
            }}
            className="flex-1 py-3 bg-black hover:bg-black/85 text-white font-semibold text-[13px] rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate('account');
            }}
            className="flex-1 py-3 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] font-semibold text-[13px] rounded-xl transition-all cursor-pointer border border-[#e1e3e4]"
          >
            Track in My Account
          </button>
        </div>
      </div>
    </div>
  );
};
