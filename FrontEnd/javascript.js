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
}

const galleryContainer = document.querySelector(".gallery");

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
        figure.classList.add("ma-nouvelle-classe"); // On peux ajouter une nouvelle classe

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

newDisplayWorks();

//displayArchitectWorks();

/**
 * TODO :
 * - Faire exactement pareil pour les catégories
 *
 * - Faire le design de la page connexion
 * - Partie JS:
 * --- Récupérer en JS les données du formulaire lorsque l'on clique sur le bouton "connexion"
 * --- Avec fetch (POST), envoyer ces données pour récupérer un token
 *
 * - Faire la modal en javscript
 */

const categoriesContainer = document.querySelector(".categories");

DisplayCategories = () => {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      return response.json(); // On ne récupère que le contenu que l'on envoi dans le prochain then
    })

    .then((categories) => {
      const allButton = document.createElement("button");
      allButton.classList.add("category-btn");
      allButton.setAttribute("id", "all");

      allButton.innerHTML = "Tous";

      categoriesContainer.appendChild(allButton);

      categories.forEach((category) => {
        const button = document.createElement("button");
        button.classList.add("category-btn");

        button.setAttribute("id", category.id);

        button.innerHTML = `
      ${category.name}
      `;

        categoriesContainer.appendChild(button);
      });
    })

    .catch((error) => {
      console.error("Une erreur est survenue");
    });
};

DisplayCategories();
