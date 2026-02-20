/* ─── Defaults matching logo.svg class fills ─────────────────── */
const DEFAULTS = {
  'cls-1': '#c65252',  // background rect
  'cls-4': '#2f4460',  // pennant body
  'cls-2': '#8ebcef',  // accents
  'cls-3': '#fffefd',  // text
};

/* ─── Load SVG inline so its DOM is directly styleable ───────── */
async function loadSVG() {
  const res  = await fetch('logo.svg');
  const text = await res.text();
  document.getElementById('svg-container').innerHTML = text;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const isValidHex = str => /^#[0-9a-fA-F]{6}$/.test(str);

// Set fill on every element that carries the given SVG CSS class.
// Inline style.fill beats the class-level fill rule, so no !important needed.
function applyColor(svgClass, hex) {
  document.querySelectorAll('#svg-container .' + svgClass)
    .forEach(el => { el.style.fill = hex; });
}

function syncPicker(key, hex) {
  const el = document.getElementById('pick-' + key);
  if (el) el.value = hex;
}

function syncHex(key, hex) {
  const el = document.getElementById('hex-' + key);
  if (el) { el.value = hex; el.classList.remove('invalid'); }
}

/* ─── Wire up a single color row ────────────────────────────── */
function wireRow(row) {
  const svgClass = row.dataset.class;                  // e.g. "cls-1"
  const key      = row.querySelector('label').getAttribute('for')
                       .replace('pick-', '');          // e.g. "background"
  const picker   = document.getElementById('pick-' + key);
  const hexInput = document.getElementById('hex-'  + key);

  // Color picker → SVG + hex field
  picker.addEventListener('input', () => {
    applyColor(svgClass, picker.value);
    syncHex(key, picker.value);
  });

  // Hex field → SVG + color picker
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

  // Normalise on blur
  hexInput.addEventListener('blur', () => {
    let val = hexInput.value.trim();
    if (val && !val.startsWith('#')) {
      val = '#' + val;
      hexInput.value = val;
    }
    if (!isValidHex(val)) hexInput.classList.add('invalid');
  });
}

/* ─── Reset button ──────────────────────────────────────────── */
function resetColors() {
  document.querySelectorAll('.color-row').forEach(row => {
    const svgClass = row.dataset.class;
    const hex      = DEFAULTS[svgClass];
    const key      = row.querySelector('label').getAttribute('for')
                         .replace('pick-', '');
    applyColor(svgClass, hex);
    syncPicker(key, hex);
    syncHex(key, hex);
  });
}

/* ─── Init ──────────────────────────────────────────────────── */
loadSVG().then(() => {
  document.querySelectorAll('.color-row').forEach(wireRow);
  document.getElementById('reset-btn').addEventListener('click', resetColors);
});
