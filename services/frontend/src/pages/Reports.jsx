import React from 'react';
import Header from '../components/Header';

export default function Reports({ resources, bookings }) {
  const totalResources = resources.length;
  const busyCount = resources.filter(r => r.status === 'busy').length;
  const utilization = totalResources > 0 ? Math.round((busyCount / totalResources) * 100) : 0;
  
  // Calculate bookings per resource for the chart
  const resourceUsage = resources.map(r => {
    const usageCount = bookings.filter(b => b.resourceId === r.id).length;
    return { name: r.name, count: usageCount };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...resourceUsage.map(r => r.count), 1);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title="SmartRes" subtitle="Reports & Analytics" />
      
      <div className="flex-1 overflow-y-auto bg-dark-900 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-800 rounded-xl border border-dark-650 p-5">
              <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider block mb-2">Total Bookings</span>
              <div className="text-4xl font-bold text-white">{bookings.length}</div>
              <p className="text-2xs text-accent-cyan mt-2">Historical & Active</p>
            </div>
            <div className="bg-dark-800 rounded-xl border border-dark-650 p-5">
              <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider block mb-2">Most Used Resource</span>
              <div className="text-2xl font-bold text-white truncate my-1">
                {resourceUsage.length > 0 ? resourceUsage[0].name : 'N/A'}
              </div>
              <p className="text-2xs text-dark-400 mt-2">
                {resourceUsage.length > 0 ? `${resourceUsage[0].count} total bookings` : 'No data'}
              </p>
            </div>
            <div className="bg-dark-800 rounded-xl border border-dark-650 p-5">
              <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider block mb-2">Peak Usage Time</span>
              <div className="text-2xl font-bold text-white mt-1">
                {(() => {
                  if (bookings.length === 0) return 'N/A';
                  let morning = 0, afternoon = 0, evening = 0;
                  bookings.forEach(b => {
                    const h = new Date(b.startTime).getHours();
                    if (h < 12) morning++;
                    else if (h < 17) afternoon++;
                    else evening++;
                  });
                  const max = Math.max(morning, afternoon, evening);
                  if (max === morning) return 'Morning (AM)';
                  if (max === evening) return 'Evening (PM)';
                  return 'Afternoon (Mid)';
                })()}
              </div>
              <p className="text-2xs text-accent-amber mt-2">Highest traffic detected</p>
            </div>
          </div>
          
          {/* Chart Section */}
          <div className="bg-dark-800 rounded-xl border border-dark-650 p-5">
            <h2 className="text-sm font-semibold text-white mb-6">Resource Usage Frequency</h2>
            
            <div className="space-y-4">
              {resourceUsage.map((r, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-xs font-medium text-dark-100 truncate text-right">
                    {r.name}
                  </div>
                  <div className="flex-1 bg-dark-750 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-accent-blue to-accent-cyan h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(r.count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-xs text-dark-300 font-mono">
                    {r.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
