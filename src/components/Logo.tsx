import React from 'react';

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Red Outer Circle */}
      <div className="absolute inset-0 bg-red-600 rounded-full shadow-lg" />
      
      {/* White Inner Badge Area (Simulating the sticker look) */}
      <div className="absolute inset-[3px] bg-white rounded-full flex flex-col items-center justify-center overflow-hidden border-b-2 border-red-700/20">
        {/* Placeholder for Tools Icons */}
        <div className="flex gap-0.5 mb-0.5">
          <div className="w-1 h-3 bg-blue-500 rounded-full" />
          <div className="w-1 h-3 bg-red-500 rounded-full" />
          <div className="w-1 h-3 bg-yellow-500 rounded-full" />
          <div className="w-1 h-3 bg-green-500 rounded-full" />
          <div className="w-1 h-3 bg-gray-700 rounded-full" />
        </div>
        
        {/* Text Area */}
        <div className="flex flex-col items-center -mt-1 scale-75">
          <span className="text-[10px] font-black text-slate-900 tracking-tighter leading-none">CETEP</span>
          <span className="text-[3px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-0.5">Bacia do Rio Corrente</span>
        </div>
      </div>
      
      {/* Sticker Fold Effect (Top Left) */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-700 rounded-br-[100%] shadow-inner -rotate-12 transform origin-top-left" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
    </div>
  );
}
