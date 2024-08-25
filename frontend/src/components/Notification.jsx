import React from 'react';

const Notification = ({ type, content }) => {
    if (type === '' || content === '') {
        return null;
    }
    return <div className={type}>{content}</div>;
};

export default Notification;