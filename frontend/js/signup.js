const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {
    console.log("signup clicked");
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // validation
  if (!username || !email || !password) {
    alert("Please enter all the details");
    return;
  }

  try {
    console.log("sending fetch request");
    const response = await fetch("http://localhost:5001/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });  console.log("response received");

    const data = await response.text();

    if (response.ok) {
      alert("Signup successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert(data);
    }

  } catch (error) {
    console.error("FETCH ERROR:", error);
    alert("Something went wrong");
  }
});