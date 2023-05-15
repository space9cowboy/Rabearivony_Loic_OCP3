/* `const api = "http://localhost:5678/api/";` assigne une valeur de chaîne à la variable constante
`api`. Cette chaîne représente l'URL de base du point de terminaison de l'API auquel le code va adresser des requêtes.
au code. Dans ce cas, l'API est hébergée localement sur la même machine que le code, et est accessible à l'adresse suivante
`http://localhost:5678/api/`. */
const api = "http://localhost:5678/api/";

/* `let categoryId = "";` initialise une variable `categoryId` avec une chaîne de valeur vide. Cette variable
est utilisée pour stocker l'ID de la catégorie sélectionnée afin de filtrer les œuvres affichées sur la page. */
let categoryId = "";
/* `let categories = [];` initialise un tableau vide appelé `categories`. Ce tableau sera utilisé plus tard pour
stocker les données des catégories récupérées de l'API. */
let categories = [];

/****** FETCH DE LA ROUTE WORKS ******/
/**
 * Cette fonction récupère les données d'un point de terminaison de l'API de works
 * pour les travaux et les enregistre dans la console, tout en gérant les erreurs éventuelles.
 * tout en gérant les erreurs qui peuvent survenir.
 */
async function fetchWorksApi() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (works = data));
    console.log("La récupération des données de l'API est ok");

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

/* `window.addEventListener("load", () => fetchWorksApi());` 
ajoute un écouteur d'événement à l'objet `window` qui écoute l'événement `load`.
l'objet `window` qui écoute l'événement `load`. Lorsque l'événement `load` est déclenché 
(c'est-à-dire lorsque le chargement de la page se termine), l'objet `fetchWorksApi' est activé.
page finit de se charger), la fonction `fetchWorksApi()` est appelée. Cela garantit que les données de l'API sont
données de l'API ne sont récupérées et enregistrées dans la console qu'une fois que la page a fini de se charger, 
ce qui permet d'éviter les problèmes potentiels liés à la synchronisation des données de l'API.
tout problème potentiel lié à la synchronisation de la demande d'API. */

window.addEventListener("load", () => {
  fetchWorksApi();
  fetchCategoriesApi();

  /* attribution d'id a la page de départ */
  categoryId = "Tous";
  checkToken();
});

/* Cette fonction affiche les œuvres en fonction de leur catégorie dans un élément HTML.
  @param œuvres - Le paramètre `œuvres` est un tableau d'objets représentant différentes œuvres ou
 projets. Chaque objet contient des informations telles que le titre, la description, l'image et la
  la catégorie */
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

/**** FETCH DE LA ROUTE CATEGORIES *****/
/* récupération des données API des catégories */
async function fetchCategoriesApi() {
  try {
    await fetch(api + "categories")
      .then((res) => res.json())
      .then((data) => (categories = data));
    console.log("La récupération des données de l'API est ok");
    console.log(categories);
  } catch (err) {
    console.log("erreur fetchCategoriesApi", err);
  }
}

/* The `getCategoriesNameFromWorks(data)` function takes an array of work objects as `data` and
extracts the unique category names from it using the `map()` method and a `Set` object. It returns
an array of unique category names. */
/*function getCategoriesNameFromWorks(data) {

    const categoryNameSet = new Set(data.map((work) => work.category.name));
    console.log(data);
    console.log(data.map((work) => work.category.name));
    console.log(categoryNameSet);

    const uniqueCategoryNameSet = Array.from(categoryNameSet);
    console.log(uniqueCategoryNameSet);

    return uniqueCategoryNameSet;

}*/
function getCategoriesNameFromWorks(data) {
  const categoryNameSet = new Set();

  for (const work of data) {
    categoryNameSet.add(work.category.name);
  }

  const uniqueCategoryNameSet = Array.from(categoryNameSet);

  return uniqueCategoryNameSet;
}

