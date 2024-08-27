require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/Person')

const app = express()

morgan.token('postData', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

// const generateId = () => {
//   return Math.floor(Math.random() * 10000)
// }

// let persons = [
//     {
//       "id": "1",
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": "2",
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": "3",
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": "4",
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

//  Middlewares

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.json())
app.use(cors())

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
)

// Persons Logic API

// Get All Persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

// Get Person by ID
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Add Person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number is missing'
    })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        // If person exists, the number is updated
        Person.findByIdAndUpdate(existingPerson._id, { number: body.number }, { new: true, runValidators: true, context: 'query' })
          .then(updatedPerson => {
            response.json(updatedPerson)
          })
          .catch(error => next(error))
      } else {
        // If person does not exist, create a new one
        const person = new Person({
          name: body.name,
          number: body.number,
        })

        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

// Update Person
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Delete Person
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person
    .findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  const date = new Date()

  Person.find({}).then(people => {
    const info = `Phonebook has info for ${people.length} people`
    response.send(`${info} <br /> ${date}`)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Error Handler Middleware when next(error) is called
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})