import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { 
  Home, 
  Bot, 
  Calendar, 
  ShoppingCart, 
  User, 
  Sparkles 
} from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const { cartItems } = useCart();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { id: 'home', labelKey: 'navHome', icon: Home },
    { id: 'ai-assistant', labelKey: 'navAI', icon: Bot, isAI: true },
    { id: 'bookings', labelKey: 'navBookings', icon: Calendar },
    { id: 'grocery', labelKey: 'navGrocery', icon: ShoppingCart, badge: totalCartCount },
    { id: 'profile', labelKey: 'navProfile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1 sm:py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAI) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-amber-500 text-white flex items-center justify-center shadow-lg transform transition-all group-hover:scale-105 group-active:scale-95 ${isActive ? 'ring-4 ring-teal-200 animate-pulse-ring' : ''}`}>
                  <Bot className="w-7 h-7 text-white" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute top-1 right-1" />
                </div>
                <span className={`text-[11px] font-extrabold mt-1 ${isActive ? 'text-teal-700' : 'text-slate-600'}`}>
                  {t(tab.labelKey)}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-teal-700 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
