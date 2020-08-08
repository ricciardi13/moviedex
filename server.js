require('dotenv').config()
const express = require('express')
const cors = require('cors')
const MOVIE_DATA = require('./movies-data-small.json')
const app = express()

app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.get('/movies', function handleGetMovies(req, res) {
  let response = MOVIE_DATA;
  
  if (req.query.film_title) {
    response = response.filter(movies => 
      movies.film_title.toLowerCase().includes(req.query.film_title.toLowerCase())
    )
  }
  
  if (req.query.genre) {
    response = response.filter(movies =>
      movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  
  if (req.query.country) {
      response = response.filter(movies => 
        movies.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
  }

  if (req.query.avg_vote) {
    response = response.filter(movies =>
        Number(movies.avg_vote) >= Number(req.query.avg_vote)
    )
  }

  res.json(response)
})

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://locahost:${PORT}`)
})

module.exports = app;