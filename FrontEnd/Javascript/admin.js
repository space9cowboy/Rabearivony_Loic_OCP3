//***** Verification TOKEN / Modale / Administrateur *******//

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
//******  LOG OUT!! a la fermeture onglet / redirection & Rechargement pour la sécurité ****//

function removeToken() {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
  sessionStorage.removeItem("deletedImages");
}

//*****  création de l'Admin Editor ******/

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
    openModal();
    editModal();
  });

  //*** Suppression des travaux de l'API ****//

  const deleteWorksApi = document.getElementById("publier");
  //Confirmation DELETE CARTES dans L'API
  deleteWorksApi.addEventListener("click", (e) => {
    e.preventDefault();
    fetchDeleteApi();
  });
}

//***** Barre editor, span et icon (log) ****//

const adminContainer = () => {
  const $bannerEditor = document.createElement("div");
  $bannerEditor.classList.add("bannerEditor");
  document.body.insertBefore($bannerEditor, document.body.firstChild);

  const $spanBannerEditor = document.createElement("span");
  $spanBannerEditor.classList.add("projectRemove");
  $spanBannerEditor.textContent = "Mode édition";

  const $btnBannerEditor = document.createElement("button");
  $btnBannerEditor.textContent = "Publiez les changements";
  $btnBannerEditor.id = "publier";

  $bannerEditor.innerHTML = "";
  $bannerEditor.appendChild($spanBannerEditor);
  $bannerEditor.appendChild($btnBannerEditor);
  $spanBannerEditor.insertBefore(
    createIcon("fas fa-pencil-alt"),
    $spanBannerEditor.firstChild
  );

  const $logout = document.querySelector("ul > li:nth-child(3)");
  const $logoutLink = createLogoutLink();
  $logout.innerHTML = "";
  $logout.appendChild($logoutLink);
  $logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    removeToken();
    window.location.assign("./index.html");
  });

  const $figure = document.querySelector("#introduction > figure");
  const $spanFigure = createModeEditionSpan("Mode édition");
  $figure.appendChild($spanFigure);

  const $projectFigure = document.querySelector("#portfolio > h2");
  const $spanProjectFigure = document.createElement("span");
  $spanProjectFigure.setAttribute("id", "titleProjectRemove");
  $spanProjectFigure.textContent = "Mode édition";

  $projectFigure.appendChild($spanProjectFigure);
  $spanProjectFigure.insertBefore(
    createIcon("fas fa-pencil-alt"),
    $spanProjectFigure.firstChild
  );
};

/**
 * Crée un élément <span> pour indiquer le mode d'édition avec une icône de crayon.
 * @param {string} text - Le texte à afficher dans le <span>.
 * @returns {HTMLElement} L'élément <span> représentant le mode d'édition avec l'icône de crayon.
 */
const createModeEditionSpan = (text) => {
  const $span = document.createElement("span");
  $span.classList.add("figureRemove");
  $span.textContent = text;
  $span.insertBefore(createIcon("fas fa-pencil-alt"), $span.firstChild);
  return $span;
};

/**
 * Crée un élément <i> avec une classe d'icône spécifiée.
 * @param {string} className - La classe d'icône à utiliser.
 * @returns {HTMLElement} L'élément <i> représentant l'icône.
 */
const createIcon = (className) => {
  const $icon = document.createElement("i");
  $icon.className = className;
  return $icon;
};

/**
 * Crée un élément <a> pour le lien de déconnexion.
 * @returns {HTMLAnchorElement} L'élément <a> représentant le lien de déconnexion.
 */
const createLogoutLink = () => {
  const $logoutLink = document.createElement("a");
  $logoutLink.href = "./login.html";
  $logoutLink.textContent = "Logout";
  return $logoutLink;
};

document.body.classList.add("marginTop");
