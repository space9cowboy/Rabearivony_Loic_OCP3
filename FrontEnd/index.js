/* `const api = "http://localhost:5678/api/";` assigne une valeur de chaîne à la variable constante
`api`. Cette chaîne représente l'URL de base du point de terminaison de l'API auquel le code va adresser des requêtes.
au code. Dans ce cas, l'API est hébergée localement sur la même machine que le code, et est accessible à l'adresse suivante
`http://localhost:5678/api/`. */
const api = "http://localhost:5678/api/";

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
        console.log(works);

        worksDisplay(works);
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

window.addEventListener("load", () => fetchWorksApi());

function worksDisplay(data) {

    // Récupérez l'élément HTML dans lequel vous souhaitez insérer les éléments.
    const works = document.querySelector(".gallery");
          
          data.forEach(work => {
            const workElement = document.createElement('div');
            workElement.innerHTML = `
              <figure>
              <img src="${work.imageUrl}" alt="${work.title}"/>
              <figcaption>${work.title}</figcaption>
              </figure>
            `;
            works.appendChild(workElement);
          });

}


  
  
  












