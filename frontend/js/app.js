const userId = localStorage.getItem("user_id");

const incomeModal = document.getElementById("incomeModal");
const expenseModal = document.getElementById("expenseModal");
const goalModal = document.getElementById("goalModal");

//index protection
if (!userId) {
  window.location.href = "login.html";
}

// check if user is logged in
const loginLink = document.getElementById("authLink");

if (userId) {
  loginLink.textContent = "Logout";

  loginLink.addEventListener("click", () => {
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
  });

} else {
  loginLink.textContent = "Login / Signup";

  loginLink.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

//cards and modals 

document.getElementById("openIncomeModal").addEventListener("click", () => {
    incomeModal.style.display = "flex";
});

document.getElementById("openExpenseModal").addEventListener("click", () => {
    expenseModal.style.display = "flex";
});

document.getElementById("openGoalModal").addEventListener("click", () => {
    goalModal.style.display = "flex";
});

window.addEventListener("click", (e) => {
    if (e.target === incomeModal) incomeModal.style.display = "none";
    if (e.target === expenseModal) expenseModal.style.display = "none";
    if (e.target === goalModal) goalModal.style.display = "none";
});

// save income
document.getElementById("saveIncomeBtn").addEventListener("click", async () => {
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
    } catch (error) {
        console.error(error);
        alert("Failed to add income");
    }
    loadSummary();
});

// save expense
document.getElementById("saveExpenseBtn").addEventListener("click", async () => {
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
    } catch (error) {
        console.error(error);
        alert("Failed to add expense");
    }
    loadSummary();
});

// save goal
document.getElementById("saveGoalBtn").addEventListener("click", async () => {
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
    } catch (error) {
        console.error(error);
        alert("Failed to add goal");
    }
    loadSummary();
});

async function loadSummary() {
    try {
        const response = await fetch(`http://localhost:5001/api/finance/summary/${userId}`);
        const data = await response.json();

        document.getElementById("revenueValue").textContent = `₹${data.total_income}`;
        document.getElementById("expenseValue").textContent = `₹${data.total_expense}`;
        document.getElementById("balanceValue").textContent = `₹${data.balance}`;
    } catch (error) {
        console.error(error);
    }
}

loadSummary();