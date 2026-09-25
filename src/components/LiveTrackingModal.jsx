import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  FileText, 
  Navigation, 
  Sparkles
} from 'lucide-react';

export const LiveTrackingModal = ({ booking, onClose }) => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!booking) return null;

  const steps = [
    { label: 'Booking Confirmed', time: '10:15 AM', desc: 'Order received & dispatched to local partner' },
    { label: 'Agent Assigned', time: '10:18 AM', desc: `${booking.assignedProvider || 'Ramesh Kumar (★ 4.9)'}` },
    { label: 'En Route / Items Picked Up', time: 'In Progress', desc: 'Agent is navigating live via GPS to location' },
    { label: 'Service / Delivery Completed', time: 'Est 20 mins', desc: 'Final OTP confirmation pending' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase">
              Live Order Status
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {booking.serviceName}
            </h3>
            <p className="text-xs text-slate-500">ID: {booking.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          
          {/* Simulated GPS Live Map */}
          <div className="relative h-48 bg-slate-800 rounded-2xl overflow-hidden shadow-inner border border-slate-700 flex flex-col justify-between p-4">
            {/* Map Grid Pattern background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Top Status Banner */}
            <div className="relative z-10 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Agent Moving Live
              </span>
              <span className="text-[11px] text-slate-300 font-mono">GPS: 17.4486° N, 78.3908° E</span>
            </div>

            {/* Visual Moving Route */}
            <div className="relative z-10 my-auto flex items-center justify-between px-6">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg font-bold text-xs">
                  A
                </div>
                <span className="text-[10px] text-slate-300 font-bold mt-1">Provider</span>
              </div>

              <div className="flex-1 mx-3 border-t-2 border-dashed border-teal-400 relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-teal-500 text-white p-1 rounded-full animate-pulse shadow-lg">
                  <Navigation className="w-4 h-4 rotate-45" />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-300 font-bold mt-1">Your Location</span>
              </div>
            </div>

            {/* Bottom Address preview */}
            <div className="relative z-10 text-[11px] text-slate-300 truncate bg-slate-900/80 px-3 py-1 rounded-lg">
              Destination: {booking.address}
            </div>
          </div>

          {/* Assigned Provider Profile */}
          <div className="bg-gradient-to-r from-teal-50 to-slate-50 p-4 rounded-2xl border border-teal-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                RK
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {booking.assignedProvider || 'Ramesh Kumar'}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold text-[10px]">★ 4.9 Verified</span>
                  <span>• 1,420+ Orders Done</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => alert(`Calling Doorlyn Provider: ${booking.contactPhone || '+91 9876543210'}`)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call Provider
            </button>
          </div>

          {/* Complete Booked Service Specifications Details Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Complete Booked Service Details
              </span>
              <span className="font-mono font-bold text-teal-800 text-[11px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Paid: ₹{booking.totalAmount || booking.price} ({booking.paymentMethod})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Service & Sub-Option:</span>
                <p className="font-bold text-slate-900">{booking.serviceName} {booking.subServiceName ? `(${booking.subServiceName})` : ''}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Scheduled Date & Time Slot:</span>
                <p className="font-bold text-slate-800">{booking.date} ({booking.timeSlot})</p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Service Address:</span>
                <p className="font-medium text-slate-800">{booking.address}</p>
              </div>

              {booking.appliedCoupon && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Applied Coupon:</span>
                  <p className="font-bold text-emerald-700">{booking.appliedCoupon} (Saved ₹{booking.couponDiscount || 100})</p>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Progress Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Service Progress Steps
            </h4>
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-5">
              {steps.map((step, idx) => {
                const isCompleted = idx <= activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      isCompleted ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-teal-700 text-sm' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => alert('Doorlyn Tax Invoice & Digital Receipt downloaded successfully!')}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Download Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Done Tracking
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
