// A shortcut: $('val') grabs the page element with id="val".
const $ = id => document.getElementById(id);

// CATS holds every category: its units and how to convert between them.
const CATS = {
  length: {
    label: 'Length',
    // Each unit: [full name, short code, how many meters are in one unit].
    units: [
      ['Millimeter','mm',0.001], ['Centimeter','cm',0.01], ['Meter','m',1],
      ['Kilometer','km',1000], ['Inch','in',0.0254], ['Foot','ft',0.3048],
      ['Yard','yd',0.9144], ['Mile','mi',1609.344]
    ],
    // factor = how many meters in one unit
    // Convert by going through meters: value → meters → target unit.
    convert(v, from, to){
      // Find how many meters are in one "from" unit.
      const f = this.units.find(u=>u[1]===from)[2];
      // Find how many meters are in one "to" unit.
      const t = this.units.find(u=>u[1]===to)[2];
      // value in meters, divided into the target unit.
      return v * f / t;
    }
  },
  weight: {
    label: 'Weight',
    // Each unit: [full name, short code, how many kilograms are in one unit].
    units: [
      ['Milligram','mg',1e-6], ['Gram','g',0.001], ['Kilogram','kg',1],
      ['Metric ton','t',1000], ['Pound','lb',0.45359237], ['Ounce','oz',0.028349523125]
    ],
    // Convert by going through kilograms: value → kg → target unit.
    convert(v, from, to){
      // Find how many kilograms are in one "from" unit.
      const f = this.units.find(u=>u[1]===from)[2];
      // Find how many kilograms are in one "to" unit.
      const t = this.units.find(u=>u[1]===to)[2];
      // value in kilograms, divided into the target unit.
      return v * f / t;
    }
  },
  temp: {
    label: 'Temperature',
    units: [['Celsius','C',1],['Fahrenheit','F',1],['Kelvin','K',1]],
    // Turn any temperature into Celsius first.
    toC(v, u){ return u==='C' ? v : u==='F' ? (v-32)*5/9 : v-273.15; },
    // Turn a Celsius value into the target unit.
    fromC(c, u){ return u==='C' ? c : u==='F' ? c*9/5+32 : c+273.15; },
    // Convert by going through Celsius: value → °C → target unit.
    convert(v, from, to){ return this.fromC(this.toC(v, from), to); }
  }
};

// The active category right now. Starts on length.
let cat = 'length';

// Fill the From and To dropdowns with the current category's units.
function fillUnits(){
  const c = CATS[cat];
  // Build one <option> per unit for each dropdown.
  $('from').innerHTML = c.units.map(u=>'<option value="'+u[1]+'">'+u[0]+'</option>').join('');
  $('to').innerHTML   = c.units.map(u=>'<option value="'+u[1]+'">'+u[0]+'</option>').join('');
  // Default: convert from the first unit to the second unit.
  $('from').selectedIndex = 0;
  $('to').selectedIndex = Math.min(1, c.units.length-1);
}

// Format a number nicely for display.
function fmt(n){
  // Not a real number: show a dash.
  if (!isFinite(n)) return '—';
  // Huge or tiny numbers: show like 1.234568e+12.
  if (n !== 0 && (Math.abs(n) >= 1e12 || Math.abs(n) < 1e-9)) return n.toExponential(6);
  // Round off tiny float errors, then add thousand separators.
  const r = Math.round(n * 1e10) / 1e10;   // kill float dust
  return r.toLocaleString('en-US', {maximumFractionDigits: 10});
}

// Look up a unit's full name from its short code, e.g. 'km' → 'Kilometer'.
function unitName(code){
  const u = CATS[cat].units.find(u=>u[1]===code);
  return u ? u[0] : code;
}

// Read the inputs, convert, and show the result.
function convertNow(){
  // Read what the user typed and clear any old error.
  const raw = $('val').value.trim();
  $('msg').textContent = '';
  // Empty or not a number: clear the result and stop.
  if (raw === '' || isNaN(Number(raw))){
    $('out').textContent = '—'; $('formula').textContent = '';
    return;
  }
  const v = Number(raw);
  const from = $('from').value, to = $('to').value;
  // Kelvin can never go below 0 — reject impossible input.
  if (cat === 'temp' && from === 'K' && v < 0){
    $('msg').textContent = 'Kelvin cannot be below absolute zero (0 K).';
    $('out').textContent = '—'; $('formula').textContent = '';
    return;
  }
  // Do the conversion.
  const r = CATS[cat].convert(v, from, to);
  // Reject results below absolute zero too.
  if (cat === 'temp' && to === 'K' && r < -1e-9){
    $('msg').textContent = 'Result is below absolute zero — check your input.';
    $('out').textContent = '—'; $('formula').textContent = '';
    return;
  }
  // Show the answer and the full equation, like "5 Kilometer = 3.1 Mile".
  $('out').textContent = fmt(r);
  $('formula').textContent = fmt(v) + ' ' + unitName(from) + ' = ' + fmt(r) + ' ' + unitName(to);
}

// Category tabs: switch category when a tab is clicked.
$('tabs').addEventListener('click', e=>{
  // Find which tab was clicked (ignore clicks on empty space).
  const t = e.target.closest('.tab');
  if(!t) return;
  // Move the "active" highlight to the clicked tab.
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  // Remember the new category, refill the dropdowns, convert.
  cat = t.dataset.cat;
  fillUnits();
  convertNow();
});
// Convert instantly whenever the value or a unit changes.
$('val').addEventListener('input', convertNow);
$('from').addEventListener('change', convertNow);
$('to').addEventListener('change', convertNow);
// Swap button: exchange From and To, then convert.
$('swap').addEventListener('click', ()=>{
  const f = $('from').value;
  $('from').value = $('to').value;
  $('to').value = f;
  convertNow();
});

// Set up the dropdowns and convert once when the page loads.
fillUnits();
convertNow();
