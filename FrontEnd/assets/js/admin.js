/**
 * 1) Depuis javascript, création d'un bouton "Modifier" et insertion dans le DOM
 * 2) Au clic, sur le bouton, création + insertion d'une modale
 * 3) Dans cette modale, insertion de tous les projets
 *
 * 4) Création d'un autre bouton n°2
 * 5) Au clic sur bouton n°3 création de la seconde modale
 * 6) Dans la seconde modale, ajout d'un formulaire
 */

const token = localStorage.getItem('authToken');
const editContainer = document.querySelector(".portfolio");

//if(token){
    // Mettre ton code ici

//}

const editButton = document.createElement("button");
editButton.classList.add("edit-button");
editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';

editContainer.appendChild(editButton);

// Find the <h2> element
const h2Element = editContainer.querySelector("h2");

// Insert the edit button just after the <h2> element
h2Element.insertAdjacentElement("afterend", editButton);