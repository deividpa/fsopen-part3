require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/Person')

const app = express()

morgan.token('postData', function (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
});

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

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

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors())

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :postData'
    )
);

// Persons Logic API

// Get All Persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

// Get Person by ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then(person => {
        response.json(person)
    })
})

// Add Person
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'Name or Number is missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Delete Person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person 
        .findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/api/info', (request, response) => {
    const date = new Date()

    Person.find({}).then(people => {
        const info = `Phonebook has info for ${people.length} people`
        response.send(`${info} <br /> ${date}`)
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})