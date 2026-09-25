import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Navigation,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';

export const BookingsView = ({ onOpenTracking }) => {
  const { bookings, cancelBooking } = useBooking();
  const [filter, setFilter] = useState('ALL');
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ACTIVE') return b.status === 'Confirmed' || b.status === 'In Progress';
    if (filter === 'COMPLETED') return b.status === 'Completed';
    if (filter === 'CANCELLED') return b.status === 'Cancelled';
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedBookingId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            My Service Bookings
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking, complete service specifications, and history
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'Active Orders' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.id ? 'bg-teal-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No bookings found</h3>
            <p className="text-xs text-slate-400 mt-1">Book any service using Doorlyn AI Assistant or Ecosystem Grid</p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isExpanded = expandedBookingId === b.id;

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        b.status === 'Completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        ● {b.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">ID: {b.id}</span>
                      <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{b.serviceCategory}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900">
                      {b.serviceName}
                    </h3>

                    {b.subServiceName && (
                      <p className="text-xs font-extrabold text-teal-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-teal-600" /> Option: {b.subServiceName}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {b.date} ({b.timeSlot})
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 max-w-md truncate">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        {b.address}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Provider: <strong className="text-slate-800">{b.assignedProvider}</strong></span>
                    </div>
                  </div>

                  {/* Price & Primary CTA */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block">Total Amount</span>
                      <span className="text-xl font-black text-teal-700">₹{b.totalAmount}</span>
                      <span className="text-[10px] text-slate-500 block font-semibold">{b.paymentMethod}</span>
                      {b.appliedCoupon && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                          Coupon: {b.appliedCoupon}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleExpand(b.id)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? 'Hide Details' : 'View Service Details'}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {b.status === 'Confirmed' && (
                        <>
                          <button
                            onClick={() => onOpenTracking(b)}
                            className="px-4 py-2 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            Track Live
                          </button>
                          <button
                            onClick={() => cancelBooking(b.id)}
                            className="px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-xl text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {b.status === 'Completed' && (
                        <button
                          onClick={() => alert(`Receipt downloaded for booking ${b.id}`)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE COMPLETE SERVICE DETAILS CARD */}
                {isExpanded && (
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs space-y-4 animate-in fade-in-50">
                    
                    {/* Header: Complete Booking Info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <span className="font-extrabold text-slate-800 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Complete Booked Service Specifications
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Booking Created: {new Date(b.createdAt || Date.now()).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    {/* Section 1: Overview & Timing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Service Category</span>
                        <span className="font-extrabold text-amber-700">{b.serviceCategory}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Primary Service</span>
                        <span className="font-extrabold text-slate-900">{b.serviceName}</span>
                      </div>

                      {b.subServiceName && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Sub-Service Option</span>
                          <span className="font-extrabold text-teal-700">{b.subServiceName}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-teal-600" /> Appointment Slot
                        </span>
                        <span className="font-bold text-slate-800">{b.date} ({b.timeSlot})</span>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" /> Full Service Address
                        </span>
                        <span className="font-medium text-slate-800">{b.address}</span>
                      </div>
                    </div>



                    {/* Section 3: Verified Provider & Doorlyn Service */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-teal-50/90 p-3 rounded-xl border border-teal-100 gap-2">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Assigned Verified Service Partner</span>
                          <span className="font-extrabold text-teal-950 text-xs">{b.assignedProvider}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-extrabold shadow-2xs">
                          Verified Doorlyn Service
                        </span>
                      </div>
                    </div>

                    {/* Section 4: Itemized Payment & Invoice Summary */}
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2 text-xs border border-slate-800">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                        Invoice & Billing Breakdown
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Base MRP Rate</span>
                          <span className="font-bold">₹{b.mrp || b.totalAmount + 150}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Payment Gateway / Mode</span>
                          <span className="font-bold text-white">{b.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Coupon Discount</span>
                          <span className="font-bold text-emerald-400">{b.appliedCoupon ? `- ₹${b.couponDiscount || 100} (${b.appliedCoupon})` : 'None'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Total Paid Amount</span>
                          <span className="font-black text-amber-400 text-sm">₹{b.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

