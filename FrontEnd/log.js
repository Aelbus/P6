const errorMsgLogin = document.getElementById("error-msg-login");

document.getElementById("btn-login").addEventListener("click", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    e.preventDefault();
    const response = await fetch("http://" + window.location.hostname + ":5678/api/users/login", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        loginResponse: JSON.stringify({ email: email, password: password }),
    });

    const loginResponse = await response.json();
        if (loginResponse.token === undefined) {
            errorMsgLogin.textContent = "Mot de passe ou adresse email incorrect";
        } 
        else {
        setLoginCookie("token", loginResponse.token, 3600);
        window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/index.html";
        }
});

function setLoginCookie(key, content, expiration) {
  document.cookie = `${key}=${content} path=/; max-age=${expiration}`;
}