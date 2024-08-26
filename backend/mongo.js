const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@demo-cluster.vh1jz.mongodb.net/personDoc?retryWrites=true&w=majority&appName=demo-cluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

peopleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', peopleSchema)

// If the number of arguments is 3, then we print all the persons in the phonebook
if(process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to the phonebook`)
        mongoose.connection.close()
    })
}