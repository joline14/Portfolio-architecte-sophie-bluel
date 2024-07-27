// Variables globales pour les éléments utilisés dans plusieurs fonctions
const modalContainer = document.querySelector(".modal-container");
const firstPage = document.querySelector(".modal");
const secondPage = document.querySelector(".modal-2");
const formAddPhoto = document.getElementById("form-addphoto");
const modalGallery = document.querySelector(".modal-gallery");
const inputTitle = document.getElementById("title");
const selectCategory = document.getElementById("category");
const inputFile = document.getElementById("file");
const previewImg = document.getElementById("image");
const label = document.querySelector(".addPhoto-file");
const previewTextImg = document.querySelector(".addPhoto-container p");
const errorSelect = document.getElementById("error-select");
const works = []; // Liste des travaux

// Récupère les travaux depuis l'API

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
  }
}

// Ouvre la modale

function openModal() {
  // Affiche la modale
  modalContainer.style.display = "flex";
}

// Ferme la modale et réinitialise le formulaire

function closeModal() {
  // Cache la modale
  modalContainer.style.display = "none";
  // Réinitialise le formulaire d'ajout de photo
  resetForm();
}

// Réinitialisation formulaire d'ajout de photo

function resetForm() {
  // Réinitialise tous les champs du formulaire
  formAddPhoto.reset();
  // Cache l'image de prévisualisation
  previewImg.style.display = "none";
  // Réinitialise le style du label pour ajouter une photo
  label.classList.remove("addPhoto-file2");
  // Réinitialise le texte de prévisualisation de l'image
  previewTextImg.innerHTML = "jpg, png : 4mo max";
  // Cache le message d'erreur de sélection de catégorie
  errorSelect.style.display = "none";
}

// Affichage  firstPage de la modale (galerie)

function showFirstPage() {
  firstPage.style.display = "flex"; // Affiche la première page
  secondPage.style.display = "none"; // Cache la deuxième page
}

// Affichage secondPage de la modale (formulaire d'ajout de photo)

function showSecondPage() {
  firstPage.style.display = "none"; // Cache la première page
  secondPage.style.display = "flex"; // Affiche la deuxième page
}

// Affichage galerie dans la modale

async function displayGalleryModal() {
  // Vide le contenu actuel de la galerie
  modalGallery.innerHTML = "";
  // Récupère les travaux depuis l'API
  const works = await getWorks();
  // Pour chaque travail, crée et ajoute les éléments nécessaires à la galerie
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const trashcan = document.createElement("i");
    const span = document.createElement("span");

    img.src = work.imageUrl; // Définit l'URL de l'image
    img.alt = work.title; // Définit le texte alternatif de l'image
    trashcan.classList.add("fa-solid", "fa-trash-can"); // Ajoute des classes à l'icône poubelle
    trashcan.id = work.id; // Définit l'id de l'icône poubelle
    // Ajoute un événement de clic pour supprimer le travail
    trashcan.addEventListener("click", () => deleteWork(work.id));

    span.appendChild(trashcan); // Ajoute l'icône poubelle au span
    figure.appendChild(img); // Ajoute l'image à la figure
    figure.appendChild(span); // Ajoute le span à la figure
    modalGallery.appendChild(figure); // Ajoute la figure à la galerie
  });
}

// Prévisualisation image lors de l'ajout d'un nouveau projet

function previewNewWork() {
  // Ajoute un événement de changement pour l'input de fichier
  inputFile.addEventListener("change", () => {
    // Récupère le fichier sélectionné
    const fileImg = inputFile.files[0];
    if (fileImg) {
      // Si un fichier est sélectionné, crée un FileReader pour lire le fichier
      const reader = new FileReader();
      // Définit ce qui se passe lorsque le fichier est complètement lu
      reader.onload = function (e) {
        // Définit la source de l'image de prévisualisation
        previewImg.src = e.target.result;
        // Affiche l'image de prévisualisation
        previewImg.style.display = "block";
        // Ajoute une classe pour modifier le style du label
        label.classList.add("addPhoto-file2");
        // Vide le texte de prévisualisation de l'image
        previewTextImg.innerHTML = "";
      };
      // Lit le fichier comme une URL de données
      reader.readAsDataURL(fileImg);
    } else {
      // Si aucun fichier n'est sélectionné, cache l'image de prévisualisation
      previewImg.style.display = "none";
    }
  });
}

// Ajoute un nouveau projet

async function addWork() {
  // Crée un FormData pour envoyer les données du formulaire
  const formData = new FormData();
  formData.append("title", inputTitle.value);
  formData.append("image", inputFile.files[0]);
  formData.append("category", selectCategory.value);

  // Envoie une requête POST pour ajouter le nouveau projet
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  if (response.ok) {
    // Si la réponse est OK, réinitialise le formulaire et affiche la première page de la modale
    resetForm();
    showFirstPage();
    // Réaffiche la galerie mise à jour
    await displayGalleryModal();
  } else {
    // Si la réponse n'est pas OK, lance une erreur
    throw new Error("Erreur lors de l'ajout de fichier.");
  }
}

// Supprime un projet existant

async function deleteWork(workId) {
  // Envoie une requête DELETE pour supprimer le projet
  await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
  // Réaffiche la galerie mise à jour
  await displayGalleryModal();
}

// Valide le formulaire avant l'ajout d'un nouveau projet

function validateForm() {
  // Ajoute un événement de soumission pour le formulaire
  formAddPhoto.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Vérifie si tous les champs nécessaires sont remplis
    if (previewImg.src === "") {
      isValid = false;
    }
    if (inputTitle.value === "") {
      isValid = false;
    }
    if (selectCategory.value === "0") {
      isValid = false;
      // Affiche un message d'erreur si aucune catégorie n'est sélectionnée
      errorSelect.style.display = "flex";
    }

    // Si le formulaire est valide, ajoute le projet
    if (isValid) {
      addWork();
    }
  });
}

// Initialise les événements et affiche la galerie

function initModal() {
  // événement pour ouvrir la modale au clic sur le lien "modifier"
  const modify = document.querySelector(".modification p");
  modify.addEventListener("click", openModal);

  // événements pour fermer la modale au clic sur les boutons de fermeture
  const closeButtons = document.querySelectorAll(".fa-xmark");
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  // événement pour afficher la première page de la modale au clic sur la flèche
  const backToFirstPageButton = document.querySelector(".fa-arrow-left");
  backToFirstPageButton.addEventListener("click", showFirstPage);

  // événement pour afficher la deuxième page de la modale au clic sur le bouton "Ajouter une photo"
  const addPhotoButton = document.querySelector(".btnAddPhoto");
  addPhotoButton.addEventListener("click", showSecondPage);

  // Prépare l'événement pour prévisualiser l'image sélectionnée
  previewNewWork();
  // Prépare l'événement pour valider le formulaire
  validateForm();
  // Affiche la galerie de la modale
  displayGalleryModal();
}

// Initialise la modale après le chargement du DOM
document.addEventListener("DOMContentLoaded", initModal);
