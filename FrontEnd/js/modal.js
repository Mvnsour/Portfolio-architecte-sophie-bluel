const modal = document.getElementById("modal");
const closeModal = document.getElementById("close");
const openEditBtn = document.getElementById("edit-btn"); // to delete photo
const openTopEditBtn = document.getElementById("top-edit-btn"); // to add photo
const addPhotoBtn = document.getElementById("add-photo-btn");
const modalGallery = document.getElementById("modal-gallery");
const modalAddPhoto = document.getElementById("modal-add-photo");
const toReturn = document.getElementById("to-return");

const isLoggedIn = localStorage.getItem("authToken") !== null;
  
if (isLoggedIn) {
  console.log("The user is connected !");
  localStorage.removeItem("isLoggedIn");
}

if (!modal || !openEditBtn || !closeModal || !openTopEditBtn || !addPhotoBtn || !modalGallery || !modalAddPhoto || !toReturn) {
  console.log("Error: One or more elements are missing!");
} else {

  // Functions used to show/hide the modal and the views
  const showModal = () => modal.style.display = "block";
  const hideModal = () => modal.style.display = "none";

  const showGalleryView = () => {
    modalGallery.classList.remove("hidden");
    modalAddPhoto.classList.add("hidden");
  }

  const showAddPhotoView = () => {
    modalGallery.classList.add("hidden");
    modalAddPhoto.classList.remove("hidden");
  }

  // Events
  openEditBtn.onclick = () =>{
    showModal();
    showGalleryView(); // display the gallery
    toReturn.style.display = "block"; // show the return button
  };

  openTopEditBtn.onclick = () => {
    showModal();
    showAddPhotoView(); // display the form to add a photo
    toReturn.style.display = "none";
  };

  closeModal.onclick = () => hideModal();

  addPhotoBtn.onclick = () => {
    modalGallery.classList.add("hidden");  // hide the gallery
    modalAddPhoto.classList.remove("hidden");  // display the form to add a photo
  }

  toReturn.onclick = () => showGalleryView();

  window.onclick = (e) => {
    if (e.target === modal) {
      hideModal();
    }
  };
}