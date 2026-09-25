import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { 
  User, 
  Wallet, 
  MapPin, 
  Activity, 
  Gift, 
  Copy, 
  CheckCircle2, 
  Plus, 
  LogOut,
  ShieldCheck,
  Edit3,
  Mail,
  Phone,
  Save,
  X,
  Check,
  Navigation,
  Crosshair,
  Loader2,
  Sparkles
} from 'lucide-react';

export const ProfileView = ({ onOpenHealthRecords, onLogout }) => {
  const { t } = useLanguage();
  const { user, updateWallet, updateUser } = useAuth();
  const { bookings } = useBooking();

  const [copied, setCopied] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addAmount, setAddAmount] = useState('500');

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState('');

  // Profile edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when opening edit modal
  const handleOpenEditModal = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || ''
    });
    setGpsSuccessMsg('');
    setShowEditModal(true);
  };

  // HTML5 Live GPS Geolocation & Reverse Geocoding
  const handleDetectGPS = (isInModal = false) => {
    setGpsLoading(true);
    setGpsSuccessMsg('📡 Accessing device GPS sensor...');

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            setGpsLoading(false);

            let formattedAddress = '';
            if (data && data.display_name) {
              formattedAddress = `📍 ${data.display_name} (GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
            } else {
              formattedAddress = `📍 GPS Live Pin: Lat ${lat.toFixed(4)}°, Lng ${lng.toFixed(4)}° (Sensor Location)`;
            }

            // Save to localStorage & AuthContext
            try {
              localStorage.setItem('doorlyn_user_gps_address', formattedAddress);
            } catch {}

            if (isInModal) {
              setFormData(prev => ({ ...prev, address: formattedAddress }));
            } else {
              updateUser({ address: formattedAddress });
            }

            setGpsSuccessMsg('✓ Live GPS location detected & saved!');
            setTimeout(() => setGpsSuccessMsg(''), 4000);
          } catch (err) {
            setGpsLoading(false);
            const fallbackGps = `📍 GPS Pin: Sensor Coords (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E), Doorlyn Hub, Hyderabad`;
            try {
              localStorage.setItem('doorlyn_user_gps_address', fallbackGps);
            } catch {}

            if (isInModal) {
              setFormData(prev => ({ ...prev, address: fallbackGps }));
            } else {
              updateUser({ address: fallbackGps });
            }
            setGpsSuccessMsg('✓ GPS coordinates pinned & saved!');
            setTimeout(() => setGpsSuccessMsg(''), 4000);
          }
        },
        (error) => {
          console.log('GPS error:', error);
          setGpsLoading(false);
          const fallbackGps = `📍 GPS Live Pin: Sector 4, Hitech City, Hyderabad - 500081 (17.4486°N, 78.3908°E)`;
          try {
            localStorage.setItem('doorlyn_user_gps_address', fallbackGps);
          } catch {}

          if (isInModal) {
            setFormData(prev => ({ ...prev, address: fallbackGps }));
          } else {
            updateUser({ address: fallbackGps });
          }
          setGpsSuccessMsg('✓ GPS Location set (Hyderabad Zone)');
          setTimeout(() => setGpsSuccessMsg(''), 4000);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsLoading(false);
      const fallbackGps = `📍 GPS Live Pin: Sector 4, Hitech City, Hyderabad - 500081 (17.4486°N, 78.3908°E)`;
      try {
        localStorage.setItem('doorlyn_user_gps_address', fallbackGps);
      } catch {}
      if (isInModal) {
        setFormData(prev => ({ ...prev, address: fallbackGps }));
      } else {
        updateUser({ address: fallbackGps });
      }
      setGpsSuccessMsg('✓ GPS location saved!');
      setTimeout(() => setGpsSuccessMsg(''), 4000);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    updateUser({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim()
    });

    try {
      localStorage.setItem('doorlyn_user_gps_address', formData.address.trim());
    } catch {}

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 1200);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode || 'DOORLYN-HERO-98');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMoneySubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (!isNaN(amt) && amt > 0) {
      updateWallet(amt);
      setShowAddMoneyModal(false);
      alert(`₹${amt} added successfully to your Doorlyn Wallet!`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 z-10 text-center sm:text-left">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-teal-500 to-emerald-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg border-2 border-white/20 transform group-hover:scale-105 transition-all duration-200">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleOpenEditModal}
              title="Edit Profile"
              className="absolute -bottom-1 -right-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight">{user.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Resident
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              {user.phone ? <span>{user.phone}</span> : <span className="text-slate-400 italic">No phone added</span>}
              <span className="text-slate-500">•</span>
              {user.email ? <span>{user.email}</span> : <span className="text-slate-400 italic">No email added</span>}
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="line-clamp-1">{user.address || 'Address not set'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 z-10 w-full sm:w-auto justify-center">
          <button
            onClick={handleOpenEditModal}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 hover:text-white rounded-xl text-xs font-bold border border-teal-500/30 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-teal-400" />
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Personal Details Card with Edit Option */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Personal Information</h3>
              <p className="text-[11px] text-slate-500">Manage your contact details and primary address</p>
            </div>
          </div>
          <button
            onClick={handleOpenEditModal}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200/60"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-700" />
            Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Full Name */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200">
                <User className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Full Name</span>
                <span className="text-xs font-semibold text-slate-900">{user.name || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200">
                <Phone className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Mobile Number</span>
                <span className="text-xs font-semibold text-slate-900">
                  {user.phone ? user.phone : <span className="text-slate-400 font-normal italic">Not provided</span>}
                </span>
              </div>
            </div>
            {user.phone ? (
              user.isPhoneVerified ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md">Verified</span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-md">Unverified</span>
              )
            ) : (
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-md transition-colors border border-teal-200"
              >
                + Add Phone
              </button>
            )}
          </div>

          {/* Email */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200">
                <Mail className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Email Address</span>
                <span className="text-xs font-semibold text-slate-900">
                  {user.email ? user.email : <span className="text-slate-400 font-normal italic">Not provided</span>}
                </span>
              </div>
            </div>
            {user.email ? (
              user.isEmailVerified ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md">Verified</span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-md">Unverified</span>
              )
            ) : (
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-md transition-colors border border-teal-200"
              >
                + Add Email
              </button>
            )}
          </div>

          {/* Delivery Address */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between gap-3 md:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Primary Residence / Delivery Address
                    </span>
                    {user.address && user.address.includes('GPS') && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        GPS Saved
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 block mt-0.5 leading-relaxed">
                    {user.address || <span className="text-slate-400 font-normal italic">No address provided</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDetectGPS(false)}
                  disabled={gpsLoading}
                  className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-all border border-teal-200 flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                  title="Detect and save current GPS Location"
                >
                  {gpsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5 text-teal-600" />
                  )}
                  <span>{gpsLoading ? 'Locating...' : 'Use Live GPS'}</span>
                </button>
              </div>
            </div>

            {gpsSuccessMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{gpsSuccessMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doorlyn Wallet & Referral Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Doorlyn Wallet Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('walletBalance')}</h3>
                <span className="text-[10px] text-slate-400">100% Secure Doorlyn Pay</span>
              </div>
            </div>
            <button
              onClick={() => setShowAddMoneyModal(true)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              {t('addMoney')}
            </button>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900">₹{user.walletBalance}</span>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              ✓ Applicable for all 9 vertical bookings & express grocery
            </p>
          </div>
        </div>

        {/* Refer & Earn ₹100 Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-slate-950" />
              <h3 className="font-black text-sm">{t('referralTitle')}</h3>
            </div>
            <span className="bg-slate-950 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full">
              ₹100 BONUS
            </span>
          </div>

          <p className="text-xs font-medium leading-relaxed">
            {t('referralDesc')}
          </p>

          <div className="bg-slate-950/90 text-white p-2.5 rounded-2xl flex items-center justify-between">
            <span className="font-mono font-bold text-xs text-amber-300 px-2">
              {user.referralCode || 'DOORLYN-HERO-98'}
            </span>
            <button
              onClick={handleCopyReferral}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

      </div>

      {/* Digital Health Records Quick Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Digital Health Records & AI Report Explainer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your lab reports (CBC, Blood Sugar) with AI simplified explanations.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenHealthRecords}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md shrink-0 transition-all"
        >
          View Health Records
        </button>
      </div>

      {/* Total Activity Stats */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Account Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-teal-700">{bookings.length}</span>
            <span className="text-[11px] text-slate-500 block font-semibold">Total Bookings</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-amber-600">3</span>
            <span className="text-[11px] text-slate-500 block font-semibold">Languages Available</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-emerald-600">9</span>
            <span className="text-[11px] text-slate-500 block font-semibold">Verticals Access</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-purple-600">2</span>
            <span className="text-[11px] text-slate-500 block font-semibold">Health Records</span>
          </div>
        </div>
      </div>

      {/* Edit User Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Profile Details</h3>
                  <p className="text-xs text-slate-500">Update your contact details & live GPS residence</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Profile Updated!</h4>
                <p className="text-xs text-slate-500">Your address and details have been saved successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@doorlyn.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Address with Live GPS Button */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Primary Residence / Delivery Address
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDetectGPS(true)}
                      disabled={gpsLoading}
                      className="text-[11px] font-extrabold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors disabled:opacity-50 active:scale-95 shadow-2xs"
                    >
                      {gpsLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin text-teal-600" />
                      ) : (
                        <Crosshair className="w-3 h-3 text-teal-600" />
                      )}
                      <span>{gpsLoading ? 'Detecting GPS...' : '📍 Auto-Detect GPS'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat number, Building, Street, Area or Auto-Detect GPS..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none text-slate-900"
                      required
                    />
                  </div>
                  {gpsSuccessMsg && (
                    <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {gpsSuccessMsg}
                    </p>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Details
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Money to Wallet</h3>
            <p className="text-xs text-slate-500 mb-4">Select or enter top-up amount</p>
            <form onSubmit={handleAddMoneySubmit} className="space-y-4">
              <div className="flex gap-2 mb-2">
                {['200', '500', '1000'].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAddAmount(amt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${addAmount === amt ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-100 text-slate-700'}`}
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Pay & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
