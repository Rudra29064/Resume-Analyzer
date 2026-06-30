import React from 'react';

function ListCard({ title, items, color }) {
  const colors = {
    green: { dot: 'bg-pass', text: 'text-pass' },
    red: { dot: 'bg-alert', text: 'text-alert' },
    orange: { dot: 'bg-warn', text: 'text-warn' },
    blue: { dot: 'bg-signal', text: 'text-signal' },
    indigo: { dot: 'bg-signal', text: 'text-signal' },
  };
  const c = colors[color];

  return (
    <div className="border border-white/10 bg-panel/60 p-6">
      <p className="font-mono text-[10px] text-steel tracking-widest mb-4">{title.toUpperCase()}</p>
      <ul className="space-y-2.5">
        {items?.length ? items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
            <span className={`w-1.5 h-1.5 ${c.dot} mt-1.5 flex-shrink-0`} />
            {item}
          </li>
        )) : (
          <li className="text-steeldim text-sm font-mono">— none detected —</li>
        )}
      </ul>
    </div>
  );
}

export default ListCard;