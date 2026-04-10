import React from 'react';

export default function AnalyticsPanel({ resources, selectedResource }) {
  const totalResources = resources.length;
  const available = resources.filter(r => r.status === 'available').length;
  const busy = resources.filter(r => r.status === 'busy').length;
  const utilizationRate = totalResources > 0 ? Math.round((busy / totalResources) * 100) : 0;

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <aside className="w-[260px] min-w-[260px] h-screen bg-dark-850 border-l border-dark-650 overflow-y-auto">
      {/* Details header */}
      <div className="px-4 h-12 flex items-center border-b border-dark-650 shrink-0">
        <span className="text-xs font-semibold text-dark-100">Details</span>
      </div>

      {/* Selected resource info */}
      {selectedResource ? (
        <div className="px-4 py-3 border-b border-dark-700">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-dark-300">Resource:</span>
              <span className="text-white font-medium text-right max-w-[140px] truncate">{selectedResource.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-300">Status:</span>
              <span className={`px-1.5 py-[1px] rounded text-2xs font-semibold uppercase ${selectedResource.status === 'available' ? 'tag-available' : 'tag-busy'}`}>
                {selectedResource.status}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-300">Available:</span>
              <span className="text-dark-50 text-right">{formatTime(selectedResource.available_time)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 border-b border-dark-700">
          <p className="text-xs text-dark-300 italic">Select a resource for details</p>
        </div>
      )}

      {/* Quick stats */}
      <div className="px-4 py-3 border-b border-dark-700">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-dark-100">Resource Stats</span>
          <span className="text-2xs text-accent-cyan cursor-pointer hover:underline">Refresh</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dark-750 rounded-lg p-2.5">
            <div className="text-lg font-bold text-white">{available}</div>
            <div className="text-2xs text-dark-200">Available</div>
          </div>
          <div className="bg-dark-750 rounded-lg p-2.5">
            <div className="text-lg font-bold text-accent-rose">{busy}</div>
            <div className="text-2xs text-dark-200">In Use</div>
          </div>
        </div>
      </div>

      {/* Voice Check style — Utilization  */}
      <div className="px-4 py-3 border-b border-dark-700">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-dark-100">Utilization</span>
          <span className="text-2xs text-dark-300">Live</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-2xs text-dark-300 mb-0.5">Usage Rate</div>
            <div className="text-base font-bold text-accent-cyan">{utilizationRate}%</div>
          </div>
          <div>
            <div className="text-2xs text-dark-300 mb-0.5">Efficiency</div>
            <div className="text-base font-bold text-accent-green">{Math.max(0, 100 - utilizationRate)}%</div>
          </div>
        </div>

        <div className="text-2xs text-dark-300 leading-relaxed p-2 bg-dark-750 rounded-lg">
          {utilizationRate > 60
            ? 'High utilization detected. Consider staggering booking times for better distribution.'
            : 'Resource utilization is within optimal range. Good distribution across available resources.'
          }
        </div>
      </div>

      {/* Timing section */}
      <div className="px-4 py-3 border-b border-dark-700">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-dark-100">Timing</span>
          <span className="text-2xs text-accent-cyan cursor-pointer">Best Slots →</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-dark-300">Best Window:</span>
            <span className="text-dark-50 font-medium">Off-peak</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-dark-300">Peak Hours:</span>
            <span className="text-dark-50">9–11 AM</span>
          </div>
        </div>

        {/* Active rate bar */}
        <div className="mt-3">
          <div className="flex justify-between text-2xs mb-1">
            <span className="text-dark-300">Active Rate</span>
            <span className="text-accent-cyan font-semibold">{utilizationRate}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill bg-accent-cyan" style={{ width: `${utilizationRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Forecast section */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-dark-100">Forecast</span>
        </div>

        <div className="space-y-2.5">
          {resources.slice(0, 4).map((r, i) => (
            <div key={r.id} className="flex items-center gap-2">
              <span className="text-2xs text-dark-300 w-10 shrink-0">Res {i + 1}</span>
              <div className="flex-1 progress-track">
                <div
                  className={`progress-fill ${r.status === 'busy' ? 'bg-accent-rose' : 'bg-accent-cyan'}`}
                  style={{ width: `${r.status === 'busy' ? 75 + Math.random() * 20 : 20 + Math.random() * 30}%` }}
                ></div>
              </div>
              <span className="text-2xs text-dark-200 w-[60px] text-right truncate">
                {r.status === 'busy' ? 'High' : 'Medium'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
