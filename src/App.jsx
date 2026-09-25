import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { BookingModal } from './components/BookingModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { IVRSModal } from './components/IVRSModal';
import { HealthRecordModal } from './components/HealthRecordModal';

import { HomeView } from './views/HomeView';
import { AssistantView } from './views/AssistantView';
import { BookingsView } from './views/BookingsView';
import { ProfileView } from './views/ProfileView';
import { GroceryView } from './views/GroceryView';
import { AuthView } from './views/AuthView';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const { activeTrackingOrder, setActiveTrackingOrder } = useBooking();

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [bookingModalData, setBookingModalData] = useState(null); // { service, category }
  const [showIVRS, setShowIVRS] = useState(false);
  const [showHealthRecords, setShowHealthRecords] = useState(false);

  const handleOpenBookingModal = (service, category) => {
    setBookingModalData({ service, category });
  };

  const handleTriggerAIBooking = (serviceObj) => {
    setBookingModalData({
      service: serviceObj,
      category: { id: 'healthcare', titleKey: 'catHealthcare' }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      
      {/* Global Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenIVRS={() => setShowIVRS(true)}
        onOpenBookingModal={handleOpenBookingModal}
        onNavigateToGrocery={() => setActiveTab('grocery')}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {activeTab === 'auth' && (
          <AuthView onAuthSuccess={() => setActiveTab('home')} />
        )}

        {activeTab === 'home' && (
          <HomeView
            onNavigateToAI={() => setActiveTab('ai-assistant')}
            onNavigateToGrocery={() => setActiveTab('grocery')}
            onOpenBookingModal={handleOpenBookingModal}
            onOpenIVRS={() => setShowIVRS(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AssistantView
            onTriggerBooking={handleTriggerAIBooking}
            onOpenHealthRecords={() => setShowHealthRecords(true)}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsView
            onOpenTracking={(booking) => setActiveTrackingOrder(booking)}
          />
        )}

        {activeTab === 'grocery' && (
          <GroceryView
            onOpenCheckout={(service, category) => handleOpenBookingModal(service, category)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            onOpenHealthRecords={() => setShowHealthRecords(true)}
            onLogout={() => {
              logout();
              setActiveTab('auth');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      {bookingModalData && (
        <BookingModal
          service={bookingModalData.service}
          category={bookingModalData.category}
          onClose={() => setBookingModalData(null)}
          onBookingSuccess={(createdBooking) => {
            setBookingModalData(null);
            setActiveTrackingOrder(createdBooking);
          }}
        />
      )}

      {activeTrackingOrder && (
        <LiveTrackingModal
          booking={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {showIVRS && (
        <IVRSModal onClose={() => setShowIVRS(false)} />
      )}

      {showHealthRecords && (
        <HealthRecordModal onClose={() => setShowHealthRecords(false)} />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
