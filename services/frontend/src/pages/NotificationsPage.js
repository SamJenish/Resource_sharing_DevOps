import React from 'react';
import Header from '../components/Header';

export default function NotificationsPage({ notifications }) {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title="SmartRes" subtitle="Notifications" />

      <div className="flex-1 overflow-y-auto bg-dark-900 p-5">
        <div className="max-w-2xl mx-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-3 opacity-40">📭</div>
              <p className="text-sm text-dark-300 mb-1">No notifications yet</p>
              <p className="text-2xs text-dark-400">Book a resource to see alerts here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="bg-dark-800 rounded-xl border border-dark-650 p-4 hover:border-dark-500 transition-all">
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">✅ {n.message}</span>
                    <span className="text-2xs text-dark-400 shrink-0 ml-3">{n.time}</span>
                  </div>
                  <p className="text-xs text-dark-200 mb-2">{n.detail}</p>
                  {n.feedback && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-accent-violet/10 border border-accent-violet/20">
                      <span className="text-xs mt-0.5">🤖</span>
                      <p className="text-2xs text-dark-100 leading-relaxed">{n.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
