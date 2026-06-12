const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

const foodAmount = document.getElementById("foodAmount");
const transportAmount = document.getElementById("transportAmount");
const shoppingAmount = document.getElementById("shoppingAmount");

const foodFill = document.querySelector(".food-fill");
const transportFill = document.querySelector(".transport-fill");
const shoppingFill = document.querySelector(".shopping-fill");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions(list = transactions) {
  transactionList.innerHTML = "";

  list.forEach((transaction) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <div class="transaction-info">

                <span class="transaction-name">
                    ${transaction.description}
                </span>

                <span class="transaction-category">
                    ${transaction.category}
                </span>

            </div>

            <div>

                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount.toFixed(2)}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    ✕
                </button>

            </div>
        `;

    transactionList.appendChild(li);
  });
}

function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  const balance = income - expense;

  balanceEl.textContent = `₹${balance.toFixed(2)}`;
  incomeEl.textContent = `₹${income.toFixed(2)}`;
  expenseEl.textContent = `₹${expense.toFixed(2)}`;

  updateInsights();
}

function updateInsights() {
  let food = 0;
  let transport = 0;
  let shopping = 0;

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;

    switch (transaction.category) {
      case "Food":
        food += transaction.amount;
        break;

      case "Transport":
        transport += transaction.amount;
        break;

      case "Shopping":
        shopping += transaction.amount;
        break;
    }
  });

  const total = food + transport + shopping || 1;

  foodAmount.textContent = `₹${food.toFixed(2)}`;
  transportAmount.textContent = `₹${transport.toFixed(2)}`;
  shoppingAmount.textContent = `₹${shopping.toFixed(2)}`;

  foodFill.style.width = `${(food / total) * 100}%`;
  transportFill.style.width = `${(transport / total) * 100}%`;
  shoppingFill.style.width = `${(shopping / total) * 100}%`;
}

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();

  const amount = Number(amountInput.value);

  const type = typeInput.value;

  const category = categoryInput.value;

  if (!description || amount <= 0) {
    alert("Please enter valid data");
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
    category,
  };

  transactions.push(transaction);

  saveTransactions();

  renderTransactions();
  updateSummary();

  transactionForm.reset();
});

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  saveTransactions();

  renderTransactions();
  updateSummary();
}

window.deleteTransaction = deleteTransaction;

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filtered = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(keyword),
  );

  renderTransactions(filtered);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("darkMode", isDark);

  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "true") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

renderTransactions();
updateSummary();
