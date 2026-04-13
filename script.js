const state = {
  current: '0',       // what the user is currently typing
  expression: '',     // the full expression shown above (e.g. "12 + 5")
  operator: null,     // the chosen operator (+, -, *, /)
  prevValue: null,    // the number before the operator was pressed
  shouldReset: false, // flag: after = is pressed, next number starts fresh
};

// --- DOM References ---
const expressionEl = document.getElementById('expression');
const currentEl = document.getElementById('current');

// --- Display ---
function updateDisplay() {
  currentEl.textContent = state.current;
  expressionEl.textContent = state.expression;
}

// --- Input Validation Helpers ---
function hasDecimal() {
  return state.current.includes('.');
}

function isAtLimit() {
  return state.current.replace('.', '').replace('-', '').length >= 10;
}

// --- Actions ---

function handleNumber(value) {
  if (state.shouldReset) {
    state.current = value;
    state.shouldReset = false;
    updateDisplay();
    return;
  }

  if (isAtLimit()) return;

  if (state.current === '0' && value !== '.') {
    state.current = value;
  } else {
    state.current += value;
  }

  updateDisplay();
}

function handleDecimal() {
  if (hasDecimal()) return;

  if (state.shouldReset) {
    state.current = '0.';
    state.shouldReset = false;
    updateDisplay();
    return;
  }

  state.current += '.';
  updateDisplay();
}

function handleOperator(op) {
  const current = parseFloat(state.current);

  if (state.prevValue !== null && !state.shouldReset) {
    const result = compute(state.prevValue, current, state.operator);
    state.current = formatResult(result);
  }

  state.prevValue = parseFloat(state.current);
  state.operator = op;

  const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
  state.expression = `${state.current} ${opSymbol}`;

  state.shouldReset = true;
  updateDisplay();
}

function handleEquals() {
  if (state.operator === null || state.prevValue === null) return;

  const current = parseFloat(state.current);
  const result = compute(state.prevValue, current, state.operator);

  const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[state.operator];
  state.expression = `${state.prevValue} ${opSymbol} ${current} =`;

  state.current = formatResult(result);
  state.operator = null;
  state.prevValue = null;
  state.shouldReset = true;

  updateDisplay();
}

function handleClear() {
  state.current = '0';
  state.expression = '';
  state.operator = null;
  state.prevValue = null;
  state.shouldReset = false;
  updateDisplay();
}

function handleDelete() {
  if (state.shouldReset || state.current === '0') return;

  state.current = state.current.slice(0, -1) || '0';
  updateDisplay();
}

// --- Math Engine ---
function compute(a, b, operator) {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) {
        state.expression = '';
        state.shouldReset = true;
        return 'Error';
      }
      return a / b;
    default: return b;
  }
}

// --- Result Formatting ---
function formatResult(value) {
  if (value === 'Error') return 'Error';
  const rounded = parseFloat(value.toFixed(10));
  return rounded.toString();
}

// --- Event Delegation ---
const buttonsContainer = document.querySelector('.buttons');

buttonsContainer.addEventListener('click', (event) => {
  const btn = event.target.closest('.btn');
  if (!btn) return; // clicked on gap, not a button

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'number':   handleNumber(value);   break;
    case 'operator': handleOperator(value); break;
    case 'decimal':  handleDecimal();       break;
    case 'equals':   handleEquals();        break;
    case 'clear':    handleClear();         break;
    case 'delete':   handleDelete();        break;
  }
});

// --- Keyboard Support ---
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key >= '0' && key <= '9')       handleNumber(key);
  else if (key === '.')               handleDecimal();
  else if (['+','-','*','/'].includes(key)) handleOperator(key);
  else if (key === 'Enter' || key === '=') handleEquals();
  else if (key === 'Backspace')       handleDelete();
  else if (key === 'Escape')          handleClear();
});