const api = "http://localhost:5678/api/";
const token = localStorage.getItem("token");

let categoryId = "";
let categories = [];

//****** FETCH DE LA ROUTE WORKS ******//
/**
 * Effectue une requête asynchrone pour récupérer les données de l'API "works".
 * @returns {Promise<void>} Une promesse résolue une fois que les données sont récupérées.
 */

async function fetchWorksApi() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (works = data));

    /* appel a la fonction workdisplays */
    worksDisplay(works);
    /* appel a la fonction getBtnCategories */
    const btnCategories = getCategoriesNameFromWorks(works);
    /* appel a la fonction btnCategoriesFilter */
    btnCategoriesFilter(btnCategories);
  } catch (err) {
    console.log("erreur fetchWorksApi", err);
  }
}

window.addEventListener("load", () => {
  fetchWorksApi();
  fetchCategoriesApi();

  /* attribution d'id a la page de départ */
  categoryId = "Tous";
  checkToken();
});

/**
 * Affiche les œuvres dans un conteneur HTML spécifié.
 * @param {Array} works - Un tableau contenant les données des œuvres à afficher.
 */
function worksDisplay(works) {
  // Récupérez l'élément HTML dans lequel vous souhaitez insérer les éléments.
  const $worksContainer = document.querySelector(".gallery");
  const $workDisplay = new Set();

  $worksContainer.innerHTML = "";
  works.forEach((work) => {
    if (categoryId === "Tous" || work.category.name === categoryId) {
      $workDisplay.add(work);
    } else {
      console.log("erreur au niveau de workdisplay");
    }
  });

  $workDisplay.forEach((work) => {
    $worksContainer.appendChild(worksTemplates(work));
  });
}

//**** FETCH DE LA ROUTE CATEGORIES *****//
/**
 * Effectue une requête asynchrone pour récupérer les données de l'API "categories".
 * @returns {Promise<void>} Une promesse résolue une fois que les données sont récupérées.
 */
async function fetchCategoriesApi() {
  try {
    await fetch(api + "categories")
      .then((res) => res.json())
      .then((data) => (categories = data));
  } catch (err) {
    console.log("erreur fetchCategoriesApi", err);
  }
}

/**
 * Récupère les noms de catégories à partir des données des œuvres.
 * @param {Array} data - Un tableau contenant les données des œuvres.
 * @returns {Array} Un tableau contenant les noms de catégories uniques.
 */
function getCategoriesNameFromWorks(data) {
  const categoryNameSet = new Set();

  for (const work of data) {
    categoryNameSet.add(work.category.name);
  }

  const uniqueCategoryNameSet = Array.from(categoryNameSet);

  return uniqueCategoryNameSet;
}

//*******  Création du Blockfiter et du bouton tous *********//

/**
 * Filtre les catégories à afficher en tant que boutons de filtre.
 * @param {NodeList} categories - Un tableau contenant les noms des catégories.
 */
function btnCategoriesFilter(categories) {
  const blockFilter = document.querySelector(".filter");
  const buttonTous = document.createElement("button");

  buttonTous.classList.add("btn", "active");
  buttonTous.textContent = "Tous";

  blockFilter.appendChild(buttonTous);

  const allButtons = [buttonTous];

  for (const categoryName of categories) {
    const buttonAutres = document.createElement("button");
    buttonAutres.classList.add("btn");
    buttonAutres.textContent = categoryName;
    blockFilter.appendChild(buttonAutres);

    allButtons.push(buttonAutres);
  }

  allButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      categoryId = event.target.textContent;

      allButtons.forEach((button) => {
        button.classList.remove("active");
      });
      event.target.classList.add("active");
      worksDisplay(works);
    });
  });
}

//********** Création des works ***********/
/**
 * Crée un élément HTML représentant une œuvre.
 * @param {Object} work - Les données de l'œuvre.
 * @returns {HTMLElement} L'élément HTML représentant l'œuvre.
 */
function worksTemplates(work) {
  const $workFigures = document.createElement("figure");
  //Ajout d'un data set work pour l'étape d'attribution des ID dans la modale
  $workFigures.setAttribute("data-work-id", work.id);

  $workFigures.setAttribute("data-value", work.categoryId);

  // Injection de mes images dans les workstemplates
  const $workImg = document.createElement("img");
  $workImg.setAttribute("src", work.imageUrl);
  $workImg.setAttribute("alt", work.title);

  const $workFigcaptions = document.createElement("figcaption");
  $workFigcaptions.textContent = work.title;

  $workFigures.appendChild($workImg);
  $workFigures.appendChild($workFigcaptions);

  /*retourner les workfigures pour le stockage */
  return $workFigures;
}
