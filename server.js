const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json')

const morganSetting = process.env.NODE_ENV === 'production'?'tiny':'common'
app.use(morgan(morganSetting))


const app = express()

app.use(cors())
app.use(helmet())

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})




const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]

app.use(function validateBearerToken(req,res,next){
  
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  console.log('validate bearer token middleware')
  if(!authToken || authToken.split(' ')[1]!==apiToken)
  {return res.status(401).json({"error":"Unauthorized request"})}
  
  next()
})



function handleGetTypes(req, res) {
  res.json(validTypes)
}

app.get('/types',handleGetTypes)

function handleGetPokemon(req,res){

  let response = POKEDEX.pokemon;

  if(req.query.name){
    
    response = response.filter(pokemon=>
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }
  
  if(req.query.type){
    response = response.filter(pokemon=>
      pokemon.type.includes(req.query.type)
     
    )
  }
  
  res.json(response)
}



app.get('/pokemon',handleGetPokemon)

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{
  console.log(`Server listening at http://localhost:${PORT}`)
})

