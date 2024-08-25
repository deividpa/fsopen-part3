import React from 'react';

const PersonForm = ({ onSubmit, newName, newNumber, onNameChange, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <span>name:</span> 
        <input type="text" value={newName} onChange={onNameChange} />
      </div>
      <div>
        <span>number:</span>
        <input type="text" value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default PersonForm;