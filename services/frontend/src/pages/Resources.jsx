import React from 'react';
import Header from '../components/Header';

export default function Resources({ resources }) {
  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title="SmartRes" subtitle="All Resources" />
      
      <div className="flex-1 overflow-y-auto bg-dark-900 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-white">Resource Directory</h1>
            <span className="text-xs text-dark-300">{resources.length} total resources</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-dark-800 rounded-xl border border-dark-650 p-5 hover:border-dark-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center text-sm border border-dark-600 font-bold text-white shadow-inner">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{r.name}</h3>
                      <p className="text-2xs text-dark-300">ID #{r.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-2xs font-semibold uppercase ${r.status === 'available' ? 'tag-available' : 'tag-busy'}`}>
                    {r.status}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-dark-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-300">Availability:</span>
                    <span className="text-dark-100 font-medium">
                      {r.status === 'available' ? 'Available Now' : `Busy until ${formatTime(r.available_time)}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
