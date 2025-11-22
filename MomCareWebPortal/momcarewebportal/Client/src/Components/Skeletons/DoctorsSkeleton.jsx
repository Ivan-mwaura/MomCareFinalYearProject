import React from 'react';
import './DoctorsSkeleton.scss';

const DoctorsSkeleton = () => {
  return (
    <div className="doctor-management-skeleton">
      {/* Header */}
      <header className="page-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-add-doctor-btn"></div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="skeleton-search-input"></div>
      </div>

      {/* Doctor List */}
      <div className="doctor-list">
        <table className="doctor-table">
          <thead>
            <tr>
              {[...Array(8)].map((_, index) => (
                <th key={index}>
                  <div className="skeleton-header"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(8)].map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className="skeleton-cell"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <div className="skeleton-pagination-btn"></div>
          <div className="skeleton-pagination-text"></div>
          <div className="skeleton-pagination-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsSkeleton;