const errorMessage = document.getElementById("error-msg-login");

document.getElementById("btn-login").addEventListener("click", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    e.preventDefault();
    const response = await fetch("http://localhost:5678/api/users/login", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
    });

    const body = await response.json();
    if (body.token === undefined) {
        errorMessage.textContent = "E-mail ou Mot de passe incorrect";
    } else {
        setLoginCookie("token", body.token, 3600);
        window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/index.html";
        }
});

function setLoginCookie(key, content, expiration) {
  document.cookie = `${key}=${content} path=/; max-age=${expiration}`;
}