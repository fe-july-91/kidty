import React, { useState } from 'react';
import { bisector, extent, line, range, scaleLinear } from 'd3';
import { useElementWidth } from '../../Shared/CustomHooks/useElementWidth';
import { ChartTooltip } from './ChartTooltip';
import { Point, formatAge, formatValue, monthLabel } from './growth';

type AgedPoint = Point & { age: number };

type Props = {
  /** Measurements with the child's age in months, sorted by date. */
  points: AgedPoint[];
  /** Child's current age in months. */
  currentAge: number;
  unit: string;
  onSelect: (point: Point) => void;
};

const HEIGHT = 240;
const M = { top: 26, right: 12, bottom: 30, left: 40 };
const nearest = bisector<AgedPoint, number>((p) => p.age).center;

export const HistoryChart: React.FC<Props> = ({ points, currentAge, unit, onSelect }) => {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<AgedPoint | null>(null);

  if (!points.length) {
    return (
      <div ref={ref} className="grid h-[240px] place-items-center text-sm text-muted">
        Історія з’явиться після першого заміру
      </div>
    );
  }

  const minAge = Math.floor(points[0].age / 12) * 12;
  const maxAge = Math.max(minAge + 12, Math.ceil(currentAge / 12) * 12);
  const x = scaleLinear().domain([minAge, maxAge]).range([M.left + 6, width - M.right - 6]);
  const [lo, hi] = extent(points, (p) => p.value) as [number, number];
  const span = hi - lo || 1;
  const y = scaleLinear()
    .domain([lo - (span * 0.08), hi + (span * 0.12)])
    .nice(4)
    .range([HEIGHT - M.bottom, M.top]);
  const ticks = y.ticks(4);
  const years = range(minAge, maxAge + 1, 12);
  const path = line<AgedPoint>().x((p) => x(p.age)).y((p) => y(p.value))(points);
  const last = points[points.length - 1];

  const pick = (clientX: number, target: SVGRectElement) => {
    const box = target.ownerSVGElement!.getBoundingClientRect();
    const px = ((clientX - box.left) / box.width) * width;
    return points[nearest(points, x.invert(px))];
  };

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="block h-[240px] w-full overflow-visible"
        role="img"
        aria-label="Значення за всю історію"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="stroke-grid" x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} />
            <text className="fill-muted text-xs tabular-nums" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
              {formatValue(t)}
            </text>
          </g>
        ))}
        <text className="fill-muted text-xs" x={M.left - 8} y={M.top - 12} textAnchor="end">
          {unit}
        </text>
        <line className="stroke-hairline" x1={M.left} x2={width - M.right} y1={HEIGHT - M.bottom} y2={HEIGHT - M.bottom} />
        {years.map((a) => (
          <text key={a} className="fill-muted text-xs" x={x(a)} y={HEIGHT - M.bottom + 18} textAnchor="middle">
            {a === 0 ? 'нар.' : `${a / 12} р.`}
          </text>
        ))}

        {hover && <line className="stroke-hairline" x1={x(hover.age)} x2={x(hover.age)} y1={M.top - 6} y2={HEIGHT - M.bottom} />}
        {path && <path d={path} className="fill-none stroke-primary" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
        {points.map((p) => (
          <circle
            key={p.id}
            className="fill-primary stroke-white"
            strokeWidth={2}
            cx={x(p.age)}
            cy={y(p.value)}
            r={p === hover || p === last ? 5.5 : 3.5}
          />
        ))}
        <text className="fill-ink text-xs font-semibold tabular-nums" x={x(last.age)} y={y(last.value) - 12} textAnchor="end">
          {formatValue(last.value)} {unit}
        </text>

        <rect
          className="cursor-pointer fill-transparent"
          x={M.left}
          width={width - M.left - M.right}
          y={M.top - 6}
          height={HEIGHT - M.top - M.bottom + 6}
          onPointerMove={(e) => setHover(pick(e.clientX, e.currentTarget))}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => onSelect(pick(e.clientX, e.currentTarget))}
        />
      </svg>

      {hover && (
        <ChartTooltip
          x={x(hover.age)}
          y={y(hover.value)}
          value={`${formatValue(hover.value)} ${unit}`}
          label={`${monthLabel(hover)} · ${formatAge(hover.age)}`}
        />
      )}
    </div>
  );
};
