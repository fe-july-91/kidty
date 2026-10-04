# Kidty design system

The web app uses one light theme with a palette called "blue and copper". It is
calm and restrained: mostly neutrals, blue for actions and data, and copper as
a small accent.

Tokens live in two places:

- `apps/web/src/hero.ts` holds the HeroUI colour ramps (`primary`, `secondary`, …).
- `apps/web/src/index.css` (`@theme`) holds the neutrals, shadows and breakpoints.

## Colour

### Brand

| Token | Hex | Use |
|---|---|---|
| `primary` (500) | `#3A6DB3` | Buttons, links, active states, chart lines and bars |
| `primary-100` | `#EDF4FF` | Success notices, soft highlights |
| `primary-700` | `#1C457D` | Link hover |
| `primary-900` | `#042148` | Dark panels (gradient to `primary-700`) |
| `secondary` (500) | `#C26F45` | Copper **accent**, used sparingly |
| `secondary-600` | `#A85C34` | Copper text (roles, "Delete") |
| `secondary-100` | `#FEF0E9` | Background of the delete confirmation |

Both ramps run from 100 to 900 in `hero.ts`.

**Copper is an accent, never a surface.** Use it for small things: an eyebrow
dot, a role caption, the head on the logo's i, a destructive text button, one
highlighted point on a chart. Never use it for large fills, whole cards or
plaques.

### Neutrals

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#F5F7FA` | Page background |
| `white` | `#FFFFFF` | Cards, header, modals |
| `ink` | `#1F2A3D` | Headings and main text |
| `ink-2` | `#4A5568` | Body text, secondary text |
| `muted` | `#76829A` | Captions, axis labels, placeholders |
| `hairline` | `#D9E0EA` | Borders, dividers, outlined buttons |
| `grid` | `#E9EDF3` | Chart gridlines |
| `soft` | `#EFF3F8` | Segmented controls, hover backgrounds |
| `chip` | `#E3E9F2` | Chips and tags |

Status colours (`danger`, `warning`, `success`) come from HeroUI. They are only
for messages, never for decoration. Errors use `text-danger-600`, or
`bg-danger-100 text-danger-700` as a block.

### Avatars

Child avatars are transparent PNGs on a soft pastel circle. The background
colours are listed in `avatarBackgrounds` in `Utils/kit.js`. The pastels stay
low-saturation so they don't compete with the data.

## Typography

- **Font**: Rubik, bundled in `src/assets/fonts` (300, 400, 500, 700).
- **Page title**: `text-[26px]`–`text-[2.5rem] font-semibold leading-tight tracking-tight`.
- **Section title**: `text-xl font-semibold`.
- **Card title**: `text-[17px] font-semibold`.
- **Body**: 16px `text-ink-2 leading-relaxed`. Lead paragraphs use `text-lg`.
- **Captions and labels**: `text-sm` / `text-xs text-muted`.

## Layout and surfaces

- **Page**: `bg-canvas text-ink`, centred container (`max-w-2xl` for forms, `max-w-5xl` for content pages), `px-4` gutters.
- **Card**: `rounded-[22px] bg-white shadow-card p-5 md:p-6` (`p-8` for roomy cards).
- **Modal**: the same card on an `bg-ink/40` overlay, `max-w-[460px]`.
- **Spacing**: `gap-5` between cards, `gap-10` between page sections.
- **Header**: white with a `border-hairline` bottom edge, 48px tall (64px on desktop).

## Components

- **Buttons**: HeroUI `Button` with `radius="full"`.
  - Primary action: `color="primary"`.
  - Secondary action: `variant="bordered" className="border-hairline text-ink-2"`.
  - Destructive: copper text button, which turns into `bg-secondary-600 text-white` on confirmation.
- **Inputs**: HeroUI `Input` / `Textarea` with `variant="bordered"`.
- **Segmented control** (gender, language): `rounded-full bg-soft p-[3px]`; the active item is `bg-white font-semibold shadow-sm`.
- **Eyebrow**: a small label above a page title, `text-sm font-medium text-ink-2`, with a 2-unit `bg-secondary-500` dot.
- **Links**: `text-primary hover:text-primary-700`.
- **Notices**: `rounded-xl px-4 py-3 text-sm`. Success uses `bg-primary-100 text-primary-800`; error uses `bg-danger-100 text-danger-700`.

## Charts (D3)

- Marks are `primary`. Copper (`secondary`) highlights at most one thing, such as the latest point.
- Gridlines use `stroke-grid` and axis lines `stroke-hairline`. Labels use `fill-muted text-xs`.
- Lines are 2px with round joins. Points get a white ring (`stroke-white`).
- Every chart has a hover tooltip. Tooltip text uses ink tokens, never the series colour.

## Logo

The logo has two parts that echo each other.

- **Wordmark**: `apps/web/src/assets/icons/logo.svg`. It spells *kidty* in Rubik Bold, outlined, in `ink`.
  - The **i** is a growth figure: a rounded `primary` stem with a copper head in place of the dot.
  - It is used in the header at `h-6 lg:h-7`.
- **Mark**: `apps/web/src/assets/icons/logo-mark.svg`. It shows three figures of growing height in `#9DB8DE`, `primary` and `#284F86`; the tallest has a copper head.
  - Use it where the word does not fit.
- **App icon / favicon**: `apps/web/public/favicon.svg`, `favicon.ico` (16/32/48) and `apple-touch-icon.png` (180).
  - The mark sits on a `primary` tile; the figures are light blue and white, and the copper head stays.

On dark backgrounds, use white letters and a light-blue stem (`#C9D8EE`). Keep
the copper head in every version.

## Language and copy

- The app is bilingual. `src/i18n/locales/uk.ts` is the source, and `en.ts` must have the same keys; run `npm run i18n:check -w @kidty/web`.
- English is the default.
- Both languages say the same thing in the same tone: warm, short and plain. Copy addresses parents, not only mothers.
