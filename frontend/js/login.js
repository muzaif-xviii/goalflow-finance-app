const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password){
    alert("please enter all the details");
    return;
  }

  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // store user_id
      localStorage.setItem("user_id", data.user_id);

      // redirect to dashboard
      window.location.href = "index.html";
    } else {
      alert(data);
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
});