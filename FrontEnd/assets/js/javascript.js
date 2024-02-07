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
  const result = await fetch(`http://localhost:5678/api/works`)
    .then((response) => {
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
};

/**
 * Affiche tous les `works`recu en paramètre
 */
const displayWorks = (works) => {
  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.setAttribute("id", `${work.categoryId}`);

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
  const result = await fetch("http://localhost:5678/api/categories").then(
    (response) => {
      return response.json();
    }
  );

  return result;
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
  const works = await getWorks(); // Récupère tous les projets
  displayWorks(works); // Afficher les projets
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
      const works = await getWorks(category.id); // Récupère tous les projets
      displayWorks(works); // Afficher les projets
    });
  });
};

/**
 * Initialise l'application
 */
const init = async () => {
  const works = await getWorks(); // Récupère tous les projets
  displayWorks(works); // Afficher les projets

  const categories = await getCategories(); // Récupère toutes les catégories
  displayCategories(categories);
};

init();
