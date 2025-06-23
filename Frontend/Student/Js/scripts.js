// Login main JS 
async function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.querySelector('input[type="email"]').value;
  const passwordInput = document.querySelector('input[type="password"]').value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/student/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      // You can optionally save user info in sessionStorage/localStorage if needed
      // localStorage.setItem("student", JSON.stringify(data.user));
      window.location.href = "../Images/index.html"; // Student dashboard path
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Something went wrong. Please try again.");
  }
}
