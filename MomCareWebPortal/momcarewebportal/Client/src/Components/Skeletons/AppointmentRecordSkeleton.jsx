import React from 'react';
import './AppointmentRecordSkeleton.scss';

const AppointmentRecordSkeleton = () => {
  return (
    <div className="appointment-record-skeleton">
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

      {/* Optional: Skeleton for selected mother state */}
      <div className="skeleton-appointment-record-container">
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
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton-nav-item"></div>
            ))}
          </div>
        </div>

        <div className="skeleton-main-content">
          <div className="skeleton-form-section">
            <div className="skeleton-form-content">
              <div className="skeleton-form-title"></div>
              <div className="skeleton-form-grid">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="skeleton-form-field"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="skeleton-form-actions">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
          <div className="skeleton-detailed-records">
            <div className="skeleton-records-title"></div>
            <div className="skeleton-records-grid">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="skeleton-record-card">
                  <div className="skeleton-record-header">
                    <div className="skeleton-record-info"></div>
                    <div className="skeleton-toggle-button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRecordSkeleton;