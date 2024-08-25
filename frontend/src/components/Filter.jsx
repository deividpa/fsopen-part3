import React from 'react';

const Filter = ({ searchTerm, onChange }) => {
    return (
        <div>
            <span>Filter shown with:</span>
            <input value={searchTerm} onChange={onChange} />
        </div>
    );
};

export default Filter;