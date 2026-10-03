import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import { scaleBand, scalePow } from 'd3';
import { client } from '../../Utils/httpClient';
import { vaccinesSelect } from '../../Utils/kit';
import { Child, VaccineData } from '../../Shared/types/types';
import { useElementWidth } from '../../Shared/CustomHooks/useElementWidth';
import { ChartTooltip } from '../Growth/ChartTooltip';
import { ageInMonths, formatAge } from '../Growth/growth';

const VACCINES: string[] = vaccinesSelect;
const AGE_TICKS = [0, 2, 6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 144, 168, 192];

type Dose = VaccineData & { age: number; dose: number; day: number; month: number; year: number };
type Draft = { id?: number; type: string; date: string }; // date as YYYY-MM-DD

const parse = (date: string) => {
  const [day, month, year] = date.split('-').map(Number);
  return { day, month, year };
};
const toInput = (date: string) => date.split('-').reverse().join('-');
const fromInput = (value: string) => value.split('-').reverse().join('-');
const displayDate = (date: string) => date.replaceAll('-', '.');
const todayInput = () => new Date().toISOString().slice(0, 10);

export const VaccinesCard: React.FC<{ child: Child }> = ({ child }) => {
  const [items, setItems] = useState<VaccineData[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [hover, setHover] = useState<Dose | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [ref, width] = useElementWidth<HTMLDivElement>(720);

  useEffect(() => {
    client
      .get<VaccineData[]>(`children/${child.id}/vaccination`)
      .then(setItems)
      .catch((err) => setError(err.message || 'Не вдалося завантажити дані'));
  }, [child.id]);

  // Number each dose of a vaccine in date order.
  const doses = useMemo(() => {
    const counter: Record<string, number> = {};
    return items
      .map((v) => {
        const d = parse(v.date);
        return { ...v, ...d, age: Math.max(0, ageInMonths(child.birth, d.year, d.month, d.day)) };
      })
      .sort((a, b) => a.year - b.year || a.month - b.month || a.day - b.day || a.id - b.id)
      .map((v) => ({ ...v, dose: (counter[v.type] = (counter[v.type] ?? 0) + 1) }));
  }, [items, child.birth]);

  const last = doses.at(-1);
  const now = new Date();
  const currentAge = ageInMonths(child.birth, now.getFullYear(), now.getMonth() + 1, now.getDate());

  const narrow = width < 560;
  const M = { top: 8, right: 18, bottom: 30, left: narrow ? 118 : 168 };
  const rowH = narrow ? 30 : 34;
  const height = M.top + (rowH * VACCINES.length) + M.bottom;
  const maxAge = Math.max(12, currentAge);
  // A square-root scale gives the busy first year more room than later years.
  const x = scalePow().exponent(0.5).domain([0, maxAge]).range([M.left + 12, width - M.right]);
  const y = scaleBand<string>().domain(VACCINES).range([M.top, M.top + (rowH * VACCINES.length)]);
  const ticks = AGE_TICKS.filter((t) => t <= maxAge);
  const r = narrow ? 9 : 10;
  const cy = (type: string) => y(type)! + (y.bandwidth() / 2);

  const save = async () => {
    if (!draft?.date) return;
    const body = { type: draft.type, date: fromInput(draft.date) };
    setSaving(true);
    setError('');
    try {
      if (draft.id) {
        const updated = await client.put<VaccineData>(`children/${child.id}/vaccination/${draft.id}`, body);
        setItems((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      } else {
        const created = await client.post<VaccineData>(`children/${child.id}/vaccination`, body);
        setItems((prev) => [...prev, created]);
      }
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти щеплення');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft?.id) return;
    setSaving(true);
    setError('');
    try {
      await client.delete(`children/${child.id}/vaccination/${draft.id}`);
      setItems((prev) => prev.filter((v) => v.id !== draft.id));
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося видалити щеплення');
    } finally {
      setSaving(false);
    }
  };

  const edit = (d: Dose) => {
    setError('');
    setDraft({ id: d.id, type: d.type, date: toInput(d.date) });
  };

  return (
    <div className="grid gap-3.5 p-5 pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold text-ink">Щеплення</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {last ? `${doses.length} доз · останнє ${displayDate(last.date)}, ${last.type}` : 'Ще немає записів'}
          </p>
        </div>
        {!draft && (
          <Button
            size="sm"
            radius="full"
            variant="bordered"
            className="border-hairline text-ink-2"
            onPress={() => {
              setError('');
              setDraft({ type: VACCINES[0], date: todayInput() });
            }}
          >
            Додати щеплення
          </Button>
        )}
      </div>

      {draft && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-soft px-3.5 py-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[13px] text-ink-2">{draft.id ? 'Змінити щеплення' : 'Нове щеплення'}</span>
            <select
              aria-label="Вакцина"
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] text-ink"
            >
              {VACCINES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <input
              type="date"
              aria-label="Дата щеплення"
              value={draft.date}
              max={todayInput()}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] text-ink"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {draft.id && (
              <Button size="sm" radius="full" variant="bordered" className="border-hairline text-secondary-600" onPress={remove} isDisabled={saving}>
                Видалити
              </Button>
            )}
            <Button size="sm" radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={() => setDraft(null)} isDisabled={saving}>
              Скасувати
            </Button>
            <Button size="sm" radius="full" color="primary" onPress={save} isLoading={saving} isDisabled={!draft.date}>
              Зберегти
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-[13px] text-danger-600">{error}</p>}

      <div ref={ref} className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ height }} className="block w-full overflow-visible" role="img" aria-label="Щеплення за віком дитини">
          {ticks.map((t) => (
            <g key={t}>
              <line className="stroke-grid" x1={x(t)} x2={x(t)} y1={M.top} y2={height - M.bottom} />
              <text className="fill-muted text-xs" x={x(t)} y={height - M.bottom + 18} textAnchor="middle">
                {t === 0 ? 'нар.' : t < 12 ? `${t} міс.` : `${t / 12} р.`}
              </text>
            </g>
          ))}
          {VACCINES.map((v) => (
            <text key={v} className="fill-ink-2" style={{ fontSize: narrow ? 11 : 13 }} x={0} y={cy(v)} dy="0.32em">
              {v}
            </text>
          ))}
          <line className="stroke-hairline" x1={M.left} x2={width - M.right} y1={height - M.bottom} y2={height - M.bottom} />

          {doses.length === 0 && (
            <text className="fill-muted text-sm" x={(M.left + width) / 2} y={(height - M.bottom) / 2} textAnchor="middle">
              Додайте перше щеплення, і воно з’явиться на шкалі віку
            </text>
          )}

          {doses
            .filter((d) => VACCINES.includes(d.type))
            .map((d) => {
              const active = hover?.id === d.id || draft?.id === d.id;
              return (
                <g
                  key={d.id}
                  transform={`translate(${x(d.age)},${cy(d.type)})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${d.type}, доза ${d.dose}: ${displayDate(d.date)}, вік ${formatAge(d.age)}`}
                  className="cursor-pointer outline-none"
                  onPointerEnter={() => setHover(d)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(d)}
                  onBlur={() => setHover(null)}
                  onClick={() => edit(d)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      edit(d);
                    }
                  }}
                >
                  <circle className={`${draft?.id === d.id ? 'fill-secondary' : 'fill-primary'} stroke-white`} strokeWidth={2} r={active ? r + 2 : r} />
                  <text className="pointer-events-none fill-white text-[11px] font-semibold" textAnchor="middle" dy="0.35em">
                    {d.dose}
                  </text>
                  <circle className="fill-transparent" r={14} />
                </g>
              );
            })}
        </svg>

        {hover && (
          <ChartTooltip
            x={x(hover.age)}
            y={cy(hover.type) - 6}
            value={`${hover.type} · доза ${hover.dose}`}
            label={`${displayDate(hover.date)} · ${formatAge(hover.age)}`}
          />
        )}
      </div>

      <details className="text-[13px] text-ink-2">
        <summary className="w-fit cursor-pointer">Показати таблицею</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-[320px] border-collapse tabular-nums">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-1 pr-4 font-medium">Вакцина</th>
                <th className="py-1 pr-4 font-medium">Доза</th>
                <th className="py-1 pr-4 font-medium">Дата</th>
                <th className="py-1 pr-4 font-medium">Вік</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((d) => (
                <tr key={d.id} className="border-t border-grid">
                  <td className="py-1 pr-4">{d.type}</td>
                  <td className="py-1 pr-4">{d.dose}</td>
                  <td className="py-1 pr-4">{displayDate(d.date)}</td>
                  <td className="py-1 pr-4">{formatAge(d.age)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {doses.length === 0 && <p className="py-1 text-muted">Немає записів</p>}
        </div>
      </details>
    </div>
  );
};
