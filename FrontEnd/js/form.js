
import { deleteWork, worksUrl ,categoriesUrl } from "./gallery.js";
// get the form and its elements
const form = document.getElementById("form");  // Corrigé : "form" au lieu de "add-photo-form"
const titleInput = document.getElementById("text-title");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("file-btn");
const submitBtn = document.getElementById("submit-photo-form"); // Ajout du bouton de soumission

if (!form || !titleInput || !categorySelect || !imageInput) {
  console.error("Erreur : Un ou plusieurs éléments du formulaire n'ont pas été trouvés !");
  
} else {
  
// error message
const errorMessage = document.createElement("p");
errorMessage.style.color = "red";
errorMessage.style.textAlign = "center"; // Pour un meilleur affichage
if (form) {
  form.appendChild(errorMessage);
}

// preview image
// create a preview image element and its style
const photoContainer = document.querySelector(".add-photo-container");
const previewImage = document.createElement("img");
previewImage.style.maxWidth = "129px";
previewImage.style.maxHeight = "193px";
previewImage.style.objectFit = "cover";
previewImage.style.display = "none"; // Initialement caché
const imageIcon = document.getElementById("image-icon");
const paragraph = document.getElementById("paragraph");

if (photoContainer) {
  photoContainer.appendChild(previewImage);
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    // Vérifier la taille du fichier (4Mo max)
    if (file.size > 4 * 1024 * 1024) {
      errorMessage.textContent = "L'image ne doit pas dépasser 4Mo.";
      imageInput.value = ""; // Réinitialiser l'input file
      return;
    }
    
    // Vérifier le type du fichier
    if (!file.type.includes("image/jpeg") && !file.type.includes("image/png")) {
      errorMessage.textContent = "Le fichier doit être au format JPG ou PNG.";
      imageInput.value = ""; // Réinitialiser l'input file
      return;
    }
    
    errorMessage.textContent = ""; // Effacer le message d'erreur si tout va bien
    
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      // Cacher l'icône et le paragraphe quand l'image est affichée
      imageIcon.style.display = "none";
      paragraph.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// load categories
async function loadCategories() {
  try {
    const response = await fetch(categoriesUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des catégories: ${response.status}`);
    }
    const categories = await response.json();
 
    for (const category of categories) {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    };
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
    errorMessage.textContent = "Impossible de charger les catégories. Veuillez réessayer.";
  }
}

loadCategories();

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  errorMessage.textContent = "";

  const title = titleInput.value.trim();
  const category = categorySelect.value; 
  const file = imageInput.files[0]; 

  // Validation du formulaire
  if (!title) {
    errorMessage.textContent = "Veuillez entrer un titre.";
    return;
  }
  
  if (!category) {
    errorMessage.textContent = "Veuillez sélectionner une catégorie.";
    return;
  }
  
  if (!file) {
    errorMessage.textContent = "Veuillez ajouter une image.";
    return;
  }

  // Désactiver le bouton pendant l'envoi pour éviter les soumissions multiples
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";
  }

  // we set up the form data
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", file);

  const token = localStorage.getItem("authToken"); 

  try {
    const response = await fetch(worksUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${await response.text()}`);
    }

    const newWork = await response.json();
    
    // Affichage du message de succès
    errorMessage.textContent = "Projet ajouté avec succès !";
    errorMessage.style.color = "green";
    
    // Réinitialisation du formulaire
    form.reset();
    previewImage.src = "";
    previewImage.style.display = "none";
    imageIcon.style.display = "block";
    paragraph.style.display = "block";

    // Ajout dynamique du nouveau projet dans la galerie principale
    addWorkToMainGallery(newWork);
    
    // Ajout dynamique du nouveau projet dans la galerie de la modale
    addWorkToModalGallery(newWork);
    
    // Fermer la modale après 2 secondes (optionnel)
    setTimeout(() => {
      const modal = document.getElementById("modal");
      const modalGallery = document.getElementById("modal-gallery");
      const modalAddPhoto = document.getElementById("modal-add-photo");
      
      if (modal) {
        modal.style.display = "none";
      }
      
      if (modalGallery && modalAddPhoto) {
        modalGallery.classList.remove("hidden");
        modalAddPhoto.classList.add("hidden");
      }
      
      errorMessage.textContent = "";
    }, 2000);

  } catch (err) {
    console.error("Erreur lors de l'envoi :", err);
    errorMessage.textContent = "Erreur lors de l'envoi du formulaire. Veuillez réessayer.";
    errorMessage.style.color = "red";
  } finally {
    // Réactiver le bouton après l'envoi
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Valider";
    }
  }
});

