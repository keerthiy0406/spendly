"use strict";
/* =========================================================================
   Spendly — a mini expense tracker (starter)
   Fill in every TODO. Your code must compile with `npm run build`
   (tsc, strict mode) with ZERO type errors. Do NOT use `any` to dodge types.
   See TODO.md for the task list and marks.
   ========================================================================= */
/* -------------------------------------------------------------------------
   TASK 1 — Enum (LU: Enums & Tuples)
   TODO: Define a string enum `Category` with: Food, Travel, Bills, Other.
   ------------------------------------------------------------------------- */
// enum Category { ... }
var Category;
(function (Category) {
    Category["Food"] = "Food";
    Category["Travel"] = "Travel";
    Category["Bills"] = "Bills";
    Category["Other"] = "Other";
})(Category || (Category = {}));
/* In-memory store (already typed once you define Expense above). */
const expenses = [];
let nextId = 1;
/* -------------------------------------------------------------------------
   TASK 5 — Type guard / narrowing (LU: Type Guards & Narrowing)
   TODO: Write `toNewExpense` that takes the RAW form strings and either
         returns a valid `NewExpense` or `null`.
         Use typeof / Number checks and verify the category is a real enum
         value. Reject: empty title, non-positive or non-numeric amount,
         invalid category. No `any`.
   ------------------------------------------------------------------------- */
// function toNewExpense(title: string, amountRaw: string, category: string): NewExpense | null { ... }
function isCategory(value) {
    return Object.values(Category).some((category) => category === value);
}
function toNewExpense(title, amountRaw, category) {
    const cleanTitle = title.trim();
    const amount = Number(amountRaw);
    if (cleanTitle === "") {
        return null;
    }
    if (amountRaw.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
        return null;
    }
    if (!Object.values(Category).includes(category)) {
        return null;
    }
    return {
        title: cleanTitle,
        amount: amount,
        category: category,
    };
}
/* -------------------------------------------------------------------------
   TASK 6 — Core logic
   TODO: total()      -> sum of all expense amounts (number)
         breakdown()  -> SummaryRow[] : one [category, total] row per Category
   ------------------------------------------------------------------------- */
// function total(): number { ... }
// function breakdown(): SummaryRow[] { ... }
function total() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}
function breakdown() {
    const totals = {
        [Category.Food]: 0,
        [Category.Travel]: 0,
        [Category.Bills]: 0,
        [Category.Other]: 0,
    };
    for (const expense of expenses) {
        totals[expense.category] += expense.amount;
    }
    return Object.values(Category).map((category) => ({
        category,
        total: totals[category],
    }));
}
/* -------------------------------------------------------------------------
   TASK 7 — DOM wiring + render (LU: TypeTasks UI, Build & Ship)
   TODO:
     - Grab the form + inputs with getElementById and cast to the right
       HTMLElement types (e.g. `as HTMLInputElement`).
     - On submit: preventDefault, call toNewExpense, show an error message
       if invalid, else push a full Expense (add the id) and re-render.
     - render(): paint the #list, #total, and #breakdown from the data.
   ------------------------------------------------------------------------- */
// const form = document.getElementById("expense-form") as HTMLFormElement;
// ... wire up the submit handler and render() here ...
/* Call render() once on load so the UI reflects the (empty) state. */
// render();
const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const errorElement = document.getElementById("error");
const listElement = document.getElementById("list");
const totalElement = document.getElementById("total");
const breakdownElement = document.getElementById("breakdown");
function render() {
    listElement.innerHTML = "";
    for (const expense of expenses) {
        const li = document.createElement("li");
        const details = {
            title: expense.title,
            category: expense.category,
        };
        li.textContent = '${details.title} (${details.category}): $${expense.amount.toFixed(2)}';
        listElement.appendChild(li);
    }
    totalElement.textContent = 'Total: $${total().toFixed(2)}';
    breakdownElement.innerHTML = "";
    for (const row of breakdown()) {
        const li = document.createElement("li");
        li.textContent = '${row.category}: $${row.total.toFixed(2)}';
        breakdownElement.appendChild(li);
    }
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newExpense = toNewExpense(titleInput.value, amountInput.value, categoryInput.value);
    if (newExpense === null) {
        errorElement.textContent = "Invalid input. Please check your entries.";
        return;
    }
    errorElement.textContent = "";
    const expense = {
        id: nextId++,
        ...newExpense,
    };
    nextId++;
    expenses.push(expense);
    form.reset();
    render();
});
render();
