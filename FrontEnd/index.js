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


/**
 * Cette fonction récupère les données d'un point de terminaison de l'API de works 
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
        /* appel a la fonction getBtnCategories */
        const btnCategories = getCategoriesNameFromWorks(works);
        /* appel a la fonction btnCategoriesFilter */
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

/* La fonction `worksDisplay` prend un tableau d'objets travail comme `data` et crée dynamiquement des éléments HTML
pour afficher l'image et le titre de chaque œuvre dans une galerie sur la page web. Elle sélectionne d'abord l'élément
HTML où les œuvres seront affichées, puis elle parcourt le tableau `data` et crée un nouvel élément `figure` pour chaque œuvre.
nouvel élément `figure` pour chaque œuvre. À l'intérieur de chaque élément `figure`, il crée un élément `img` avec l'URL de l'image de l'œuvre en tant qu'élément de référence.
l'URL de l'image de l'œuvre comme attribut `src` et le titre de l'œuvre comme attribut `alt`, et un élément `figcaption`.
`figcaption` avec le titre de l'œuvre comme contenu textuel. Enfin, il ajoute chaque élément `figure`
à l'élément HTML sélectionné. */

function worksDisplay(works) {

    // Récupérez l'élément HTML dans lequel vous souhaitez insérer les éléments.
    const $worksContainer = document.querySelector(".gallery");
    const $workDisplay = new Set(); 

        $worksContainer.innerHTML = "";
        works.forEach((work) => {
            if (categoryId === "Tous" || work.category.name === categoryId) {
                $workDisplay.add(work);
            }
            else {
                console.log("erreur au niveau de workdisplay");
            }
        });
        
        $workDisplay.forEach((work) => {
            $worksContainer.appendChild(worksTemplates(work));
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
    }
   
    catch (err) {
        console.log("erreur fetchCategoriesApi", err);
    }

}


/* The `getCategoriesNameFromWorks(data)` function takes an array of work objects as `data` and
extracts the unique category names from it using the `map()` method and a `Set` object. It returns
an array of unique category names. */
function getCategoriesNameFromWorks(data) {

  
    /* `const categoryNameSet = new Set(data.map((work) => work.category.name));` is creating a new
    `Set` object called `categoryNameSet` that contains the unique category names extracted from the
    `data` array of work objects. It does this by using the `map()` method to extract the category
    name from each work object, and then adding each category name to the `Set` object. The `Set`
    object automatically removes any duplicates, so `categoryNameSet` contains only the unique
    category names. */
    const categoryNameSet = new Set(data.map((work) => work.category.name));
    console.log(data);
    console.log(data.map((work) => work.category.name));
    console.log(categoryNameSet);

    const uniqueCategoryNameSet = Array.from(categoryNameSet);
    console.log(uniqueCategoryNameSet);

    return uniqueCategoryNameSet;

}

/* Création du Blockfiter et du bouton tous */
/* The `btnCategoriesFilter` function creates a filter block with buttons for each category retrieved
from the API. It first selects the HTML element where the filter block will be inserted, creates a
"Tous" button and adds it to the block. Then, it creates a button for each category and adds it to
the block. It also adds an event listener to each button that sets the `categoryId` variable to the
text content of the clicked button and calls the `worksDisplay` function to display the works
filtered by category. */
function btnCategoriesFilter(categories) {
    
    const blockFilter = document.querySelector(".filter");
    const buttonTous = document.createElement("button");
    
    buttonTous.classList.add("btn","active");
    buttonTous.textContent = "Tous";
   
    blockFilter.appendChild(buttonTous);


    
    const allButtons = [buttonTous, ...categories.map((categoryName) => {
        
        const buttonAutres = document.createElement("button");
        buttonAutres.classList.add("btn");
        buttonAutres.textContent = categoryName;
        blockFilter.appendChild(buttonAutres); 
        console.log(buttonAutres);
        return buttonAutres;
        
    })];

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
    const $workFigures = document.createElement('figure');
        
    const $workImg = document.createElement('img');
        $workImg.setAttribute('src', work.imageUrl);
        $workImg.setAttribute('alt', work.title);

    const $workFigcaptions = document.createElement('figcaption');
        $workFigcaptions.textContent = work.title;

    $workFigures.appendChild($workImg);
    $workFigures.appendChild($workFigcaptions);

    return $workFigures;

}


  
  












