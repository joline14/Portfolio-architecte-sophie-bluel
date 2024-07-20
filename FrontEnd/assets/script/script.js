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

async function init() {
  const works = await getWorks();
  const categories = await getCategories();
  console.log(works);
  displayWorks(works);
  console.log(categories);
  displayCategories(categories);
  filteringWorks(works);
}

init();