/****  Création du Blockfiter et du bouton tous *****/
/* The `btnCategoriesFilter` function creates a filter block with buttons for each category retrieved
from the API. It first selects the HTML element where the filter block will be inserted, creates a
"Tous" button and adds it to the block. Then, it creates a button for each category and adds it to
the block. It also adds an event listener to each button that sets the `categoryId` variable to the
text content of the clicked button and calls the `worksDisplay` function to display the works
filtered by category. */
function btnCategoriesFilter(categories) {
  const blockFilter = document.querySelector(".filter");
  const buttonTous = document.createElement("button");

  buttonTous.classList.add("btn", "active");
  buttonTous.textContent = "Tous";

  blockFilter.appendChild(buttonTous);

  /* `const allButtons` crée un tableau qui inclut le bouton "Tous" et tous les boutons des catégories
    créés en utilisant la méthode `map()` sur le tableau `categories`. L'opérateur d'étalement `...` est utilisé pour étaler le résultat de la méthode `...`.
    est utilisé pour répartir le résultat de la méthode `map()` dans le tableau. Chaque bouton de catégorie est créé
    est créé à l'aide de `document.createElement("button")`, on lui attribue la classe "btn", et on lui assigne le contenu textuel du nom de la catégorie.
    du nom de la catégorie. Le bouton est ensuite ajouté à l'élément `blockFilter`. La fonction
    renvoie un tableau de tous les boutons créés, y compris le bouton "Tous". */
  // const allButtons = [buttonTous, ...categories.map((categoryName) => {

  /*const buttonAutres = document.createElement("button");
        buttonAutres.classList.add("btn");
        buttonAutres.textContent = categoryName;
        blockFilter.appendChild(buttonAutres); 
        console.log(buttonAutres);
        return buttonAutres;
        
    })];*/

  const allButtons = [buttonTous];

  for (const categoryName of categories) {
    const buttonAutres = document.createElement("button");
    buttonAutres.classList.add("btn");
    buttonAutres.textContent = categoryName;
    blockFilter.appendChild(buttonAutres);
    console.log(buttonAutres);
    allButtons.push(buttonAutres);
  }

  console.log(allButtons);

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

/* Création des works */
function worksTemplates(work) {
  const $workFigures = document.createElement("figure");

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

/***** Modale / Administrateur *****/
function checkToken() {
  // vérifie si le token est dans le local storage
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("pas de token en mémoire");
  } else {
    console.log("token en mémoire => MODE ADMIN ACTIVE");
    adminEditor();
  }
}
// LOG OUT!! a la fermeture onglet / redirection & Rechargement pour la sécurité
function removeToken() {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
}
//événement fermeture onglet ou redirection vers un autre site
window.addEventListener("unload", removeToken);

// création de l'Admin Editor
function adminEditor() {
  adminContainer();
  // Ouverure de la première modale
  const $modalJs = document.getElementById("titleProjectRemove");
  // Appel a l'évenement lors du click sur la modale
  $modalJs.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("ouverture de la modale");
    modalContainer();
    displayModal();
  });
}

