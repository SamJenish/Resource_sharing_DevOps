import React, { useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import AnalyticsPanel from '../components/AnalyticsPanel';
import BookingModal from '../components/BookingModal';

export default function Dashboard({ resources, onBookResource, addNotification }) {
  const [selectedResource, setSelectedResource] = useState(resources.length > 0 ? resources[0] : null);
  const [bookingResource, setBookingResource] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Update selected resource when data changes
  React.useEffect(() => {
    if (selectedResource) {
      const updated = resources.find(r => r.id === selectedResource.id);
      if (updated) setSelectedResource(updated);
    } else if (resources.length > 0) {
      setSelectedResource(resources[0]);
    }
  }, [resources, selectedResource?.id]); // eslint-disable-line

  const handleBooked = (data) => {
    addNotification({
      id: Date.now(),
      type: 'success',
      message: `"${data.resource.name}" booked successfully`,
      detail: `Available at ${new Date(data.available_time).toLocaleString()}`,
      feedback: data.feedback,
      time: new Date().toLocaleTimeString()
    });
  };

  const filtered = resources.filter(r => {
    if (filter === 'available') return r.status === 'available';
    if (filter === 'busy') return r.status === 'busy';
    return true;
  }).filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      {/* === LEFT: Resource list panel === */}
      <div className="w-[300px] min-w-[300px] border-r border-dark-650 bg-dark-900 flex flex-col h-screen">
        {/* List header */}
        <div className="px-3.5 h-12 flex items-center justify-between border-b border-dark-650 shrink-0">
          <span className="text-xs font-semibold text-dark-50">All Resources</span>
          <button className="text-dark-300 hover:text-white text-xs transition-colors" title="Refresh">↻</button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-dark-700 shrink-0">
          <div className="flex items-center bg-dark-800 rounded-lg border border-dark-650 px-2.5 py-1.5 gap-2">
            <span className="text-dark-400 text-xs">⌕</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-dark-400 outline-none flex-1"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-dark-400 hover:text-white text-xs">×</button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="px-3 py-2 flex gap-1.5 border-b border-dark-700 shrink-0">
          {['all', 'available', 'busy'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-2xs font-semibold capitalize transition-all
                ${filter === f
                  ? 'bg-accent-amber/20 text-accent-amber'
                  : 'text-dark-200 hover:text-white hover:bg-dark-750'
                }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <button className="text-dark-300 hover:text-white text-xs transition-colors">▽</button>
            <button className="text-dark-300 hover:text-white text-xs transition-colors">☰</button>
          </div>
        </div>

        {/* Sort */}
        <div className="px-3.5 py-1.5 flex items-center justify-between border-b border-dark-700/50 shrink-0">
          <span className="text-2xs text-dark-300">Newest ↓</span>
        </div>

        {/* Cards list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-dark-300">No resources found</div>
          ) : (
            filtered.map((r) => (
              <Card
                key={r.id}
                resource={r}
                isSelected={selectedResource?.id === r.id}
                onClick={setSelectedResource}
              />
            ))
          )}
        </div>
      </div>

      {/* === CENTER: Main content area === */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          title="SmartRes"
          subtitle={selectedResource ? selectedResource.name : 'Dashboard'}
        />

        <div className="flex-1 overflow-y-auto bg-dark-900">
          {selectedResource ? (
            <div className="p-6">
              {/* Resource detail card */}
              <div className="mb-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center text-sm border border-dark-600">
                        {selectedResource.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-white">{selectedResource.name}</h2>
                        <span className="text-2xs text-dark-300">Resource #{selectedResource.id}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-2xs font-semibold uppercase ${selectedResource.status === 'available' ? 'tag-available' : 'tag-busy'}`}>
                    {selectedResource.status}
                  </span>
                </div>

                {/* Content — mimics the thread/post view from the reference */}
                <div className="bg-dark-800 rounded-xl border border-dark-650 p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-2xs font-bold text-white">
                      SR
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">System Resource</div>
                      <div className="text-2xs text-dark-300">Updated {formatTime(selectedResource.available_time)}</div>
                    </div>
                    <div className="ml-auto text-dark-400 hover:text-white cursor-pointer text-sm">⋯</div>
                  </div>

                  <p className="text-sm text-dark-100 leading-relaxed mb-4">
                    {selectedResource.status === 'available'
                      ? `${selectedResource.name} is currently available for booking. This resource is ready to be reserved for your team or project needs. Click the book button below to reserve it.`
                      : `${selectedResource.name} is currently in use and will become available at ${formatTime(selectedResource.available_time)}. You can check back later or browse other available resources.`
                    }
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-2xs text-dark-300 pt-3 border-t border-dark-700">
                    <span>ID: #{selectedResource.id}</span>
                    <span>·</span>
                    <span>{selectedResource.status === 'available' ? '🟢 Ready' : '🔴 Occupied'}</span>
                    <span>·</span>
                    <span>{formatTime(selectedResource.available_time)}</span>
                  </div>
                </div>
              </div>

              {/* Response options — mimics the reply section */}
              {selectedResource.status === 'available' && (
                <div className="bg-dark-800 rounded-xl border border-dark-650 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-dark-200 font-medium">Quick Actions</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {['Book for 1 hour', 'Book for 2 hours', 'Book for 4 hours'].map((label, i) => (
                      <div key={i} className="flex items-center justify-between bg-dark-750 rounded-lg px-3.5 py-2 border border-dark-600/50 group hover:border-dark-500 transition-all cursor-pointer"
                        onClick={() => {
                          // Simple click behavior
                          setBookingResource(selectedResource);
                        }}
                      >
                        <span className="text-xs text-dark-100">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xs text-dark-400">{12 + i * 5}/32</span>
                          <button className="text-dark-500 hover:text-accent-rose text-xs">×</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Book button centered */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setBookingResource(selectedResource)}
                      className="w-8 h-8 rounded-full bg-dark-650 border border-dark-500 flex items-center justify-center text-dark-200 hover:text-accent-cyan hover:border-accent-cyan/40 transition-all text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedResource.status === 'busy' && (
                <div className="bg-dark-800 rounded-xl border border-dark-650 p-4">
                  <div className="flex items-center gap-2 text-xs text-dark-200">
                    <span className="text-accent-amber">⏳</span>
                    <span>Ends in:</span>
                    <span className="px-2 py-0.5 rounded bg-dark-750 text-dark-100 font-mono text-2xs">
                      {(() => {
                        const diff = new Date(selectedResource.available_time) - new Date();
                        const hrs = Math.max(0, Math.floor(diff / 3600000));
                        const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
                        return `${hrs}h ${mins}m`;
                      })()}
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom toolbar — mimics the reference bottom bar */}
              <div className="flex items-center justify-center gap-3 mt-4 py-3">
                {['◇', '◈', '◆', '⊕', '▣', '▩', '◯', '◉', '✦', '⬡'].map((icon, i) => (
                  <button key={i} className="text-dark-400 hover:text-dark-100 text-xs transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-dark-300 text-sm">
              Select a resource to view details
            </div>
          )}
        </div>
      </div>

      {/* === RIGHT: Analytics panel === */}
      <AnalyticsPanel resources={resources} selectedResource={selectedResource} />

      {/* === Booking modal === */}
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
