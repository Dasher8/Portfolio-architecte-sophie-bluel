/**
 * VARIALES
 */
const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.querySelector(".categories");

/**
 * FONCTIONS
 */

/**
 * Récupère la liste des projets
 */
const getWorks = async (categoryID = null) => {
  try {
    const result = await fetch(`http://localhost:5678/api/works`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((works) => {
        if (categoryID === null) return works;

        const newWorks = [];

        works.forEach((work) => {
          if (work.categoryId === categoryID) {
            newWorks.push(work);
          }
        });

        return newWorks;
      });
    return result;
  } catch (error) {
    console.error("Error fetching works:", error);
    return null;
  }
};

/**
 * Affiche tous les `works`recu en paramètre
 */
const displayWorks = (works) => {
  // Check if works is an array and not empty
  if (!Array.isArray(works) || works.length === 0) {
    galleryContainer.innerHTML = "<p>No works to display</p>";
    return; // Exit the function early
  }

  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.setAttribute("id", `${work.id}`);

    figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}" />
            <figcaption>${work.title}</figcaption>
          `;

    galleryContainer.appendChild(figure);
  });
};

/**
 * Récupère la liste des catégories
 */
const getCategories = async () => {
  try {
    const result = await fetch("http://localhost:5678/api/categories").then(
      (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }
    );
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

/**
 * Affiche la liste des catégories
 */
const displayCategories = (categories) => {
  // Affichage du boutton "tous"
  const newButton = document.createElement("button");
  newButton.classList.add("category-btn");
  newButton.setAttribute("id", 0);
  newButton.innerHTML = "Tous";

  categoriesContainer.appendChild(newButton);

  // Event au click sur le btn tous
  newButton.addEventListener("click", async () => {
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("btn-active");
    });
    newButton.classList.add("btn-active"); // Ajouter la classe active au bouton "Tous"
    try {
      const works = await getWorks(); // Récupère tous les projets
      displayWorks(works); // Afficher les projets
    } catch (error) {
      console.error("Error fetching works:", error);
    }
  });

  // Afficahge des catégories
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("category-btn");
    button.setAttribute("id", category.id);

    button.innerHTML = category.name;

    categoriesContainer.appendChild(button);

    button.addEventListener("click", async () => {
      document.querySelectorAll(".category-btn").forEach((btn) => {
        btn.classList.remove("btn-active");
      });
      button.classList.add("btn-active"); // Ajouter la classe active au bouton cliqué
      try {
        const works = await getWorks(category.id); // Récupère tous les projets
        displayWorks(works); // Afficher les projets
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    });
  });
};

/**
 * Initialise l'application
 */
const init = async () => {
  try {
    const works = await getWorks(); // Récupère tous les projets
    displayWorks(works); // Afficher les projets

    const categories = await getCategories(); // Récupère toutes les catégories
    displayCategories(categories);
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};

init();
