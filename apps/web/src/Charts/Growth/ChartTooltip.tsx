import React from 'react';

type Props = { x: number; y: number; value: string; label: string };

/** Small tooltip anchored above a point of an SVG chart (coordinates in px). */
export const ChartTooltip: React.FC<Props> = ({ x, y, value, label }) => (
  <div
    className="pointer-events-none absolute z-10 whitespace-nowrap rounded-xl border border-hairline bg-white px-3 py-2 text-[13px] shadow-card"
    style={{ left: x, top: y, transform: 'translate(-50%, calc(-100% - 12px))' }}
    role="status"
  >
    <strong className="block text-[15px] font-semibold text-ink">{value}</strong>
    <span className="text-muted">{label}</span>
  </div>
);
