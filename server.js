'use strict';



const express = require('express');
const cors = require('cors');
const data = require('./move data/data.json');

const server = express();
server.use(cors);

server.get('/', handelMainPage);
server.get('/favorite', handelFavorite);
// server.get('*', handelerrors);
// server.get('*',handelerrors1);

server.get('*', function(req, res, next) {
    var err = new Error();
    err.status = 404;
    next();
});

//Handle 404
server.use(function(err, req, res, next){
    res.sendStatus(404);
    if (req.accepts('json')) {
        res.json({
            "status": 404,
            "responseText": " age not found error "
        });
        return;
    }
   
});

//Handle 500
server.use(function(err, req, res, next){
    res.sendStatus(500);
    if (req.accepts('json')) {
        res.json({
            "status": 500,
            "responseText": "Sorry, something went wrong"
        });
        return;
    }
});

//send the user to 500 page without shutting down the server
process.on('uncaughtException', function (err) {
  console.log('-------------------------- Caught exception: ' + err);
    app.use(function(err, req, res, next){
        res.render('500');
    });
});
// function handelerrors1(req, res) {

//     res.status(404);
//     if (req.accepts('json')) {
//         res.json({
//             "status": ,
//             "responseText": "Sorry, something went wrong"
//         });
//         return;
//     }
// }

// function handelerrors(req, res) {


// }

// app.use(function (req, res) {
//     res.sendStatus(500);
//     // res.render('page not found error');
//     if (req.accepts('json')) {
//         res.json({
//             "status": 500,
//             "responseText": "Sorry, something went wrong"
//         });
//         return;

// });

function handelFavorite(req, res) {
    res.status(200).send('Welcome to Favorite Page')


}




function Meme(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}




function handelMainPage(req, res) {

    let memes = [];
    data.data.forEach(val => {
        let obj = new Meme(val.title, val.poster_path, val.overview);
        memes.push(obj);
    })

    console.log(memes);
    return res.status(200).json(memes);

}





server.listen(3000, () => {
    console.log("my server is lisining for port 3000");

});
