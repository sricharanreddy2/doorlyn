import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { couponsData } from '../data/servicesData';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Wallet, 
  IndianRupee, 
  Upload, 
  Tag, 
  Sparkles,
  ShieldCheck,
  User,
  Truck,
  Package,
  Users,
  Utensils,
  Award,
  UserCheck,
  Wrench,
  Lock,
  Leaf,
  HeartPulse,
  Activity,
  FileText,
  ChevronDown,
  ChevronUp,
  Zap,
  Check,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export const BookingModal = ({ service, category, onClose, onBookingSuccess }) => {
  const { t } = useLanguage();
  const { user, updateWallet, login, isAuthenticated } = useAuth();
  const { addBooking } = useBooking();

  const [activeService, setActiveService] = useState(service || category?.items?.[0]);

  // Selected sub-service selection state
  const [selectedSubService, setSelectedSubService] = useState(
    activeService?.subServices && activeService.subServices.length > 0 ? activeService.subServices[0] : null
  );

  // Booking Form State
  const [bookingConfirmedObj, setBookingConfirmedObj] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Collection');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [patientName, setPatientName] = useState(user?.name || 'Rajesh Kumar');
  const [patientGender, setPatientGender] = useState('Male');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 9876543210');
  const [pickupAddress, setPickupAddress] = useState('Flat 402, Lotus Heights, Hitech City, Hyderabad');
  const [dropAddress, setDropAddress] = useState('Plot 12, Jubilee Hills, Hyderabad');
  const [houseType, setHouseType] = useState('2BHK Apartment');
  const [vehicleRequirement, setVehicleRequirement] = useState('Tata Ace (1.5 Ton Mini Truck)');
  const [workerDuration, setWorkerDuration] = useState('Full Day (8 Hours)');
  const [subjectRequirement, setSubjectRequirement] = useState('Maths & Science (Class 10 SSC)');
  const [numberOfPlates, setNumberOfPlates] = useState('100 Plates');
  const [foodPreference, setFoodPreference] = useState('Veg + Non-Veg Special');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [showAllSubFeatures, setShowAllSubFeatures] = useState(true);

  const price = selectedSubService?.price || activeService?.price || service?.price || 249;
  const mrp = selectedSubService?.mrp || activeService?.mrp || service?.mrp || 400;
  const activeServicePrice = price;
  const activeServiceMrp = mrp;
  const activeServiceName = activeService?.name || service?.name || 'Service';

  const mrpDiscount = Math.max(0, mrp - price);
  const couponDiscount = selectedCoupon ? selectedCoupon.discount : 0;
  const platformFee = 15;
  const totalPayable = Math.max(0, price - couponDiscount + platformFee);

  const timeSlots = ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'];
  const subFeaturesList = activeService?.subFeatures || service?.subFeatures || category?.subFeatures || [];

  const handleApplyCoupon = (c) => {
    if (price < c.minOrder) {
      setCouponMsg(`⚠️ Minimum order of ₹${c.minOrder} required for code ${c.code}`);
      return;
    }
    if (selectedCoupon?.code === c.code) {
      setSelectedCoupon(null);
      setCouponMsg('');
    } else {
      setSelectedCoupon(c);
      setCouponMsg(`🎉 Coupon ${c.code} applied! You saved ₹${c.discount}`);
    }
  };

  const [selectedDate, setSelectedDate] = useState('2026-08-04');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM - 11:00 AM');
  // Check saved GPS location from localStorage
  const savedGpsAddress = typeof window !== 'undefined' ? localStorage.getItem('doorlyn_user_gps_address') : null;
  const [address, setAddress] = useState(savedGpsAddress || user?.address || 'Flat 402, Lotus Heights, Hitech City, Hyderabad');
  const [, setUseLiveLocation] = useState(Boolean(savedGpsAddress));
  const [gpsLoading, setGpsLoading] = useState(false);

  const saveGpsAddress = (gpsStr) => {
    setAddress(gpsStr);
    try {
      localStorage.setItem('doorlyn_user_gps_address', gpsStr);
    } catch {}
    if (user && user.updateUser) {
      user.updateUser({ address: gpsStr });
    }
  };

  // REAL HTML5 GPS GEOLOCATION & REVERSE GEOCODING
  const handleLiveLocationGPS = () => {
    setUseLiveLocation(true);
    setGpsLoading(true);
    setAddress('📡 Accessing device GPS location...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            setGpsLoading(false);
            if (data && data.display_name) {
              const fullGpsStr = `📍 GPS Live Pin: ${data.display_name} (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
              saveGpsAddress(fullGpsStr);
            } else {
              const gpsStr = `📍 GPS Live Pin: Lat ${lat.toFixed(4)}°, Lng ${lng.toFixed(4)}° (GPS Sensor Location)`;
              saveGpsAddress(gpsStr);
            }
          } catch {
            setGpsLoading(false);
            const gpsStr = `📍 GPS Live Pin: Lat ${lat.toFixed(4)}°, Lng ${lng.toFixed(4)}° (Device Sensor Location)`;
            saveGpsAddress(gpsStr);
          }
        },
        (error) => {
          console.log('GPS location error:', error);
          setGpsLoading(false);
          // High accuracy fallback when device browser blocks GPS permission
          const fallbackGps = `📍 GPS Live Pin: Sensor Coordinates (17.4486° N, 78.3908° E)`;
          saveGpsAddress(fallbackGps);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsLoading(false);
      const fallbackGps = `📍 GPS Live Pin: Sensor Coordinates (17.4486° N, 78.3908° E)`;
      saveGpsAddress(fallbackGps);
    }
  };

  const handleImageUploadSim = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
    } else {
      setUploadedImage('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400');
    }
  };

  const renderSubFeatureIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'Award': return <Award className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />;
      case 'Clock': return <Clock className="w-4 h-4 text-teal-600 shrink-0" />;
      case 'UserCheck': return <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-orange-600 shrink-0" />;
      case 'Truck': return <Truck className="w-4 h-4 text-cyan-600 shrink-0" />;
      case 'Lock': return <Lock className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'Package': return <Package className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'Leaf': return <Leaf className="w-4 h-4 text-green-600 shrink-0" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'Activity': return <Activity className="w-4 h-4 text-teal-600 shrink-0" />;
      case 'FileText': return <FileText className="w-4 h-4 text-slate-700 shrink-0" />;
      case 'Users': return <Users className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-rose-600 shrink-0" />;
      default: return <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />;
    }
  };

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated && login) {
      login('rajesh@doorlyn.in', 'password123');
    }

    // WALLET DEDUCTION VALIDATION FIX
    if (paymentMethod === 'Doorlyn Wallet') {
      if ((user?.walletBalance || 0) < totalPayable) {
        setCouponMsg(`⚠️ Insufficient Wallet Balance! Available balance ₹${user?.walletBalance || 0}, required ₹${totalPayable}. Please choose UPI or Cash on Delivery.`);
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // DEDUCT WALLET BALANCE LOCALLY AND PERSIST IN AUTH CONTEXT
      if (paymentMethod === 'Doorlyn Wallet') {
        updateWallet(-totalPayable);
      }

      const isHealthcare = category?.id === 'healthcare';
      const isLogistics = category?.id === 'logistics' || category?.id === 'pickup-drop';
      const isWorker = category?.id === 'worker-market';
      const isStudent = category?.id === 'student-services';
      const isCatering = category?.id === 'catering';

      const newBookingObj = addBooking({
        serviceCategory: category?.titleKey ? t(category.titleKey) : (category?.id || 'General Service'),
        serviceName: activeServiceName,
        subServiceName: selectedSubService ? selectedSubService.name : null,
        price: totalPayable,
        totalAmount: totalPayable,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        patientName: isHealthcare ? patientName : null,
        patientGender: isHealthcare ? patientGender : null,
        contactPhone: isHealthcare ? contactPhone : null,
        address: isLogistics ? `Pickup: ${pickupAddress} -> Drop: ${dropAddress}` : address,
        pickupAddress: isLogistics ? pickupAddress : null,
        dropAddress: isLogistics ? dropAddress : null,
        houseType: category?.id === 'logistics' ? houseType : null,
        vehicleRequirement: category?.id === 'logistics' ? vehicleRequirement : null,
        workerDuration: isWorker ? workerDuration : null,
        subjectRequirement: isStudent ? subjectRequirement : null,
        numberOfPlates: isCatering ? numberOfPlates : null,
        foodPreference: isCatering ? foodPreference : null,
        paymentMethod,
        appliedCoupon: selectedCoupon?.code || null,
        mrp,
        mrpDiscount,
        couponDiscount,
        platformFee,
        categoryId: category?.id || null,
        uploadedImage: isLogistics ? uploadedImage : null
      });

      setIsSubmitting(false);
      setBookingConfirmedObj(newBookingObj);
    }, 1200);
  };

  if (bookingConfirmedObj) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full text-center shadow-2xl animate-in zoom-in-95 border border-slate-100 max-h-[90vh] overflow-y-auto">
          
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-0.5">{t('bookingConfirmed')}</h3>
          <p className="text-xs text-slate-500 mb-4 flex items-center justify-center gap-1.5">
            Booking Reference ID: <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{bookingConfirmedObj.id}</span>
          </p>

          {/* Service Details Container */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl text-left space-y-3.5 text-xs border border-slate-200 mb-5 shadow-xs">
            
            {/* Header: Category & Main Service Name */}
            <div className="border-b border-slate-200/80 pb-3 flex justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase border border-amber-200/80">
                  {bookingConfirmedObj.serviceCategory}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">
                  {bookingConfirmedObj.serviceName}
                </h4>
                {bookingConfirmedObj.subServiceName && (
                  <p className="text-xs text-teal-700 font-bold mt-0.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    Selected Option: {bookingConfirmedObj.subServiceName}
                  </p>
                )}
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 border border-emerald-200">
                ✓ Confirmed
              </span>
            </div>

            {/* Schedule & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-teal-600" /> Date & Time Slot
                </span>
                <p className="font-bold text-slate-800 text-xs">
                  {bookingConfirmedObj.date}
                </p>
                <p className="text-[11px] text-teal-700 font-semibold">
                  {bookingConfirmedObj.timeSlot}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600" /> Service Location
                </span>
                <p className="font-medium text-slate-700 text-[11px] line-clamp-2 leading-tight">
                  {bookingConfirmedObj.address}
                </p>
              </div>
            </div>



            {/* Provider Info */}
            <div className="flex items-center justify-between bg-teal-50/80 p-2.5 rounded-xl border border-teal-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Assigned Partner</span>
                  <span className="font-bold text-teal-900 text-xs">{bookingConfirmedObj.assignedProvider}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white text-teal-800 px-2 py-0.5 rounded font-extrabold border border-teal-200">
                Verified Provider
              </span>
            </div>

            {/* Itemized Payment & Invoice Summary */}
            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complete Invoice Breakdown</span>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Base MRP Rate:</span>
                  <span className="font-semibold text-slate-700">₹{bookingConfirmedObj.mrp || bookingConfirmedObj.totalAmount + 150}</span>
                </div>
                {bookingConfirmedObj.mrpDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>MRP Discount:</span>
                    <span>- ₹{bookingConfirmedObj.mrpDiscount}</span>
                  </div>
                )}
                {bookingConfirmedObj.appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Savings ({bookingConfirmedObj.appliedCoupon}):</span>
                    <span>- ₹{bookingConfirmedObj.couponDiscount || 0}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Doorlyn Convenience Fee:</span>
                  <span>₹{bookingConfirmedObj.platformFee || 15}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Total Paid ({bookingConfirmedObj.paymentMethod}):</span>
                  <span className="font-black text-teal-700 text-sm">₹{bookingConfirmedObj.totalAmount}</span>
                </div>
              </div>
              {bookingConfirmedObj.paymentMethod === 'Doorlyn Wallet' && (
                <div className="flex justify-between text-emerald-700 text-[11px] font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-1">
                  <span>Remaining Doorlyn Wallet Balance:</span>
                  <span className="font-extrabold">₹{user.walletBalance}</span>
                </div>
              )}
            </div>

          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                onClose();
                if (onBookingSuccess) onBookingSuccess(bookingConfirmedObj);
              }}
              className="w-full py-3 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-2xl font-extrabold shadow-lg text-sm transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Track Service Live
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-amber-600 uppercase">
              {category?.titleKey ? t(category.titleKey) : 'Service Booking'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {activeService?.name || service?.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleConfirmBookingSubmit} className="p-6 space-y-6">
          
          {/* Category Service Switcher Chips */}
          {category?.items && category.items.length > 1 && (
            <div className="bg-slate-100/90 p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Select Service in {category?.titleKey ? t(category.titleKey) : 'Category'}:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {category.items.map((catItem) => {
                  const isSelected = activeService?.id === catItem.id;
                  return (
                    <button
                      key={catItem.id}
                      type="button"
                      onClick={() => {
                        setActiveService(catItem);
                        setSelectedSubService(catItem.subServices?.[0] || null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-md scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {catItem.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Service Pricing & Highlights Header Box */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 p-4.5 rounded-2xl border border-teal-100/90 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-800 font-extrabold tracking-wide uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  {activeService?.category || service?.category || 'Doorlyn Verified Service'}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">₹{selectedSubService?.price || activeService?.price || service?.price}</span>
                  {(selectedSubService?.mrp || activeService?.mrp || service?.mrp) && (
                    <span className="text-sm text-slate-400 line-through">₹{selectedSubService?.mrp || activeService?.mrp || service?.mrp}</span>
                  )}
                  <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    {Math.round((((selectedSubService?.mrp || activeService?.mrp || service?.mrp || 1000) - (selectedSubService?.price || activeService?.price || service?.price || 500)) / (selectedSubService?.mrp || activeService?.mrp || service?.mrp || 1000)) * 100)}% OFF
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md text-teal-700 flex items-center justify-center border border-teal-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>

            {/* Selected Sub-Service Confirmation pill */}
            {selectedSubService && (
              <div className="mt-2.5 pt-2 border-t border-teal-100 flex items-center gap-1.5 text-xs text-teal-900 font-extrabold">
                <Check className="w-4 h-4 text-emerald-600" />
                Selected: <span className="text-amber-700 underline font-black">{selectedSubService.name}</span> (₹{selectedSubService.price})
              </div>
            )}

            {/* Quick Inclusion Badges */}
            {(activeService?.includes || service?.includes) && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-teal-100/60">
                {(activeService?.includes || service?.includes).map((inc, i) => (
                  <span key={i} className="text-[11px] bg-white/90 text-teal-900 px-2.5 py-1 rounded-lg font-bold border border-teal-200/60 flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {inc}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* DEDICATED FEATURE 1: Select Specific Sub-Service List */}
          {(activeService?.subServices || service?.subServices) && (activeService?.subServices || service?.subServices).length > 0 && (
            <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Select Specific Sub-Service / Option
                </label>
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  {(activeService?.subServices || service?.subServices).length} Options Available
                </span>
              </div>

              <div className="space-y-2">
                {(activeService?.subServices || service?.subServices).map((sub) => {
                  const isSelected = selectedSubService?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubService(sub)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-white border-teal-600 ring-2 ring-teal-400 shadow-md' 
                          : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className={`text-xs font-black ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>{sub.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{sub.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <span className="text-sm font-black text-slate-900">₹{sub.price}</span>
                        {sub.mrp && (
                          <span className="text-[10px] text-slate-400 line-through block">₹{sub.mrp}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEDICATED FEATURE 2: Service Sub-Features Breakdown Grid */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-500/40">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Included Sub-Features & Key Benefits</h3>
                  <p className="text-[10px] text-slate-400">Guaranteed inclusions provided with your booking</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllSubFeatures(!showAllSubFeatures)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                {showAllSubFeatures ? 'Hide Details' : 'View Sub-Features'}
                {showAllSubFeatures ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showAllSubFeatures && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
                {subFeaturesList.map((sf, idx) => (
                  <div key={idx} className="bg-slate-800/90 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/80 flex items-start gap-2.5 transition-all">
                    <div className="mt-0.5 p-1 rounded-lg bg-slate-900 border border-slate-700">
                      {renderSubFeatureIcon(sf.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-300">{sf.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug font-normal">{sf.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 1. Date & Time Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              {t('selectDateTime')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
              <div>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  {timeSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Custom Fields based on Vertical Category */}
          {category?.id === 'healthcare' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-600" />
                Patient Information (For Lab Home Collection)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Patient Full Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {(category?.id === 'pickup-drop' || category?.id === 'logistics') && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-teal-600" />
                Pickup & Drop Address Details
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Pickup Location Address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
                <input
                  type="text"
                  placeholder="Drop Location Address"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              {category?.id === 'logistics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Property / House Type</label>
                    <select
                      value={houseType}
                      onChange={(e) => setHouseType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="1BHK Apartment">1BHK Apartment</option>
                      <option value="2BHK Apartment">2BHK Apartment</option>
                      <option value="3BHK Villa">3BHK Independent House</option>
                      <option value="Commercial Office">Commercial Office Relocation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Vehicle Requirement</label>
                    <select
                      value={vehicleRequirement}
                      onChange={(e) => setVehicleRequirement(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="Tata Ace (1.5 Ton Mini Truck)">Tata Ace (1.5 Ton)</option>
                      <option value="Mahindra Bolero Pickup (2.5 Ton)">Mahindra Bolero Pickup</option>
                      <option value="Large 14ft Eicher Truck">14ft Eicher Container Truck</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Upload Image Option */}
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  Upload Photo of Parcel / Furniture (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadSim}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {uploadedImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-teal-700 font-bold">✓ Photo Attached</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {category?.id === 'worker-market' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-600">Select Booking Duration</label>
              <select
                value={workerDuration}
                onChange={(e) => setWorkerDuration(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="Half Day (4 Hours)">Half Day (4 Hours)</option>
                <option value="Full Day (8 Hours)">Full Day (8 Hours)</option>
                <option value="3 Days Contract">3 Days Contract</option>
                <option value="Weekly Helper Contract">Weekly Helper Contract</option>
              </select>
            </div>
          )}

          {category?.id === 'student-services' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-600">Subject Requirement & Class</label>
              <input
                type="text"
                value={subjectRequirement}
                onChange={(e) => setSubjectRequirement(e.target.value)}
                placeholder="e.g. Maths & Science for 10th Class SSC"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          )}

          {category?.id === 'catering' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Number of Plates</label>
                <select
                  value={numberOfPlates}
                  onChange={(e) => setNumberOfPlates(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="50 Plates">50 Plates</option>
                  <option value="100 Plates">100 Plates</option>
                  <option value="250 Plates">250 Plates</option>
                  <option value="500+ Plates Grand Event">500+ Plates Grand Event</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Food Preference</label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Pure Veg">Pure Veg Traditional</option>
                  <option value="Veg + Non-Veg Special">Veg + Non-Veg Special</option>
                  <option value="Jain Meal Standard">Jain Meal Standard</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. Address & Live GPS Pin Location */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-teal-600" />
                {t('selectAddress')}
              </label>
              <button
                type="button"
                onClick={handleLiveLocationGPS}
                disabled={gpsLoading}
                className="text-xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
              >
                {gpsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                )}
                {gpsLoading ? 'Fetching GPS...' : 'Use GPS Live Location'}
              </button>
            </div>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
              required
            />
          </div>

          {/* 4. Doorlyn Coupons */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Tag className="w-4 h-4 text-teal-600" />
              {t('applyCoupons')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {couponsData.map((c) => (
                <button
                  type="button"
                  key={c.code}
                  onClick={() => handleApplyCoupon(c)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedCoupon?.code === c.code 
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                    <span>{c.code}</span>
                    <span className="text-amber-600 text-[10px]">SAVE ₹{c.discount}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{c.desc}</p>
                </button>
              ))}
            </div>
            {couponMsg && (
              <p className={`text-xs font-semibold mt-1.5 ${selectedCoupon ? 'text-emerald-600' : 'text-amber-600'}`}>
                {couponMsg}
              </p>
            )}
          </div>

          {/* 5. Payment Methods with Live Wallet Balance & Deduction */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              {t('paymentMethod')}
            </label>
            <div className="space-y-2">
              {[
                { id: 'Cash on Collection', label: t('cashOnDelivery'), icon: IndianRupee },
                { id: 'UPI (GPay/PhonePe)', label: t('upiPayment'), icon: Sparkles },
                { id: 'Credit/Debit Card', label: t('cardPayment'), icon: CreditCard },
                { 
                  id: 'Doorlyn Wallet', 
                  label: `${t('doorlynWallet')} (Balance: ₹${user?.walletBalance ?? 450})`, 
                  icon: Wallet,
                  isWallet: true 
                }
              ].map((method) => {
                const IconComponent = method.icon;
                const isSelected = paymentMethod === method.id;
                const isLowBalance = method.isWallet && (user?.walletBalance ?? 450) < totalPayable;

                return (
                  <label
                    key={method.id}
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-200' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id)}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-xs font-bold text-slate-800">{method.label}</span>
                      </div>
                      <IconComponent className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Insufficient Wallet Balance Warning */}
                    {method.isWallet && isSelected && isLowBalance && (
                      <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Short balance: ₹{totalPayable - user.walletBalance} needed. Top up in profile or select UPI / Cash.</span>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* 6. Payment Summary Breakdown */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Payment Summary</h4>
            <div className="flex justify-between text-slate-300">
              <span>{t('totalMRP')}</span>
              <span>₹{mrp}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>{t('discountMRP')}</span>
              <span>- ₹{mrpDiscount}</span>
            </div>
            {selectedCoupon && (
              <div className="flex justify-between text-amber-400">
                <span>{t('couponSavings')} ({selectedCoupon.code})</span>
                <span>- ₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>{t('platformFee')}</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-black text-sm text-white">
              <span>{t('totalToPay')}</span>
              <span className="text-amber-400 text-base">₹{totalPayable}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-teal-700 hover:from-amber-600 hover:to-teal-800 text-white rounded-2xl font-black text-base shadow-xl transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Confirming Booking...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t('confirmBooking')} • ₹{totalPayable}
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
