/* ─── Defaults matching logo.svg ─────────────────────────────── */
const DEFAULTS = {
  'color-background': '#1a1a2e',
  'color-pennant':    '#e94560',
  'color-accent':     '#f5a623',
  'color-text':       '#ffffff',
};

/* ─── Load the SVG inline so its elements are directly styleable ─ */
async function loadSVG() {
  const res  = await fetch('logo.svg');
  const text = await res.text();
  document.getElementById('svg-container').innerHTML = text;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const isValidHex = str => /^#[0-9a-fA-F]{6}$/.test(str);

function applyColor(targetId, hex) {
  const el = document.getElementById(targetId);
  if (!el) return;
  // rect / polygon → fill attribute; text → fill attribute
  el.setAttribute('fill', hex);
}

function syncPicker(targetId, hex) {
  const picker = document.getElementById('pick-' + targetId.replace('color-', ''));
  if (picker) picker.value = hex;
}

function syncHex(targetId, hex) {
  const input = document.getElementById('hex-' + targetId.replace('color-', ''));
  if (input) {
    input.value = hex;
    input.classList.remove('invalid');
  }
}

/* ─── Wire up a single color row ────────────────────────────── */
function wireRow(row) {
  const targetId = row.dataset.target;                          // e.g. "color-pennant"
  const suffix   = targetId.replace('color-', '');             // e.g. "pennant"
  const picker   = document.getElementById('pick-' + suffix);
  const hexInput = document.getElementById('hex-' + suffix);

  // Color picker → update SVG + hex field
  picker.addEventListener('input', () => {
    const hex = picker.value;
    applyColor(targetId, hex);
    syncHex(targetId, hex);
  });

  // Hex text field → update SVG + color picker
  hexInput.addEventListener('input', () => {
    let val = hexInput.value.trim();
    if (!val.startsWith('#')) val = '#' + val;

    if (isValidHex(val)) {
      hexInput.classList.remove('invalid');
      applyColor(targetId, val);
      syncPicker(targetId, val);
    } else {
      hexInput.classList.add('invalid');
    }
  });

  // Normalise on blur (add # if missing, keep invalid style if still wrong)
  hexInput.addEventListener('blur', () => {
    let val = hexInput.value.trim();
    if (val && !val.startsWith('#')) {
      val = '#' + val;
      hexInput.value = val;
    }
    if (!isValidHex(val)) {
      hexInput.classList.add('invalid');
    }
  });
}

/* ─── Reset button ──────────────────────────────────────────── */
function resetColors() {
  for (const [targetId, hex] of Object.entries(DEFAULTS)) {
    applyColor(targetId, hex);
    syncPicker(targetId, hex);
    syncHex(targetId, hex);
  }
}

/* ─── Init ──────────────────────────────────────────────────── */
loadSVG().then(() => {
  document.querySelectorAll('.color-row').forEach(wireRow);
  document.getElementById('reset-btn').addEventListener('click', resetColors);
});
