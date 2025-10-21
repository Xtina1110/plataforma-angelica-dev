import React from 'react';
import './ContentWrapper.css';

const ContentWrapper = ({ children, className = '' }) => {
  return (
    <div className={`content-wrapper ${className}`}>
      {children}
    </div>
  );
};

export default ContentWrapper;

