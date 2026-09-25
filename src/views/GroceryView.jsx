import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { servicesData } from '../data/servicesData';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Clock, 
  Trash2,
  ArrowRight,
  Search,
  X,
  Sparkles,
  Tag,
  Check,
  Leaf,
  Layers
} from 'lucide-react';

export const GroceryView = ({ onOpenCheckout }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const groceryCategory = servicesData.find(s => s.id === 'groceries');
  const allItems = groceryCategory ? groceryCategory.items : [];

  const [grocerySearch, setGrocerySearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Essentials', icon: '🛒' },
    { id: 'fresh-veg-fruits', label: '🥦 Veggies & Fruits', matchId: 'fresh-veg-fruits' },
    { id: 'staples-oil-ghee', label: '🌾 Rice & Staples', matchId: 'staples-oil-ghee' },
    { id: 'milk-curd-dairy', label: '🥛 Dairy & Dry Fruits', matchId: 'milk-curd-dairy' },
    { id: 'snacks-drinks', label: '🍿 Snacks & Drinks', matchId: 'snacks-drinks' }
  ];

  // Filter items by search query and category filter
  const filteredGroceryItems = useMemo(() => {
    const q = (grocerySearch || '').trim().toLowerCase();

    return allItems.filter(item => {
      // Category tab filter
      if (selectedFilter !== 'all' && item.id !== selectedFilter) {
        return false;
      }

      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const tagMatch = item.tag?.toLowerCase().includes(q);
      const includesMatch = item.includes?.some(inc => inc.toLowerCase().includes(q));
      const subServicesMatch = item.subServices?.some(sub => 
        sub.name.toLowerCase().includes(q) || sub.desc?.toLowerCase().includes(q)
      );

      return nameMatch || tagMatch || includesMatch || subServicesMatch;
    });
  }, [allItems, grocerySearch, selectedFilter]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Grocery Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-600/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black">Doorlyn Grocery Express</h2>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                15-MIN DELIVERY
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Fresh vegetables, fruits, rice, dal, milk, curd & snacks direct from local stores.
            </p>
          </div>
        </div>

        <div className="z-10 flex items-center gap-2 text-xs font-bold text-emerald-200 bg-emerald-950/40 px-3.5 py-2 rounded-2xl border border-emerald-500/30">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span>Farm Fresh & Zero Plastic Bags</span>
        </div>
      </div>

      {/* Grocery Search Bar & Filter Pills */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
          <input
            type="text"
            placeholder="Search groceries (e.g. milk, tomato, onion, rice, dal, ghee, bananas, snacks)..."
            value={grocerySearch}
            onChange={(e) => setGrocerySearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 shadow-inner"
          />
          {grocerySearch && (
            <button
              onClick={() => setGrocerySearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 bg-slate-200/70 rounded-full transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedFilter === tab.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {(grocerySearch || selectedFilter !== 'all') && (
            <button
              onClick={() => {
                setGrocerySearch('');
                setSelectedFilter('all');
              }}
              className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 border border-red-200"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & Cart Drawer Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Items Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <span>Daily Essentials Catalog</span>
              {grocerySearch && (
                <span className="text-xs font-normal text-slate-500">
                  for "{grocerySearch}"
                </span>
              )}
            </h3>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
              {filteredGroceryItems.length} {filteredGroceryItems.length === 1 ? 'Pack' : 'Packs'} Available
            </span>
          </div>

          {filteredGroceryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredGroceryItems.map((item) => {
                const inCartItem = cartItems.find(c => c.id === item.id);
                const discount = item.mrp && item.mrp > item.price ? item.mrp - item.price : 0;
                const discountPercent = item.mrp && item.mrp > item.price ? Math.round((discount / item.mrp) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {item.tag}
                        </span>
                        {discountPercent > 0 && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </h4>

                      {/* Inclusions */}
                      {item.includes && (
                        <div className="mt-2.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Box Inclusions:
                          </span>
                          <div className="space-y-0.5">
                            {item.includes.map((inc, i) => (
                              <div key={i} className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-packs options list */}
                      {item.subServices && item.subServices.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Individual Items / Sub-Packs:
                          </span>
                          <div className="space-y-1">
                            {item.subServices.map((sub) => {
                              const inCartSub = cartItems.find(c => c.id === sub.id);
                              return (
                                <div 
                                  key={sub.id}
                                  className="p-2 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between text-xs gap-2"
                                >
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-800 block truncate">{sub.name}</span>
                                    <span className="text-[10px] text-slate-500 block truncate">{sub.desc}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="font-black text-emerald-800 text-xs">₹{sub.price}</span>
                                    {inCartSub ? (
                                      <div className="flex items-center gap-1 bg-emerald-700 text-white px-1.5 py-0.5 rounded-lg text-xs">
                                        <button onClick={() => updateQuantity(sub.id, -1)} className="p-0.5">
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="font-bold">{inCartSub.quantity}</span>
                                        <button onClick={() => updateQuantity(sub.id, 1)} className="p-0.5">
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => addToCart(sub)}
                                        className="px-2 py-1 bg-white hover:bg-emerald-700 hover:text-white text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold transition-colors shadow-2xs"
                                      >
                                        + Add
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-900">₹{item.price}</span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                        )}
                      </div>

                      {inCartItem ? (
                        <div className="flex items-center gap-2 bg-emerald-700 text-white px-2.5 py-1 rounded-xl shadow-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-emerald-800 rounded"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs">{inCartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-emerald-800 rounded"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Combo Pack
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No groceries found for "{grocerySearch}"</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for essentials like "milk", "vegetables", "rice", "dal", "curd", or "snacks".
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {['Milk', 'Vegetables', 'Rice', 'Curd', 'Snacks', 'Almonds'].map(suggest => (
                  <button
                    key={suggest}
                    onClick={() => {
                      setGrocerySearch(suggest);
                      setSelectedFilter('all');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl text-xs font-bold text-slate-700 border border-slate-200"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart Drawer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl h-fit space-y-4 sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Grocery Cart</h3>
                <span className="text-[10px] text-slate-400">{cartItems.length} items</span>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Your cart is empty</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Add daily fruits, vegetables or staples</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {cartItems.map(ci => (
                  <div key={ci.id} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-800 block truncate max-w-[130px]">{ci.name}</span>
                      <span className="text-[10px] text-slate-400">₹{ci.price} × {ci.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-extrabold text-emerald-800">₹{ci.price * ci.quantity}</span>
                      <button onClick={() => removeFromCart(ci.id)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between font-black text-sm text-slate-900">
                  <span>Cart Subtotal:</span>
                  <span className="text-emerald-800 text-base">₹{cartTotal}</span>
                </div>

                <button
                  onClick={() => onOpenCheckout(groceryCategory.items[0], groceryCategory)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-emerald-700 to-teal-800 hover:from-amber-600 hover:to-teal-900 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Proceed to 15-Min Delivery
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
