registerLoginField = document.getElementById("loginId-reg")
registerPasswordField = document.getElementById("passwordId-reg")

loginLoginField = document.getElementById("loginId")
loginPasswordField = document.getElementById("passwordId")

function login()
{
    var loginVar = loginLoginField.value
    var passwordVar = loginPasswordField.value

    var request = new XMLHttpRequest();

    request.open("POST", "/login", true);
    request.setRequestHeader("Content-type","application/json");

    request.send(JSON.stringify({login : loginVar},{password : passwordVar}));
}

function register() {
    var loginVar = registerLoginField.value
    var passwordVar = registerPasswordField.value

    var request = new XMLHttpRequest();

    request.open("POST", "/register", true);
    request.setRequestHeader("Content-type","application/json");

    request.send(JSON.stringify({login : loginVar},{password : passwordVar}));
}