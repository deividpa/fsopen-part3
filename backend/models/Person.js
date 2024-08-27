const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
  
mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        match: [/^\d{2,3}-\d+$/, 'Please fill a valid phone number (e.g., 09-1234556 or 040-22334455)']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)