const express = require('express')
const app = express()

app.use(express.json())

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Persons Logic API

// Get All Persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Get Person by ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Add Person
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'Name or Number is missing' 
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'Name must be unique' 
        })
    }
  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(persons)
})

// Delete Person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/api/info', (request, response) => {
    const date = new Date()
    const info = `Phonebook has info for ${persons.length} people`
    response.send(`${info} <br /> ${date}`)
})

const PORT = 3001
app.listen(PORT)