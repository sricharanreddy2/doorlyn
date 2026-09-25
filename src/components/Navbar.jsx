import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { servicesData } from '../data/servicesData';
import { searchDoorlynServices } from '../utils/searchHelper';
import { 
  Globe, 
  Bell, 
  Search, 
  PhoneCall, 
  Sparkles, 
  Wallet,
  CheckCircle2,
  X,
  ArrowRight,
  Activity,
  Wrench,
  PackageCheck,
  Truck,
  ShoppingCart,
  HardHat,
  GraduationCap,
  UtensilsCrossed,
  Tag
} from 'lucide-react';

const iconMap = {
  Activity,
  Wrench,
  PackageCheck,
  Truck,
  ShoppingCart,
  HardHat,
  GraduationCap,
  UtensilsCrossed,
  PhoneCall
};

export const Navbar = ({ 
  onOpenIVRS, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery,
  onOpenBookingModal,
  onNavigateToGrocery
}) => {
  const { lang, setLang, t } = useLanguage();
  const { user } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const searchContainerRef = useRef(null);

  const mockNotifications = [
    { id: 1, title: 'Booking Confirmed', text: 'Full Body Checkup phlebotomist assigned for tomorrow 8 AM.', time: '5m ago', unread: true },
    { id: 2, title: 'IVRS Call Alert', text: 'Doorlyn Helpline +91 98765 43210 call logged. Booking updated.', time: '1h ago', unread: true },
    { id: 3, title: 'Wallet Cashback', text: '₹50 added to Doorlyn Wallet via referral program.', time: '1d ago', unread: false }
  ];

  // Close live search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowLiveSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim().length > 0) {
      setShowLiveSearch(true);
      if (setActiveTab) setActiveTab('home');
    } else {
      setShowLiveSearch(false);
    }
  };

  // Find live matching services for dropdown using smart search helper
  const { matchedServices: liveResults } = searchDoorlynServices(searchQuery, t);

  const handleSelectLiveResult = (result) => {
    setShowLiveSearch(false);
    if (result.category.id === 'groceries' && onNavigateToGrocery) {
      onNavigateToGrocery();
    } else if (onOpenBookingModal) {
      onOpenBookingModal(result, result.category);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Tag */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              if (setActiveTab) setActiveTab('home');
              setSearchQuery('');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl tracking-tight">D</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">DOORLYN</span>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  AI OS
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block">
                Multilingual Household Operating System
              </p>
            </div>
          </div>

          {/* Search Bar with Live Suggestions Dropdown (Desktop) */}
          <div ref={searchContainerRef} className="flex-1 max-w-md hidden md:block relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('quickSearchPlaceholder') || 'Search blood test, electrician, plumber, grocery...'}
                value={searchQuery}
                onFocus={() => { if (searchQuery.trim()) setShowLiveSearch(true); }}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowLiveSearch(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Panel */}
            {showLiveSearch && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {liveResults.length > 0 ? `${liveResults.length} Services Found` : 'No Services Found'}
                  </span>
                  <span className="text-[10px] text-teal-700 font-bold">Press result to book</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {liveResults.slice(0, 6).map((item) => {
                    const IconComp = iconMap[item.category.icon] || Activity;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectLiveResult(item)}
                        className="p-3 hover:bg-teal-50/70 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.category.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 truncate">
                                {item.name}
                              </h4>
                              {item.tag && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {item.catTitle} • {item.includes ? item.includes.slice(0, 2).join(', ') : 'Verified Service'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-2">
                          <div>
                            <span className="text-xs font-black text-teal-700 block">₹{item.price}</span>
                            {item.mrp && item.mrp > item.price && (
                              <span className="text-[10px] text-slate-400 line-through">₹{item.mrp}</span>
                            )}
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-teal-50 group-hover:bg-teal-600 group-hover:text-white text-teal-700 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {liveResults.length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                      <p className="text-xs font-semibold">No services matched "{searchQuery}"</p>
                      <p className="text-[11px] text-slate-400 mt-1">Try searching "blood test", "electrician", "cleaning", or "plumber"</p>
                    </div>
                  )}
                </div>

                {liveResults.length > 6 && (
                  <div 
                    onClick={() => { setShowLiveSearch(false); if (setActiveTab) setActiveTab('home'); }}
                    className="p-2.5 bg-slate-50 hover:bg-teal-50 text-center text-xs font-bold text-teal-700 border-t border-slate-100 cursor-pointer transition-colors"
                  >
                    View all {liveResults.length} search results on Home →
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* IVRS Helpline Call Button */}
            <button
              onClick={onOpenIVRS}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-full text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
              title="Call +91 98765 43210 to Book Services"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
              <span className="hidden lg:inline">IVR Booking:</span>
              <span>+91 98765 43210</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold transition-all border border-slate-200"
              >
                <Globe className="w-4 h-4 text-teal-700" />
                <span>{lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'తెలుగు'}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  <button
                    onClick={() => { setLang('EN'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between ${lang === 'EN' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>English</span>
                    {lang === 'EN' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => { setLang('HI'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between ${lang === 'HI' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {lang === 'HI' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => { setLang('TE'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between ${lang === 'TE' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>తెలుగు (Telugu)</span>
                    {lang === 'TE' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full relative transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">2 New</span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {mockNotifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs transition-colors ${n.unread ? 'bg-teal-50/70 border border-teal-100' : 'bg-slate-50'}`}>
                        <div className="flex justify-between font-semibold text-slate-800 mb-0.5">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Wallet Badge */}
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-full text-xs font-bold border border-teal-200 transition-all"
            >
              <Wallet className="w-4 h-4 text-teal-600" />
              <span>₹{user.walletBalance}</span>
            </button>

          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('quickSearchPlaceholder') || 'Search services...'}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

