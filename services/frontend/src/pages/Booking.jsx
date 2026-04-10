import React, { useState } from 'react';
import Header from '../components/Header';
import BookingModal from '../components/BookingModal';

export default function Booking({ resources, onBookResource, addNotification }) {
  const [bookingResource, setBookingResource] = useState(null);

  const availableResources = resources.filter(r => r.status === 'available');

  const handleBooked = (data) => {
    addNotification({
      id: Date.now(),
      type: 'success',
      message: `"${data.resource.name}" booked`,
      detail: `Available at ${new Date(data.available_time).toLocaleString()}`,
      time: new Date().toLocaleTimeString()
    });
    setBookingResource(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title="SmartRes" subtitle="Book a Resource" />
      
      <div className="flex-1 overflow-y-auto bg-dark-900 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-white mb-2">Book a Resource</h1>
          <p className="text-sm text-dark-300 mb-6">Select from currently available resources below to make a booking.</p>
          
          {availableResources.length === 0 ? (
            <div className="p-10 border border-dark-650 border-dashed rounded-xl text-center">
              <span className="text-3xl opacity-50 mb-3 block">🏜️</span>
              <p className="text-sm font-semibold text-white mb-1">No resources available</p>
              <p className="text-xs text-dark-300">All resources are currently busy. Check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableResources.map(r => (
                <div key={r.id} className="bg-dark-800 rounded-xl border border-dark-650 p-4 flex items-center justify-between group hover:border-accent-cyan/50 transition-colors">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{r.name}</h3>
                    <p className="text-2xs text-dark-300 mt-0.5">Ready to use</p>
                  </div>
                  <button 
                    onClick={() => setBookingResource(r)}
                    className="px-4 py-2 rounded-lg bg-dark-700 text-xs font-semibold text-white hover:bg-accent-cyan hover:text-dark-900 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Reusing the existing BookingModal for the actual input logic */}
      {bookingResource && (
        <BookingModal
          resource={bookingResource}
          onBookResource={onBookResource}
          onClose={() => setBookingResource(null)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}
