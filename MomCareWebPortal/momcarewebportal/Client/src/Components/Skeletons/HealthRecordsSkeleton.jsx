import React from 'react';
import './HealthRecordsSkeleton.scss';

const HealthRecordsSkeleton = () => {
  return (
    <div className="health-records-skeleton">
      <header className="skeleton-header">
        <div className="skeleton-search-container">
          <div className="skeleton-search-input"></div>
        </div>
      </header>

      <div className="skeleton-welcome-section">
        <div className="skeleton-welcome-card">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-tips-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-tip-card">
                <div className="skeleton-tip-icon"></div>
                <div className="skeleton-tip-title"></div>
                <div className="skeleton-tip-text"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton for selected mother state */}
      <div className="skeleton-health-records-container">
        <div className="skeleton-sidebar">
          <div className="skeleton-title"></div>
          <div className="skeleton-mother-profile">
            <div className="skeleton-profile-title"></div>
            <div className="skeleton-profile-details">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="skeleton-profile-detail"></div>
              ))}
            </div>
          </div>
          <div className="skeleton-sidebar-nav">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton-nav-item"></div>
            ))}
          </div>
        </div>

        <div className="skeleton-main-content">
          <div className="skeleton-form-section">
            <div className="skeleton-form-content">
              <div className="skeleton-form-title"></div>
              <div className="skeleton-checkbox-grid">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="skeleton-checkbox-item"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="skeleton-form-actions">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
          <div className="skeleton-additional-content">
            <div className="skeleton-quick-stats">
              <div className="skeleton-stats-title"></div>
              <div className="skeleton-stats-grid">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="skeleton-stat-card">
                    <div className="skeleton-stat-icon"></div>
                    <div className="skeleton-stat-text"></div>
                    <div className="skeleton-stat-value"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="skeleton-notes-section">
              <div className="skeleton-notes-title"></div>
              <div className="skeleton-notes-text"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordsSkeleton;