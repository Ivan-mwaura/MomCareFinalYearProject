import React from 'react';
import './CHWsSkeleton.scss';

const CHWsSkeleton = () => {
  return (
    <div className="chw-skeleton">
      <h1 className="skeleton-title"></h1>

      {/* Filters Skeleton */}
      <div className="filters">
        <div className="skeleton-filter skeleton-input"></div>
        <div className="skeleton-filter skeleton-input"></div>
        <div className="skeleton-filter skeleton-select"></div>
        <div className="skeleton-filter skeleton-select"></div>
      </div>

      {/* CHW List Skeleton */}
      <div className="chw-list">
        <h2 className="skeleton-subtitle"></h2>
        <table>
          <thead>
            <tr>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell skeleton-type"></th>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell"></th>
              <th className="skeleton-header-cell"></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell skeleton-type"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell skeleton-description"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td>
                  <div className="actions">
                    {[...Array(5)].map((_, btnIndex) => (
                      <div key={btnIndex} className="skeleton-button skeleton-action-button"></div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="pagination">
        <div className="skeleton-button skeleton-pagination-button"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-button skeleton-pagination-button"></div>
      </div>
    </div>
  );
};

export default CHWsSkeleton;