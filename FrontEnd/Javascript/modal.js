//**** Création du contenu de la modale ****//
function modalContainer() {
  const $modal = document.createElement("aside");
  $modal.id = "modal";
  $modal.className = "modal";
  $modal.innerHTML = `
      <div id="modalContainer">
    
      <i id="closeModal" class="fa-solid fa-xmark"></i>
      <i id="previewModal" class="fa-solid fa-arrow-left "></i>
    
      <!-------------------- GALLERY ------------------------>
      
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
    
      <!------------------EDIT------------->

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

//****  Affichage de la modale ****//

function displayModal() {
  const modal = document.querySelector("#modal");
  const closeModalBtn = document.querySelector("#closeModal");
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
//**** Fermeture de la modale ****//

function closeModal() {
  document.getElementById("modal").remove();
}

//**** Création de l'open modal (affichage et suppression des photos dans la modale ) ****//

function openModal() {
  let deletedImages = {};
  document.getElementById("modalGrid").innerHTML = "";

  //***** INJECTION DES ELEMENTS FETCHER *****//
  // Récupérer les liens des images
  // méthode qui crée un nouveau tableau à partir d'un objet itérable.
  const imagesUrl = [...document.querySelectorAll(".gallery img")].map((img) =>
    img.getAttribute("src")
  );

  // Créer un Set pour n'avoir que des liens uniques
  const imagesUrlSet = new Set(imagesUrl);

  const imageElements = [...imagesUrlSet].map((link, index) => {
    const container = document.createElement("figure");
    const img = document.createElement("img");
    const p = document.createElement("p");
    const iconDelete = document.createElement("i");

    // ajouter l'attribut data-work-id
    container.setAttribute("data-work-id", works[index].id);
    iconDelete.id = "deleteIcon";
    iconDelete.classList.add("fa-solid", "fa-trash-can", "iconModal");
    iconDelete.setAttribute("aria-hidden", "true");
    img.src = link;
    p.textContent = "éditer";
    container.appendChild(img);
    container.appendChild(p);
    container.appendChild(iconDelete);

    // Ajouter l'icône de déplacement uniquement sur le premier élément
    if (index === 0) {
      const iconMove = document.createElement("i");
      iconMove.id = "moveIcon";
      iconMove.classList.add(
        "fa-solid",
        "fa-arrows-up-down-left-right",
        "iconModal"
      );
      container.appendChild(iconMove);
    }

    //DELETE icone Corbeille
    iconDelete.addEventListener("click", async (e) => {
      e.preventDefault();
      const workDelete = e.target.parentNode.getAttribute("data-work-id");
      removeElement(workDelete);
      deletedImages[workDelete] = true;

      // Convertir l'objet en chaîne de caractères JSON
      const deletedImagesJSON = JSON.stringify(deletedImages);
      // Stocker JSON dans sessionStorage
      sessionStorage.setItem("deletedImages", deletedImagesJSON);
    });

    //****FONCTION DELETE SUR LE DOM UNIQUEMENT appellé ds l evenement au click delete ****//

    function removeElement(workDelete) {
      const work = document.querySelector(`[data-work-id="${workDelete}"]`);
      if (work && work.parentNode) {
        work.parentNode.removeChild(work);
        container.remove(work);
      }
    }

    //**** FONCTION DELETE ALL DU DOM DEPUIS MODAL ****//

    const deleteALL = document.querySelector("#deleteAllWorks");
    deleteALL.addEventListener("click", () => {
      const figureModals = document.querySelectorAll("#modalGrid figure");
      const galleryModals = document.querySelectorAll("#portfolio figure");
      const deletedImages =
        JSON.parse(sessionStorage.getItem("deletedImages")) || {};
      const imageIds = [];

      figureModals.forEach((figure) => {
        const dataWorkId = figure.getAttribute("data-work-id");
        imageIds.push(dataWorkId);
        // stocke l'ID deletedImages
        deletedImages[dataWorkId] = true;
      });

      //**** DELETE TOUTES LES CARTES ****//

      figureModals.forEach((figure) => figure.remove());
      galleryModals.forEach((figure) => figure.remove());

      //****  Stocke les ID SESSIONTORAGE ****//

      sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
    });
    return container;
  });
  const galleryMap = document.getElementById("modalGrid");
  galleryMap.append(...imageElements);
}

//**** Fetch delete API ****/

const fetchDeleteApi = () => {
  // Récupérer la chaîne de sessionStorage
  const deletedImagesJSON = sessionStorage.getItem("deletedImages");

  // Convertir la chaîne en objet JavaScript
  const deletedImages = JSON.parse(deletedImagesJSON);

  // Supprimer chaque image du SESSION STORAGE
  //méthode JavaScript qui renvoie un tableau contenant les clés d'un objet
  Object.keys(deletedImages).forEach(async (id) => {
    try {
      if (token === false) return console.log({ error: "Pas connecté" });

      const response = await fetch(`${api}works/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log(`Image avec ID ${id} supprimée`);
      } else {
        throw new Error(response.statusText);
      }
    } catch (e) {
      console.error(
        `Erreur lors de la suppression de l'image avec ID ${id}: ${e}`
      );
    }
  });
};

