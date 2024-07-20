//Déclaration des variables

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters-container");
const token = localStorage.getItem("token");
const logout = document.querySelector(".logout");

// Récupération des travaux

async function getWorks() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    return reponse.json();
  } catch (error) {
    console.log(error);
  }
}

// Affichage des travaux récupérés

async function displayWorks(works) {
  gallery.innerHTML = "";
  works.forEach((work) => {
    // Pour chaque "work" ...
    createWork(work); // La fonction "createWork" est appelée
  });
}

function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Récupération des catégories pour les filtres
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

// Affichage des filtres récupérés
function displayCategories(categories) {
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.id = category.id;
    console.log(filters);
    filters.appendChild(button);
  });
}

// Filtrage des travaux de la galerie par catégories
async function filteringWorks(allWorks) {
  const buttons = document.querySelectorAll(".filters-container button");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const buttonId = event.target.id;
      console.log(buttonId);
      gallery.innerHTML = "";
      const worksByCategory = buttonId ? allWorks.filter((work) => work.categoryId == buttonId) : allWorks;

      // Affichage des travaux filtrés ou de tous les travaux si aucun filtre n'est sélectionné
      worksByCategory.forEach((work) => {
        createWork(work); // Appel de la fonction "createWork"
      });
    });
  });
}

async function init() {
  // Mode admin - quand l'utilisateur est connecté
  if (token) {
    // Si la connexion a bien été établie et qu'on a récupéré le token
    logout.textContent = "logout"; // Changement du texte "login" en "logout" dans la barre de navigation du header
    document.querySelector(".edition-mode").style.display = "block"; // Apparition de la bannière "mode édition"
    document.querySelector(".filters-container").style.display = "none"; // Disparition des filtres
    document.querySelector(".modification p").style.display = "block"; // Apparition du lien "modifier"

    // Déconnexion
    logout.addEventListener("click", () => {
      // Lors du clic sur "logout"
      localStorage.removeItem("token"); // Le token est supprimé du local storage
      window.location.href = "login.html"; // Redirection sur la page de connexion
    });
  }
  const works = await getWorks();
  const categories = await getCategories();
  console.log(works);
  displayWorks(works);
  console.log(categories);
  displayCategories(categories);
  filteringWorks(works);
}

init();
