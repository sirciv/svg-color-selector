/* ─── Defaults matching the SVG's class fills ───────────────── */
const DEFAULTS = {
  'cls-1': '#c65252',  // background rect
  'cls-4': '#2f4460',  // pennant body
  'cls-2': '#8ebcef',  // accents
  'cls-3': '#fffefd',  // text
};

/* ─── Helpers ────────────────────────────────────────────────── */
const isValidHex = str => /^#[0-9a-fA-F]{6}$/.test(str);

// Inline style.fill overrides the SVG class-level fill rule.
function applyColor(svgClass, hex) {
  document.querySelectorAll('.' + svgClass).forEach(el => {
    el.style.fill = hex;
  });
}

function syncPicker(key, hex) {
  document.getElementById('pick-' + key).value = hex;
}

function syncHex(key, hex) {
  const el = document.getElementById('hex-' + key);
  el.value = hex;
  el.classList.remove('invalid');
}

/* ─── Wire up a single color row ────────────────────────────── */
function wireRow(row) {
  const svgClass = row.getAttribute('data-class');
  const key      = row.querySelector('label').getAttribute('for').replace('pick-', '');
  const picker   = document.getElementById('pick-' + key);
  const hexInput = document.getElementById('hex-' + key);

  picker.addEventListener('input', () => {
    applyColor(svgClass, picker.value);
    syncHex(key, picker.value);
  });

  hexInput.addEventListener('input', () => {
    let val = hexInput.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (isValidHex(val)) {
      hexInput.classList.remove('invalid');
      applyColor(svgClass, val);
      syncPicker(key, val);
    } else {
      hexInput.classList.add('invalid');
    }
  });

  hexInput.addEventListener('blur', () => {
    let val = hexInput.value.trim();
    if (val && !val.startsWith('#')) {
      val = '#' + val;
      hexInput.value = val;
    }
    if (!isValidHex(val)) hexInput.classList.add('invalid');
  });
}

/* ─── Reset ─────────────────────────────────────────────────── */
function resetColors() {
  document.querySelectorAll('.color-row').forEach(row => {
    const svgClass = row.getAttribute('data-class');
    const key      = row.querySelector('label').getAttribute('for').replace('pick-', '');
    const hex      = DEFAULTS[svgClass];
    applyColor(svgClass, hex);
    syncPicker(key, hex);
    syncHex(key, hex);
  });
}

/* ─── Randomize ──────────────────────────────────────────────── */
function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

function randomizeColors() {
  document.querySelectorAll('.color-row').forEach(row => {
    const svgClass = row.getAttribute('data-class');
    const key      = row.querySelector('label').getAttribute('for').replace('pick-', '');
    const hex      = randomHex();
    applyColor(svgClass, hex);
    syncPicker(key, hex);
    syncHex(key, hex);
  });
}

/* ─── Init (SVG is already in the DOM — no fetch needed) ─────── */
document.querySelectorAll('.color-row').forEach(wireRow);
document.getElementById('randomize-btn').addEventListener('click', randomizeColors);
document.getElementById('reset-btn').addEventListener('click', resetColors);
