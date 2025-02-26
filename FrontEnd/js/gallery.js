const worksUrl = "http://localhost:5678/api/works";

async function getWorks() {
  try {
    const response = await fetch(worksUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    displayWorks(json);
  } catch (error) {
    console.error(error.message);
  }
}

getWorks();

async function displayWorks(works) {
  const gallery = document.querySelector(".gallery");

  if (!gallery) {
    console.error("Erreur : L'élément .gallery n'a pas été trouvé !");
  } else {
    gallery.innerHTML = ""; // don't understand why it's rendering "'gallery' is possibly null"
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
      gallery.appendChild(figure); // don't understand why it's rendering "'gallery' is possibly null"
    }
  }
}
