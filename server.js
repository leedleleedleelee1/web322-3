/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ______frank fu________________ Student ID: _____126609197_________ Date: _____oct 12 2023_________
*
*  Published URL: 
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
app.use(express.static("public"));

// Update the "/" route to respond with the "/views/home.html" file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

// Add an "/about" route that responds with "/views/about.html" file
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

// Update the "/lego/sets" route to handle theme query parameters and errors
app.get('/lego/sets', async (req, res) => {
    try {
        const theme = req.query.theme; // Check if "theme" query parameter is present
        let sets;

        if (theme) {
            sets = await legoData.getSetsByTheme(theme);
        } else {
            sets = await legoData.getAllSets();
        }

        res.send(sets);
    } catch (err) {
        res.status(404).send(err);
    }
});

// Update the "/lego/sets/id-demo" route to return Lego set by set_num dynamically
app.get('/lego/sets/:setNum', async (req, res) => {
    try {
        const setNum = req.params.setNum;
        let set = await legoData.getSetByNum(setNum);
        res.send(set);
    } catch (err) {
        res.status(404).send(err);
    }
});

// Delete the "/lego/sets/theme-demo" route

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
});

// Add support for a custom "404 error" page
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/views/404.html');
});


