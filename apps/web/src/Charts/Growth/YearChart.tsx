import React, { useMemo, useState } from 'react';
import { extent, line, range, scaleLinear, scalePoint } from 'd3';
import { useElementWidth } from '../../Shared/CustomHooks/useElementWidth';
import { useTranslation } from 'react-i18next';
import { useFormat } from '../../i18n/useFormat';
import { ChartTooltip } from './ChartTooltip';

type YearPoint = { month: number; value: number };

type Props = {
  year: number;
  /** Saved values for the year. */
  points: YearPoint[];
  /** Month being edited and its unsaved value, if any. */
  preview: YearPoint | null;
  unit: string;
  step: number;
  emptyDomain: [number, number];
  onSelectMonth: (month: number) => void;
};

const HEIGHT = 240;
const M = { top: 26, right: 12, bottom: 30, left: 40 };
const MONTHS = range(1, 13);

export const YearChart: React.FC<Props> = ({
  year,
  points,
  preview,
  unit,
  step,
  emptyDomain,
  onSelectMonth,
}) => {
  const { t } = useTranslation();
  const f = useFormat();
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  // Saved values with the preview applied, in month order.
  const shown = useMemo(() => {
    const rest = points.filter((p) => p.month !== preview?.month);
    return [...rest, ...(preview ? [preview] : [])].sort((a, b) => a.month - b.month);
  }, [points, preview]);

  const x = scalePoint<number>()
    .domain(MONTHS)
    .range([M.left + 8, width - M.right - 8]);

  const [lo, hi] = shown.length
    ? (extent(shown, (p) => p.value) as [number, number])
    : emptyDomain;
  const pad = Math.max((hi - lo) * 0.25, step * 6);
  const y = scaleLinear()
    .domain([lo - pad, hi + pad])
    .nice(4)
    .range([HEIGHT - M.bottom, M.top]);
  const ticks = y.ticks(4);

  const path = line<YearPoint>()
    .x((p) => x(p.month)!)
    .y((p) => y(p.value));
  const savedLine = path(shown.filter((p) => p.month !== preview?.month));
  const previewIndex = preview ? shown.findIndex((p) => p.month === preview.month) : -1;
  const previewLine =
    previewIndex >= 0
      ? path([shown[previewIndex - 1], shown[previewIndex], shown[previewIndex + 1]].filter(Boolean))
      : null;

  const last = shown.at(-1);
  const labelled = shown.filter((p) =>
    preview ? p.month === preview.month : p === last
  );
  const hovered = hover !== null ? shown.find((p) => p.month === hover) : undefined;
  const bandWidth = x.step();
  // On narrow charts label every other month so the labels don't collide.
  const labelEvery = bandWidth < 30 ? 2 : 1;

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="block h-[240px] w-full overflow-visible"
        role="img"
        aria-label={t('growth.chartYear', { year })}
      >
        {preview && (
          <rect
            className="fill-soft"
            x={x(preview.month)! - 14}
            width={28}
            y={M.top - 6}
            height={HEIGHT - M.bottom - M.top + 6}
            rx={8}
          />
        )}

        {shown.length > 0 && (
          <g>
            {ticks.map((t) => (
              <g key={t}>
                <line className="stroke-grid" x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} />
                <text className="fill-muted text-xs tabular-nums" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
                  {f.number(t)}
                </text>
              </g>
            ))}
            <text className="fill-muted text-xs" x={M.left - 8} y={M.top - 12} textAnchor="end">
              {unit}
            </text>
          </g>
        )}

        <line className="stroke-hairline" x1={M.left} x2={width - M.right} y1={HEIGHT - M.bottom} y2={HEIGHT - M.bottom} />
        {MONTHS.filter((m) => (m - 1) % labelEvery === 0 || m === preview?.month).map((m) => (
          <text
            key={m}
            className={`text-xs ${m === preview?.month ? 'fill-ink font-semibold' : 'fill-muted'}`}
            x={x(m)}
            y={HEIGHT - M.bottom + 18}
            textAnchor="middle"
          >
            {f.monthShort(m)}
          </text>
        ))}

        {shown.length === 0 && (
          <text className="fill-muted text-sm" x={(M.left + width - M.right) / 2} y={(HEIGHT / 2) - 10} textAnchor="middle">
            {t('growth.clickToAddFirst')}
          </text>
        )}

        {hover !== null && (
          <line className="stroke-hairline" x1={x(hover)} x2={x(hover)} y1={M.top - 6} y2={HEIGHT - M.bottom} />
        )}

        {savedLine && <path d={savedLine} className="fill-none stroke-primary" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
        {previewLine && <path d={previewLine} className="fill-none stroke-secondary" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" />}

        {shown.map((p) => {
          const selected = p.month === preview?.month;
          return (
            <circle
              key={p.month}
              className={`${selected ? 'fill-secondary' : 'fill-primary'} stroke-white`}
              strokeWidth={2}
              cx={x(p.month)}
              cy={y(p.value)}
              r={selected ? 6 : 4.5}
            />
          );
        })}

        {labelled.map((p) => (
          <text key={p.month} className="fill-ink text-xs font-semibold tabular-nums" x={x(p.month)} y={y(p.value) - 12} textAnchor="middle">
            {f.number(p.value)}
          </text>
        ))}

        {MONTHS.map((m) => {
          const p = shown.find((q) => q.month === m);
          return (
            <rect
              key={m}
              x={x(m)! - (bandWidth / 2)}
              width={bandWidth}
              y={M.top - 6}
              height={HEIGHT - M.top - M.bottom + 30}
              className="cursor-pointer fill-transparent outline-none focus-visible:stroke-primary focus-visible:[stroke-width:2]"
              tabIndex={0}
              role="button"
              aria-label={`${f.monthName(m)} ${year}: ${p ? `${f.number(p.value)} ${unit}` : t('growth.noMeasurement')}`}
              onPointerEnter={() => setHover(m)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(m)}
              onBlur={() => setHover(null)}
              onClick={() => onSelectMonth(m)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMonth(m);
                }
              }}
            />
          );
        })}
      </svg>

      {hover !== null && (
        <ChartTooltip
          x={x(hover)!}
          y={hovered ? y(hovered.value) : M.top + 10}
          value={hovered ? `${f.number(hovered.value)} ${unit}` : t('growth.noMeasurement')}
          label={`${f.monthName(hover)} ${year}${hovered ? '' : ` · ${t('growth.clickToAdd')}`}`}
        />
      )}
    </div>
  );
};
