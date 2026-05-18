# 🧮 Simple Calculator

A clean, beginner-friendly calculator web application built with pure HTML, CSS, and JavaScript — no frameworks, no libraries.

---

## 📸 Preview

A dark-themed calculator card centered on the page, with a monospaced display and a responsive grid of rounded buttons.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Operations** | Addition `+`, Subtraction `−`, Multiplication `×`, Division `÷` |
| **Decimal support** | Enter and calculate numbers with decimal points |
| **Clear (C)** | Resets the calculator completely |
| **Delete (DEL)** | Removes the last entered character |
| **Live preview** | Shows the evaluated result as you type |
| **Divide by zero** | Displays a friendly error message instead of crashing |
| **Keyboard input** | Full keyboard support (digits, operators, Enter, Backspace, Escape) |
| **Responsive UI** | Works on desktop, tablet, and mobile screens |
| **Dark theme** | Easy-on-the-eyes dark colour scheme |
| **Smooth animations** | Hover effects, press animations, and keyboard flash feedback |

---

## 🗂️ Folder Structure

```
calculator/
│
├── index.html    ← Page structure and button layout
├── style.css     ← All visual styling (dark theme, grid, animations)
├── script.js     ← All calculator logic and keyboard support
└── README.md     ← This file
```

---

## 🛠️ Technologies Used

- **HTML5** — Semantic markup, `data-*` attributes for button actions
- **CSS3** — Custom properties, CSS Grid, transitions, media queries
- **JavaScript (ES6)** — DOM manipulation, event delegation, keyboard events
- **Google Fonts** — `Share Tech Mono` (display) + `Nunito` (buttons)

---

## 🚀 How to Run

No build step, no install, no server needed.

1. **Download or clone** this folder.
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari).
3. Start calculating!

```bash
# Optional: serve with a simple local server
npx serve .
# then open http://localhost:3000
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `0` – `9` | Enter digits |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last character |
| `Delete` or `Escape` | Clear everything |

---

## 🧩 Code Structure (script.js overview)

```
1.  Get HTML elements          — grab display elements once
2.  Calculator state           — currentExpression, justEvaluated
3.  updateDisplay()            — refresh both display lines
4.  appendValue(value)         — add a digit/operator safely
5.  clearCalculator()          — reset to empty state
6.  deleteLast()               — backspace one character
7.  calculate()                — evaluate and show result
8.  safeEvaluate(expression)   — safe math engine (no raw eval)
9.  formatNumber(num)          — clean up trailing zeros
10. Button click handler       — event delegation on the grid
11. Keyboard input handler     — maps keys → calculator actions
12. flashButton(selector)      — visual feedback for keyboard presses
13. Initialise                 — updateDisplay() on page load
```

---

## 🎓 Learning Notes (for beginners)

- **Event delegation** (Section 10): Instead of adding a click listener to every button, we add one listener to the parent grid and check which button was clicked. Cleaner and more efficient.
- **`data-*` attributes** (HTML): Custom HTML attributes like `data-value="7"` let us attach metadata to elements without using JavaScript variables.
- **`safeEvaluate`** (Section 8): We use `new Function(...)` instead of `eval()` — slightly safer because it runs in a limited scope. We also validate the string with a regular expression first.
- **Guard clauses** (Section 4): The `if` checks at the top of `appendValue` prevent bad input (double operators, double decimals) before they happen, keeping the logic simple.

---

## 📄 License

Free to use for learning and personal projects.
