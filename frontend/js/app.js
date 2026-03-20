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