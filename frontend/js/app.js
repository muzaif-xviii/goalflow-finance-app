const userId = localStorage.getItem("user_id");

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