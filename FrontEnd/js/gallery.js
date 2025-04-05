const worksUrl = "http://localhost:5678/api/works";
export const categoriesUrl = "http://localhost:5678/api/categories";
let works = []; // to store data from the API

async function getWorks() {
  try {
    const response = await fetch(worksUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    works = await response.json();
    displayWorks(works);
    displayWorksModal(works);
  } catch (error) {
    console.error(error.message);
  }
}

async function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("Erreur : L'élément .gallery n'a pas été trouvé !");
  } else {
    gallery.innerHTML = ""; // don't understand why it's rendering "'gallery' is possibly null" without if/else statement
  }
  
  for (const work of works) {
    // creating tags and give them the right proprety of the object
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;
    // target the right tag for nest the elements
    figure.appendChild(img);
    figure.appendChild(figcaptionElement);
    if (!gallery) {
      console.error("Erreur : L'élément .gallery n'a pas été trouvé !");
    } else {
      gallery.appendChild(figure); // don't understand why it's rendering "'gallery' is possibly null" without if/else statement
    }
  }
}

async function displayWorksModal(works) {
  const lilGallery = document.querySelector(".lil-gallery");
  if (!lilGallery) {
    console.error("Erreur : L'élément .lil-gallery n'a pas été trouvé !");
  } else {
    lilGallery.innerHTML = ""; // don't understand why it's rendering "'lilGallery' is possibly null" without if/else statement
  }

  for (const work of works) {
    // creating tags and give them the right proprety of the object
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    trashIcon.onclick = () => {
      deleteWork(work.id);
    }
    const trashIconContainer = document.createElement("div");
    trashIconContainer.className = "trash-icon-container";

    trashIconContainer.appendChild(trashIcon);
    figure.appendChild(img);
    figure.appendChild(trashIconContainer);

    // target the right tag for nest the elements
    if (!lilGallery) {
      console.error("Erreur : L'élément .lil-gallery n'a pas été trouvé !");
    } else {
      lilGallery.appendChild(figure); // don't understand why it's rendering "'gallery' is possibly null" without if/else statement
    }
  }
}

export async function displayFilters() {
  const filtersContainer = document.querySelector(".filters");

  if (!filtersContainer) {
    console.error("Erreur : L'élément .filters n'a pas été trouvé !");
    return;
  }

  const response = await fetch(categoriesUrl);
  const categories = await response.json();
  
  // creation of a button to display all works
  categories.unshift({ id: 0, name: "Tous" });

  // creation of a button to display all works
  for (const category of categories) {
    const btn = document.createElement("button");
    btn.innerText = category.name;
    btn.dataset.id = category.id;
    
    btn.addEventListener("click", onFilterClick);
    filtersContainer.appendChild(btn);
  }
}

function onFilterClick(event) {
  const categoryId = parseInt(event.target.dataset.id);
  let filteredWorks = works; // by default, we display all works

  if (categoryId > 0) {
    filteredWorks = works.filter((work) => work.category.id === categoryId);
  }

  displayWorks(filteredWorks);
}

async function deleteWork(workId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${worksUrl}/${workId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }

    console.log(`Travail ${workId} supprimé avec succès !`);
    removeWorkFromDOM(workId);
    
  } catch (error) {
    console.error("Erreur lors de la suppression du travail :", error);
  }
}

function removeWorkFromDOM(workId) {
  // remove the element from the gallery
  const galleryElement = document.querySelector(`.gallery figure[data-id="${workId}"]`);
  if (galleryElement) {
    galleryElement.remove();
  }

  // remove the element from the modal gallery
  const modalGalleryElement = document.querySelector(`#lil-gallery figure[data-id="${workId}"]`);
  if (modalGalleryElement) {
    modalGalleryElement.remove();
  }
}

getWorks();
displayFilters();