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

function closeAddModal() {
  const addModalContainer = document.querySelector(".add-modal-container");
  addModalContainer.remove();
}

// Function to open the add modal
function openAddModal() {
  const addModalContainer = document.querySelector(".add-modal-container");
  addModalContainer.style.display = "block"; // Show the add modal

  // Close the initial modal
  closeModal();
}

// Create the edit button
const editButton = document.createElement("button");
editButton.classList.add("edit-button");
editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';

// Find the <h2> element
const h2Element = editContainer.querySelector("h2");

// Insert the edit button just after the <h2> element
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
        image.classList.add("works-img");
        image.setAttribute("id", `${work.categoryId}`);

        // Append image to the works container
        worksContainer.appendChild(image);

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        // Add click event listener to delete button
        deleteButton.addEventListener("click", async () => {
          try {
            const deleteResponse = await fetch(
              `http://localhost:5678/api/works/${work.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (deleteResponse.ok) {
              // Remove both image and delete button from the DOM
              worksContainer.removeChild(image);
              worksContainer.removeChild(deleteButton);
            } else {
              console.error("Failed to delete work");
            }
          } catch (error) {
            console.error("Error deleting work:", error);
          }
        });

        // Append delete button to works container
        worksContainer.appendChild(deleteButton);
      });

      // Select the modal content element
      const modalContent = document.querySelector(".modal-content");
      // Append the works container to the modal content
      modalContent.appendChild(worksContainer);
    } catch (error) {
      console.error("Error fetching or displaying works:", error);
    }
  }

  //Add add button
  const addButton = document.createElement("button");
  addButton.classList.add("add-button");
  addButton.innerHTML = "<p>Ajouter une photo</p>";
  modalContent.appendChild(addButton);
  addButton.addEventListener("click", openAddModal); // Open the add modal when the add button is clicked

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
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

/**
 * Function to create the add modal
 */
function createAddModal() {
  // Create add modal container
  const addModalContainer = document.createElement("div");
  addModalContainer.classList.add("add-modal-container");
  addModalContainer.style.display = "none"; // Initially hide the add modal

  // Create add modal content
  const addModalContent = document.createElement("div");
  addModalContent.classList.add("add-modal-content");
  addModalContent.innerHTML = '<p class="add-modal-title">Ajout photo</p>';

  //create Picture Container
  const addPictureContainer = document.createElement("div");
  addPictureContainer.classList.add("add-picture-container");
  addPictureContainer.innerHTML = '<i class="fa-regular fa-image"></i>';

  const photoSizeText = document.createElement("p");
  photoSizeText.classList.add("picture-size-txt");
  photoSizeText.innerHTML = "jpg, png : 4mo max";
  addPictureContainer.appendChild(photoSizeText);

  //create add Picture Button
  const addPictureButton = document.createElement("button");
  addPictureButton.classList.add("add-picture-btn");
  addPictureButton.setAttribute("type", "submit");
  addPictureButton.innerHTML = "+ Ajouter photo";

  addPictureContainer.appendChild(addPictureButton);

  addModalContent.appendChild(addPictureContainer);

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeButton.addEventListener("click", closeAddModal);

  addModalContent.appendChild(closeButton);

  const returnButton = document.createElement("button");
  returnButton.classList.add("return-button");
  returnButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  returnButton.addEventListener("click", () => {
    // Close the add modal
    closeAddModal();
    // Display the main modal
    openModal(); // If main modal not found, open it
  });

  //FORM
  //Create form
  const form = document.createElement("form");
  form.classList.add("modal-form");

  //Create form inputs
  const inputTitle = document.createElement("input");
  inputTitle.id = "input-title";
  inputTitle.type = "text";
  inputTitle.name = "Titre";

  const inputCategory = document.createElement("input");
  inputCategory.id = "input-category";
  inputCategory.type = "text";
  inputCategory.name = "Catégory";

  // Create labels for the inputs
  const labelTitle = document.createElement("label");
  labelTitle.textContent = "Titre"; // Label text for the title input
  labelTitle.setAttribute("for", "input-title"); // Set the 'for' attribute to match the input's 'id'

  const labelCategory = document.createElement("label");
  labelCategory.textContent = "Catégory"; // Label text for the category input
  labelCategory.setAttribute("for", "input-category"); // Set the 'for' attribute to match the input's 'id'

  //Add elemetst to the form
  form.appendChild(labelTitle);
  form.appendChild(inputTitle);
  form.appendChild(labelCategory);
  form.appendChild(inputCategory);

  //Append form to the DOM
  addModalContent.appendChild(form);

  const validateButton = document.createElement("button");
  validateButton.classList.add("validate-button");
  validateButton.innerHTML = "<p>Valider</p>";
  addModalContent.appendChild(validateButton);

  addModalContent.appendChild(returnButton);

  addModalContent.appendChild(closeButton);

  // Append add modal content to add modal container
  addModalContainer.appendChild(addModalContent);

  // Append add modal container to body
  document.body.appendChild(addModalContainer);

  // Close the modal when clicking outside of its content
  addModalContainer.addEventListener("click", (event) => {
    if (event.target === addModalContainer) {
      closeAddModal();
    }
  });
}

// Create the add modal when the page loads
createAddModal();