//******* Création de l'EDIT MODAL ********//

function editModal() {
  const addNewWork = document.getElementById("editModal");
  const inputFile = document.querySelector("#filetoUpload");
  const selectEditCategory = document.getElementById("category");
  const editSection = document.querySelector("#editSection");
  const gallerySection = document.querySelector("#modalEdit");
  const previewModal = document.querySelector("#previewModal"); // Bouton
  const addToApi = document.getElementById("editWorks");

  let titleSelected = false;
  let categorySelected = false;
  let btnSubmitValidation = false;

  addNewWork.addEventListener("click", () => {
    gallerySection.style.display = "none";
    editSection.style.display = "";
    previewModal.style.display = "initial";
  });

  previewModal.addEventListener("click", () => {
    gallerySection.style.display = "";
    editSection.style.display = "none";
    previewModal.style.display = "none";
  });

  inputFile.addEventListener("change", addPicture);

  // SELECTION CATEGORIES - Génération des options de l'élément select à partir des données de l'API
  if (selectEditCategory.options.length === 0) {
    const emptyEditOption = document.createElement("option");
    emptyEditOption.value = "";
    emptyEditOption.textContent = "";
    selectEditCategory.appendChild(emptyEditOption);

    categories.forEach(function (category) {
      const otherEditOption = document.createElement("option");
      otherEditOption.textContent = category.name;
      otherEditOption.setAttribute("data-id", category.id);
      selectEditCategory.appendChild(otherEditOption);
    });
  }

  // Ajout d'un écouteur d'évenement qui se déclanche lorsque l'élément avec l'ID "editSection" recoit une entrée (ex: champ de saise)
  editSection.addEventListener("input", () => {
    const editTitle = document.querySelector("#title");
    const errorImg = document.querySelector("#errorImg");
    const titleError = document.querySelector("#ErrorTitleSubmit");
    const categoryError = document.querySelector("#ErrorCategorySubmit");
    const submitForm = document.querySelector(
      "#editWorks > div.footerModal.editFooter > input[type=submit]"
    );

    submitForm.style.background = "grey";

    let category = document.querySelector("#category").value;
    const title = editTitle.value;
    const image = inputFile.files[0];

    if (image === null || image === undefined) {
      // Si aucune image n'est définie
      errorImg.textContent = "Veuillez séléctionner une image";
      imageSelected = false;
    } else if (title.length < 1) {
      titleError.textContent = "Ajoutez un titre";
      titleSelected = false;
    } else if (category === "") {
      // Si aucune catégorie n'a été sélectionnée
      categoryError.textContent = "Choisissez une catégorie";
      titleError.textContent = "";
      categorySelected = false;
    } else {
      titleError.textContent = "";
      categoryError.textContent = "";
      categorySelected = true;
      titleSelected = true;
      imageSelected = true;
    }

    if (titleSelected && categorySelected && imageSelected) {
      // Si un titre, une catégorie et une image sont sélectionnés
      submitForm.style.background = "#1d6154";
      btnSubmitValidation = true;
    }
  });
  // Ajout d'un écouteur d'événement qui se déclanche lorsque le formulaire avec l'ID "addToApi" est soumis
  addToApi.addEventListener("submit", (e) => {
    e.preventDefault();

    if (btnSubmitValidation) {
      // Récupérer image
      const image = inputFile.files[0];

      // Récupérer Titre
      const title = document.querySelector("#title").value;

      // Récupérer id du fetch Category depuis la liste
      let categorySelect = document.querySelector("#category");

      let selectedOption = categorySelect.selectedOptions[0];

      let category = selectedOption.getAttribute("data-id");

      category = parseInt(category);

      const formData = new FormData();
      // Crée un nouvel objet FormData pour envoyer les données du formulaire

      formData.append("image", image);

      formData.append("title", title);

      formData.append("category", category);

      fetch(api + "works", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ta requête POST n'est pas passé :/ ");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Ta requête POST est passé :) :", data);
          fetchApiWorks();
          workDisplay();
          closeModal();
          // réinitialiser le champ inputFile sinon il envoie plusieur formData en post
          inputFile.value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
          console.log("Ta requête POST n'est PAS passée :( ");
        });
    } else {
      console.log("Formulaire invalide !!!");
    }
  });
}

//******* Ajout D'une nouvelle photo ******/

function addPicture() {
  const inputFile = document.getElementById("filetoUpload");

  const viewImage = document.getElementById("addImageContainer");

  const file = inputFile.files[0];

  const maxSize = 4 * 1024 * 1024;

  if (file.size > maxSize) {
    errorImg.textContent = "Votre image est trop volumineuse";

    console.log("fichier > 4MO!");

    return;
  }

  const reader = new FileReader();
  // Crée un nouvel objet FileReader

  reader.addEventListener("load", function () {
    viewImage.innerHTML = "";

    const img = document.createElement("img");

    img.setAttribute("src", reader.result);

    viewImage.appendChild(img);

    viewImage.style.padding = "0";
  });

  reader.readAsDataURL(file);
}
