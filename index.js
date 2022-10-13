const { response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
var morgan = require('morgan')
app.use(express.json())
morgan.token('info', (request, response) => {
    return JSON.stringify(request.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))
let persons = [
    {
      "id": 1,
      "name": "Arto",
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people </p> <p>${Date()}</p>`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  app.post('/api/persons', (request, response) => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
    const personP = request.body
    if (!personP.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
      if (!personP.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
      if (persons.filter(person => 
        person.name === personP.name).length !== 0
        ) {
            return response.status(400).json({ 
              error: 'name needs to be unique' 
            })
          }
          
    personP.id = getRandomInt(999999)
    persons = persons.concat(personP)
    response.json(personP)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })