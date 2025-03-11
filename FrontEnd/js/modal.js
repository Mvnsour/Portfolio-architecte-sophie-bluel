const modal = document.getElementById("modal");
const closeModal = document.getElementById("close");
const openModal = document.getElementById("edit-btn"); // edit
const topEditBtn = document.getElementById("top-edit-btn"); // edition
const addPhotoBtn = document.getElementById("add-photo-btn");
const galleryModal = document.getElementById("modal-gallery");
const modalAddPhoto = document.getElementById("modal-add-photo");
const toReturn = document.getElementById("to-return");

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (isLoggedIn) {
  console.log("L'utilisateur est connecté !");
  localStorage.removeItem("isLoggedIn");
}

if (!modal || !openModal || !closeModal || !topEditBtn || !addPhotoBtn || !galleryModal || !modalAddPhoto || !toReturn) {
  console.log("Erreur : Un ou plusieurs éléments du formulaire sont introuvables !");
} else {
  const displayModal = () => modal.style.display = "block";
  const hideModal = () => modal.style.display = "none";
  const displayGalleryModal = () => galleryModal.style.display = "block";
  const hideGalleryModal = () => galleryModal.style.display = "none";
  const displayAddPhotoModal = () => modalAddPhoto.style.display = "block";
  const hideAddPhotoModal = () => modalAddPhoto.style.display = "none";
  
  openModal.onclick = () =>{
    displayModal();
    displayGalleryModal();
    hideAddPhotoModal();
  };

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  topEditBtn.onclick = () => {
    displayModal();
    hideGalleryModal();
    displayAddPhotoModal();
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      hideModal();
    }
  };

  addPhotoBtn.onclick = () => {
    galleryModal.classList.add("hidden");  // hide the gallery
    modalAddPhoto.classList.remove("hidden");  // display the form to add a photo
  }

  toReturn.onclick = () => {
    galleryModal.classList.remove("hidden"); // display the gallery
    modalAddPhoto.classList.add("hidden"); // hide the form to add a photo
  }
}