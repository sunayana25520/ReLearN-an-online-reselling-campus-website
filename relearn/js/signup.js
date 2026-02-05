import { signupUser } from "../backend/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const regno = document.getElementById("regno").value.trim();
    const department = document.getElementById("department").value;
    const semester = document.getElementById("semester").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // College email check
    const emailPattern = /^[a-zA-Z0-9._%+-]+@mictech\.edu\.in$/;
    if (!emailPattern.test(email)) {
      alert("Use your @mictech.edu.in email");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await signupUser({
        email,
        password,
        fullname,
        regno,
        department,
        semester
      });

      alert("Signup successful! Check your email for verification.");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
});