import React, { useEffect, useState } from 'react';
import { Button, Slider } from '@heroui/react';
import { scaleLinear } from 'd3';
import { client } from '../../Utils/httpClient';
import { EyeResponce } from '../../Shared/types/types';
import { useElementWidth } from '../../Shared/CustomHooks/useElementWidth';
import { formatSigned } from '../Growth/growth';

const MIN = -10;
const MAX = 12;
const TICKS = [-10, -5, 0, 5, 10];

type Eyes = { leftEye: number; rightEye: number };

const EyeScale: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const [ref, width] = useElementWidth<HTMLDivElement>(300);
  const x = scaleLinear().domain([MIN, MAX]).range([8, width - 8]);
  const cy = 16;

  return (
    <div ref={ref} className="min-w-0">
      <svg viewBox={`0 0 ${width} 44`} className="block h-11 w-full overflow-visible" role="img" aria-label={`${label}: ${formatSigned(value)} діоптрії`}>
        <rect className="fill-soft" x={x(MIN)} width={x(MAX) - x(MIN)} y={cy - 4} height={8} rx={4} />
        <rect className="fill-primary" opacity={0.35} x={Math.min(x(0), x(value))} width={Math.abs(x(value) - x(0))} y={cy - 4} height={8} rx={4} />
        <line className="stroke-muted" x1={x(0)} x2={x(0)} y1={cy - 8} y2={cy + 8} />
        <circle className="fill-primary stroke-white" strokeWidth={2} cx={x(value)} cy={cy} r={7} />
        {TICKS.map((t) => (
          <text key={t} className="fill-muted text-xs tabular-nums" x={x(t)} y={40} textAnchor="middle">
            {t > 0 ? `+${t}` : t < 0 ? `−${-t}` : '0'}
          </text>
        ))}
      </svg>
    </div>
  );
};

export const EyesCard: React.FC<{ childId: number }> = ({ childId }) => {
  const [saved, setSaved] = useState<Eyes | null>(null);
  const [draft, setDraft] = useState<Eyes | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client
      .get<EyeResponce>(`children/${childId}/eye`)
      // id 0 means nothing has been saved for this child yet.
      .then((data) => setSaved(data.id ? { leftEye: data.leftEye, rightEye: data.rightEye } : null))
      .catch((err) => setError(err.message || 'Не вдалося завантажити дані'));
  }, [childId]);

  const shown = draft ?? saved;

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError('');
    try {
      const data = await client.put<EyeResponce>(`children/${childId}/eye`, draft);
      setSaved({ leftEye: data.leftEye, rightEye: data.rightEye });
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти дані');
    } finally {
      setSaving(false);
    }
  };

  const rows: [keyof Eyes, string][] = [
    ['leftEye', 'Ліве око'],
    ['rightEye', 'Праве око'],
  ];

  return (
    <div className="grid gap-3.5 p-5 pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold text-ink">Зір</h2>
          <p className="mt-0.5 text-[13px] text-muted">Діоптрії, від −10 до +12</p>
        </div>
        {!draft && (
          <Button size="sm" radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={() => setDraft(saved ?? { leftEye: 0, rightEye: 0 })}>
            {saved ? 'Редагувати' : 'Додати'}
          </Button>
        )}
      </div>

      {shown ? (
        <div className="grid gap-3.5">
          {rows.map(([key, label]) => (
            <div key={key} className="grid grid-cols-[7.5em_1fr] items-center gap-3">
              <div className="text-[13px] text-ink-2">
                <b className="block text-[22px] font-semibold tabular-nums text-ink">{formatSigned(shown[key])}</b>
                {label}
              </div>
              <EyeScale value={shown[key]} label={label} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-muted">Ще немає даних. Додайте результати огляду в окуліста.</p>
      )}

      {draft && (
        <div className="grid gap-2.5 rounded-2xl bg-soft px-3.5 py-3">
          {rows.map(([key, label]) => (
            <Slider
              key={key}
              label={label}
              color="secondary"
              size="sm"
              minValue={MIN}
              maxValue={MAX}
              step={0.25}
              value={draft[key]}
              getValue={(v) => formatSigned(Array.isArray(v) ? v[0] : v)}
              onChange={(v) => setDraft({ ...draft, [key]: Array.isArray(v) ? v[0] : v })}
              classNames={{ label: 'text-[13px] text-ink-2', value: 'text-[13px] font-semibold text-ink tabular-nums' }}
            />
          ))}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs text-muted">Шкала показує нове значення ще до збереження</span>
            <div className="flex gap-2">
              <Button size="sm" radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={() => setDraft(null)} isDisabled={saving}>
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
    </div>
  );
};
