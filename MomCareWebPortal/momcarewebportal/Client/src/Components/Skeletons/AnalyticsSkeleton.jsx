import React from 'react';
import './AnalyticsSkeleton.scss';

const AnalyticsSkeleton = () => {
  return (
    <div className="analytics-skeleton">
      {/* Header */}
      <div className="skeleton-title"></div>

      {/* Date Filter */}
      <div className="date-filter">
        <div className="skeleton-date-input"></div>
        <div className="skeleton-date-input"></div>
      </div>

      {/* Dashboard Section */}
      <div className="dashboard">
        <div className="skeleton-section-title"></div>
        <div className="charts">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="chart">
              <div className="skeleton-chart-title"></div>
              <div className="skeleton-chart-content"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Section */}
      <div className="reports">
        <div className="skeleton-section-title"></div>
        <div className="report-controls">
          <div className="skeleton-select"></div>
          <div className="skeleton-button"></div>
        </div>
        <div className="report-preview">
          <div className="skeleton-preview-title"></div>
          <div className="skeleton-preview-text"></div>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-preview-line"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;