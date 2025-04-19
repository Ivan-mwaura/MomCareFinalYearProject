import React from 'react';
import './DashboardSkeleton.scss';

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-initials skeleton"></div>
          <div className="user-welcome skeleton"></div>
        </div>
        <div className="header-title skeleton"></div>
        <div className="mode-toggle skeleton"></div>
      </div>

      {/* Cards */}
      <div className="dashboard-cards">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="card skeleton"></div>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="chart-container">
            <div className="chart-title skeleton"></div>
            <div className="chart-content skeleton"></div>
          </div>
        ))}
      </div>

      {/* Lists */}
      <div className="dashboard-lists">
        <div className="upcoming-appointments">
          <div className="list-title skeleton"></div>
          <ul>
            {[...Array(3)].map((_, index) => (
              <li key={index}>
                <div className="date skeleton"></div>
                <div className="name skeleton"></div>
                <div className="risk skeleton"></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="recent-alerts">
          <div className="list-title skeleton"></div>
          <ul>
            {[...Array(3)].map((_, index) => (
              <li key={index} className="alert">
                <div className="alert-title skeleton"></div>
                <div className="alert-description skeleton"></div>
                <div className="alert-date skeleton"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;