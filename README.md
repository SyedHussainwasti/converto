# Unit Converter

Instant conversion across Length, Weight and Temperature. Type a value and the result updates immediately.

## How to use

Open `index.html` in any browser. Pick a category tab, type a value, choose **From**/**To** units (or hit ⇄ to swap them). The result and the full equation appear below.

- **Length**: mm, cm, m, km, inch, foot, yard, mile
- **Weight**: mg, g, kg, metric ton, lb, oz
- **Temperature**: °C, °F, K (guards against below-absolute-zero results)

## How it works

- Length converts through meters: `result = value × (meters per from-unit) ÷ (meters per to-unit)`.
- Weight converts through kilograms the same way.
- Temperature converts through Celsius: `°F→°C = (°F−32)×5/9`, `K→°C = K−273.15`, then back out with the inverse formulas.
- Results are rounded to 10 significant decimals to remove floating-point dust, and very large/small values fall back to exponential notation.

## Files

- `index.html` — the page markup
- `styles.css` — all the styling, with plain-English comments
- `app.js` — the conversion logic, with plain-English comments

No libraries, no network requests, works offline.
