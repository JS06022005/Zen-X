import React, { useState } from 'react';
import { CartItem, DeliveryAddress, PaymentMethodType, Screen } from '../types';

interface CheckoutScreenProps {
  items: CartItem[];
  address: DeliveryAddress;
  onUpdateAddress: (address: DeliveryAddress) => void;
  appliedPromo: string;
  onRemovePromo: () => void;
  onPaymentSuccess: () => void;
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  items,
  address,
  onUpdateAddress,
  appliedPromo,
  onRemovePromo,
  onPaymentSuccess,
  onNavigate,
  onGoBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [upiMode, setUpiMode] = useState<'vpa' | 'qr'>('vpa');
  const [upiVpa, setUpiVpa] = useState('priya@okhdfcbank');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<DeliveryAddress>(address);
  const [cardNumber, setCardNumber] = useState('4532 8921 7842 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('821');
  const [cardName, setCardName] = useState('Priya Sharma');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financials
  const itemsTotalMrp = 4797;
  const promoDiscount = appliedPromo ? 2099 : 0;
  const baseTotal = 2698;
  const codFee = selectedMethod === 'cod' ? 40 : 0;
  const totalPayable = (appliedPromo ? baseTotal : itemsTotalMrp - 1800) + codFee;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAddress(addressForm);
    setIsAddressModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9fa]">
      {/* Minimalist Checkout Navigation Bar */}
      <header className="w-full bg-white shadow-xs border-b border-[#e1e3e4]">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo and Go Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] text-[13px] font-semibold transition-all cursor-pointer border border-[#e1e3e4] shadow-2xs mr-1 active:scale-[0.98]"
              title="Go Back"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Go Back</span>
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <img
                alt="ZEN X Logo"
                className="h-8 md:h-9 object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1U26kq_Ker2XL1l9R6hTSArJpzyuoAcvGf3v89L8cb7UJ0SCVapM9R8gImHR9QthJes0vdY8VkLlFecONjwn5WHeWcYZZgSgcPQFcde7yvZ_Lg57UNVEXtePSpLJuYXIl-FPnQcOpiX_R6HFCPUhViFk59PlIRPPSLdThbI8f3QtOtrvEE7IWP2y4gr5cFxdnJC1-1Qbnt02WjF8Fr0jSZNl_PoUG7wJ7bduXbnRGstP22qwpOqrHBUu-YA"
              />
            </button>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-[#45464c] uppercase tracking-widest pl-3 border-l border-[#edeeef]">
              Apparel Lab
            </span>
          </div>

          {/* Center Checkout Progress Indicator */}
          <nav aria-label="Checkout Steps" className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center gap-2 text-[#191c1d] cursor-pointer group"
            >
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">
                ✓
              </span>
              <span className="text-[14px] font-medium">1. Delivery</span>
            </button>
            <div className="w-12 h-0.5 bg-black"></div>
            <div className="flex items-center gap-2 text-[#0051d5]">
              <span className="w-6 h-6 rounded-full bg-[#0051d5] text-white flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span className="text-[14px] font-semibold tracking-tight text-[#191c1d]">
                Payment Method
              </span>
            </div>
          </nav>

          {/* Trust Badge & Helpline Support */}
          <div className="flex items-center gap-4 text-[#45464c]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3f4f5] text-[12px] border border-[#e1e3e4]">
              <span
                className="material-symbols-outlined text-[#0051d5] text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="font-medium text-[#191c1d] hidden lg:inline">
                100% Secure Checkout
              </span>
            </div>
            <a
              href="tel:18002081020"
              className="flex items-center gap-1 text-[#45464c] hover:text-[#191c1d] text-[12px] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">support_agent</span>
              <span className="hidden sm:inline">24x7 Helpline</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Visual Stepper Strip */}
      <div className="md:hidden w-full bg-[#edeeef] px-4 py-2.5 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
            ✓
          </span>
          <span className="text-[#191c1d] line-through opacity-75 font-medium">Address</span>
        </div>
        <span className="material-symbols-outlined text-[#76777d] text-sm">arrow_forward</span>
        <div className="flex items-center gap-2 text-[#0051d5]">
          <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center text-[10px] font-bold">
            2
          </span>
          <span className="font-semibold text-[#191c1d]">Select Payment</span>
        </div>
        <span className="material-symbols-outlined text-[#c6c6cd] text-sm">arrow_forward</span>
        <div className="flex items-center gap-1 text-[#45464c] opacity-50">
          <span className="w-5 h-5 rounded-full bg-[#e1e3e4] flex items-center justify-center text-[10px]">
            3
          </span>
          <span>Order Placed</span>
        </div>
      </div>

      {/* Main Multi-Column Content Workspace */}
      <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Checkout Flow & Accordions (7 Columns) */}
          <main className="lg:col-span-7 flex flex-col gap-6">
            {/* STEP 1 SUMMARY: Delivered To (Completed State) */}
            <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e3e4] relative overflow-hidden transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#e7e8e9] text-[#191c1d] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">check</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[16px] font-bold text-[#191c1d]">Delivery Address</h2>
                      <span className="px-2 py-0.5 rounded bg-[#edeeef] text-[#45464c] text-[10px] font-bold uppercase tracking-wider">
                        {address.tag}
                      </span>
                    </div>
                    <p className="text-[15px] font-semibold text-[#191c1d] mt-1">
                      {address.fullName}
                    </p>
                    <p className="text-[13px] text-[#45464c] leading-relaxed">
                      {address.addressLine}, {address.area}, {address.city}, {address.state} — {address.pincode}
                    </p>
                    <p className="text-[13px] text-[#45464c] flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-sm">call</span>
                      {address.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="shrink-0 px-4 py-2 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] text-[13px] font-semibold rounded-lg transition-colors cursor-pointer border border-[#e1e3e4]"
                >
                  Change
                </button>
              </div>
            </section>

            {/* STEP 2: Payment Method Matrix (Active State) */}
            <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e3e4] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#edeeef]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[13px] font-bold">
                    2
                  </div>
                  <div>
                    <h1 className="text-[18px] font-bold text-[#191c1d] tracking-tight">
                      Select Payment Option
                    </h1>
                    <p className="text-[12px] text-[#45464c]">
                      All transactions are encrypted with bank-grade security protocols
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#0051d5] font-semibold uppercase bg-[#dbe1ff]/60 px-2.5 py-1 rounded-full border border-[#dbe1ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span> Instant Confirmation
                </span>
              </div>

              {/* PAYMENT METHODS ACCORDION / TOGGLES */}
              <div className="flex flex-col gap-4">
                {/* OPTION A: UPI (Default & Recommended) */}
                <div
                  onClick={() => setSelectedMethod('upi')}
                  className={`rounded-2xl p-5 cursor-pointer transition-all duration-200 border ${
                    selectedMethod === 'upi'
                      ? 'bg-[#f3f4f5] border-black shadow-xs'
                      : 'bg-white border-[#e1e3e4] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center p-1 border ${
                          selectedMethod === 'upi'
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-[#c6c6cd]'
                        }`}
                      >
                        {selectedMethod === 'upi' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-[#191c1d]">UPI</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[10px] font-bold uppercase tracking-wider">
                            Instant • 0% Fee
                          </span>
                        </div>
                        <p className="text-[13px] text-[#45464c] mt-0.5">
                          Google Pay, PhonePe, Paytm, CRED & Any UPI App
                        </p>
                      </div>
                    </div>
                    {/* UPI Quick App Logos */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-white text-[11px] font-bold text-[#191c1d] border border-[#e1e3e4] shadow-2xs">
                        GPay
                      </span>
                      <span className="px-2.5 py-1 rounded bg-white text-[11px] font-bold text-[#0051d5] border border-[#e1e3e4] shadow-2xs">
                        PhonePe
                      </span>
                      <span className="px-2.5 py-1 rounded bg-white text-[11px] font-bold text-[#191c1d] border border-[#e1e3e4] shadow-2xs hidden sm:inline">
                        Paytm
                      </span>
                    </div>
                  </div>

                  {/* Collapsible Content for UPI */}
                  {selectedMethod === 'upi' && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-5 pt-5 flex flex-col gap-4 bg-white p-5 rounded-xl border border-[#e1e3e4] shadow-xs animate-in fade-in duration-200"
                    >
                      {/* UPI Tab Selector: ID vs QR */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setUpiMode('vpa')}
                          className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                            upiMode === 'vpa'
                              ? 'bg-black text-white'
                              : 'bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e7e8e9]'
                          }`}
                        >
                          Enter UPI ID / VPA
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiMode('qr')}
                          className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                            upiMode === 'qr'
                              ? 'bg-black text-white'
                              : 'bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e7e8e9]'
                          }`}
                        >
                          Scan Dynamic QR
                        </button>
                      </div>

                      {/* UPI Input Section */}
                      {upiMode === 'vpa' ? (
                        <div className="flex flex-col gap-2.5">
                          <label className="text-[12px] font-medium text-[#45464c]">
                            Enter your UPI VPA / Handle
                          </label>
                          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={upiVpa}
                                onChange={(e) => setUpiVpa(e.target.value)}
                                placeholder="e.g. priyasharma@okhdfcbank"
                                className="w-full h-11 px-3.5 bg-[#f3f4f5] rounded-xl text-[14px] text-[#191c1d] focus:outline-none focus:bg-white border border-[#e1e3e4]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0051d5] uppercase tracking-wider">
                                VERIFIED
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handlePay}
                              disabled={isProcessing}
                              className="h-11 px-6 bg-[#0051d5] hover:bg-[#003ea8] text-white text-[13px] font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              <span>
                                {isProcessing
                                  ? 'Connecting to UPI...'
                                  : `Verify & Pay ₹${totalPayable.toLocaleString('en-IN')}`}
                              </span>
                              <span className="material-symbols-outlined text-sm">lock</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[11px] text-[#45464c] font-semibold">
                              Frequent:
                            </span>
                            {['@okicici', '@paytm', '@ybl'].map((h) => (
                              <button
                                key={h}
                                type="button"
                                onClick={() => setUpiVpa(`priya${h}`)}
                                className="px-2 py-0.5 rounded bg-[#f3f4f5] text-[11px] font-semibold text-[#191c1d] hover:bg-[#e7e8e9] border border-[#e1e3e4] cursor-pointer"
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* UPI QR Code Section */
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4]">
                          <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs flex items-center justify-center shrink-0 border border-[#e1e3e4]">
                            <svg className="w-full h-full text-black" viewBox="0 0 120 120" fill="currentColor">
                              <rect x="10" y="10" width="30" height="30" rx="3" fill="currentColor" />
                              <rect x="15" y="15" width="20" height="20" rx="2" fill="#FFFFFF" />
                              <rect x="20" y="20" width="10" height="10" fill="currentColor" />
                              <rect x="80" y="10" width="30" height="30" rx="3" fill="currentColor" />
                              <rect x="85" y="15" width="20" height="20" rx="2" fill="#FFFFFF" />
                              <rect x="90" y="20" width="10" height="10" fill="currentColor" />
                              <rect x="10" y="80" width="30" height="30" rx="3" fill="currentColor" />
                              <rect x="15" y="85" width="20" height="20" rx="2" fill="#FFFFFF" />
                              <rect x="20" y="90" width="10" height="10" fill="currentColor" />
                              <rect x="48" y="14" width="8" height="8" fill="currentColor" />
                              <rect x="62" y="14" width="8" height="8" fill="currentColor" />
                              <rect x="48" y="32" width="12" height="8" fill="currentColor" />
                              <rect x="14" y="48" width="8" height="14" fill="currentColor" />
                              <rect x="30" y="52" width="14" height="6" fill="currentColor" />
                              <rect x="52" y="52" width="16" height="16" fill="currentColor" />
                              <rect x="76" y="48" width="10" height="10" fill="currentColor" />
                              <rect x="94" y="58" width="14" height="8" fill="currentColor" />
                              <rect x="48" y="80" width="10" height="14" fill="currentColor" />
                              <rect x="66" y="82" width="14" height="8" fill="currentColor" />
                              <rect x="88" y="86" width="16" height="12" fill="currentColor" />
                            </svg>
                          </div>
                          <div className="flex flex-col gap-2 text-center sm:text-left">
                            <span className="text-[15px] font-bold text-[#191c1d]">
                              Scan with any UPI App
                            </span>
                            <p className="text-[13px] text-[#45464c] leading-relaxed">
                              Open Google Pay, PhonePe, Paytm or BHIM on your smartphone to scan and authorize payment.
                            </p>
                            <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                              <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-pulse"></span>
                              <span className="text-[11px] font-bold text-[#45464c] uppercase">
                                Expires in 08:42 mins
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handlePay}
                              className="mt-2 px-4 py-2 bg-black text-white text-[12px] font-semibold rounded-lg hover:bg-black/85 transition-colors cursor-pointer w-fit self-center sm:self-start"
                            >
                              Simulate QR Scan Success
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* OPTION B: Credit & Debit Cards */}
                <div
                  onClick={() => setSelectedMethod('card')}
                  className={`rounded-2xl p-5 cursor-pointer transition-all duration-200 border ${
                    selectedMethod === 'card'
                      ? 'bg-[#f3f4f5] border-black shadow-xs'
                      : 'bg-white border-[#e1e3e4] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center p-1 border ${
                          selectedMethod === 'card'
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-[#c6c6cd]'
                        }`}
                      >
                        {selectedMethod === 'card' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-[16px] font-bold text-[#191c1d]">
                          Credit / Debit Card
                        </span>
                        <p className="text-[13px] text-[#45464c] mt-0.5">
                          Visa, MasterCard, RuPay, Maestro & American Express
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#e1e3e4] rounded text-[#191c1d]">
                        VISA
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#e1e3e4] rounded text-[#191c1d]">
                        MC
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#e1e3e4] rounded text-[#191c1d]">
                        RUPAY
                      </span>
                    </div>
                  </div>

                  {/* Card Form */}
                  {selectedMethod === 'card' && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-5 pt-5 flex flex-col gap-4 bg-white p-5 rounded-xl border border-[#e1e3e4] shadow-xs animate-in fade-in duration-200"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-medium text-[#45464c]">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 •••• •••• 8921"
                            className="w-full h-11 px-3.5 bg-[#f3f4f5] rounded-xl text-[14px] text-[#191c1d] focus:outline-none focus:bg-white border border-[#e1e3e4]"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d]">
                            credit_card
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[12px] font-medium text-[#45464c]">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full h-11 px-3.5 bg-[#f3f4f5] rounded-xl text-[14px] text-[#191c1d] focus:outline-none focus:bg-white border border-[#e1e3e4]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[12px] font-medium text-[#45464c]">CVV</label>
                            <span className="text-[10px] text-[#76777d] cursor-pointer">3 Digits?</span>
                          </div>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full h-11 px-3.5 bg-[#f3f4f5] rounded-xl text-[14px] text-[#191c1d] focus:outline-none focus:bg-white border border-[#e1e3e4]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-medium text-[#45464c]">Name on Card</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Priya Sharma"
                          className="w-full h-11 px-3.5 bg-[#f3f4f5] rounded-xl text-[14px] text-[#191c1d] focus:outline-none focus:bg-white border border-[#e1e3e4]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id="save-card-toggle"
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded text-black cursor-pointer"
                        />
                        <label
                          htmlFor="save-card-toggle"
                          className="text-[12px] text-[#45464c] cursor-pointer"
                        >
                          Save card securely for future fast payments (as per RBI Guidelines)
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full h-11 bg-black hover:bg-black/85 text-white text-[14px] font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 cursor-pointer"
                      >
                        <span>
                          {isProcessing
                            ? 'Processing Payment...'
                            : `Pay ₹${totalPayable.toLocaleString('en-IN')} with Card`}
                        </span>
                        <span className="material-symbols-outlined text-sm">lock</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* OPTION C: Net Banking */}
                <div
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`rounded-2xl p-5 cursor-pointer transition-all duration-200 border ${
                    selectedMethod === 'netbanking'
                      ? 'bg-[#f3f4f5] border-black shadow-xs'
                      : 'bg-white border-[#e1e3e4] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center p-1 border ${
                          selectedMethod === 'netbanking'
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-[#c6c6cd]'
                        }`}
                      >
                        {selectedMethod === 'netbanking' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-[16px] font-bold text-[#191c1d]">Net Banking</span>
                        <p className="text-[13px] text-[#45464c] mt-0.5">
                          50+ Indian banks supported with direct secure login
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#45464c]">account_balance</span>
                  </div>

                  {/* Net Banking Form */}
                  {selectedMethod === 'netbanking' && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-5 pt-5 flex flex-col gap-4 bg-white p-5 rounded-xl border border-[#e1e3e4] shadow-xs animate-in fade-in duration-200"
                    >
                      <span className="text-[12px] font-bold text-[#45464c] uppercase">Popular Banks</span>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                        {[
                          { name: 'HDFC', badge: 'H', color: 'bg-black text-white' },
                          { name: 'ICICI', badge: 'I', color: 'bg-[#0051d5] text-white' },
                          { name: 'SBI', badge: 'S', color: 'bg-[#dbe1ff] text-[#00174b]' },
                          { name: 'Axis', badge: 'A', color: 'bg-[#e1e3e4] text-[#191c1d]' },
                          { name: 'Kotak', badge: 'K', color: 'bg-[#e1e3e4] text-[#191c1d]' },
                        ].map((b) => (
                          <button
                            key={b.name}
                            type="button"
                            onClick={() => setSelectedBank(b.name)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-[12px] font-semibold transition-all cursor-pointer ${
                              selectedBank === b.name
                                ? 'border-black bg-[#f3f4f5]'
                                : 'border-[#e1e3e4] hover:bg-[#f3f4f5]'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${b.color}`}
                            >
                              {b.badge}
                            </span>
                            <span>{b.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col gap-1.5 mt-1">
                        <label className="text-[12px] text-[#45464c] font-medium">
                          Or select from other banks
                        </label>
                        <select className="w-full h-11 px-3 bg-[#f3f4f5] rounded-xl text-[13px] text-[#191c1d] focus:outline-none border border-[#e1e3e4]">
                          <option>Select another bank...</option>
                          <option>Bank of Baroda</option>
                          <option>Punjab National Bank</option>
                          <option>Canara Bank</option>
                          <option>IndusInd Bank</option>
                          <option>Federal Bank</option>
                          <option>IDFC FIRST Bank</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full h-11 bg-black text-white text-[13px] font-semibold rounded-xl shadow-xs transition-all mt-2 cursor-pointer hover:bg-black/85"
                      >
                        {isProcessing
                          ? 'Redirecting to Bank Portal...'
                          : `Proceed to ${selectedBank} Portal →`}
                      </button>
                    </div>
                  )}
                </div>

                {/* OPTION D: Cash on Delivery (COD) */}
                <div
                  onClick={() => setSelectedMethod('cod')}
                  className={`rounded-2xl p-5 cursor-pointer transition-all duration-200 border ${
                    selectedMethod === 'cod'
                      ? 'bg-[#f3f4f5] border-black shadow-xs'
                      : 'bg-white border-[#e1e3e4] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center p-1 border ${
                          selectedMethod === 'cod'
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-[#c6c6cd]'
                        }`}
                      >
                        {selectedMethod === 'cod' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-[#191c1d]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#e7e8e9] text-[#45464c] text-[10px] font-bold">
                            +₹40 fee
                          </span>
                        </div>
                        <p className="text-[13px] text-[#45464c] mt-0.5">
                          Pay via Cash or QR code on delivery doorstep
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#45464c]">local_shipping</span>
                  </div>

                  {/* COD Details */}
                  {selectedMethod === 'cod' && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-5 pt-5 flex flex-col gap-4 bg-white p-5 rounded-xl border border-[#e1e3e4] shadow-xs animate-in fade-in duration-200"
                    >
                      <div className="p-3.5 bg-[#f3f4f5] rounded-xl flex items-start gap-3 border border-[#e1e3e4]">
                        <span className="material-symbols-outlined text-[#0051d5] text-base mt-0.5">
                          info
                        </span>
                        <p className="text-[13px] text-[#45464c] leading-relaxed">
                          Pay with Cash or UPI upon delivery. ₹40 COD convenience fee applies to verify non-digital shipping.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full h-11 bg-black text-white text-[13px] font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer hover:bg-black/85"
                      >
                        {isProcessing
                          ? 'Confirming Order...'
                          : `Confirm Order with Cash (₹${(totalPayable).toLocaleString('en-IN')})`}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Strip Inside Payment Container */}
              <div className="pt-4 border-t border-[#edeeef] flex flex-wrap items-center justify-between gap-4 text-[#45464c]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    256-bit SSL Secure Checkout
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase opacity-75">
                  <span>PCI-DSS Level 1</span>
                  <span>•</span>
                  <span>NPCI Certified</span>
                  <span>•</span>
                  <span>RBI Regulated</span>
                </div>
              </div>
            </section>
          </main>

          {/* RIGHT COLUMN: Sticky Order Summary & Pay Action (5 Columns) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-8 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e3e4] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#edeeef]">
                <h2 className="text-[16px] font-bold text-[#191c1d]">Order Summary</h2>
                <span className="px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#45464c] text-[11px] uppercase font-bold border border-[#e1e3e4]">
                  3 Items
                </span>
              </div>

              {/* Product Mini Thumbnails & Quantities */}
              <div className="flex flex-col gap-4">
                {/* Item 1 */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f3f4f5] shrink-0 border border-[#e1e3e4]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Structured Oversized Tee"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqtezVr6-oQ49z7PNWHNGQpLwCaRKF2xjHXxKkJ-H6RSCWMQnCN6NnuA4c4OXwiDjJhDLnpKrQpNNYqes9TX79181NF_DvjaUU2pRGdt0k1Lw0jOEvId6Oi5-DeNgHXVfBSuVW3mFXLD1TFVkElWdmFklZxQYHH3nEMoqoEZ8JlvOVdHaKylcmxBjFqqjyJNMiZO67R46WyqnFjiul1UC5XKw1xxpdy4vBxcpVqdmcdtBbrPk6DZ17Ow"
                    />
                    <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-bold px-1 rounded">
                      1x
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#191c1d] truncate">
                      Structured Oversized Tee
                    </h3>
                    <p className="text-[12px] text-[#45464c]">Color: Washed Slate • Size: L</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[14px] font-bold text-[#191c1d]">₹1,199</span>
                      <span className="text-[12px] text-[#76777d] line-through">₹2,199</span>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f3f4f5] shrink-0 border border-[#e1e3e4]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Pleated Utilitarian Chino"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgYUaV1izMmFA3cpUL_lAiUpUEBfH5l2YWmPGUWRooMbooWbP1YzYzuTULaFArREgLms3fsGZUvbKoJZ3WA2w9BwbPRljfXkVItSZn7g-Cn3COAP4rQ2ucurvcm6bbfGCcilkCDy70dyV-iDibcSZogzMeEEmJcVUJuOeO0KmZvQHptMkXlNfUXYp_ILz4eA5laDwfaqIT8ILzctBsfmyWAlUWMe1J_VJq7nNfpQoetuYDCii-RuPl5Q"
                    />
                    <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-bold px-1 rounded">
                      1x
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#191c1d] truncate">
                      Pleated Utilitarian Chino
                    </h3>
                    <p className="text-[12px] text-[#45464c]">Color: Deep Olive • Size: 32</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[14px] font-bold text-[#191c1d]">₹1,499</span>
                      <span className="text-[12px] text-[#76777d] line-through">₹2,598</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    disabled
                    value={appliedPromo}
                    className="w-full h-10 px-3 bg-[#f3f4f5] rounded-xl text-[12px] text-[#191c1d] uppercase tracking-wider font-bold opacity-90 cursor-not-allowed border border-[#e1e3e4]"
                  />
                  <span className="material-symbols-outlined text-[#0051d5] absolute right-2.5 top-1/2 -translate-y-1/2 text-base">
                    check_circle
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onRemovePromo}
                  className="px-3 h-10 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#ba1a1a] text-[12px] font-semibold rounded-xl border border-[#e1e3e4] cursor-pointer"
                >
                  Remove
                </button>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="flex flex-col gap-2.5 pt-1 border-t border-[#edeeef]">
                <div className="flex items-center justify-between text-[13px] text-[#45464c]">
                  <span>Items Total (MRP)</span>
                  <span>₹{itemsTotalMrp.toLocaleString('en-IN')}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex items-center justify-between text-[13px] text-[#0051d5] font-semibold">
                    <span>Promotional Discount</span>
                    <span>- ₹{promoDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {codFee > 0 && (
                  <div className="flex items-center justify-between text-[13px] text-[#45464c]">
                    <span>Cash on Delivery Handling Fee</span>
                    <span>+₹40</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[13px] text-[#45464c]">
                  <span>Standard Delivery</span>
                  <span className="text-[#0051d5] font-bold uppercase tracking-wider text-[11px]">
                    Free
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#edeeef] text-[#191c1d]">
                  <span className="text-[16px] font-bold">Total Payable</span>
                  <div className="text-right">
                    <span className="text-[24px] font-bold text-[#191c1d]">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[11px] text-[#76777d] uppercase font-medium">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              {/* Primary Trigger Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full h-12 bg-black hover:bg-[#0051d5] text-white text-[14px] font-semibold rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                <span>
                  {isProcessing
                    ? 'Processing Authorization...'
                    : selectedMethod === 'upi'
                    ? `Pay ₹${totalPayable.toLocaleString('en-IN')} with UPI`
                    : selectedMethod === 'card'
                    ? `Pay ₹${totalPayable.toLocaleString('en-IN')} with Card`
                    : selectedMethod === 'netbanking'
                    ? `Pay ₹${totalPayable.toLocaleString('en-IN')} via Net Banking`
                    : `Confirm Order (COD ₹${totalPayable.toLocaleString('en-IN')})`}
                </span>
              </button>

              {/* Safe Payments & Compliance Seals */}
              <div className="p-4 bg-[#f3f4f5] rounded-xl flex flex-col gap-2.5 border border-[#e1e3e4]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#76777d] font-bold tracking-wider">
                    Trusted Gateway
                  </span>
                  <span className="text-[11px] text-[#0051d5] font-bold">Razorpay / Cashfree</span>
                </div>
                <div className="flex items-center gap-2 text-[#45464c]">
                  <span className="material-symbols-outlined text-base text-[#0051d5]">shield</span>
                  <p className="text-[12px] leading-tight text-[#45464c]">
                    Your payment data is processed through 256-bit encrypted channels. We do not store card credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* Return & Guarantee Assurance Banner */}
            <div className="bg-[#f3f4f5] rounded-2xl p-4 flex items-center gap-3.5 border border-[#e1e3e4]">
              <div className="w-10 h-10 rounded-full bg-white text-[#191c1d] flex items-center justify-center shrink-0 border border-[#e1e3e4]">
                <span className="material-symbols-outlined text-xl">published_with_changes</span>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#191c1d]">14-Day Effortless Returns</h4>
                <p className="text-[12px] text-[#45464c]">
                  Not the right fit? Easy doorstep pickup & instant refund to source.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-[#e1e3e4] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#edeeef] mb-4">
              <h3 className="text-[18px] font-bold text-[#191c1d]">Update Delivery Address</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-[#76777d] hover:text-black cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] text-[#45464c] font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f3f4f5] rounded-lg text-[13px] border border-[#e1e3e4] focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[12px] text-[#45464c] font-medium">Flat / House No / Building</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f3f4f5] rounded-lg text-[13px] border border-[#e1e3e4] focus:outline-none focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-[#45464c] font-medium">Area / Street</label>
                  <input
                    type="text"
                    required
                    value={addressForm.area}
                    onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f3f4f5] rounded-lg text-[13px] border border-[#e1e3e4] focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-[#45464c] font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f3f4f5] rounded-lg text-[13px] border border-[#e1e3e4] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-[#45464c] font-medium">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f3f4f5] rounded-lg text-[13px] border border-[#e1e3e4] focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-[#45464c] font-medium">Phone</label>
                  <input
                    type="text"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f3f4f5] rounded-lg text-[13px] border border-[#e1e3e4] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-[#f3f4f5] text-[13px] font-semibold rounded-lg hover:bg-[#e7e8e9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white text-[13px] font-semibold rounded-lg hover:bg-black/85 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
