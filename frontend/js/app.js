const userId = localStorage.getItem("user_id");

// PAGE PROTECTION
if (!userId) {
    window.location.href = "login.html";
}

// DOM ELEMENTS
const incomeModal = document.getElementById("incomeModal");
const expenseModal = document.getElementById("expenseModal");
const goalModal = document.getElementById("goalModal");

const authLink = document.getElementById("authLink");

const revenueValue = document.getElementById("revenueValue");
const expenseValue = document.getElementById("expenseValue");
const balanceValue = document.getElementById("balanceValue");

const expenseList = document.getElementById("expenseList");
const transactionList = document.getElementById("transactionList");
const goalList = document.getElementById("goalList");

// AUTH LINK
if (authLink) {
    authLink.textContent = "Logout";
    authLink.href = "#";

    authLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user_id");
        window.location.href = "login.html";
    });
}

// OPEN MODALS
document.getElementById("openIncomeModal")?.addEventListener("click", () => {
    incomeModal.style.display = "flex";
});

document.getElementById("openExpenseModal")?.addEventListener("click", () => {
    expenseModal.style.display = "flex";
});

document.getElementById("openGoalModal")?.addEventListener("click", () => {
    goalModal.style.display = "flex";
});

// CLOSE MODALS
window.addEventListener("click", (e) => {
    if (e.target === incomeModal) incomeModal.style.display = "none";
    if (e.target === expenseModal) expenseModal.style.display = "none";
    if (e.target === goalModal) goalModal.style.display = "none";
});

// ---------- SAVE INCOME ----------
document.getElementById("saveIncomeBtn")?.addEventListener("click", async () => {
    const amount = document.getElementById("incomeAmount").value;
    const source = document.getElementById("incomeSource").value;
    const date_received = document.getElementById("incomeDate").value;

    if (!amount || !source || !date_received) {
        alert("Please fill all income details");
        return;
    }

    try {
        const response = await fetch("http://localhost:5001/api/finance/income", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                amount,
                source,
                date_received
            })
        });

        const data = await response.json();
        alert(data.message);

        incomeModal.style.display = "none";

        document.getElementById("incomeAmount").value = "";
        document.getElementById("incomeSource").value = "";
        document.getElementById("incomeDate").value = "";

        await loadSummary();
        await loadTransactions();
        await loadGoals();
    } catch (error) {
        console.error("Income save error:", error);
        alert("Failed to add income");
    }
});

// SAVE EXPENSE
document.getElementById("saveExpenseBtn")?.addEventListener("click", async () => {
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;
    const date_spent = document.getElementById("expenseDate").value;

    if (!amount || !category || !date_spent) {
        alert("Please fill all expense details");
        return;
    }

    try {
        const response = await fetch("http://localhost:5001/api/finance/expense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                amount,
                category,
                date_spent
            })
        });

        const data = await response.json();
        alert(data.message);

        expenseModal.style.display = "none";

        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseCategory").value = "";
        document.getElementById("expenseDate").value = "";

        await loadExpenses();
        await loadSummary();
        await loadTransactions();
        await loadGoals();
        if (typeof loadExpenseChart === "function") {
          loadExpenseChart();
        }
    } catch (error) {
        console.error("Expense save error:", error);
        alert("Failed to add expense");
    }
});

// SAVE GOAL
document.getElementById("saveGoalBtn")?.addEventListener("click", async () => {
    const goal_name = document.getElementById("goalName").value;
    const target_amount = document.getElementById("goalTarget").value;

    if (!goal_name || !target_amount) {
        alert("Please fill all goal details");
        return;
    }

    try {
        const response = await fetch("http://localhost:5001/api/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                goal_name,
                target_amount
            })
        });

        const data = await response.json();
        alert(data.message);

        goalModal.style.display = "none";

        document.getElementById("goalName").value = "";
        document.getElementById("goalTarget").value = "";

        await loadGoals();
    } catch (error) {
        console.error("Goal save error:", error);
        alert("Failed to add goal");
    }
});

