/**
 * 1) Depuis javascript, création d'un bouton "Modifier" et insertion dans le DOM
 * 2) Au clic, sur le bouton, création + insertion d'une modale
 * 3) Dans cette modale, insertion de tous les projets
 *
 * 4) Création d'un autre bouton n°2
 * 5) Au clic sur bouton n°3 création de la seconde modale
 * 6) Dans la seconde modale, ajout d'un formulaire
 */

const token = localStorage.getItem("authToken");
const editContainer = document.querySelector(".portfolio");

/**
 * Function to close modal
 */
function closeModal() {
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.remove();
}

// Create the edit button
const editButton = document.createElement("button");
editButton.classList.add("edit-button");
editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';

//editContainer.appendChild(editButton);

// Find the <h2> element
const h2Element = editContainer.querySelector("h2");

// Insert the edit button just after the <h2> element
// beforeend insert the button in the h2, need to fix the position later
h2Element.insertAdjacentElement("beforeend", editButton);

// Add event listener to the edit button
editButton.addEventListener("click", openModal);

/**
 * Function to create a modal with the ability to close it
 */
function openModal() {
  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = '<p class="modal-title">Galerie photo</p>';

  /**
   * Function to fetch works from the API and display them in the modal content
   */
  async function displayWorksInModal() {
    try {
      // Fetch works from the API
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();

      // Create a new div to hold the works images
      const worksContainer = document.createElement("div");
      worksContainer.classList.add("works-container");

      // Iterate over the works and create HTML elements for each photo
      works.forEach((work) => {
        // Create image element
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;

        // Append image to the works container
        worksContainer.appendChild(image);
      });

      // Select the modal content element
      const modalContent = document.querySelector(".modal-content");
      // Append the works container to the modal content
      modalContent.appendChild(worksContainer);
    } catch (error) {
      console.error("Error fetching or displaying works:", error);
    }
  }

  const addButton = document.createElement("button");
  addButton.classList.add("add-button");
  addButton.innerHTML = "<p>Ajouter une photo</p>";
  modalContent.appendChild(addButton);

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", closeModal);

  modalContent.appendChild(closeButton);

  // Append modal content to modal container
  modalContainer.appendChild(modalContent);

  // Append modal container to body
  document.body.appendChild(modalContainer);

  // Display works in modal content
  displayWorksInModal();

  // Close the modal when clicking outside of its content
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });
}
