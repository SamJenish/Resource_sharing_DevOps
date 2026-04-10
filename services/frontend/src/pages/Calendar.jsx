import React, { useState, useMemo } from 'react';
import Header from '../components/Header';

// -- Date Helper Functions --
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday is 0
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getStartOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const formatTime = (date) => {
  return new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

// -- Main Component --
export default function Calendar({ resources, bookings }) {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // For modal

  // Calculate the days to display based on the view mode
  const displayDates = useMemo(() => {
    if (viewMode === 'week') {
      const startOfWeek = getStartOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
    } else {
      const startOfMonth = getStartOfMonth(currentDate);
      const startOfWeekOfMonth = getStartOfWeek(startOfMonth);
      const daysCount = 42; // 6 weeks * 7 days to cover the grid
      return Array.from({ length: daysCount }, (_, i) => addDays(startOfWeekOfMonth, i));
    }
  }, [currentDate, viewMode]);

  // Map bookings to resources
  const enrichedBookings = useMemo(() => {
    return bookings.map(b => {
      const resource = resources.find(r => r.id === b.resourceId);
      const startDate = new Date(b.createdAt);
      const endDate = new Date(startDate.getTime() + b.duration * 3600000);
      return {
        ...b,
        resourceName: resource ? resource.name : `Resource #${b.resourceId}`,
        startDate,
        endDate
      };
    });
  }, [bookings, resources]);

  // Get bookings for a specific day
  const getBookingsForDay = (date) => {
    return enrichedBookings.filter(b => isSameDay(b.startDate, date));
  };

  const handlePrev = () => {
    if (viewMode === 'week') setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(addMonths(currentDate, -1));
  };

  const handleNext = () => {
    if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const weekDaysHeader = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Handle selected date modal
  const selectedDayBookings = selectedDate ? getBookingsForDay(selectedDate) : [];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
      <Header title="SmartRes" subtitle="Advanced Calendar" />

      <div className="flex-1 overflow-y-auto bg-dark-900 p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-dark-800 border border-dark-650 p-4 rounded-xl mb-4 shrink-0 transition-all">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white w-48">{monthName}</h2>
              <div className="flex bg-dark-750 rounded-lg p-1 border border-dark-600">
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 text-xs font-semibold text-dark-100 hover:text-white transition-colors hover:bg-dark-650 rounded-md"
                >
                  ←
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-xs font-semibold text-dark-100 hover:text-white transition-colors hover:bg-dark-650 rounded-md"
                >
                  Today
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 text-xs font-semibold text-dark-100 hover:text-white transition-colors hover:bg-dark-650 rounded-md"
                >
                  →
                </button>
              </div>
            </div>

            <div className="flex bg-dark-750 rounded-lg p-1 border border-dark-600">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === 'week' ? 'bg-dark-600 text-white shadow-sm' : 'text-dark-200 hover:text-dark-50'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === 'month' ? 'bg-dark-600 text-white shadow-sm' : 'text-dark-200 hover:text-dark-50'}`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Grid Container */}
          <div className="flex-1 bg-dark-800 border border-dark-650 rounded-xl overflow-hidden flex flex-col transition-all duration-300">
            {/* Header Row */}
            <div className="grid grid-cols-7 border-b border-dark-650 bg-dark-850 shrink-0">
              {weekDaysHeader.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-dark-200 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className={`flex-1 grid grid-cols-7 ${viewMode === 'month' ? 'grid-rows-6' : 'grid-rows-1'} bg-dark-750 transition-all duration-300`}>
              {displayDates.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(date, new Date());
                const dayBookings = getBookingsForDay(date);
                const hasBookings = dayBookings.length > 0;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`border-b border-r border-dark-650 p-2 flex flex-col cursor-pointer transition-all hover:bg-dark-650 
                      ${isCurrentMonth ? 'bg-dark-800' : 'bg-dark-850/50 opacity-60'}
                      ${viewMode === 'week' ? 'h-full overflow-y-auto' : ''}
                      ${hasBookings && viewMode === 'month' ? 'bg-dark-800' : ''}
                    `}
                  >
                    {/* Cell Date Header */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold
                        ${isToday ? 'bg-accent-cyan text-dark-900' : 'text-dark-100'}
                      `}>
                        {date.getDate()}
                      </span>
                      {hasBookings && viewMode === 'week' && (
                        <span className="text-2xs text-dark-300 px-1.5 py-0.5 rounded bg-dark-750">{dayBookings.length} booking(s)</span>
                      )}
                    </div>

                    {/* Bookings Content */}
                    {viewMode === 'week' ? (
                      <div className="flex-1 space-y-2">
                        {dayBookings.map((b, i) => {
                          const now = new Date();
                          const isPast = b.endDate < now;
                          const isActive = b.startDate <= now && b.endDate >= now;
                          
                          let styles = "bg-accent-cyan/10 border-accent-cyan/20 hover:bg-accent-cyan/20";
                          if (isPast) styles = "bg-dark-750 border-dark-650 opacity-50 hover:opacity-80";
                          else if (isActive) styles = "bg-accent-cyan border-accent-cyan shadow-[0_0_15px_rgba(0,206,209,0.3)] z-10 transform hover:scale-[1.02] hover:shadow-accent-cyan/40";

                          return (
                            <div key={i} className={`border rounded-lg p-2.5 transition-all group relative cursor-help ${styles}`}>
                              <h4 className={`text-xs font-semibold truncate ${isActive ? 'text-dark-900' : (isPast ? 'text-dark-300' : 'text-accent-cyan')}`}>
                                {b.resourceName}
                              </h4>
                              <p className={`text-[10px] mt-1 ${isActive ? 'text-dark-800' : 'text-dark-200'}`}>
                                {formatTime(b.startDate)} - {formatTime(b.endDate)}
                              </p>
                              <p className={`text-[10px] mt-1 font-mono ${isActive ? 'text-dark-700' : 'text-dark-300'}`}>
                                {b.duration}h
                              </p>

                              {/* Hover Details */}
                              <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-2xl z-50 transition-all text-left">
                                <p className="text-xs font-bold text-white mb-0.5">{b.resourceName}</p>
                                <p className="text-[10px] text-dark-200 mb-2">{formatTime(b.startDate)} to {formatTime(b.endDate)}</p>
                                <p className="text-[10px] px-2 py-1 bg-dark-700 rounded w-max text-accent-cyan font-semibold">
                                  {isPast ? 'Completed session' : isActive ? 'Active right now' : 'Upcoming session'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-end gap-1 px-1">
                        {hasBookings && (
                          <div className="bg-accent-cyan/20 border border-accent-cyan/30 rounded px-1.5 py-0.5 w-full text-[10px] text-accent-cyan font-semibold truncate text-center">
                            {dayBookings.length} Booked
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Bookings Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedDate(null)}>
          <div className="w-full max-w-md bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-dark-650 flex justify-between items-center bg-dark-850">
              <h2 className="text-base font-semibold text-white">
                Bookings for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h2>
              <button onClick={() => setSelectedDate(null)} className="text-dark-300 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>
            
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {selectedDayBookings.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-3xl opacity-40 block mb-3">🗓️</span>
                  <p className="text-sm font-semibold text-white mb-1">No Bookings</p>
                  <p className="text-xs text-dark-300">All slots are free on this day.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayBookings.map((b, i) => (
                    <div key={i} className="bg-dark-750 border border-dark-600 rounded-lg p-4 relative overflow-hidden group hover:border-dark-500 transition-colors">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan group-hover:w-1.5 transition-all"></div>
                      <div className="flex justify-between items-start pl-2">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{b.resourceName}</h3>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-dark-200">
                            <span className="bg-dark-850 px-2 py-0.5 rounded text-[10px] text-accent-cyan font-mono border border-dark-650">#{b.resourceId}</span>
                            <span>{b.duration} hour(s)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-white bg-dark-650 px-2 py-1 rounded inline-block">{formatTime(b.startDate)}</div>
                          <div className="text-[10px] text-dark-400 mt-1 uppercase">to {formatTime(b.endDate)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-5 py-3 border-t border-dark-650 bg-dark-850">
               <button
                  onClick={() => setSelectedDate(null)}
                  className="w-full py-2.5 bg-dark-700 hover:bg-dark-600 text-xs font-semibold text-white rounded-lg transition-colors border border-dark-600"
               >
                  Close Panel
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