// LOAD SUMMARY
async function loadSummary() {
    try {
        const response = await fetch(`http://localhost:5001/api/finance/summary/${userId}`);
        const data = await response.json();

        if (revenueValue) revenueValue.textContent = `₹${data.total_income}`;
        if (expenseValue) expenseValue.textContent = `₹${data.total_expense}`;
        if (balanceValue) balanceValue.textContent = `₹${data.balance}`;
    } catch (error) {
        console.error("Summary load error:", error);
    }
}

// LOAD EXPENSES
async function loadExpenses() {
    try {
        const response = await fetch(`http://localhost:5001/api/finance/expenses/${userId}`);
        const expenses = await response.json();

        console.log("Loaded expenses:", expenses);
        console.log("expenseList element:", expenseList);

        if (!expenseList) {
            console.error("No element found with id='expenseList'");
            return;
        }

        expenseList.innerHTML = "";

        if (!expenses || expenses.length === 0) {
            expenseList.innerHTML = "<p>No expenses added yet.</p>";
            return;
        }

        expenses.forEach((expense) => {
            const div = document.createElement("div");
            div.className = "expense-entry";
            div.innerHTML = `
                <strong>${expense.category}</strong><br>
                ₹${expense.amount}<br>
                <small>${expense.date_spent}</small>
            `;
            expenseList.appendChild(div);
        });
    } catch (error) {
        console.error("Expense load error:", error);
    }
}

// LOAD TRANSACTIONS
async function loadTransactions() {
    try {
        const response = await fetch(`http://localhost:5001/api/finance/transactions/${userId}`);
        const transactions = await response.json();

        if (!transactionList) {
            console.error("No element found with id='transactionList'");
            return;
        }

        transactionList.innerHTML = "";

        if (!transactions || transactions.length === 0) {
            transactionList.innerHTML = "<p>No transactions yet.</p>";
            return;
        }

        transactions.forEach((transaction) => {
            const div = document.createElement("div");
            div.className = "transaction-entry";
            div.innerHTML = `
                <strong>${transaction.type === "income" ? "Income" : "Expense"}</strong><br>
                ${transaction.label}<br>
                ₹${transaction.amount}<br>
                <small>${transaction.date}</small>
            `;
            transactionList.appendChild(div);
        });
    } catch (error) {
        console.error("Transaction load error:", error);
    }
}

// LOAD GOALS
async function loadGoals() {
    try {
        const response = await fetch(`http://localhost:5001/api/goals/${userId}`);
        const goals = await response.json();

        if (!goalList) {
            console.error("No element found with id='goalList'");
            return;
        }

        goalList.innerHTML = "";

        if (!goals || goals.length === 0) {
            goalList.innerHTML = "<p>No active goals yet.</p>";
            return;
        }

        const balanceText = balanceValue ? balanceValue.textContent.replace("₹", "") : "0";
        const balance = Number(balanceText) || 0;

        goals.forEach((goal) => {
            const affordable = balance >= Number(goal.target_amount);

            const div = document.createElement("div");
            div.className = "goal-entry";
            div.innerHTML = `
                <strong>${goal.goal_name}</strong><br>
                Target: ₹${goal.target_amount}<br>
                Status: ${affordable ? "Affordable" : "Not Yet Affordable"}<br>
                <button class="completeGoalBtn" data-id="${goal.goal_id}">Mark Done</button>
            `;
            goalList.appendChild(div);
        });

        document.querySelectorAll(".completeGoalBtn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const goalId = btn.dataset.id;

                try {
                    const response = await fetch(`http://localhost:5001/api/goals/complete/${goalId}`, {
                        method: "PUT"
                    });

                    const data = await response.json();
                    alert(data.message);
                    await loadGoals();
                } catch (error) {
                    console.error("Goal complete error:", error);
                }
            });
        });
    } catch (error) {
        console.error("Goal load error:", error);
    }
}

// INITIALIZE DASHBOARD
async function initializeDashboard() {
    await loadSummary();
    await loadExpenses();
    await loadTransactions();
    await loadGoals();
}

initializeDashboard();