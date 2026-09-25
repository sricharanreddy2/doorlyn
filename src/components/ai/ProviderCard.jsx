import React from 'react';
import { Star, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const ProviderCard = ({ provider, onSelectProvider, onBookNow }) => {
  if (!provider) return null;

  return (
    <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-4 shadow-xl my-2 text-white max-w-sm w-full font-sans transition-all hover:border-teal-400">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <img
          src={provider.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
          alt={provider.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/60 shadow-md"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1">
              {provider.name}
              {provider.badge && (
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" title="Doorlyn Verified Provider" />
              )}
            </h4>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg text-[11px] font-black border border-amber-500/40">
              <Star className="w-3 h-3 fill-current text-amber-400" />
              {provider.rating} ({provider.reviewsCount})
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium mt-0.5">{provider.role}</p>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-400" /> {provider.location}
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Experience: {provider.experience}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Availability */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Service Fee</span>
          <span className="text-sm font-black text-amber-400">₹{provider.price}</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
            <Clock className="w-3 h-3" /> Available Tomorrow
          </span>
          <span className="text-[11px] text-slate-300 font-medium">09:00 AM - 11:00 AM</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onSelectProvider && onSelectProvider(provider)}
          className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all text-center"
        >
          View Details
        </button>
        <button
          onClick={() => onBookNow && onBookNow(provider)}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all text-center active:scale-95 flex items-center justify-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Book Now
        </button>
      </div>
    </div>
  );
};
