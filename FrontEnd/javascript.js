/**
 * Variables
 */
const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.querySelector(".categories");

/*
async function displayArchitectWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  console.log("Architect's Works:", works);

  const galleryContainer = document.querySelector(".gallery");

  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    galleryContainer.appendChild(figure);
  });

  console.log("Architect's Works:", works);
}*/

/**
 * Récupère et affiche la liste des projets
 */
newDisplayWorks = () => {
  // On demande au serveur la liste des projets
  fetch("http://localhost:5678/api/works")
    // On récupère la réponse du serveur
    .then((response) => {
      return response.json(); // On ne récupère que le contenu que l'on envoi dans le prochain then
    })

    // On à la liste des travaux
    .then((works) => {
      // On parcours tous les travaux et à chaque tour de boucle on à la travail en cours dans work
      works.forEach((work) => {
        // Création d'un nouveau noeud "figure"
        const figure = document.createElement("figure");
        //figure.classList.add("ma-nouvelle-classe"); // On peux ajouter une nouvelle classe
        figure.setAttribute("id", `${work.categoryId}`);

        // On modifie le contenu HTML du noeud (attention de ne pas oublier les backtik => ``)
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}" />
            <figcaption>${work.title}</figcaption>
          `;

        // On ajoute le nouveau noeud dans notre gallery
        galleryContainer.appendChild(figure);
      });
    })

    // Déclanche une erreur
    .catch((error) => {
      console.error("Une erreur est survenue");
    });
};

/**
 * Récupère et affiche la liste des catégories
 */
displayCategories = () => {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      return response.json(); // On ne récupère que le contenu que l'on envoi dans le prochain then
    })
    .then((categories) => {
      // Création du boutton "Tous"
      const allButton = document.createElement("button");
      allButton.classList.add("category-btn");
      allButton.setAttribute("id", "all");
      allButton.innerHTML = "Tous";

      // Event au click sur le btn tous
      allButton.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach((btn) => {
          btn.classList.remove("btn-active");
        });
        allButton.classList.add("btn-active");
        filterAndDisplayWorks();
      });

      categoriesContainer.appendChild(allButton);

      categories.forEach((category) => {
        const button = document.createElement("button");
        button.classList.add("category-btn");

        button.setAttribute("id", category.id);

        button.innerHTML = `
      ${category.name}
      `;

        button.addEventListener("click", () => {
          document.querySelectorAll(".category-btn").forEach((btn) => {
            btn.classList.remove("btn-active");
          });
          button.classList.add("btn-active");
          filterAndDisplayWorks(category.id);
        });

        categoriesContainer.appendChild(button);
      });
    })

    .catch((error) => {
      console.error("Une erreur est survenue");
    });
};

/**
 * Trie les projets
 */
filterAndDisplayWorks = (categoryId) => {
  console.log("Filtering by category ID:", categoryId);
  const galleryContainer = document.querySelector(".gallery");

  if (categoryId) {
    // Select all figures initially created and hide them
    const allFigures = galleryContainer.querySelectorAll(".ma-nouvelle-classe");
    allFigures.forEach((figure) => {
      if (figure.getAttribute("id") === categoryId.toString()) {
        figure.style.display = ""; // Show figures matching the selected category
      } else {
        figure.style.display = "none";
      }
    });
  } else {
    // If no category is selected (All button clicked), show all figures
    const allFigures = galleryContainer.querySelectorAll(".ma-nouvelle-classe");
    allFigures.forEach((figure) => {
      figure.style.display = ""; // Show all figures ; Set to an empty string to reset the display property to its default value (which is determined by the browser's default styling)
    });
  }
};

newDisplayWorks();
displayCategories();













