const worksUrl = "http://localhost:5678/api/works";
const categoriesUrl = "http://localhost:5678/api/categories";
let works = []; // to store data from the API

async function getWorks() {
  try {
    const response = await fetch(worksUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    works = await response.json();
    displayWorks(works);
    console.log(works);
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

async function displayFilters() {
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
    
    // Attacher l'événement sans exécuter immédiatement la fonction
    btn.addEventListener("click", onFilterClick);
    filtersContainer.appendChild(btn);
  }
}

function onFilterClick(event) {
  const categoryId = parseInt(event.target.dataset.id);
  let filteredWorks = works; // Assumer que `works` est une variable globale contenant les données

  if (categoryId > 0) {
    filteredWorks = works.filter((work) => work.category.id === categoryId);
  }

  displayWorks(filteredWorks);
}

getWorks();
displayFilters();