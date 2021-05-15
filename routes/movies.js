const express = require('express');
const router  = express.Router();
const Celebrity = require('../models/celebrity');
const Movie = require('../models/movie');

router.get('/',(req,res,next)=>{
    Movie.find()
    .then(allMoviesFromDB=>{
        res.render('movies/movies-list',{allMovies:allMoviesFromDB})
    })
  })
router.get('/new',(req,res,next)=>{
  Celebrity.find()
  .then(castFromDB=>{
    res.render('movies/movie-create',{cast:castFromDB})
  })
  .catch(err=>next(err))
})
router.post('/new',(req,res,next)=>{
  const {title, genre, plot, cast}=req.body;
  Movie.create({title, genre, plot, cast})
  .then(()=>{
      res.redirect('/movies')
  })
  .catch(err=>next(err))
})
router.post('/:id/delete',(req,res,next)=>{
  Movie.findByIdAndRemove(req.params.id)
  .then(()=>{
    console.log('id=',req.params.id)
    res.redirect('/movies')
  })
  .catch(err=>next(err))
})
router.get('/:id/edit',(req,res,next)=>{
  Movie.findById(req.params.id)
  .then(movieFound=>{
    Celebrity.find()
    .then(celebs=>{
      celebs.forEach((celeb,i)=>{
        if (movieFound.cast.includes(celeb._id)){
          celebs[i].selected=true;
        }
      })
      res.render('movies/edit',{
        theMovie: movieFound,
        theCast: celebs,
      })
    })
    .catch(err=>next(err))
  })
  .catch(err=>next(err))
})

router.get('/:id',(req,res,next)=>{
  Movie.findById(req.params.id)
    .populate('cast')
    .then(theMovie=>{
        res.render('movies/show',{movieData:theMovie})
    })
    .catch(err=>next(err))
})

router.post('/:id',(req,res,next)=>{
    Movie.findByIdAndUpdate(req.params.id,{
        title: req.body.title,
        genre: req.body.genre,
        plot: req.body.plot,
        cast: req.body.cast
    },{new:true})
        .then(updatedMovie=>{
            console.log('updated movie')
            res.redirect(`/movies/${updatedMovie._id}`)
        })
        .catch(err=>next(err))
    .catch(err=>next(err))
})
module.exports = router;