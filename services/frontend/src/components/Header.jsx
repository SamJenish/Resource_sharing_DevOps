import React from 'react';

export default function Header({ title, subtitle }) {
  return (
    <header className="h-12 flex items-center justify-between px-5 border-b border-dark-650 bg-dark-850/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-white">{title || 'Resources'}</h1>
        {subtitle && (
          <>
            <span className="text-dark-400 text-xs">/</span>
            <span className="text-xs text-dark-200">{subtitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-amber to-accent-orange border-2 border-dark-850"></div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-violet to-accent-blue border-2 border-dark-850"></div>
        </div>
        <span className="text-dark-400 text-xs mx-1">·</span>
        <button className="text-xs text-dark-200 hover:text-white transition-colors flex items-center gap-1">
          <span>⊕</span> Invite
        </button>
        <button className="text-xs text-dark-200 hover:text-white transition-colors">☺</button>
        <button className="text-xs text-dark-200 hover:text-white transition-colors">⚙</button>
      </div>
    </header>
  );
}
