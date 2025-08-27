//Déclaration des variables
const form = document.querySelector("form");
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");

// gère connexion utilisateur
async function login() {
  try {
    // Prépare les données de connexion
    const chargeUtile = JSON.stringify({
      email: email.value,
      password: password.value
    });

    // Envoie la requête de connexion
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
    });

    // Vérifie si la réponse est OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    // Si un token est reçu, le stocke et redirige
    if (responseData && responseData.token) {
      localStorage.setItem("token", responseData.token);
      window.location.href = "./index.html";
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    // Gère les erreurs
    console.error("There was a problem with the fetch operation:", error);
    alert("Login failed: " + error.message);
  }
}

// validation côté client du formulaire de connexion
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
