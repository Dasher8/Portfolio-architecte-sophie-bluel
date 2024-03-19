let inputTitle;
let selectCategory;
let addPictureButton;

const token = localStorage.getItem("authToken");
const editContainer = document.querySelector(".portfolio");
const worksContainer = document.querySelector(".works-container");

// Add event listener for logout
const logout = document.querySelector(".logout-link");
if (logout) {
  logout.addEventListener("click", function (event) {
    event.preventDefault();
    // Remove the token from localStorage
    localStorage.removeItem("authToken");
    console.log("Token removed successfully"); // Log success message
    // Redirect to index.html
    window.location.href = "index.html";
  });
} else {
  console.error("Logout link not found");
}

/**
 * Function to close modal
 */
function closeModal() {
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.remove();
}

/**
 * Function to close the add modal
 */
function closeAddModal() {
  const addModalContainer = document.querySelector(".add-modal-container");
  addModalContainer.remove();
}

/**
 * Function to open the add modal
 */
function openAddModal() {
  let addModalContainer = document.querySelector(".add-modal-container");

  // Check if add modal container already exists
  if (!addModalContainer) {
    // If it doesn't exist, create it
    createAddModal();
    addModalContainer = document.querySelector(".add-modal-container");
  }

  addModalContainer.style.display = "block"; // Show the add modal

  // Close the initial modal
  closeModal();
}

// Create the edit button
const editBtnContainer = document.querySelector(".edit-btn-container");
const editButton = document.createElement("button");
editButton.classList.add("edit-button");
editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';

editBtnContainer.appendChild(editButton);

// Add event listener to the edit button
editButton.addEventListener("click", openModal);

/**
 * Function to create a modal
 */
