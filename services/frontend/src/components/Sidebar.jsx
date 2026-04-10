import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navSections = [
  {
    label: 'MANAGEMENT',
    items: [
      { icon: '◫', name: 'Dashboard', path: '/dashboard' },
      { icon: '☰', name: 'Resources', path: '/resources' },
      { icon: '▦', name: 'Bookings', path: '/booking' },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { icon: '⊡', name: 'Usage Stats', path: '/reports' },
      { icon: '◉', name: 'Performance', path: '/reports' },
      { icon: '◎', name: 'Reports', path: '/reports' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { icon: '◈', name: 'Calendar', path: '/calendar' },
      { icon: '⊙', name: 'Notifications', path: '/notifications' },
      { icon: '⚙', name: 'Settings', path: '/dashboard' },
    ],
  },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-[200px] min-w-[200px] h-screen bg-dark-850 border-r border-dark-650 flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-dark-650 shrink-0">
        <div className="w-6 h-6 rounded-md bg-accent-cyan flex items-center justify-center text-dark-900 text-xs font-bold">S</div>
        <span className="font-semibold text-sm text-white tracking-tight">SmartRes</span>
        <span className="ml-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-accent-amber/20 text-accent-amber uppercase">Pro</span>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 py-2 px-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-2xs font-semibold text-dark-200 uppercase tracking-wider">{section.label}</span>
              <span className="text-dark-300 text-xs cursor-pointer hover:text-dark-100 transition-colors">+</span>
            </div>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-lg text-[13px] font-medium transition-all duration-150 group
                    ${isActive 
                      ? 'bg-dark-700 text-white' 
                      : 'text-dark-100 hover:bg-dark-750 hover:text-white'
                    }`}
                >
                  <span className={`text-[11px] w-4 text-center ${isActive ? 'text-accent-cyan' : 'text-dark-300 group-hover:text-dark-100'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div className="px-3 py-3 border-t border-dark-650 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-xs font-bold text-white">A</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">Admin User</div>
            <div className="text-2xs text-dark-200">admin@system</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-2xs text-dark-300 hover:text-accent-rose transition-colors text-left px-1"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
