import React, { useEffect, useMemo, useState } from 'react';
import { Button, Slider } from '@heroui/react';
import { client } from '../../Utils/httpClient';
import { Child, Data } from '../../Shared/types/types';
import { HistoryChart } from './HistoryChart';
import { YearChart } from './YearChart';
import {
  METRICS,
  MetricType,
  Point,
  ageInMonths,
  byDate,
  formatAge,
  formatSigned,
  formatValue,
  monthLabel,
  monthName,
  parseBirth,
  pointKey,
  summarize,
  toPoint,
} from './growth';

type Props = { child: Child; metric: MetricType };
type Mode = 'year' | 'history';

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth() + 1;
const today = new Date().getDate();

export const GrowthCard: React.FC<Props> = ({ child, metric }) => {
  const m = METRICS[metric];
  const [points, setPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<Mode>('year');
  const [year, setYear] = useState(thisYear);
  const [editing, setEditing] = useState<{ month: number; value: number } | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client
      .get<Data[]>(`children/${child.id}/${metric}`)
      .then((data) => {
        const loaded = data.map(toPoint).sort(byDate);
        setPoints(loaded);
        // Open the year of the latest measurement.
        setYear(loaded.at(-1)?.year ?? thisYear);
      })
      .catch((err) => setError(err.message || 'Не вдалося завантажити дані'));
  }, [child.id, metric]);

  const birthYear = parseBirth(child.birth).year;
  const years = useMemo(() => {
    const all = new Set([...points.map((p) => p.year), thisYear]);
    for (let y = birthYear; y <= thisYear; y++) all.add(y);
    return [...all].sort((a, b) => b - a);
  }, [points, birthYear]);

  const yearPoints = points.filter((p) => p.year === year);
  const existing = editing ? yearPoints.find((p) => p.month === editing.month) : undefined;
  const summary = summarize(points);
  const currentAge = ageInMonths(child.birth, thisYear, thisMonth, today);

  const openEditor = (month: number, inYear = year) => {
    const found = points.find((p) => p.year === inYear && p.month === month);
    const before = points.filter((p) => pointKey(p) <= pointKey({ year: inYear, month })).at(-1);
    setYear(inYear);
    setMode('year');
    setError('');
    setEditing({
      month,
      value: found?.value ?? before?.value ?? Math.round((m.min + m.max) / 3 / m.step) * m.step,
    });
  };

  const save = async () => {
    if (!editing) return;
    const body = { year: String(year), month: monthName(editing.month), value: editing.value };
    setSaving(true);
    setError('');
    try {
      const saved = existing
        ? await client.put<Data>(`children/${child.id}/${metric}/${existing.id}`, body)
        : await client.post<Data>(`children/${child.id}/${metric}`, body);
      const point = toPoint(saved);
      setPoints((prev) =>
        [...prev.filter((p) => p.id !== point.id && !(p.year === point.year && p.month === point.month)), point].sort(byDate)
      );
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти дані');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    setSaving(true);
    setError('');
    try {
      await client.delete(`children/${child.id}/${metric}/${existing.id}`);
      setPoints((prev) => prev.filter((p) => p.id !== existing.id));
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося видалити дані');
    } finally {
      setSaving(false);
    }
  };

  const tableRows = mode === 'year' ? yearPoints : points;

  return (
    <div className="grid gap-3.5 p-5 pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold text-ink">{m.title}</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {child.name}, {formatAge(currentAge)}
          </p>
        </div>
        <div className="text-right max-sm:text-left" aria-live="polite">
          {summary ? (
            <>
              <div className="text-[26px] font-semibold leading-tight text-ink">
                {formatValue(summary.last.value)}
                <small className="ml-1 text-sm font-medium text-ink-2">{m.unit}</small>
              </div>
              <div className="text-[13px] text-ink-2">
                {summary.delta !== null && (
                  <>
                    <b className="font-semibold text-ink">
                      {formatSigned(summary.delta)} {m.unit}
                    </b>{' '}
                    за {summary.months} міс. ·{' '}
                  </>
                )}
                {monthLabel(summary.last)}
              </div>
            </>
          ) : (
            <div className="text-[13px] text-ink-2">Ще немає замірів</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex rounded-full bg-soft p-[3px]" role="group" aria-label="Період">
          {(
            [
              ['year', 'Рік'],
              ['history', 'Вся історія'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setEditing(null);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[13px] ${
                mode === value ? 'bg-white font-semibold text-ink shadow-sm' : 'text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'year' && (
          <select
            aria-label="Рік"
            value={year}
            onChange={(e) => {
              setYear(+e.target.value);
              setEditing(null);
            }}
            className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] text-ink"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      {mode === 'year' ? (
        <YearChart
          year={year}
          points={yearPoints}
          preview={editing}
          unit={m.unit}
          step={m.step}
          emptyDomain={[m.min, (m.min + m.max) / 2]}
          onSelectMonth={(month) => openEditor(month)}
        />
      ) : (
        <HistoryChart
          points={points.map((p) => ({ ...p, age: ageInMonths(child.birth, p.year, p.month) }))}
          currentAge={currentAge}
          unit={m.unit}
          onSelect={(p) => openEditor(p.month, p.year)}
        />
      )}

      {editing && (
        <div className="grid gap-2.5 rounded-2xl bg-soft px-3.5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-[13px] text-ink-2">
              {existing ? 'Змінити замір · ' : 'Новий замір · '}
              <b className="font-semibold capitalize text-ink">
                {monthName(editing.month)} {year}
              </b>
            </span>
            <span className="text-lg font-semibold tabular-nums text-ink">
              {formatValue(editing.value)} {m.unit}
            </span>
          </div>
          <Slider
            aria-label={m.title}
            color="secondary"
            size="sm"
            minValue={m.min}
            maxValue={m.max}
            step={m.step}
            value={editing.value}
            onChange={(v) => setEditing({ ...editing, value: Array.isArray(v) ? v[0] : v })}
          />
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs text-muted">
              {existing && existing.value === editing.value
                ? 'Збережене значення'
                : 'Ще не збережено. На графіку попередній перегляд'}
            </span>
            <div className="flex flex-wrap gap-2">
              {existing && (
                <Button size="sm" radius="full" variant="bordered" className="border-hairline text-secondary-600" onPress={remove} isDisabled={saving}>
                  Видалити
                </Button>
              )}
              <Button size="sm" radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={() => setEditing(null)} isDisabled={saving}>
                Скасувати
              </Button>
              <Button size="sm" radius="full" color="primary" onPress={save} isLoading={saving}>
                Зберегти
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-[13px] text-danger-600">{error}</p>}

      <details className="text-[13px] text-ink-2">
        <summary className="w-fit cursor-pointer">Показати таблицею</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-[260px] border-collapse tabular-nums">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-1 pr-4 font-medium">Місяць</th>
                <th className="py-1 pr-4 font-medium">Вік</th>
                <th className="py-1 pr-4 font-medium">Значення</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((p) => (
                <tr key={p.id} className="border-t border-grid">
                  <td className="py-1 pr-4 capitalize">{monthLabel(p)}</td>
                  <td className="py-1 pr-4">{formatAge(ageInMonths(child.birth, p.year, p.month))}</td>
                  <td className="py-1 pr-4">
                    {formatValue(p.value)} {m.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tableRows.length === 0 && <p className="py-1 text-muted">Немає записів</p>}
        </div>
      </details>
    </div>
  );
};
