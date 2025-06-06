const modal = document.getElementById("modal");
const closeModal = document.getElementById("close");
const openEditBtn = document.getElementById("edit-btn");
const addPhotoBtn = document.getElementById("add-photo-btn");
const modalGallery = document.getElementById("modal-gallery");
const modalAddPhoto = document.getElementById("modal-add-photo");
const toReturn = document.getElementById("to-return");

if (!modal || !openEditBtn || !closeModal || !addPhotoBtn || !modalGallery || !modalAddPhoto || !toReturn) {
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