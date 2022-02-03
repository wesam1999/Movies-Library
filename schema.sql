DROP TABLE IF EXISTS favRecipes;

CREATE TABLE IF NOT EXISTS favRecipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date INTEGER,
    poster_path VARCHAR(10000),
    overview VARCHAR(10000)
    
);