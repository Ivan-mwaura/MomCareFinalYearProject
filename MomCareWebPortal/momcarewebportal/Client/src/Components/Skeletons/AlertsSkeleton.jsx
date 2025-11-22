import React from 'react';
import './AlertsSkeleton.scss';

const AlertsSkeleton = () => {
  return (
    <div className="alerts-skeleton">
      <h1 className="skeleton-title"></h1>

      {/* Tab Navigation Skeleton */}
      <div className="tabs">
        <div className="skeleton-tab active"></div>
        <div className="skeleton-tab"></div>
      </div>

      {/* Alerts List Skeleton */}
      <div className="alerts-list">
        <h2 className="skeleton-subtitle"></h2>
        <table>
          <thead>
            <tr>
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
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td>
                  <div className="skeleton-button skeleton-action-button"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="skeleton-button skeleton-pagination-button"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-button skeleton-pagination-button"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertsSkeleton;