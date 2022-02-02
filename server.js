'use strict';

require('dotenv').config();
const axios=require('axios')
const express = require('express');
const cors = require('cors');

const data = require('./move data/data.json');
const pg = require('pg');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);

server.get('/', handelMainPage);
server.get('/favorite', handelFavorite);
server.get('/trending',handeltrending)
server.get('/search',handelsearch);
server.psot('/addMovie',handeladdMovie);
server.get('/getMovies',handelgetMovies);
server.use(express.json());

function handeladdMovie(req,res){

    const recipe = req.body;
    //   console.log(recipe)
      let sql = `INSERT INTO favRecipes(title,readyInMinutes,summary,vegetarian,instructions,sourceUrl) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`
      let values=[recipe.title,recipe.readyInMinutes,recipe.summary,recipe.vegetarian,recipe.instructions,recipe.sourceUrl];
      client.query(sql,values).then(data =>{
          res.status(200).json(data.rows);
      }).catch(error=>{
          
      });

}

function handelgetMovies(req,res){
    let sql = `SELECT * FROM favRecipes;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });


}





// let url=`https://api.themoviedb.org/3/movie/550?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2&number=2`
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
   let url=`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
    axios.get(url)
     .then((result)=>{
        
        let recipes = result.data.results.map(recipes =>{
            return new Recipe(recipes.id,recipes.title,recipes.release_date,recipes.poster_path,recipes.overview);
        });res.status(200).json(recipes)

    }).catch((err)=>{
        console.log(err);
    })


}
function handeltrending(req,res){
   console.log("asdsdsad"); 
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`)
     .then((result)=>{
        console.log("inside");
        let recipes = result.data.results.map(recipes =>{
            return new Recipe(recipes.id,recipes.title,recipes.release_date,recipes.poster_path,recipes.overview);
        });res.status(200).json(recipes)

    }).catch((err)=>{
console.log(err);
    })
        

  

}



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





client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`)
    })
})