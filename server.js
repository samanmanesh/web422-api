/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: __Mohammadhossein__Sobhanmanesh________ Student ID: ____116523200_____ Date: ______Sep 14,2022____
* Cyclic Link: _____https://dead-ruby-giraffe.cyclic.app/_________________________________________
*
********************************************************************************/


const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const MoviesDB = require('./modules/moviesDB.js');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const db = new MoviesDB();
//For using .env file
require('dotenv').config();

//Middleware
// Add support for incoming JSON entities
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.post("/api/movies", (req, res) => {
  db.addMovie(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.get("/api/movies", (req, res) => {
  if (!req.query.page && !req.query.perPage)
    return res
      .status(400)
      .json({ message: "page and perPage query parameters are required" });

  req.query.page = req.query.page;
  req.query.perPage = req.query.perPage;
  req.query.title = req.query.title || "title";
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});


app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.put("/api/movies/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then((data) => {
      res.status(201).json({ message: "Movie Updated" });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then((data) => {
      res.status(201).json({ message: "Movie Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});


// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


