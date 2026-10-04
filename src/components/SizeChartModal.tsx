import React, { useState } from 'react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const sizeDataInches = [
    { size: 'S', chest: '42', length: '28.5', shoulder: '21.5', sleeve: '8.5', isModel: false },
    { size: 'M (Model)', chest: '44', length: '29.5', shoulder: '22.5', sleeve: '9.0', isModel: true },
    { size: 'L', chest: '46', length: '30.5', shoulder: '23.5', sleeve: '9.5', isModel: false },
    { size: 'XL', chest: '48', length: '31.5', shoulder: '24.5', sleeve: '10.0', isModel: false },
    { size: 'XXL', chest: '50', length: '32.5', shoulder: '25.5', sleeve: '10.5', isModel: false },
  ];

  const sizeDataCm = [
    { size: 'S', chest: '106.7', length: '72.4', shoulder: '54.6', sleeve: '21.6', isModel: false },
    { size: 'M (Model)', chest: '111.8', length: '74.9', shoulder: '57.2', sleeve: '22.9', isModel: true },
    { size: 'L', chest: '116.8', length: '77.5', shoulder: '59.7', sleeve: '24.1', isModel: false },
    { size: 'XL', chest: '121.9', length: '80.0', shoulder: '62.2', sleeve: '25.4', isModel: false },
    { size: 'XXL', chest: '127.0', length: '82.6', shoulder: '64.8', sleeve: '26.7', isModel: false },
  ];

  const currentData = unit === 'inches' ? sizeDataInches : sizeDataCm;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 bg-[#f3f4f5] flex items-center justify-between border-b border-[#e1e3e4]">
          <div>
            <h3 className="text-[18px] font-bold text-[#191c1d]">Size Chart ({unit.toUpperCase()})</h3>
            <p className="text-[13px] text-[#45464c]">ZEN Oversized Signature Fit Guide</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#e7e8e9] p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setUnit('inches')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  unit === 'inches' ? 'bg-white text-black shadow-xs' : 'text-[#45464c]'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  unit === 'cm' ? 'bg-white text-black shadow-xs' : 'text-[#45464c]'
                }`}
              >
                CM
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#e7e8e9] text-[#45464c] hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <table className="w-full text-left text-[14px] text-[#191c1d]">
            <thead>
              <tr className="bg-[#f3f4f5] text-[11px] uppercase tracking-wider text-[#45464c] font-semibold">
                <th className="p-3 rounded-l-lg">Size</th>
                <th className="p-3">Chest ({unit === 'inches' ? 'In' : 'cm'})</th>
                <th className="p-3">Length ({unit === 'inches' ? 'In' : 'cm'})</th>
                <th className="p-3">Shoulder ({unit === 'inches' ? 'In' : 'cm'})</th>
                <th className="p-3 rounded-r-lg">Sleeve ({unit === 'inches' ? 'In' : 'cm'})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edeeef]">
              {currentData.map((row) => (
                <tr
                  key={row.size}
                  className={`transition-colors ${
                    row.isModel
                      ? 'bg-[#dbe1ff]/35 font-medium'
                      : 'hover:bg-[#f3f4f5]/60'
                  }`}
                >
                  <td
                    className={`p-3 font-semibold ${
                      row.isModel ? 'text-[#0051d5]' : ''
                    }`}
                  >
                    {row.size}
                  </td>
                  <td className="p-3">{row.chest}</td>
                  <td className="p-3">{row.length}</td>
                  <td className="p-3">{row.shoulder}</td>
                  <td className="p-3">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 p-3.5 bg-[#f3f4f5] rounded-xl text-[13px] text-[#45464c] flex items-start gap-2.5 border border-[#e1e3e4]">
            <span className="material-symbols-outlined text-[#0051d5] text-[18px] shrink-0 mt-0.5">
              straighten
            </span>
            <p className="leading-relaxed">
              <strong>Tip:</strong> If you prefer a regular tailored fit rather than our signature boxy oversized streetwear silhouette, consider sizing down one standard size.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#f3f4f5] border-t border-[#e1e3e4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white text-[13px] font-semibold rounded-lg hover:bg-black/85 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