const adminContainer = () => {
  // création de la barre admin editor
  const $bannerEditor = document.createElement("div");
  $bannerEditor.classList.add("bannerEditor");
  document
    .querySelector("body")
    .insertBefore($bannerEditor, document.querySelector("body").firstChild);

  const $spanBannerEditor = document.createElement("span");
  $spanBannerEditor.classList.add("projectRemove");
  $spanBannerEditor.textContent = "Mode édition";

  // création de l'icone pour le SPAN "mode édition"
  const $iconBannerEditor = document.createElement("i");
  $iconBannerEditor.className = "fas fa-pencil-alt";

  //insertion de l'icone "i" avant le SPAN "mode édition"
  $spanBannerEditor.insertBefore(
    $iconBannerEditor,
    $spanBannerEditor.firstChild
  );

  //création d'un button "publiez les changements"
  const $btnBannerEditor = document.createElement("button");
  $btnBannerEditor.textContent = "publiez les changements";

  $bannerEditor.innerHTML = "";
  $bannerEditor.appendChild($spanBannerEditor);
  $bannerEditor.appendChild($btnBannerEditor);

  //création du logout
  // séléction de l'élément "login" sur le "li" a modifier
  const $logout = document.querySelector("ul > li:nth-child(3)");

  // créer un élément <a> pour le lien de déconnexion
  const $logoutLink = document.createElement("a");
  $logoutLink.href = "./login.html";

  const $logoutText = document.createTextNode("logout");
  $logoutLink.appendChild($logoutText);

  $logout.innerHTML = "";
  $logout.appendChild($logoutLink);

  // événement deconnexion
  $logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    removeToken();
    window.location.assign("./index.html");
  });

  // ajout de la span "mode édition" et de l'icone en dessous de la photo
  const $figure = document.querySelector("#introduction > figure");

  const $iconFigureEditor = document.createElement("i");
  $iconFigureEditor.className = "fas fa-pencil-alt";

  const $spanFigure = document.createElement("span");
  $spanFigure.classList.add("figureRemove");
  $spanFigure.textContent = "Mode édition";

  $figure.appendChild($spanFigure);
  $spanFigure.insertBefore($iconFigureEditor, $spanFigure.firstChild);

  // ajout de la span "mode édition" et de l'icone a droite des projets
  const $iconProjectFigureEditor = document.createElement("i");
  $iconProjectFigureEditor.className = "fas fa-pencil-alt";

  const $projectFigure = document.querySelector("#portfolio > h2");
  const $spanProjectFigure = document.createElement("span");

  $spanProjectFigure.setAttribute("id", "titleProjectRemove");
  $spanProjectFigure.textContent = "Mode édition";

  $projectFigure.appendChild($spanProjectFigure);
  $spanProjectFigure.insertBefore(
    $iconProjectFigureEditor,
    $spanProjectFigure.firstChild
  );
};

const modalContainer = () => {
  const modal = document.createElement("aside");
  modal.id = "modal";
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labelledby", "modalTitle");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("display", "initial");

  modal.innerHTML = `
  <div id="modalContainer">

  <i id="closeModal" class="fa-solid fa-xmark"></i>
  <i id="previewModal" class="fa-solid fa-arrow-left "></i>

  
  <section class="modalTemplate" id="modalEdit">


    <div id="editionGallery">
      <h2 class="modalTitle">Galerie photo</h2>
      <!-- <i id="deleteIcon" class="fa-solid fa-trash-can iconModal"></i>
      <i id="moveIcon" class="fa-solid fa-arrows-up-down-left-right iconModal"></i> -->
      <div id="modalGrid">
      </div>
    </div>
    <div class="footerModal">
      <hr>
      <input type="submit" value="Ajouter une photo" id="editModal">
      <p id="deleteAllWorks">Supprimer la gallerie</p>
    </div>
  </section>

  <section class="modalTemplate" id="editSection" style="display:none">

    <h2 class="modalTitle">Ajout photo</h2>

    <form id="editWorks">

      <div id="addImageContainer">
        <i class="fa-solid fa-image"></i>

        <div id="inputFile">
          <label for="filetoUpload" class="fileLabel">
            <span>+ Ajouter une photo</span>
            <input type="file" id="filetoUpload" name="image" accept="image/png, image/jpeg"
              class="file-input">
          </label>
        </div>
        <span class="filesize">jpg, png : 4mo max</span>
        <span id="errorImg"></span>
      </div>

      <div class="inputEdit" id="addTitle">
        <label for="title">Titre</label>
        <input type="text" name="title" id="title" class="inputCss" required>
        <span id="ErrorTitleSubmit" class="errormsg"></span>
      </div>

      <div class=" inputEdit" id="addCategory">
        <label for="category">Catégorie</label>
        <select name="category" id="category" data-id="" class="inputCss"></select>
        <span id="ErrorCategorySubmit" class="errormsg"></span>
      </div>

      <div class="footerModal editFooter">
        <hr>
        <input type="submit" value="Valider">
      </div>
    </form>
  </section>

</div>
  `;
  document.body.appendChild(modal);
};

function displayModal() {
  const modal = document.querySelector("#modal");
  const closeModalBtn = document.querySelector("#closeModal");
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  document.getElementById("modal").remove();
}
