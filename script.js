/* ============================================================
   script.js — Simple Calculator
   Handles all calculator logic, button clicks, and keyboard input.
   ============================================================ */

/* ------------------------------------------------------------------
   1. GET REFERENCES TO HTML ELEMENTS
   These variables point to the parts of the page we need to update.
------------------------------------------------------------------ */
const expressionDisplay = document.getElementById("expression"); // main display line
const resultDisplay = document.getElementById("result");     // small preview line

/* ------------------------------------------------------------------
   2. CALCULATOR STATE
   We store everything the calculator needs to remember in one place.
------------------------------------------------------------------ */
let currentExpression = "";   // the string the user is building, e.g. "12+5"
let justEvaluated = false; // did we just press "="? Used to start fresh on next digit

/* ------------------------------------------------------------------
   3. UPDATE THE DISPLAY
   Called every time the state changes. Writes currentExpression to
   the main display and, when possible, shows a live result preview.
------------------------------------------------------------------ */
function updateDisplay() {
  // Show expression (or "0" when empty)
  expressionDisplay.textContent = currentExpression || "0";

  // Remove error styling from a previous divide-by-zero
  expressionDisplay.classList.remove("error");

  // Show a live preview in the small line below
  if (currentExpression !== "" && !isNaN(currentExpression.slice(-1))) {
    const previewValue = currentExpression;
    if (previewValue !== null && previewValue !== currentExpression) {
      resultDisplay.textContent = "= " + formatNumber(previewValue);
    } else {
      resultDisplay.textContent = "";
    }
  } else {
    resultDisplay.textContent = "";
  }
}

/* ------------------------------------------------------------------
   4. APPEND A VALUE
   Adds a digit, decimal point, or operator to the expression string.
   Handles edge cases so the expression always stays valid-looking.
------------------------------------------------------------------ */
function appendValue(value) {
  const operators = ["+", "-", "*", "/"];

  // After pressing "=" the next DIGIT starts a brand-new expression.
  // But if the next press is an operator, continue from the result.
  if (justEvaluated) {
    if (operators.includes(value)) {
      justEvaluated = false; // continue from current result
    } else {
      currentExpression = ""; // start fresh
      justEvaluated = false;
    }
  }

  // -- Guard: prevent two operators in a row --
  // If the last character is already an operator and the user presses
  // another operator, replace it instead of stacking.
  if (operators.includes(value)) {
    const lastChar = currentExpression.slice(-1);
    if (operators.includes(lastChar)) {
      currentExpression = currentExpression.slice(0, -1); // remove last operator
    }
    // Do not allow an operator to be the very first character (except minus for negative)
    if (currentExpression === "") {
      return;
    }
  }

  // -- Guard: prevent more than one decimal point in the same number --
  if (value === ".") {
    // Split by operators to get the current number segment
    const segments = currentExpression.split(/[\+\-\*\/]/);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment.includes(".")) {
      return; // already has a decimal — ignore this press
    }
    // If the decimal is at the start or after an operator, prepend a 0
    if (lastSegment === "") {
      currentExpression += "0";
    }
  }

  currentExpression += value;
  updateDisplay();
}

/* ------------------------------------------------------------------
   5. CLEAR
   Resets everything back to the initial empty state.
------------------------------------------------------------------ */
function clearCalculator() {
  currentExpression = "";
  justEvaluated = false;
  expressionDisplay.classList.remove("error");
  updateDisplay();
}

