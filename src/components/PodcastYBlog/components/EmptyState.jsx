import React from 'react';

const EmptyState = ({ icon, title, message }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h2 className="empty-state-title">{title}</h2>
    <p className="empty-state-text">{message}</p>
  </div>
);

export default EmptyState;