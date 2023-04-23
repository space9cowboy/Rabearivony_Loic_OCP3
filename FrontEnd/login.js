
const api = "http://localhost:5678/api/users/login";

/* creation user for API */
const userForApi = {
    "email": "",
    "password": ""
};

const postForm = document.getElementById("login-form");

/* recupération de l'élément avec l'Id email */
const postEmail = document.getElementById("email");

/* recupération de l'élément avec l'Id password */
const postPassword = document.getElementById("password");

/* recupération de l'élément avec l'Id submit */
const postSubmit = document.querySelector(".submit");

postEmail.addEventListener("input", (e) => {
    userForApi.email = e.target.value;
});
postPassword.addEventListener("input", (e) => {
    userForApi.password = e.target.value;
});
postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("submit");
    fetchLoginApi();
});

/* fetching login (recuperation) */
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
        .then((data) =>(login = data));

        if (login.message) {
            const $loginError = document.querySelector(".login-error");
            $loginError.textContent = "identifiant incorrect";
        }else if (login.error) {
            const $passwordError = document.querySelector(".password-error");
            $passwordError.textContent = "password incorrect";
        }else {
            localStorage.setItem("token", login.token);
            window.location.href="index.html";
            console.log("c tout bon");
        }
    }
    catch (err) {
        console.log("erreur fetchLoginApi", err);
    }
}

