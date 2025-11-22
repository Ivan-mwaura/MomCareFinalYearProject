const Appointment = require('../models/Appointment');
const Mother = require('../models/Mother');
const CHW = require('../models/CHW');
const RiskAssessment = require('../models/RiskAssessment');
const { Op } = require('sequelize');

exports.getDashboardAnalytics = async (startDate, endDate) => {
  const totalMothers = await Mother.count();
  const totalAppointments = await Appointment.count();
  const totalCHWs = await CHW.count();

  // Get appointment attendance data with date range
  const dateFilter = {
    date: {
      [Op.gte]: startDate || new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Last 30 days if no start date
      [Op.lte]: endDate || new Date() // Current date if no end date
    }
  };

  const appointments = await Appointment.findAll({
    attributes: ['status', 'date'],
    where: dateFilter
  });

  // Calculate attendance metrics
  const totalAppointmentsInPeriod = appointments.length;
  const attendanceData = {
    attended: appointments.filter(a => a.status === 'Completed').length,
    missed: appointments.filter(a => a.status === 'Missed').length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    total: totalAppointmentsInPeriod,
    percentages: {
      attended: totalAppointmentsInPeriod > 0 ? 
        (appointments.filter(a => a.status === 'Completed').length / totalAppointmentsInPeriod * 100).toFixed(1) : 0,
      missed: totalAppointmentsInPeriod > 0 ? 
        (appointments.filter(a => a.status === 'Missed').length / totalAppointmentsInPeriod * 100).toFixed(1) : 0,
      scheduled: totalAppointmentsInPeriod > 0 ? 
        (appointments.filter(a => a.status === 'Scheduled').length / totalAppointmentsInPeriod * 100).toFixed(1) : 0,
      cancelled: totalAppointmentsInPeriod > 0 ? 
        (appointments.filter(a => a.status === 'Cancelled').length / totalAppointmentsInPeriod * 100).toFixed(1) : 0
    }
  };

  // Get risk distribution data from RiskAssessment model
  const riskAssessments = await RiskAssessment.findAll({
    attributes: ['riskLevel'],
    where: {
      riskLevel: {
        [Op.ne]: null
      }
    }
  });

  const totalRiskAssessments = riskAssessments.length;
  const riskDistribution = {
    high: riskAssessments.filter(r => r.riskLevel === 'High').length,
    low: riskAssessments.filter(r => r.riskLevel === 'Low').length,
    total: totalRiskAssessments,
    percentages: {
      high: totalRiskAssessments > 0 ? 
        (riskAssessments.filter(r => r.riskLevel === 'High').length / totalRiskAssessments * 100).toFixed(1) : 0,
      low: totalRiskAssessments > 0 ? 
        (riskAssessments.filter(r => r.riskLevel === 'Low').length / totalRiskAssessments * 100).toFixed(1) : 0
    }
  };

  // Get geographic distribution with percentages
  const locations = await Mother.findAll({
    attributes: ['county'],
    where: {
      county: {
        [Op.ne]: null
      }
    }
  });

  const locationCounts = locations.reduce((acc, curr) => {
    acc[curr.county] = (acc[curr.county] || 0) + 1;
    return acc;
  }, {});

  const totalLocations = locations.length;
  const locationDistribution = Object.entries(locationCounts).reduce((acc, [county, count]) => {
    acc[county] = {
      count,
      percentage: totalLocations > 0 ? ((count / totalLocations) * 100).toFixed(1) : 0
    };
    return acc;
  }, {});

  return {
    totalMothers,
    totalAppointments,
    totalCHWs,
    attendanceData,
    riskDistribution,
    locationDistribution,
    dateRange: {
      start: startDate || new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
      end: endDate || new Date()
    }
  };
};
