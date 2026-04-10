import React from 'react';

function getTagClass(resource) {
  const name = resource.name.toLowerCase();
  if (name.includes('room')) return 'tag-room';
  if (name.includes('projector') || name.includes('printer')) return 'tag-equipment';
  if (name.includes('lab')) return 'tag-lab';
  if (name.includes('server') || name.includes('rack')) return 'tag-server';
  return 'tag-strategy';
}

function getTagLabel(resource) {
  const name = resource.name.toLowerCase();
  if (name.includes('room')) return 'ROOM';
  if (name.includes('projector')) return 'DISPLAY';
  if (name.includes('printer')) return 'HARDWARE';
  if (name.includes('lab')) return 'LAB';
  if (name.includes('server') || name.includes('rack')) return 'SERVER';
  return 'RESOURCE';
}

function getTimeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getUsageLevel(resource) {
  if (resource.status === 'busy') return 'High';
  return 'Medium';
}

export default function Card({ resource, isSelected, onClick }) {
  const tagClass = getTagClass(resource);
  const tagLabel = getTagLabel(resource);

  return (
    <button
      onClick={() => onClick(resource)}
      className={`w-full text-left px-3.5 py-3 border-b border-dark-700/60 transition-all duration-150 group
        ${isSelected
          ? 'bg-dark-700/70 border-l-2 border-l-accent-cyan'
          : 'hover:bg-dark-750/60 border-l-2 border-l-transparent'
        }`}
    >
      {/* Tags */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`${tagClass} px-1.5 py-[1px] rounded text-2xs font-semibold uppercase`}>{tagLabel}</span>
        <span className={`px-1.5 py-[1px] rounded text-2xs font-semibold uppercase ${resource.status === 'available' ? 'tag-available' : 'tag-busy'}`}>
          {resource.status === 'available' ? 'AVAILABLE' : 'BUSY'}
        </span>
      </div>

      {/* Title */}
      <h3 className={`text-[13px] font-semibold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-dark-50 group-hover:text-white'}`}>
        {resource.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-dark-200 leading-relaxed mb-2 line-clamp-2">
        {resource.status === 'available'
          ? 'Ready for booking. Click to reserve this resource for your team.'
          : `Currently in use. Available at ${new Date(resource.available_time).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}.`
        }
      </p>

      {/* Bottom row */}
      <div className="flex items-center gap-3 text-2xs text-dark-300">
        <span className="flex items-center gap-1">
          <span className="text-dark-400">◷</span>
          {getTimeAgo(resource.available_time)}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-dark-400">▥</span>
          {getUsageLevel(resource)}
        </span>
        <span className={`ml-auto w-1.5 h-1.5 rounded-full ${resource.status === 'available' ? 'bg-accent-green animate-pulse-dot' : 'bg-accent-rose'}`}></span>
      </div>
    </button>
  );
}
