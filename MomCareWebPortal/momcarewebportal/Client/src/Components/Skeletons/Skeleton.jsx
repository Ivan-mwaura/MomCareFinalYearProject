import React from 'react';
import './Skeleton.scss';

const Skeleton = ({ type, count = 1, className = '' }) => {
  const elements = [];

  for (let i = 0; i < count; i++) {
    elements.push(
      <div key={i} className={`skeleton ${type} ${className}`}>
        <div className="skeleton-shimmer"></div>
      </div>
    );
  }

  return <>{elements}</>;
};

export default Skeleton; 