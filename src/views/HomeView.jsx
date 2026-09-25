import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { servicesData } from '../data/servicesData';
import { searchDoorlynServices } from '../utils/searchHelper';
import { ServiceCard } from '../components/ServiceCard';
import { 
  Bot, 
  Mic, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Search, 
  X, 
  Tag, 
  Check, 
  Calendar, 
  ArrowRight,
  Activity,
  Wrench,
  PackageCheck,
  Truck,
  ShoppingCart,
  HardHat,
  GraduationCap,
  UtensilsCrossed,
  SlidersHorizontal,
  Home
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

export const HomeView = ({ 
  onNavigateToAI, 
  onNavigateToGrocery, 
  onOpenBookingModal, 
  onOpenIVRS, 
  searchQuery,
  setSearchQuery 
}) => {
  const { t } = useLanguage();

  const trimmedQ = (searchQuery || '').trim().toLowerCase();

  // Intelligent search with multi-word tokenization and synonym expansion
  const { matchedServices, matchedCategories } = useMemo(() => {
    return searchDoorlynServices(searchQuery, t);
  }, [searchQuery, t]);

  const filteredCategories = matchedCategories;

  const popularQuickPills = [
    { 
      label: '🏠 Home Repairs', 
      query: 'Home Repair'
    },
    { 
      label: '⚡ Electrician', 
      query: 'Electrician'
    },
    { 
      label: '🚰 Plumber', 
      query: 'Plumber'
    },
    { 
      label: '🪚 Carpenter', 
      query: 'Carpenter'
    },
    { 
      label: '❄️ AC / Appliance Repair', 
      query: 'Appliance Repair'
    },
    { 
      label: '🩸 Blood Test (CBC)', 
      query: 'CBC'
    },
    { 
      label: '📦 Express Parcel', 
      query: 'Parcel'
    },
    { 
      label: '🚚 House Shifting Truck', 
      query: 'Shifting'
    },
    { 
      label: '🛒 15-Min Groceries', 
      query: 'Grocery'
    },
    { 
      label: '🔨 Construction Mestri', 
      query: 'Mestri'
    },
    { 
      label: '🧹 Deep Cleaning', 
      query: 'Cleaning'
    }
  ];

  const handleServiceCardClick = (item) => {
    if (item.category.id === 'groceries' && onNavigateToGrocery) {
      onNavigateToGrocery();
    } else {
      onOpenBookingModal(item, item.category);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden border border-slate-800">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            India's First AI Multilingual Household Operating System
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            
            {/* Talk to Doorlyn AI CTA */}
            <button
              onClick={onNavigateToAI}
              className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-extrabold text-base rounded-2xl shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <span>{t('talkToAI')}</span>
              <Sparkles className="w-4 h-4 text-slate-900" />
            </button>

            {/* Call IVRS Hotline CTA */}
            <button
              onClick={onOpenIVRS}
              className="px-6 py-4 bg-slate-800/90 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>Call to Book: +91 98765 43210</span>
            </button>

          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Verified Partners
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" /> Anuvadini.ai Powered
            </span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <Users className="w-4 h-4" /> Rural & Elderly Accessible
            </span>
          </div>

        </div>

      </section>

      {/* Main Household Services Search Bar Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
            <input
              type="text"
              placeholder="Search by service name (e.g. CBC test, fan repair, pipe leak, truck, groceries)..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onNavigateToAI}
            className="w-full sm:w-auto px-5 py-3.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs rounded-2xl border border-teal-200 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Bot className="w-4 h-4 text-teal-700" />
            <span>AI Voice Search</span>
          </button>
        </div>

        {/* Quick Search Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Popular:
          </span>
          {popularQuickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (pill.action) pill.action();
                else if (setSearchQuery) setSearchQuery(pill.query);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 shrink-0 transition-all active:scale-95"
            >
              {pill.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 shrink-0 transition-all flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* SEARCH RESULTS SECTION: Appears when user is searching */}
      {trimmedQ && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-600" />
                Service Search Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing matching services for "<span className="font-bold text-teal-800">{searchQuery}</span>"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200">
                {matchedServices.length} {matchedServices.length === 1 ? 'Service Found' : 'Services Found'}
              </span>
              <button
                onClick={() => setSearchQuery && setSearchQuery('')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
              >
                Reset Search
              </button>
            </div>
          </div>

          {/* Direct Matching Service Cards Grid */}
          {matchedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchedServices.map((item) => {
                const IconComp = iconMap[item.category.icon] || Activity;
                const savings = item.mrp && item.mrp > item.price ? item.mrp - item.price : 0;
                const discountPercent = item.mrp && item.mrp > item.price ? Math.round((savings / item.mrp) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleServiceCardClick(item)}
                    className="bg-white rounded-3xl p-5 border-2 border-teal-100 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                  >
                    {/* Glow highlight */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

                    <div>
                      {/* Top Category Badge & Tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="bg-teal-50 text-teal-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-teal-200/80 flex items-center gap-1.5">
                          <IconComp className="w-3.5 h-3.5 text-teal-700" />
                          {item.categoryTitle}
                        </span>

                        {item.tag && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Service Title */}
                      <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                        {item.name}
                      </h3>

                      {/* Pricing Block */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Inclusions checklist */}
                      {item.includes && item.includes.length > 0 && (
                        <div className="mt-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Includes:
                          </span>
                          <div className="space-y-1">
                            {item.includes.slice(0, 3).map((inc, i) => (
                              <div key={i} className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-services count pill */}
                      {item.subServices && item.subServices.length > 0 && (
                        <div className="mt-3 text-[11px] font-bold text-teal-700 flex items-center gap-1">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>{item.subServices.length} Sub-Packages / Custom Options Available</span>
                        </div>
                      )}
                    </div>

                    {/* Book Now Button */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Doorstep Service
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceCardClick(item);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 group-hover:scale-105 transition-all"
                      >
                        <span>Book Service</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">No Services Matched "{searchQuery}"</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  We couldn't find exact service matches for your query. Try searching for broader terms or talk to our Voice AI assistant.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setSearchQuery && setSearchQuery('CBC Test')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Try "CBC Test"
                </button>
                <button
                  onClick={() => setSearchQuery && setSearchQuery('Electrician')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Try "Electrician"
                </button>
                <button
                  onClick={() => setSearchQuery && setSearchQuery('Plumber')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Try "Plumber"
                </button>
                <button
                  onClick={onNavigateToAI}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Ask Anuvadini AI
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Anuvadini AI Interactive Banner */}
      <div 
        onClick={onNavigateToAI}
        className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-2xl transition-all border border-teal-600/40 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg">Anuvadini.ai Voice AI Concierge</span>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-200 mt-1 max-w-xl">
              Supports Telugu (తెలుగు), Hindi (हिंदी), and English. Understands your intent and books healthcare, repairs, parcels, or groceries instantly!
            </p>
          </div>
        </div>

        <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shrink-0 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
          <span>Launch AI Assistant</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 8 Verticals Service Ecosystem Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {trimmedQ ? 'Explore by Categories' : 'Doorlyn Household Services'}
            </h2>
            <p className="text-xs text-slate-500">
              {trimmedQ ? `Browse service categories matching "${searchQuery}"` : 'Everything managed under one unified operating system'}
            </p>
          </div>
          <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {filteredCategories.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((category) => (
            <ServiceCard
              key={category.id}
              category={category}
              onSelectCategory={(cat) => {
                if (cat.id === 'groceries' && onNavigateToGrocery) {
                  onNavigateToGrocery();
                } else {
                  onOpenBookingModal(cat.items[0], cat);
                }
              }}
              onSelectService={(service, cat) => onOpenBookingModal(service, cat)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

