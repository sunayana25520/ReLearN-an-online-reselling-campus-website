import { loginUser } from "../backend/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");

  loginLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await loginUser(email, password);
      window.location.href = "welcome.html";
    } catch (err) {
      alert(err.message);
    }
  });
});