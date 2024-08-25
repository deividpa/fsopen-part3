import React, { useEffect, useState } from 'react';
import personService from './Services/personService';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {

    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });
    
    const handleNameChange = (event) => setNewName(event.target.value);
    const handleNumberChange = (event) => setNewNumber(event.target.value);
    const handleNameSearchChange = (event) => setNameSearch(event.target.value);

    const clearNotification = () => {
        setTimeout(() => {
            setMessage({ type: '', content: '' });
        }, 5000);
    };

    useEffect(() => {
        personService.getAll().then((personsList) => {
            setPersons(personsList);
        });
    }, [])

    const nameExists = () => {
        
        const alreadyExists = persons.find(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
        );
        
        return !!alreadyExists;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (nameExists()) {
            const response = window.confirm(`${newName} already exists, do you want to change its phone number?`);
            
            if (!response) return;

            const personFound = persons.find(
                (person) => person.name.toLowerCase() === newName.toLowerCase()
            );

            const updatePersonNumber = { ...personFound, number: newNumber };

            personService
                .update(updatePersonNumber.id, updatePersonNumber)
                .then((updatedPerson) => {
                    setPersons(
                        persons.map((person) =>
                            person.id !== updatedPerson.id
                                ? person
                                : updatedPerson
                        )
                    );

                    setMessage({
                        type: 'success',
                        content: `${updatedPerson.name} updated successfuly`,
                    })
                    clearNotification();
                });
            return;
        }
        const newPerson = {
            name: newName,
            number: newNumber,
        };

        personService.create(newPerson).then((createdPerson) => {
            setPersons([...persons, createdPerson]);
            setNewName('');
            setNewNumber('');
            setMessage({ type: 'success', content: `${newPerson.name} was created succesfuly` });
            clearNotification();
        });
    };

    const handleDeletePerson = (id) => {
        const foundPerson = persons.find((person) => person.id === id);
        if (
            window.confirm(
            `Do you want to delete ${foundPerson.name} from the phonebook?`
            )
        ) {
            personService
                .deletePerson(id)
                .then(() => {
                    setPersons(
                        persons.filter(
                            (person) => person.id !== foundPerson.id
                        )
                    );
                    setMessage({
                        type: 'success',
                        content: `${foundPerson.name} has been deleted successfuly`,
                    });
                    clearNotification();
                })
            .catch((error) => {
                setMessage({
                    type: `error`,
                    content: `There was an error deleting ${foundPerson.name} from the phonebook. ${error}`,
                });
                clearNotification();
            });
        }
    };


    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(nameSearch.toLowerCase())
    );

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification type={message.type} content={message.content} />
            <Filter searchTerm={nameSearch} onChange={handleNameSearchChange} />
            
            <h3>Add new Persons:</h3>
            <PersonForm 
                newName={newName}
                newNumber={newNumber}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
                onSubmit={handleSubmit}
            />
            
            <h3>Numbers</h3>
            <Persons 
                persons={filteredPersons} 
                handleDelete={handleDeletePerson} 
            />
        </div>
    );
};

export default App;