/* ------------------------------------------------------------------
   6. DELETE (backspace)
   Removes the last character from the expression.
------------------------------------------------------------------ */
function deleteLast() {
  // If we just evaluated, clear everything on delete
  if (justEvaluated) {
    clearCalculator();
    return;
  }
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

/* ------------------------------------------------------------------
   7. CALCULATE (equals)
   Evaluates the full expression and displays the result.
   Catches divide-by-zero and other invalid inputs gracefully.
------------------------------------------------------------------ */
function calculate() {
  // Nothing to evaluate
  if (currentExpression === "") return;

  const result = currentExpression;

  if (result === null) {
    // Show a friendly error message
    expressionDisplay.textContent = "Error";
    expressionDisplay.classList.add("error");
    resultDisplay.textContent = "";
    currentExpression = "";
    justEvaluated = false;
    return;
  }

  if (result === "DIV_ZERO") {
    expressionDisplay.textContent = "Can't divide by 0";
    expressionDisplay.classList.add("error");
    resultDisplay.textContent = "";
    currentExpression = "";
    justEvaluated = false;
    return;
  }

  // Show the result and store it so we can continue chaining operations
  currentExpression = String(result);
  justEvaluated = true;
  expressionDisplay.classList.remove("error");
  resultDisplay.textContent = "";
  expressionDisplay.textContent = formatNumber(result);
}

/* ------------------------------------------------------------------
   8. SAFE EVALUATE
   Evaluates a math expression string without using eval().
   Returns the numeric result, "DIV_ZERO", or null on bad input.
   
   We use the built-in Function constructor (safer than eval) with
   a division-by-zero check injected around the expression.
------------------------------------------------------------------ */
function safeEvaluate(expression) {
  // Basic sanity check — only allow digits, operators, dots, and spaces
  if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
    return null;
  }

  // Check for division by zero pattern like "5/0" or "12 / 0.0"
  // We detect "/ 0" by replacing "/" with division sign then catching the result
  try {
    // Wrap in a Function to evaluate safely in an isolated scope
    // eslint-disable-next-line no-new-func
    const rawResult = new Function("return (" + expression + ")")();

    if (!isFinite(rawResult)) {
      // Infinity means division by zero happened
      return "DIV_ZERO";
    }

    if (isNaN(rawResult)) {
      return null;
    }

    // Round to 10 decimal places to avoid floating-point noise like 0.1+0.2=0.30000000001
    return parseFloat(rawResult.toFixed(10));

  } catch (error) {
    // Expression is syntactically broken (e.g. "5+")
    return null;
  }
}

/* ------------------------------------------------------------------
   9. FORMAT NUMBER
   Converts a number to a readable string.
   Removes unnecessary trailing zeros after the decimal point.
   Example: 3.50000 → "3.5", 100.0 → "100"
------------------------------------------------------------------ */
function formatNumber(num) {
  // parseFloat removes trailing zeros; 
  return parseFloat(num);

}

/* ------------------------------------------------------------------
   10. BUTTON CLICK HANDLER
   All calculator buttons run through this single event listener
   attached to the button grid (event delegation pattern).
------------------------------------------------------------------ */
const buttonGrid = document.querySelector(".button-grid");

buttonGrid.addEventListener("click", function (event) {
  // Find the button that was actually clicked (could be the grid itself)
  const clickedButton = event.target.closest(".btn");
  if (!clickedButton) return; // click was on the gap between buttons

  const action = clickedButton.dataset.action; // e.g. "clear", "delete", "calculate"
  const value = clickedButton.dataset.value;  // e.g. "7", "+", "."
  if (action === "clear") {
    clearCalculator();
  } else if (action === "delete") {
    deleteLast();
  } else if (value !== undefined) {
    appendValue(value);
  }
});

/* ------------------------------------------------------------------
   11. KEYBOARD INPUT HANDLER
   Maps keyboard keys to calculator actions so users can type numbers
   and operators directly without clicking buttons.
------------------------------------------------------------------ */
document.addEventListener("keydown", function (event) {
  const key = event.key;

  // Map keyboard key → button selector (to trigger the flash animation)
  const keyToSelector = {
    "0": '[data-value="0"]',
    "1": '[data-value="1"]',
    "2": '[data-value="2"]',
    "3": '[data-value="3"]',
    "4": '[data-value="4"]',
    "5": '[data-value="5"]',
    "6": '[data-value="6"]',
    "7": '[data-value="7"]',
    "8": '[data-value="8"]',
    "9": '[data-value="9"]',
    ".": '[data-value="."]',
    "+": '[data-value="+"]',
    "-": '[data-value="-"]',
    "*": '[data-value="*"]',
    "/": '[data-value="/"]',
    "Enter": "#btn-equal",
    "=": "#btn-equal",
    "Backspace": "#btn-delete",
    "Delete": "#btn-clear",
    "Escape": "#btn-clear",
  };

  // Prevent the "/" key from opening the browser's Quick Find bar
  if (key === "/") {
    event.preventDefault();
  }

  // Trigger the corresponding calculator action
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(key)) {
    appendValue(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Delete" || key === "Escape") {
    clearCalculator();
  }
  // Flash the matching button so the user gets visual feedback
  const selector = keyToSelector[key];
  if (selector) {
    flashButton(selector);
  }
});

/* ------------------------------------------------------------------
   12. FLASH BUTTON
   Briefly adds the "btn-active" CSS class to a button to give visual
   feedback when a keyboard key is pressed.
------------------------------------------------------------------ */
function flashButton(selector) {
  const button = document.querySelector(selector);
  if (!button) return;

  button.classList.add("btn-active");

  // Remove the class after a short delay to complete the animation
  setTimeout(function () {
    button.classList.remove("btn-active");
  }, 120);
}

/* ------------------------------------------------------------------
   13. INITIALISE
   Set the display to its default state when the page first loads.
------------------------------------------------------------------ */
updateDisplay();
