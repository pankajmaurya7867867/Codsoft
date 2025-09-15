const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const themeToggle = document.getElementById('themeToggle');
const historyPanel = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistory');

let currentInput = '';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

//  Update Display
function updateDisplay() {
  display.value = currentInput;
}

//  Update History
function updateHistory() {
  historyPanel.innerHTML = history.slice(-5).map(item =>
    `<div>${item}</div>`
  ).join('');

  document.querySelectorAll('.history div').forEach(div => {
    div.addEventListener('click', () => {
      const text = div.textContent;
      currentInput = text.includes("=") ? text.split("=")[1].trim() : text;
      updateDisplay();
    });
  });

  localStorage.setItem('calcHistory', JSON.stringify(history));
}

//  Calculate Expression
function calculate() {
  try {
    const result = eval(currentInput).toString();
    history.push(`${currentInput} = ${result}`);
    currentInput = result;
    updateDisplay();
    updateHistory();
  } catch {
    currentInput = 'Error';
    updateDisplay();
  }
}

//  Button clicks
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === '=') {
      calculate();
    } else if (value === 'C') {
      currentInput = '';
    } else if (value === '⌫') {
      currentInput = currentInput.slice(0, -1);
    } else {
      if (currentInput === 'Error') currentInput = '';
      currentInput += value;
    }
    updateDisplay();
  });
});

//  Keyboard input
document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.'].includes(e.key)) {
    if (currentInput === 'Error') currentInput = '';
    currentInput += e.key;
  } else if (e.key === 'Enter') {
    calculate();
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
  } else if (e.key === 'Escape') {
    currentInput = '';
  }
  updateDisplay();
});

//  Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light')
    ? "🌑 Switch Theme"
    : "🌙 Switch Theme";
  localStorage.setItem('calcTheme', document.body.classList.contains('light') ? "light" : "dark");
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  history = [];
  updateHistory();
  currentInput = '';
  updateDisplay();
});

// Load history + theme on startup
updateHistory();
if (localStorage.getItem('calcTheme') === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌑 Switch Theme";
} else {
  themeToggle.textContent = "🌙 Switch Theme";
}
