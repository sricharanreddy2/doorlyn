import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';

const BookingContext = createContext();

const initialBookings = [
  {
    id: 'DLN-89421',
    serviceCategory: 'Healthcare & Diagnostic',
    serviceName: 'Full Body Checkup + CBC Test',
    date: '2026-08-03',
    timeSlot: '08:00 AM - 09:00 AM',
    patientName: 'Rajesh Kumar',
    patientGender: 'Male',
    contactPhone: '+91 9876543210',
    address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad, Telangana',
    paymentMethod: 'UPI (Google Pay)',
    totalAmount: 999,
    status: 'Confirmed',
    assignedProvider: 'Apollo Diagnostic Lab Care',
    trackingSteps: [
      { step: 'Order Confirmed', time: '10:15 AM', done: true },
      { step: 'Phlebotomist Assigned', time: '10:18 AM', done: true },
      { step: 'En Route to Home', time: 'Est 07:45 AM Tomorrow', done: false },
      { step: 'Sample Collected', time: 'Pending', done: false },
      { step: 'Report Uploaded', time: 'Pending', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'DLN-77312',
    serviceCategory: 'Home Repairs',
    serviceName: 'Electrician - Fan Repair & Wiring',
    date: '2026-08-01',
    timeSlot: '02:00 PM - 03:00 PM',
    address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad',
    paymentMethod: 'Cash on Collection',
    totalAmount: 350,
    status: 'Completed',
    assignedProvider: 'Srinivas Rao (Verified Technician ★ 4.9)',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  const addBooking = (newBookingData) => {
    const bookingId = `DLN-${Math.floor(10000 + Math.random() * 90000)}`;

    let savedGpsAddress = null;
    try {
      savedGpsAddress = localStorage.getItem('doorlyn_user_gps_address');
    } catch {}

    // Determine final booking address, prioritizing active GPS location
    let finalAddress = newBookingData.address;
    if (savedGpsAddress) {
      if (!finalAddress || finalAddress.includes('Flat 402, Lotus Heights') || finalAddress.includes('Village Green')) {
        finalAddress = savedGpsAddress;
      }
    }

    const newBooking = {
      id: bookingId,
      ...newBookingData,
      address: finalAddress || newBookingData.address || '📍 GPS Live Pin Location',
      status: 'Confirmed',
      assignedProvider: 'Doorlyn Verified Partner Agent (Ramesh Kumar ★ 4.9)',
      createdAt: new Date().toISOString(),
      trackingSteps: [
        { step: 'Booking Confirmed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { step: 'Provider / Agent Assigned', time: 'Just now', done: true },
        { step: 'En Route / Items Picked Up', time: 'In Progress', done: false },
        { step: 'Service / Order Delivered', time: 'Est 30 mins', done: false }
      ]
    };

    setBookings(prev => [newBooking, ...prev]);
    
    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      console.log('Confetti triggered');
    }

    return newBooking;
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      cancelBooking,
      activeTrackingOrder,
      setActiveTrackingOrder
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
