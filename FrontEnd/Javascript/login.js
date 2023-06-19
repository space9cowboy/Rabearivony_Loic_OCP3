const api = "http://localhost:5678/api/users/login";

/* recupération de l'élément avec l'Id login-form */
const postForm = document.getElementById("login-form");

/* recupération de l'élément avec l'Id email */
const postEmail = document.getElementById("email");

/* recupération de l'élément avec l'Id password */
const postPassword = document.getElementById("password");

/* recupération de l'élément avec l'Id submit */
const postSubmit = document.querySelector(".submit");

//****  creation user for API *****//

const userForApi = {
  email: postEmail.value,
  password: postPassword.value,
};

postEmail.addEventListener("input", (e) => {
  clearEmailError();
  userForApi.email = e.target.value;
});
postPassword.addEventListener("input", (e) => {
  clearPasswordError();
  userForApi.password = e.target.value;
});
postForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("submit");
  fetchLoginApi();
});

// Fonctions pour effacer les messages d'erreur de l'email et du mot de passe
function clearEmailError() {
  const $loginError = document.querySelector(".login-error");
  $loginError.textContent = "";
}

function clearPasswordError() {
  const $passwordError = document.querySelector(".password-error");
  $passwordError.textContent = "";
}

//*****  fetching login (recuperation) *****//

async function fetchLoginApi() {
  try {
    await fetch(api, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify(userForApi),
    })
      .then((res) => res.json())
      .then((data) => (login = data));

    if (login.message) {
      const $loginError = document.querySelector(".login-error");
      $loginError.textContent = "identifiant incorrect !!!";
      $loginError.style.color = "red";
    } else if (login.error) {
      const $passwordError = document.querySelector(".password-error");
      $passwordError.textContent = "Mot de Passe incorrect !!!";
      $passwordError.style.color = "red";
    } else {
      localStorage.setItem("token", login.token);
      window.location.href = "index.html";
    }
  } catch (err) {
    console.log("erreur fetchLoginApi", err);
  }
}

document.body.classList.add("marginTop");
