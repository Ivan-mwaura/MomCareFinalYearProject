import React from 'react';
import './PatientsSkeleton.scss';

const PatientsSkeleton = () => {
  return (
    <div className="patients-skeleton">
      {/* Header */}
      <div className="skeleton-title"></div>

      {/* Register Button */}
      <div className="skeleton-register-btn"></div>

      {/* Filters */}
      <div className="filters">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="skeleton-filter"></div>
        ))}
      </div>

      {/* Patient List */}
      <div className="patient-list">
        <div className="skeleton-list-title"></div>
        <table>
          <thead>
            <tr>
              {[...Array(7)].map((_, index) => (
                <th key={index}>
                  <div className="skeleton-header"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(7)].map((_, colIndex) => (
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

export default PatientsSkeleton;