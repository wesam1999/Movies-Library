'use strict';

require('dotenv').config();
const axios=require('axios')
const express = require('express');
const cors = require('cors');

const data = require('./move data/data.json');
const pg = require('pg');
const PORT = process.env.PORT;
const server = express();
server.use(express.json())

server.use(cors());
// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
    // ssl: { rejectUnauthorized: false }
}
    )
server.get('/', handelMainPage);
server.get('/favorite', handelFavorite);
server.get('/trending',handeltrending)
server.get('/search',handelsearch);
server.get('/search1',handelsearch1);
server.get('/search2',handelsearch2);
server.post('/addMovie',handeladdMovie);
server.get('/getMovies',handelgetMovies);
server.put('/UPDATE/:id',handelUpdateMovies);
server.delete('/DELETE/:id',handelDeleteMovies);
server.get('/getMovie/:id',handelgetIdMovies);
server.use(express.json());
server.use('*',notFoundHandler);
server.use(errorHandler)
function handelsearch1(req,res)
{
    let url=`https://tastedive.com/api/similar?q=red+hot+chili+peppers%2C+pulp+fiction`;
  
    axios.get(url)
      .then((result)=>{
         
       
         res.status(200).json(result.data.Similar.Results)

     }).catch((error)=>{
         errorHandler(error,req,res)
     })
 
 
 }
 function handelsearch2(req,res)
{
    let url=`https://api.tvmaze.com/singlesearch/shows?q=girls`;
  
    axios.get(url)
      .then((result)=>{
         
        
        res.status(200).json(result.data)

     }).catch((error)=>{
         errorHandler(error,req,res)
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
 
     }).catch((error)=>{
         errorHandler(error,req,res)
     })
         
 

}
function handelUpdateMovies(req,res)
{
const id=req.params.id;
console.log(id);
const recipe = req.body;
const sql=`UPDATE favRecipes SET title=$1, release_date=$2, poster_path=$3, overview=$4 RETURNING *;`;
let values = [recipe.title, recipe.release_date, recipe.poster_path, recipe.overview];
client.query(sql,values).then(data=>{
    res.status(200).json(data.rows);
    // res.status(204)
}).catch(error=>{
    errorHandler(error,req,res)
});

}

function handelDeleteMovies(req,res)
{
const id = req.params.id;
    const sql = `DELETE FROM favRecipes WHERE id=${id};`
    client.query(sql).then(()=>{
        res.status(200).send("The Recipe has been deleted");
        // res.status(204).json({});
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
  

function handelgetIdMovies(req,res)
{

    let sql = `SELECT * FROM favRecipes WHERE id=${req.params.id};`;
    
    client.query(sql).then(data=>{
        res.status(200).json(data.rows);
     }).catch(error=>{
        errorHandler(error,req,res)
     });

}


function handeladdMovie(req,res){

    const recipe = req.body;
    console.log(recipe)
    let sql =`INSERT INTO favRecipes(title, release_date, poster_path, overview) VALUES($1, $2, $3, $4) RETURNING *;`
    let values = [recipe.title, recipe.release_date, recipe.poster_path, recipe.overview];
      client.query(sql,values).then(data =>{
          res.status(200).json(data.rows[0]);
      }).catch(error=>{
        errorHandler(error,req,res)
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
let titleSearch = "Spider-Man: No Way Home";
function handelsearch(req,res){
 let  searchquery=req.query.searchquery;
//  console.log(searchquery);
    let url=` https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${searchquery}&page=2`;
  
   axios.get(url)
     .then((result)=>{
        
        let recipes = result.data.results.map(recipes =>{
            return new Recipe(recipes.id,recipes.title,recipes.release_date,recipes.poster_path,recipes.overview);
        });res.status(200).json(recipes)

    }).catch((error)=>{
        errorHandler(error,req,res)
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

    }).catch((error)=>{
        errorHandler(error,req,res)
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

function notFoundHandler(req,res){
    res.status(404).send("This page is not found")
 }
 
 function errorHandler (error,req,res){
    const err = {
         status : 500,
         messgae : error
     }
     res.status(500).send(err);
 }



client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`)
    })
})