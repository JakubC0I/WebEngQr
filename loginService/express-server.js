const express = require('express');
const portnumber = 4000;
const server = express();

const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

const { MongoClient } = require('mongodb');

server.use(express.static(path.join(__dirname, ".")));

const mongoUrl = fs.readFileSync('mongoUrl.txt', 'utf8')
const client = new MongoClient(mongoUrl);

client.connect()
const db = client.db('code-data')
const mainCollection = db.collection('data');


//#region server operations
    //displays content of database
server.get("/load", async function (req, res) {


    console.log("/load requested");

    //var data = await mainCollection.find().toArray();

    const cursor = await mainCollection.find();
    const documents = await cursor.toArray();

    //will only display the "data" part from mainCollection
    if (documents.length > 0) {
        const responseData = documents.map(document => document.data);

        res.status(200).send(responseData);
        console.log("Sending data:", responseData);
    } else {
        res.status(404).send("No matching data found");
        console.log("No matching data found");
    }

    /*    res.status(200);
    res.send(data);
    console.log("sending data: " + data);
    */
});
/*
server.get("/clear", function (req, res) {

    console.log("/clear requested");

    res.status(200);
    res.send(data);
});
*/
//adds new element to database
server.post("/save", jsonParser, async function (req, res) {

    console.log("/save requested");
    const receivedData = req.body.data;

    await mainCollection.insertOne({ data: receivedData })

    res.status(200);
    console.log("data saved: " + receivedData);
});

//if an element with specified name exists, returns it
server.post("/find", jsonParser, async function (req, res) {

    console.log("/find requested");
    const dataToFind = req.body.data;

    const data = await mainCollection.findOne({ data: dataToFind });

    res.send(data);
    console.log("sending data: " + data);
});
//#endregion

//start server
server.listen(portnumber, function ()  {
    console.log('listening at port ' + portnumber);
});