function openModal() {
  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = '<p class="modal-title">Galerie photo</p>';

  // Create a new div to hold the works images
  const worksContainer = document.createElement("div");
  worksContainer.classList.add("works-container");

  /**
   * Function to fetch works from the API and display them in the modal content with the ability to delete them
   */
  async function displayWorksInModal() {
    try {
      // Fetch works from the API
      const response = await fetch("http://localhost:5678/api/works");

      if (!response.ok) {
        throw new Error("Failed to fetch works");
      }

      const works = await response.json();
      // Iterate over the works and create HTML elements for each photo
      works.forEach((work) => {
        // Create image element
        const figure = document.createElement("figure");
        figure.setAttribute("id", `${work.categoryId}`);

        figure.innerHTML = `
            <img src="${work.imageUrl}" class="works-img" alt="${work.title}" />
          `;

        // Append image to the works container
        worksContainer.appendChild(figure);

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
              worksContainer.removeChild(figure);
              worksContainer.removeChild(deleteButton);

              // Remove the image from the gallery
              const galleryFigure = document.querySelector(
                `figure[id="${work.categoryId}"]`
              );
              if (galleryFigure) {
                galleryContainer.removeChild(figure);
              }
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

  modalContent.appendChild(worksContainer);

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
  const addPictureButton = document.createElement("input");
  addPictureButton.type = "file";
  addPictureButton.accept = "image/*";
  addPictureButton.style.display = "none"; // Hide the default file input button

  // Create the custom-styled button
  const customButton = document.createElement("button");
  customButton.classList.add("add-picture-btn");
  customButton.textContent = "+ Ajouter photo";

  // Add event listener to trigger file input click when custom button is clicked
  customButton.addEventListener("click", function () {
    addPictureButton.click(); // Trigger the click event of the file input
  });
  // Add event listener to handle file selection
  addPictureButton.addEventListener("change", handleFileSelect);

  addPictureContainer.appendChild(customButton);
  addPictureContainer.appendChild(addPictureButton);

  /**
   * Handles file selection, displaying the selected image,
   * and updating the interface accordingly.
   */
  function handleFileSelect(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Check file type
      if (!(file.type === "image/jpeg" || file.type === "image/png")) {
        showError("Please select an image file (jpg, png).");
        return;
      }

      // Check file size
      if (file.size > 4 * 1024 * 1024) {
        // 4 MB (4 * 1024 * 1024 bytes)
        showSizeLimitError("Selected image size exceeds the limit of 4 MB.");
        return;
      }

      /**
       * Remove img error message
       */

      function removeErrorMessage() {
        const errorDiv = document.querySelector(".img-error-message");
        // Check if the error message div exists before attempting to remove it
        if (errorDiv) {
          errorDiv.remove();
        }
      }

      /**
       * Remove img error message
       */

      function removeSizeErrorMessage() {
        const errorDiv = document.querySelector(".img-size-error");
        // Check if the error message div exists before attempting to remove it
        if (errorDiv) {
          errorDiv.remove();
        }
      }

      /**
       * Show eror message if file type isn't jpeg/png
       */
      function showError(errorMessage) {
        // Create a new div element for the error message
        const errorDiv = document.createElement("div");
        errorDiv.className = "img-error-message";
        errorDiv.textContent = errorMessage;

        const addPictureContainer = document.querySelector(
          ".add-picture-container"
        );

        // Insert the error message div after the img container
        addPictureContainer.insertAdjacentElement("afterend", errorDiv);

        // Add event listener to remove the error message when user interacts with the addPictureButton
        addPictureButton.addEventListener("change", removeErrorMessage);
      }

      /**
       * Show error message for exceeding image size limit
       */
      function showSizeLimitError(errorMessage) {
        // Check if an error message with class 'img-size-limit-error' already exists
        const existingErrorDiv = document.querySelector(
          ".img-size-limit-error"
        );

        // If an error message already exists, update its text content
        if (existingErrorDiv) {
          existingErrorDiv.textContent = errorMessage;
          return; // Exit the function to avoid creating duplicate error messages
        }

        // Create a new div element for the error message
        const errorDiv = document.createElement("div");
        errorDiv.className = "img-size-error";
        errorDiv.textContent = errorMessage;

        const addPictureContainer = document.querySelector(
          ".add-picture-container"
        );

        // Insert the error message div after the add picture container
        addPictureContainer.insertAdjacentElement("afterend", errorDiv);

        // Add event listener to remove the error message when user interacts with the addPictureButton
        addPictureButton.addEventListener("change", removeSizeErrorMessage);
      }

      /**
       * Upload the image in the modal's image container
       */
      const reader = new FileReader();
      reader.onload = function (e) {
        // Create an image element to display the selected image
        const imageElement = document.createElement("img");
        imageElement.src = e.target.result; // Set the image source to the file contents
        imageElement.classList.add("uploaded-image");

        // Append the image element to the "Add Picture" container
        addPictureContainer.appendChild(imageElement);
        photoSizeText.style.display = "none";
        addPictureButton.style.display = "none";
        customButton.style.display = "none";

        const pictureIcon = addPictureContainer.querySelector(".fa-image");
        pictureIcon.style.display = "none";

        // Create the edit file input button
        const editPictureButton = document.createElement("input");
        editPictureButton.type = "file";
        editPictureButton.accept = "image/*";
        editPictureButton.style.display = "none"; // Hide the default file input button

        // Create the edit button for the image
        const imgEditButton = document.createElement("button");
        imgEditButton.classList.add("img-edit-button");
        imgEditButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

        // Add event listener to trigger file input click when the edit button is clicked
        imgEditButton.addEventListener("click", function () {
          editPictureButton.click(); // Trigger the click event of the file input
        });

        // Add event listener to the edit button for the image
        imgEditButton.addEventListener("click", function () {
          event.preventDefault();
          // Check if an image already exists in the container
          const existingImage =
            addPictureContainer.querySelector(".uploaded-image");
          if (existingImage) {
            // If an image exists, remove it
            addPictureContainer.removeChild(existingImage);
          }
        });

        // Add event listener to handle file selection
        editPictureButton.addEventListener("change", handleFileSelect);

        // Append the edit file input button and the edit button to the picture container
        addPictureContainer.appendChild(editPictureButton);
        addPictureContainer.appendChild(imgEditButton);
      };
      reader.readAsDataURL(file); // Read the file contents as a data URL
    }
  }
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
    openModal();
  });

  /**
   * Create form
   */
  const form = document.createElement("form");
  form.classList.add("modal-form");
  //Create form inputs
  const inputTitle = document.createElement("input");
  inputTitle.id = "input-title";
  inputTitle.type = "text";
  inputTitle.name = "Titre";

  // Create labels for the inputs
  const labelTitle = document.createElement("label");
  labelTitle.textContent = "Titre"; // Label text for the title input
  labelTitle.setAttribute("for", "input-title"); // Set the 'for' attribute to match the input's 'id'

  //Create form inputs
  const selectCategory = document.createElement("select");
  selectCategory.id = "select-category";
  selectCategory.name = "Category";

  // Create label for the select
  const labelCategory = document.createElement("label");
  labelCategory.textContent = "Catégorie"; // Label text for the category select
  labelCategory.setAttribute("for", "select-category"); // Set the 'for' attribute to match the select's 'id'

  //create validate button
  const validateButton = document.createElement("button");
  validateButton.classList.add("validate-button");
  validateButton.innerHTML = "<p>Valider</p>";
  validateButton.disabled = true; // Initially disable the button
  addModalContent.appendChild(validateButton);

  // Event listener for input fields and file input
  [inputTitle, selectCategory, addPictureButton].forEach((input) => {
    input.addEventListener("input", validateFields);
  });

  // Add event listener to the validate button
  validateButton.addEventListener("click", handleSubmit);

  /**
   * Fetch categories from the API and populate the select options
   */
  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const categories = await response.json();

      // Create an option for each category
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id; // Set the option value to the category id
        option.textContent = category.name; // Set the option text to the category name
        selectCategory.appendChild(option); // Append the option to the select
      });

      selectCategory.value = "";
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  fetchCategories(); // Fetch categories and populate the select options

  //Add elemetst to the form
  form.appendChild(labelTitle);
  form.appendChild(inputTitle);
  form.appendChild(labelCategory);
  form.appendChild(selectCategory);

  //Append form to the DOM
  addModalContent.appendChild(form);

  /**
   * Function to validate fields
   */
  function validateFields() {
    console.log("Validating fields...");
    const title = inputTitle.value.trim(); // Trim whitespace from title
    const category = selectCategory.value; // Get the selected category value from the dropdown
    const fileSelected = !!addPictureButton.files[0]; // Check if a file is selected
    // Check if all required fields are filled
    if (title && category && fileSelected) {
      console.log("All fields filled.");
      validateButton.disabled = false; // Enable the validate button
      validateButton.classList.add("validate-button-active");
    } else {
      console.log("Some fields are empty.");
      validateButton.disabled = true; // Disable the validate button
      validateButton.classList.remove("validate-button-active");
    }
  }

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

  /**
   * Handles form submission for adding a new work to the API.
   * Collects title, category, and file data from the form,
   * sends it to the API endpoint, and updates the website.
   */
  async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("handleSubmit function called");

    const title = inputTitle.value.trim();
    const category = parseInt(selectCategory.value);
    const file = addPictureButton.files[0];

    // Create FormData object and append form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    try {
      // Send data to API
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Work successfully added to API, update website
        const newWork = await response.json();
        // Close Add Modal
        closeAddModal();
        // Reopen the main modal
        openModal();

        // Add work to gallery
       addWorkToGallery(newWork);
      } else {
        console.error("Failed to add work to API");
      }
    } catch (error) {
      console.error("Error adding work:", error);
    }
  }

  /**
   * Function to add new work to the gallery
   */
  function addWorkToGallery(work) {
    // Find the gallery container element
    const galleryContainer = document.querySelector(".gallery");

    // Check if the gallery container element exists
    if (galleryContainer) {
      // Create image element
      const figure = document.createElement("figure");
      figure.setAttribute("id", `${work.categoryId}`);

      figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" />
                <figcaption>${work.title}</figcaption>
              `;

      galleryContainer.appendChild(figure);
    } else {
      console.error("Gallery container not found. Cannot add work to gallery.");
    }
  }

  /**
   * Function to add new work to the website
   */
 
}

// Create the add modal when the page loads
createAddModal();
