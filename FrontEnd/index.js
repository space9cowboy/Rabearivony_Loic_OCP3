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
    }
  /* Le bloc `catch` gère les erreurs qui peuvent survenir pendant l'exécution du bloc `try`.
   Si une erreur survient, elle sera attrapée et le message d'erreur sera enregistré dans la console avec le
   avec le message "erreur fetchWorksApi". 
   Cela permet de s'assurer que le programme ne se plante pas et que les erreurs sont correctement gérées et rapportées.
   et que les erreurs sont correctement gérées et rapportées. */
   
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












