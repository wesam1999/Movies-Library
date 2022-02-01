'use strict';
const PORT = process.env.PORT;
require('dotenv').config();
const axios=require('axios')
const express = require('express');
const cors = require('cors');
const data = require('./move data/data.json');

const server = express();
server.use(cors());

server.get('/', handelMainPage);
server.get('/favorite', handelFavorite);
server.get('/trending',handeltrending)
server.get('/search',handelsearch)
// server.get('*', handelerrors);
// server.get('*',handelerrors1);
let url=`https:https://api.themoviedb.org/3/movie/550?api_key=${process.env.APIKEY}`
server.get('*', function(req, res) {
    
    return res.status(404).send("page not found error")  ;
});
function Recipe(id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
   
}
function handelsearch(req,res){
    let newArr = [];
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2&number=2')
     .then((result)=>{
        // console.log(result.data.recipes);
        // let recipes = result.data.recipes.map(recipe =>{
        //     return new Recipe(recipe.id,recipe.title,recipe.readyInMinutes,recipe.summary,recipe.vegetarian,recipe.instructions,recipe.sourceUrl,recipe.image);
        // });
        result.results.data.recipes.forEach(recipe =>{
            newArr.push(new Recipe(recipe.id,recipe.title,recipe.release_date,recipe.poster_path,recipe.overview));
        })
        res.status(200).json(newArr);

    }).catch((err)=>{

    })


}
function handeltrending(req,res){
    let newArr = [];
    axios.get(url)
     .then((result)=>{
        // console.log(result.data.recipes);
        // let recipes = result.data.recipes.map(recipe =>{
        //     return new Recipe(recipe.id,recipe.title,recipe.readyInMinutes,recipe.summary,recipe.vegetarian,recipe.instructions,recipe.sourceUrl,recipe.image);
        // });
        result.results.data.recipes.forEach(recipe =>{
            newArr.push(new Recipe(recipe.id,recipe.title,recipe.release_date,recipe.poster_path,recipe.overview));
        })
        res.status(200).json(newArr);

    }).catch((err)=>{

    })


}

// //Handle 404
// server.use(function(err, req, res, next){
//     res.sendStatus(404);
//     if (req.accepts('json')) {
//         res.json({
//             "status": 404,
//             "responseText": "age not found error"
//         });
//         return;
//     }
   
// });

// //Handle 500
// server.use(function(err, req, res, next){
//     res.sendStatus(500);
//     if (req.accepts('json')) {
//         res.json({
//             "status": 500,
//             "responseText": "Sorry, something went wrong"
//         });
//         return;
//     }
// });

//send the user to 500 page without shutting down the server
// process.on('uncaughtException', function (err) {
//   console.log('-------------------------- Caught exception: ' + err);
//     app.use(function(err, req, res, next){
//         res.render('500');
//     });
// });
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

    
    
        let obj = new Meme(data.title, data.poster_path, data.overview);
        
    

    
    return res.status(200).json(obj);

}





server.listen(PORT, () => {
    console.log("my server is lisining for port 3000");

});
