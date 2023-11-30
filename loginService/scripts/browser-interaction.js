databaseContent = document.getElementById("dbContent")
databaseExists = document.getElementById("dbExists")

formContent = document.getElementById("textId").value
findContent = document.getElementById("textId2").value


function changeContent()
{
    var request = new XMLHttpRequest(); 

    request.onload = function () {
        const data = request.responseText;
        databaseContent.innerHTML = data;
    }
    request.open("GET", "/load", true);
    request.send();
}

function submitForm() {
    formContent = document.getElementById("textId").value

    var request = new XMLHttpRequest();

    request.open("POST", "/save", true);
    request.setRequestHeader("Content-type","application/json");

    request.send(JSON.stringify({data : formContent}));

    changeContent()
}

function findData()
{
    findContent = document.getElementById("textId2").value

    var request = new XMLHttpRequest();

    request.onload = function () {
        const exists = request.responseText;
        if(exists != "")
        {
        databaseExists.innerHTML = "true\n" + exists;
        }
        else
        {
            databaseExists.innerHTML = "false"
        }
    }

    request.open("POST", "/find", true);
    request.setRequestHeader("Content-type","application/json");

    request.send(JSON.stringify({data : findContent}));
}