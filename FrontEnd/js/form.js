import { deleteWork, worksUrl, categoriesUrl } from "./gallery.js";

const form = document.getElementById("form");
const titleInput = document.getElementById("text-title");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("file-btn");
const submitBtn = document.getElementById("submit-photo-form");

if (submitBtn) {
  submitBtn.setAttribute("disabled", "true");
  submitBtn.style.cursor = "not-allowed";
}

if (!form || !titleInput || !categorySelect || !imageInput) {
  console.error("Erreur : Un ou plusieurs éléments du formulaire n'ont pas été trouvés !");
} else {

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
  previewImage.style.display = "none"; // Initialement caché
  const imageIcon = document.getElementById("image-icon");
  const paragraph = document.getElementById("paragraph");
  const fileBtn = document.querySelector(".file-btn");

  if (photoContainer) {
    photoContainer.appendChild(previewImage);
  }

  function validateForm() {
    // @ts-ignore
    const hasImage = imageInput.files && imageInput.files[0];
    // @ts-ignore
    const hasTitle = titleInput.value.trim() !== "";
    // @ts-ignore
    const hasCategory = categorySelect.value !== "";
    
    if (hasImage && hasTitle && hasCategory && submitBtn) {
      submitBtn.removeAttribute("disabled");
      submitBtn.style.backgroundColor = "#1D6154";
      submitBtn.style.cursor = "pointer";
    } else if (submitBtn) {
      submitBtn.setAttribute("disabled", "true");
      submitBtn.style.backgroundColor = "#A7A7A7";
    }
  }
  
  // Add event listeners to validate the form on each change
  titleInput.addEventListener("input", validateForm);
  categorySelect.addEventListener("change", validateForm);

  imageInput.addEventListener("change", () => {

    // @ts-ignore
    const file = imageInput.files[0];
    if (file) {
      // check file size (4Mo max)
      if (file.size > 4 * 1024 * 1024) {
        errorMessage.textContent = "L'image ne doit pas dépasser 4Mo.";
        // @ts-ignore
        imageInput.value = "";
        validateForm();
        return;
      }

      if (!file.type.includes("image/jpeg") && !file.type.includes("image/png")) {
        errorMessage.textContent = "Le fichier doit être au format JPG ou PNG.";
        // @ts-ignore
        imageInput.value;
        validateForm();
        return;
      }

      errorMessage.textContent = ""; // remove the error message if the file is valid

      const reader = new FileReader();
      reader.onload = function (e) {
        if (previewImage) {
          // @ts-ignore
          previewImage.src = e.target.result;
        }
        previewImage.style.display = "block";
        // hide the image icon and paragraph
        if (imageIcon) {
          imageIcon.style.display = "none";
        }
        if (paragraph) {
          paragraph.style.display = "none";
        }
        if (fileBtn) {
          // @ts-ignore
          fileBtn.style.display = "none";
        }
        validateForm();
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

      const defaultOption = document.createElement("option");
      defaultOption.value = ""; // Valeur vide
      defaultOption.textContent = ""; // Texte vide ou tu peux mettre "Sélectionner une catégorie"
      if (categorySelect) {
        categorySelect.appendChild(defaultOption);
      }
      for (const category of categories) {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        if (categorySelect) {
          categorySelect.appendChild(option);
        }
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

    // @ts-ignore
    const title = titleInput.value.trim();
    // @ts-ignore
    const category = categorySelect.value;
    // @ts-ignore
    const file = imageInput.files[0];

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
      
      // display success message
      errorMessage.textContent = "Projet ajouté avec succès !";
      errorMessage.style.color = "green";
      
      // reset the form
      // @ts-ignore
      form.reset();
      previewImage.src = "";
      previewImage.style.display = "none";
      if (imageIcon) {
        imageIcon.style.display = "block";
      }
      if (paragraph) {
        paragraph.style.display = "block";
      }

      if (fileBtn) {
        // @ts-ignore
        fileBtn.style.display = "flex";
      }

      addWorkToMainGallery(newWork);
      addWorkToModalGallery(newWork);

    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      errorMessage.textContent = "Erreur lors de l'envoi du formulaire. Veuillez réessayer.";
      errorMessage.style.color = "red";
    } finally {
      // activate the submit button and change its text
      if (submitBtn) {
        // @ts-ignore
        submitBtn.disabled = false;
        submitBtn.textContent = "Valider";
      }
    }
  });

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