// Fonction pour ajouter le nouveau projet à la galerie principale
function addWorkToMainGallery(work) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("Erreur : L'élément .gallery n'a pas été trouvé !");
    return;
  }
  
  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(caption);
  gallery.appendChild(figure);
}

// Fonction pour ajouter le nouveau projet à la galerie de la modale
function addWorkToModalGallery(work) {
  const lilGallery = document.querySelector(".lil-gallery");
  if (!lilGallery) {
    console.error("Erreur : L'élément .lil-gallery n'a pas été trouvé !");
    return;
  }
  
  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const trashContainer = document.createElement("div");
  trashContainer.className = "trash-icon-container";

  const trashIcon = document.createElement("i");
  trashIcon.className = "fa-solid fa-trash-can";
  trashIcon.onclick = () => {
    deleteWork(work.id);
  };

  trashContainer.appendChild(trashIcon);
  figure.appendChild(img);
  figure.appendChild(trashContainer);
  lilGallery.appendChild(figure);
}

}


/*  2

// form.js (version simplifiée pour développeur junior)


import { deleteWork  } from "./gallery.js";

// Sélection des éléments du formulaire et des champs
const form = document.getElementById("add-photo-form");
const titleInput = document.getElementById("text-title");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("file-btn");

// Zone où s'affichera un message d'erreur
const errorMessage = document.createElement("p");
errorMessage.style.color = "red";
form.appendChild(errorMessage);

// Prévisualisation de l'image sélectionnée
const imageContainer = document.querySelector(".add-photo-container");
const previewImage = document.createElement("img");
previewImage.style.maxWidth = "100%";
previewImage.style.maxHeight = "200px";
previewImage.style.marginTop = "10px";
previewImage.style.objectFit = "cover";
previewImage.style.borderRadius = "8px";
previewImage.style.display = "none";
imageContainer.appendChild(previewImage);

const imageIcon = document.getElementById("image-icon");
const imageHint = document.getElementById("image-hint");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      imageIcon.style.display = "none";
      imageHint.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Charger les catégories depuis l'API et les afficher dans le <select>
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erreur de chargement des catégories :", err);
  }
}

loadCategories();

// Soumission du formulaire
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";

  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const imageFile = imageInput.files[0];

  // Vérifier que tous les champs sont remplis
  if (!title || !category || !imageFile) {
    errorMessage.textContent = "Veuillez remplir tous les champs et choisir une image.";
    return;
  }

  // Préparer les données pour l'envoi
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", imageFile);

  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi");
    }

    const newWork = await response.json();
    errorMessage.textContent = "Projet ajouté avec succès !";
    errorMessage.style.color = "green";

    // Réinitialiser le formulaire et l'aperçu
    form.reset();
    previewImage.style.display = "none";
    imageIcon.style.display = "block";
    imageHint.style.display = "block";

    // Ajouter à la galerie principale
    const gallery = document.querySelector(".gallery");
    const figure = document.createElement("figure");
    figure.dataset.id = newWork.id;
    const img = document.createElement("img");
    img.src = newWork.imageUrl;
    img.alt = newWork.title;
    const caption = document.createElement("figcaption");
    caption.textContent = newWork.title;
    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);

    // Ajouter aussi à la galerie de la modale
    const lilGallery = document.querySelector(".lil-gallery");
    const modalFigure = document.createElement("figure");
    modalFigure.dataset.id = newWork.id;
    const modalImg = document.createElement("img");
    modalImg.src = newWork.imageUrl;
    modalImg.alt = newWork.title;
    const trashContainer = document.createElement("div");
    trashContainer.className = "trash-icon-container";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    trashIcon.onclick = () => {
      deleteWork(newWork.id); // fonction prévue dans gallery.js
    };
    trashContainer.appendChild(trashIcon);
    modalFigure.appendChild(modalImg);
    modalFigure.appendChild(trashContainer);
    lilGallery.appendChild(modalFigure);

  } catch (err) {
    console.error("Erreur d'envoi :", err);
    errorMessage.textContent = "Impossible d'envoyer le formulaire.";
    errorMessage.style.color = "red";
  }
});


 */







/* 3



*/



