import React, { useState } from 'react';

export default function BookingModal({ resource, onBookResource, onClose, onBooked }) {
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleBook = async (e) => {
    e.preventDefault();
    if (!duration || parseInt(duration) < 1) return;

    setLoading(true);
    setError('');
    
    try {
      // using the local hook passed down from App
      const bookingData = await onBookResource(resource.id, parseInt(duration));
      setResult(bookingData);
      onBooked(bookingData);
    } catch (err) {
      setError(err || 'Booking failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-dark-650">
            <div>
              <h2 className="text-sm font-semibold text-white">Book Resource</h2>
              <p className="text-2xs text-dark-200 mt-0.5">{resource.name}</p>
            </div>
            <button onClick={onClose} className="text-dark-300 hover:text-white transition-colors text-lg leading-none">×</button>
          </div>

          {!result ? (
            <form onSubmit={handleBook} className="p-5">
              {error && (
                <div className="mb-3 p-2.5 rounded-lg bg-accent-rose/10 border border-accent-rose/20 text-xs text-accent-rose">
                  {error}
                </div>
              )}

              {/* Resource info */}
              <div className="bg-dark-750 rounded-lg p-3 mb-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-300">Resource</span>
                  <span className="text-white font-medium">{resource.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-300">Status</span>
                  <span className="text-accent-green text-2xs font-semibold uppercase">Available</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-300">ID</span>
                  <span className="text-dark-100">#{resource.id}</span>
                </div>
              </div>

              {/* Duration input */}
              <label className="block text-2xs font-semibold text-dark-200 uppercase tracking-wider mb-1.5">
                Duration (hours)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2"
                required
                className="w-full bg-dark-750 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all mb-4"
              />

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium text-dark-100 bg-dark-700 hover:bg-dark-650 border border-dark-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !duration}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white bg-accent-cyan hover:bg-accent-cyan/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-5">
              {/* Success state */}
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-sm font-semibold text-white">Booking Confirmed</h3>
              </div>

              <div className="bg-dark-750 rounded-lg p-3 mb-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-300">Resource</span>
                  <span className="text-white font-medium">{result.resource.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-300">Available at</span>
                  <span className="text-dark-50">{new Date(result.available_time).toLocaleString()}</span>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-accent-violet/10 border border-accent-violet/20 mb-4">
                <span className="text-sm mt-0.5">🤖</span>
                <p className="text-xs text-dark-100 leading-relaxed">{result.feedback}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-dark-600 hover:bg-dark-500 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
