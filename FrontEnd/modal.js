/**** Création du contenu de la modale ***/
function modalContainer() {
  const $modal = document.createElement("aside"); // balise pour ajouter des éléments de navigation qui ne sont pas directemet liées au contenu de la page principale (boite de dialogue modale)
  $modal.id = "modal";
  $modal.className = "modal";

  //$modal.setAttribute("aria-labelledby", "modalTitle");
  //$modal.setAttribute("aria-hidden", "true");

  $modal.innerHTML = `
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
  document.body.appendChild($modal);
}

// Affichage de la modale
function displayModal() {
  const modal = document.querySelector("#modal");
  const closeModalBtn = document.querySelector("#closeModal");
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
// Fermeture de la modale
function closeModal() {
  document.getElementById("modal").remove();
}

/**** Création de l'open modal (affichage et suppression des photos dans la modale ) ****/
function openModal() {
  let deletedImages = {};

  // Sélectionne l'élément modalGrid dans le DOM
  const modalGrid = document.getElementById("modalGrid");
  // Vide le contenu de la modalGrid et évite les doublons d'images dans la galerie
  modalGrid.innerHTML = "";

  /***** Injection des éléments fetcher *****/
  // Récupération des liens des images que l'on va stocker dans un tableau
  const imagesUrl = [];
  const imageElements = document.querySelectorAll(".gallery img");

  /* On utilise la boucle for...of pour itérer les éléments de la collection (mettre les liens des images dans le tableau) */
  for (const img of imageElements) {
    imagesUrl.push(img.getAttribute("src"));
    //console.log(imagesUrl);
  }

  // Créer un Set pour n'avoir que des liens uniques
  const imagesUrlSet = new Set(imagesUrl);
  //console.log(imagesUrlSet);

  /****** Injection des works templates dans la modale *****/
  // On convertit le Set en un tableau pour itérer dessus
  const works = Array.from(imagesUrlSet);
  //console.log(works);

  // On utilise la boucle for...of pour itérer sur les liens d'images
  // Parcourir les éléments de la liste "works" avec forEach()
  works.forEach((work, workIndex) => {
    // Créer un élément <figure> pour chaque image
    const workContainer = document.createElement("figure");

    // Créer un élément <img> pour afficher l'image
    const img = document.createElement("img");
    img.setAttribute("src", work);

    // Créer un élément <p> pour afficher le texte "éditer"
    const workText = document.createElement("p");
    workText.textContent = "éditer";

    // Créer un élément <i> pour l'icône de suppression
    const workIconDelete = document.createElement("i");
    workIconDelete.id = "deleteIcon";
    workIconDelete.classList.add("fa-solid", "fa-trash-can", "iconModal");
    workIconDelete.setAttribute("aria-hidden", "true");

    // Ajouter l'attribut data-work-id à la figure avec la valeur de workIndex
    workContainer.setAttribute("data-work-id", workIndex);

    // Ajouter l'image, le paragraphe et l'icône à la figure
    workContainer.append(img, workText, workIconDelete);

    // Ajouter l'icône de déplacement uniquement sur le premier élément
    if (workIndex === 0) {
      const iconMove = document.createElement("i");
      iconMove.id = "moveIcon";
      iconMove.classList.add(
        "fa-solid",
        "fa-arrows-up-down-left-right",
        "iconModal"
      );
      workContainer.appendChild(iconMove);
    }

    // Ajouter la figure au conteneur modalGrid
    modalGrid.appendChild(workContainer);
  });

  // Ajoute un écouteur d'événement "click" à l'élément "iconDelete"
  workIconDelete.addEventListener("click", async (e) => {
    // Empêche le comportement par défaut de l'événement "click"
    e.preventDefault();

    // Récupère l'identifiant de la carte à supprimer en utilisant l'attribut "data-card-id" du parent de l'élément cliqué (le workFigures qui va etre supprimer)
    const workDeleteFigure = e.target.parentNode.getAttribute("data-work-id");

    // Supprime l'élément correspondant à l'identifiant de la carte
    removeElement(workDeleteFigure);

    // Marque l'image associée à l'identifiant de la carte comme supprimée en définissant sa clé correspondante dans l'objet "deletedImages" sur "true"
    deletedImages[workDeleteFigure] = true;

    // Affiche le contenu de l'objet "deletedImages" dans la console
    console.log(deletedImages);

    // Convertit l'objet "deletedImages" en une chaîne de caractères JSON et la stocke dans le sessionStorage avec la clé "deletedImages"
    sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
  });

  // Fonction pour supprimer un élément
  function removeElement(workDeleteFigure) {
    // Recherche l'élément de la carte à supprimer en utilisant l'identifiant de la carte
    const work = document.querySelector(`[data-work-id="${workDeleteFigure}"]`);

    // Vérifie si la carte existe et si elle a un parent
    if (work && work.parentNode) {
      // Supprime la carte de son parent
      work.parentNode.removeChild(work);

      // Supprime la carte du conteneur (container) s'il existe
      if (workContainer.contains(work)) {
        workContainer.remove(work);
      }
    }
  }
  // Fonction delete all
  const deleteALL = document.querySelector("#deleteAllWorks");
  deleteALL.addEventListener("click", () => {
    const figureModals = document.querySelectorAll("#modalGrid figure");
    const galleryModals = document.querySelectorAll("#portfolio figure");
    const deletedImages =
      JSON.parse(sessionStorage.getItem("deletedImages")) || {};
    const imageIds = [];
    console.log(deletedImages);

    figureModals.forEach((figure) => {
      const dataWorkId = figure.getAttribute("data-work-id");
      imageIds.push(dataWorkId);
      // stocke l'ID deletedImages
      deletedImages[dataWorkId] = true;
    });

    // DELETE TOUTES LES CARTES
    figureModals.forEach((figure) => figure.remove());
    galleryModals.forEach((figure) => figure.remove());

    // Stocke les ID SESSIONTORAGE
    sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
  });
}

/*** Fetch delete API ****/
async function fetchDeleteApi() {
  const deletedImagesJSON = sessionStorage.getItem("deletedImages"); // Récupère la chaîne JSON stockée dans le sessionStorage avec la clé "deletedImages"
  const deletedImages = JSON.parse(deletedImagesJSON); // Convertit la chaîne JSON en objet JavaScript

  for (const id of Object.keys(deletedImages)) {
    // Boucle for...of qui itère sur chaque clé (id) de l'objet deletedImages

    try {
      if (!token) {
        // Vérifie si la variable "token" est false (null, undefined, 0, "", false)
        console.log({ error: "Pas connecté" });
        continue; // Passe à l'itération suivante si le token est false
      }

      const response = await fetch(`${api}works/${id}`, {
        // Effectue une requête DELETE en utilisant l'ID de l'image
        method: "DELETE",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`, // Utilise la variable "token" pour l'autorisation
        },
      });

      if (response.ok) {
        // Si la réponse de la requête est réussie (code de statut 2xx)
        console.log(`Image avec ID ${id} supprimée`);
      } else {
        throw new Error(response.statusText); // Lance une erreur avec le statut de la réponse
      }
    } catch (e) {
      console.error(
        `Erreur lors de la suppression de l'image avec ID ${id}: ${e}`
      );
      // Capture les erreurs éventuelles et les affiche avec l'ID de l'image correspondante
    }
  }
}
