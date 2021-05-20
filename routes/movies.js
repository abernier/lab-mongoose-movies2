const express = require('express');
const {findById} = require('../models/celebrity.js');
const router = express.Router();

const Celebrity = require('../models/celebrity.js');

const Movie = require('../models/movie')
/* GET home page */

router.get('/', (req, res, next) => {
    Celebrity.find().then((celebrityFromDb) => {
        res.render('movies/new', {celebrity: celebrityFromDb})
    }).catch(err => console.log(err))

})

router.post('/', (req, res, next) => {
    let {title, genre, plot, cast} = req.body;
    console.log(title, genre, plot, cast);
    new Movie({title, genre, plot, cast}).save().then(addmovieFromDb => res.redirect('/movies/show')).catch(err => console.log(err))

})

router.get('/show', (req, res, next) => {
    Movie.find().then(allmoviesFromDb => res.render('movies/show', {allmovies: allmoviesFromDb})).catch(err => console.log(err))

})

router.get('/:id', (req, res, next) => {
    let id = req.params.id
    Movie.findById(id).populate('cast')
    .then(movie => res.render('movies/detail', {theMovie: movie}))
    .catch(err => console.log(err))
})

router.post('/:id/delete', (req, res) => {
    const {id} = req.params;
    console.log('lid est', id);
    Movie.findByIdAndDelete(id).then(() => res.redirect('/movies/show')).catch(error => next(error));
});

router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id
    
    Movie.findById(id)
        .populate('cast')
          .then((movie) => 
            res.render('movies/edit', {movie}))
          .catch(err => console.log(err))
    })
   

router.post('/:id', (req, res, next) => {
   
    Movie.update({
      _id: req.params.id 
    }, {
        $set: {
            cast: req.body.cast,
            title: req.body.title,
            genre: req.body.genre,
            plot: req.body.plot
        }
    }).then((movie) => res.redirect('/movies/show'))
    .catch(err => console.log(err))
})

module.exports = router;
