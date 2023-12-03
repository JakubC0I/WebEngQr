//#region init
//#region initial init?
const path = require('path');
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
const authData = pb.admins.authWithPassword('admin@admin.admin', '"]SLD;,3d>rj~S2');
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
//#endregion

//#region bcrypt init
const bcrypt = require('bcrypt');
const saltRounds = 10;
//#endregion
//#endregion

//#region server operations
//#region register
server.post("/register", jsonParser, async function (req, res) {

    console.log("/register requested");
    const receivedLogin = req.body.login;
    const receivedPassword = req.body.password;

    try {
        // Checks if account exists, will return error if false
        const account = await getUserByLogin(receivedLogin)
        res.send("User with specified login already exists");  
        }
    catch {
        bcrypt.hash(receivedPassword, saltRounds, async function(err, hash) {
            await pb.collection('Accounts').create({ login_data: {
                login: receivedLogin , password: hash
            }})
            res.send("registered with: Login: " + receivedLogin + " / Pass: " + receivedPassword + " / Hashedpass: " + hash);
        });
    }
    res.status(200);
});
//#endregion
//#region login
server.post("/login", jsonParser, async function (req, res) {

    console.log("/login requested");
    const receivedLogin = req.body.login;
    const receivedPassword = req.body.password;

    const account = await getUserByLogin(receivedLogin)
    //DUMB THING VERY DUMB WHY DO I HAVE TO ADD THOSE QUOTES WTHHH

    const hashedPassFromDb = account.login_data.password

    try {
        var compare = await bcrypt.compare(receivedPassword, hashedPassFromDb)
        if(compare) {
            const token = jwt.sign({ receivedLogin }, secretKey, { expiresIn: '1h' });
            res.cookie('loginToken', token, { httpOnly: true, maxAge: 3600000 });
            res.json({ success: true, message: 'Login successful' });
        }
        else {
            res.json({ success: false, message: 'Wrong password' });
        }
    }catch(e){
        console.log(e)
        res.json({ success: false, message: 'Error' });
    }
});
//#endregion
//#region cookies/login protection
server.get('/protected-route', (req, res) => {
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
//#endregion

//start server
server.listen(portnumber, function ()  {
    console.log('listening at port ' + portnumber);
});