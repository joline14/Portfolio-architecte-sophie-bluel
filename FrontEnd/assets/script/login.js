const form = document.querySelector("form");
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");

async function login() {
  try {
    const chargeUtile = JSON.stringify({
      email: email.value,
      password: password.value
    });

    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "./index.html";
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    alert("Login failed: " + error.message);
  }
}

function init() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailUser = email.value;
    const passwordUser = password.value;
    if (emailUser === "") {
      document.getElementById("errormail").style.display = "block"; // Le message d'erreur s'affiche
      console.log("email");
    } else {
      document.getElementById("errormail").style.display = "none"; // Le message d'erreur ne s'affiche pas
    }
    if (passwordUser === "") {
      document.getElementById("errorpassword").style.display = "block"; // Le message d'erreur s'affiche
      console.log("password");
    } else {
      document.getElementById("errorpassword").style.display = "none"; // Le message d'erreur ne s'affiche pas
    }
    login(); // Si les champs sont remplis, la fonction "login" s'éxécute
  });
}
init();
