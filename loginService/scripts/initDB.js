module.exports = {createAdmin, createCollections}

const http = require('http');

const url = "http://localhost:8090/api/admins"
const admin = {
    "email": "admin@admin.admin",
    "password": "\"]SLD;,3d>rj~S2",
    "passwordConfirm": "\"]SLD;,3d>rj~S2"
}
function createAdmin() {
    const req = http.request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    },(response) => {
        console.log(response)
    })

    req.write(admin)
    req.end()
}

function createCollections(pb) {
    pb.collection.create({
        name: "Accounts",
        type:  "base",
        schema: [
            {
                name: "login_data",
                type: "json",
                required: true
            },

        ]
    })
}

