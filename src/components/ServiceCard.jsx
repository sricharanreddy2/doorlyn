import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Activity, 
  Wrench, 
  PackageCheck, 
  Truck, 
  ShoppingCart, 
  HardHat, 
  GraduationCap, 
  UtensilsCrossed, 
  PhoneCall, 
  ChevronRight,
  Sparkles,
  ShieldCheck
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

export const ServiceCard = ({ category, onSelectCategory, onSelectService }) => {
  const { t } = useLanguage();
  const IconComponent = iconMap[category.icon] || Activity;
  const subFeaturesPreview = category.subFeatures ? category.subFeatures.slice(0, 3) : [];

  return (
    <div 
      onClick={() => onSelectCategory(category)}
      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden cursor-pointer"
    >
      
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`}></div>

      <div>
        {/* Top Header Badge & Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
            <IconComponent className="w-6 h-6" />
          </div>
          {category.badge && (
            <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {category.badge}
            </span>
          )}
        </div>

        {/* Category Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
          {t(category.titleKey)}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
          {t(category.subtitleKey)}
        </p>

        {/* Sub-Features Included Preview */}
        {subFeaturesPreview.length > 0 && (
          <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Included Sub-Features:
            </span>
            <div className="space-y-0.5">
              {subFeaturesPreview.map((sf, idx) => (
                <div key={idx} className="text-[11px] font-semibold text-slate-700 truncate flex items-center gap-1">
                  <span className="text-amber-500 font-bold">•</span> {sf.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-services Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {category.items.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectService(item, category);
              }}
              className="text-[11px] font-semibold bg-slate-100/80 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors text-left truncate max-w-[150px]"
            >
              • {item.name}
            </button>
          ))}
          {category.items.length > 3 && (
            <span className="text-[10px] font-semibold text-slate-400 self-center">
              +{category.items.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-teal-700 group-hover:underline flex items-center gap-1">
          Explore Services & Book
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory(category);
          }}
          className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-teal-700 group-hover:text-white flex items-center justify-center transition-all text-slate-600"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
