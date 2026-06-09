import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NotificationsPage from './pages/NotificationsPage';
import Resources from './pages/Resources.jsx';
import Booking from './pages/Booking.jsx';
import Calendar from './pages/Calendar.jsx';
import Reports from './pages/Reports.jsx';
import Sidebar from './components/Sidebar';
import './App.css';
/* add the rendering component imports here */
const DEFAULT_RESOURCES = [
  { id: 1, name: 'Lab A', status: 'available', available_time: new Date().toISOString() },
  { id: 2, name: 'Lab B', status: 'available', available_time: new Date().toISOString() },
  { id: 3, name: 'GPU Server Master', status: 'available', available_time: new Date().toISOString() },
  { id: 4, name: 'Meeting Room 1', status: 'available', available_time: new Date().toISOString() },
  { id: 5, name: 'Meeting Room 2', status: 'available', available_time: new Date().toISOString() },
  { id: 6, name: '3D Printer Rack', status: 'available', available_time: new Date().toISOString() },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('auth') === 'true'
  );
  
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('resources');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_RESOURCES; }
    }
    return DEFAULT_RESOURCES;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // PHASE 1: Prepopulate if empty
  useEffect(() => {
    if (bookings.length === 0) {
      const now = new Date();
      const past = new Date(now); past.setDate(past.getDate() - 1); past.setHours(14, 0, 0, 0); // Yesterday 2PM
      const present = new Date(now); present.setHours(10, 0, 0, 0); // Today 10AM
      const future = new Date(now); future.setDate(future.getDate() + 1); future.setHours(18, 0, 0, 0); // Tomorrow 6PM
      const nWeek = new Date(now); nWeek.setDate(nWeek.getDate() + 7); nWeek.setHours(9, 0, 0, 0); // Next week

      const initialBookings = [
        { id: Date.now() + 1, resourceId: 1, resourceName: 'Lab A', startTime: past.toISOString(), endTime: new Date(past.getTime() + 2 * 3600000).toISOString(), duration: 2, createdAt: past.toISOString() },
        { id: Date.now() + 2, resourceId: 2, resourceName: 'Lab B', startTime: present.toISOString(), endTime: new Date(present.getTime() + 2 * 3600000).toISOString(), duration: 2, createdAt: present.toISOString() },
        { id: Date.now() + 3, resourceId: 3, resourceName: 'GPU Server Master', startTime: future.toISOString(), endTime: new Date(future.getTime() + 3 * 3600000).toISOString(), duration: 3, createdAt: future.toISOString() },
        { id: Date.now() + 4, resourceId: 4, resourceName: 'Meeting Room 1', startTime: nWeek.toISOString(), endTime: new Date(nWeek.getTime() + 1 * 3600000).toISOString(), duration: 1, createdAt: nWeek.toISOString() },
      ];
      setBookings(initialBookings);
    }
  }, [bookings.length]);

  // PHASE 2: Auto-Release System
  useEffect(() => {
    const updateResourceStatus = () => {
      const now = new Date();
      setResources(prev => prev.map(res => {
        // Find if any booking for this resource is active NOW
        const activeBooking = bookings.find(b => {
          if (b.resourceId !== res.id) return false;
          const s = new Date(b.startTime);
          const e = new Date(b.endTime);
          return now >= s && now < e;
        });

        if (activeBooking) {
          return { ...res, status: 'busy', available_time: activeBooking.endTime };
        } else {
          return { ...res, status: 'available', available_time: now.toISOString() };
        }
      }));
    };

    updateResourceStatus();
    const intervalId = setInterval(updateResourceStatus, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [bookings]); // Re-run effect if bookings change

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    const toastId = Date.now();
    
    // Check if error
    const isError = notification.type === 'error';
    setToasts((prev) => [...prev, { ...notification, id: toastId, isError }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== toastId));
    }, 4000);
  };

  const handleBookResource = (resourceId, durationHours) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return reject('Resource not found');

        const now = new Date();
        const reqStart = now;
        const reqEnd = new Date(reqStart.getTime() + durationHours * 3600000);

        // PHASE 3: Conflict detection
        const conflict = bookings.some(b => {
          if (b.resourceId === resourceId) {
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);
            return (reqStart < bEnd && reqEnd > bStart);
          }
          return false;
        });

        if (conflict) {
          addNotification({ 
            id: Date.now(),
            type: 'error', 
            message: 'Conflict Detected', 
            detail: 'Resource already booked during this time' 
          });
          return reject('Resource already booked during this time');
        }

        // PHASE 4: AI Suggestions (Simple Rule-based)
        const resourceBookings = bookings.filter(b => b.resourceId === resourceId);
        const morningCount = resourceBookings.filter(b => new Date(b.startTime).getHours() < 12).length;
        const eveningCount = resourceBookings.filter(b => new Date(b.startTime).getHours() >= 17).length;
        
        let suggestion = 'Usage looks normal for this resource.';
        if (morningCount > eveningCount) suggestion = 'This resource is very busy during mornings. Next time try evening.';
        else if (eveningCount > morningCount) suggestion = 'This resource is busy during evenings. Next time try morning.';
        else if (resourceBookings.length > 2) suggestion = 'High usage detected recently. Booking earlier helps.';

        const newBooking = {
          id: Date.now(),
          resourceId,
          resourceName: resource.name,     // PHASE 9 Structure
          startTime: reqStart.toISOString(),
          endTime: reqEnd.toISOString(),
          duration: durationHours,
          createdAt: reqStart.toISOString()
        };

        setBookings(prev => [...prev, newBooking]);

        addNotification({
          id: Date.now(),
          type: 'success',
          message: 'Booking Successful',
          detail: `Booked ${resource.name} for ${durationHours} hours.`,
          feedback: suggestion,
          time: new Date().toLocaleTimeString()
        });

        resolve({
          resource: { ...resource, status: 'busy' },
          available_time: reqEnd.toISOString(),
          feedback: suggestion
        });
      }, 500); 
    });
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 relative">
      <Sidebar onLogout={handleLogout} />

      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard resources={resources} onBookResource={handleBookResource} addNotification={addNotification} />}
        />
        <Route
          path="/booking"
          element={<Booking resources={resources} onBookResource={handleBookResource} addNotification={addNotification} />}
        />
        <Route
          path="/resources"
          element={<Resources resources={resources} />}
        />
        <Route
          path="/calendar"
          element={<Calendar resources={resources} bookings={bookings} />}
        />
        <Route
          path="/reports"
          element={<Reports resources={resources} bookings={bookings} />}
        />
        <Route
          path="/notifications"
          element={<div className="flex flex-1 overflow-hidden"><NotificationsPage notifications={notifications} /></div>}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Toast Notifications Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-dark-800 border border-dark-600 shadow-2xl rounded-lg p-4 min-w-[250px] animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-sm font-semibold text-white">{toast.message}</p>
                <p className="text-xs text-dark-300 mt-1">{toast.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
