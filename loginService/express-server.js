//#region init
//#region initial init?
const path = require('path');
const {createAdmin, createCollections} = require('./scripts/initDB')
//#endregion

//#region express init
const express = require('express');
const portnumber = 4000;
const server = express();
server.use(express.static(path.join(__dirname, ".")));
//#endregion 

//#region pocketBase init
const PocketBase = require('pocketbase/cjs')
const pb = new PocketBase('http://127.0.0.1:8090')
let authData;


try {
     authData = pb.admins.authWithPassword('admin@admin.admin', '"]SLD;,3d>rj~S2');
}catch (e) {
    if (e.constructor === ClientResponseError) {
        createAdmin()
        createCollections(pb)
        authData = pb.admins.authWithPassword('admin@admin.admin', '"]SLD;,3d>rj~S2');
    }
}

//#endregion

//#region parsers init
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
//#endregion

//#region cookies init
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'EeWhIW7NGEKIgUmzO0CWryDbwtJsx150'
server.use(cookieParser());

const AccountsColl = 'Accounts'
const LoginField = 'login_data.login='
const EmailField = 'login_data.email='

//#endregion

//#region bcrypt init
const bcrypt = require('bcrypt');
const saltRounds = 10;
//#endregion
//#endregion

//#region server operations
//#region register
server.post("/user/register", jsonParser, async function (req, res) {

    console.log("/register requested");
    const receivedLogin = req.body.login;
    const receivedPassword = req.body.password;
    const receivedPassword2 = req.body.password2;
    const recievedEmail = req.body.email;

    try {
        // Checks if account exists, will return error if false
        const account = await getUserByLogin(receivedLogin)
        res.json({
            ok: false,
            message:"User with specified login already exists"});
        res.status(404);
        res.end()
        }
    catch {}
    try {
        const account = await getUserByEmail(recievedEmail)
        res.json({
            ok: false,
            message:"User with specified email already exists"});
        res.status(404);
        res.end()
    }
    catch {
        if(receivedPassword != receivedPassword2)
        {
            res.send("Recieved passwords do not match")
        }
        bcrypt.hash(receivedPassword, saltRounds, async function(err, hash) {
            await pb.collection(AccountsColl).create({ login_data: {
                email: recievedEmail, login: receivedLogin , password: hash
            }})
            res.json({
                ok: true,
                message:"registered"});
            res.status(200);
            res.end()
        });

    }

});
//#endregion
//#region login
server.post("/user/login", jsonParser, async function (req, res) {

    console.log("/login requested");
    const receivedLogin = req.body.login;
    const receivedPassword = req.body.password;

    const account = await getUserByLogin(receivedLogin)

    const hashedPassFromDb = account.login_data.password

    try {
        var compare = await bcrypt.compare(receivedPassword, hashedPassFromDb)
        if(compare) {
            const token = jwt.sign({ receivedLogin }, secretKey, { expiresIn: '1h' });
            res.cookie('loginToken', token, { httpOnly: true, maxAge: 3600000 });
            res.json({ ok: true, message: 'Login successful' });
        }
        else {
            res.json({ ok: false, message: 'Wrong password' });
        }
        res.end()
    }catch(e){
        console.log(e)
        res.json({ ok: false, message: 'Error' });
        res.end()
    }
});
//#endregion
//#region cookies/login protection
server.get('/user/protected-route', (req, res) => {
    const token = req.cookies.loginToken;
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
        // redirect to login page?
      }
  
      // if the token is valid it will return the login upon decoding
      const userLogin = decoded.receivedLogin;
      
      // redirect to protected path here

      res.json({ success: true, message: `Welcome, user ${userLogin}!` });
    });
    res.status(200);
});
//#endregion

//#region additional methods
function getUserByLogin(recievedLogin)
{
    return pb.collection(AccountsColl).getFirstListItem(LoginField+`"${recievedLogin}"`)
}

function getUserByEmail(recievedEmail)
{
    return pb.collection(AccountsColl).getFirstListItem(EmailField+`"${recievedEmail}"`)
}
//#endregion

//start server
server.listen(portnumber, function ()  {
    console.log('listening at port ' + portnumber);
});