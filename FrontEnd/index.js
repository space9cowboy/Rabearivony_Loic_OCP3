/* `const api = "http://localhost:5678/api/";` assigne une valeur de chaîne à la variable constante
`api`. Cette chaîne représente l'URL de base du point de terminaison de l'API auquel le code va adresser des requêtes.
au code. Dans ce cas, l'API est hébergée localement sur la même machine que le code, et est accessible à l'adresse suivante
`http://localhost:5678/api/`. */
const api = "http://localhost:5678/api/";

let categoryId = "";
let categories = [];


/**
 * Cette fonction récupère les données d'un point de terminaison de l'API 
 * pour les travaux et les enregistre dans la console, tout en gérant les erreurs éventuelles.
 * tout en gérant les erreurs qui peuvent survenir.
 */
async function fetchWorksApi() {
    try {
        await fetch(api + "works")
        .then((res) => res.json())
        .then((data) => (works = data)) ;
        console.log("La récupération des données de l'API est ok");

       /* appel a la fonction workdisplays */
        worksDisplay(works);
        const btnCategories = getBtnCategories(works);
        btnCategoriesFilter(btnCategories);
    }
   
    catch (err) {
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

window.addEventListener("load", () => {fetchWorksApi();
fetchCategoriesApi();
});

function worksDisplay(data) {

    // Récupérez l'élément HTML dans lequel vous souhaitez insérer les éléments.
    const works = document.querySelector(".gallery");
          
          data.forEach(work => {
            const workElement = document.createElement('figure');
            workElement.innerHTML = `
              
              <img src="${work.imageUrl}" alt="${work.title}"/>
              <figcaption>${work.title}</figcaption>
        
            `;
            works.appendChild(workElement);
          });
}

/* récupération des données API des catégories */
async function fetchCategoriesApi() {
    try {
        await fetch(api + "categories")
        .then((res) => res.json())
        .then((data) => (categories = data)) ;
        console.log("La récupération des données de l'API est ok");
        console.log(categories);
       /* appel a la fonction workdisplays */
        
    }
   
    catch (err) {
        console.log("erreur fetchCategoriesApi", err);
    }

}

function getBtnCategories(data) {

    const categoryNameSet = new Set(works.map((work) => work.category.name));
    const uniqueCategoryNameSet = Array.from(categoryNameSet);
    return uniqueCategoryNameSet;

}


function btnCategoriesFilter(categories) {
    const blockFilter = document.querySelector(".filter");
    const buttonsTous = document.createElement("button");
    buttonsTous.classList.add("btn","active");
    buttonsTous.textContent = "Tous";
    blockFilter.appendChild(buttonsTous);

    const allButtons = [buttonsTous, ...categories.map((categoryName) => {
        const buttonAutres = document.createElement("button");
        buttonAutres.classList.add("btn");
        buttonAutres.textContent = categoryName;
        blockFilter.appendChild(buttonAutres); 
        return buttonAutres;
    })];

    allButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            categoryId = event.target.textContent;
            allButtons.forEach((button) => {
                button.classList.remove("active");
            });
            event.target.classList.add("active");
            worksDisplay();
        });
    });
}


  
  












