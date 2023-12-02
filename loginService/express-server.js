const express = require('express');
const portnumber = 4000;
const server = express();

const PocketBase = require('pocketbase/cjs')
const pb = new PocketBase('http://127.0.0.1:8090')
const authData = pb.admins.authWithPassword('admin@admin.admin', '"]SLD;,3d>rj~S2');

const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

server.use(express.static(path.join(__dirname, ".")));

const bcrypt = require('bcrypt');
const saltRounds = 10;

//#region server operations
server.post("/register", jsonParser, async function (req, res) {

    console.log("/register requested");
    const receivedLogin = req.body.login;
    const receivedPassword = req.body.password;

    try
    {
        var test = await pb.collection('Accounts').getFirstListItem({ login_data: {
            login: receivedLogin
        }}).login;
        console.log(test)
        res.send("User with specified login already exists");        
    }
    catch
    {
        bcrypt.hash(receivedPassword, saltRounds, async function(err, hash) 
        {
            await pb.collection('Accounts').create({ login_data: {
                login: receivedLogin , password: hash
            }})
            res.send("registered with: Login: " + receivedLogin + "/ Pass: " + receivedPassword + "/ Hashedpass: " + hash);
        });
    }
    res.status(200);
});

server.post("/login", jsonParser, async function (req, res) {

    console.log("/login requested");
    const receivedLogin = req.body.login;
    const receivedPassword = req.body.password;

    var hashedPassFromDb = await pb.collection('Accounts').getFirstListItem('login='+receivedLogin, {
        expand: 'relField1,relField2.subRelField',
    });

    var data;
    try{
        var compare = await bcrypt.compare(receivedPassword, hashedPassFromDb)
        if(compare)
        {
            data = "Correct credentials"
        }
        else{
            data = "Incorrect credentials; Password is wrong"
        }
    }catch(e){
        console.log(e)
        data = "error"
    }

    res.send(data);
    console.log("sending response: " + data);
});
//#endregion

//start server
server.listen(portnumber, function ()  {
    console.log('listening at port ' + portnumber);
});