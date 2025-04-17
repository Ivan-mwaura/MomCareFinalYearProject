const Appointment = require('../models/Appointment');
const Mother = require('../models/Mother');
const CHW = require('../models/CHW');
const RiskAssessment = require('../models/RiskAssessment');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../db/connect');

exports.getDashboardData = async () => {
  try {
    // Get total counts with default values
    const totalMothers = await Mother.count().catch(() => 0);
    const highRiskCases = await RiskAssessment.count({
      where: { riskLevel: 'High' }
    }).catch(() => 0);
    
    const upcomingAppointments = await Appointment.count({
      where: {
        date: {
          [Op.gte]: new Date(),
          [Op.lte]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    }).catch(() => 0);
    
    const activeCHWs = await CHW.count({
      where: { status: 'Active' }
    }).catch(() => 0);

    // Get appointment trends (last 30 days) with default empty array
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const appointmentTrends = await Appointment.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), 'date'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        date: {
          [Op.gte]: thirtyDaysAgo,
          [Op.lte]: new Date()
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']]
    }).catch(() => []);

    // Get risk level changes (last 30 days) with default empty array
    const riskChanges = await RiskAssessment.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', literal('CASE WHEN "RiskAssessment"."riskLevel" = \'High\' THEN 1 ELSE 0 END')), 'high'],
        [sequelize.fn('SUM', literal('CASE WHEN "RiskAssessment"."riskLevel" = \'Low\' THEN 1 ELSE 0 END')), 'low']
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
          [Op.lte]: new Date()
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    }).catch(() => []);

    // Get CHW performance data with default empty array
    const chwPerformance = await CHW.findAll({
      attributes: [
        'firstName',
        'lastName',
        [sequelize.fn('COUNT', sequelize.col('appointments.id')), 'completedFollowUps'],
        [sequelize.fn('COUNT', sequelize.col('mothers.id')), 'totalMothers']
      ],
      include: [
        {
          model: Appointment,
          as: 'appointments',
          attributes: [],
          where: { status: 'Completed' },
          required: false
        },
        {
          model: Mother,
          as: 'mothers',
          attributes: [],
          required: false
        }
      ],
      group: ['CHW.id', 'CHW.firstName', 'CHW.lastName']
    }).catch(() => []);

    // Get upcoming appointments list with default empty array
    const upcomingAppointmentsList = await Appointment.findAll({
      where: {
        date: {
          [Op.gte]: new Date(),
          [Op.lte]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: [
        {
          model: Mother,
          as: 'mother',
          attributes: ['firstName', 'lastName'],
          include: [{
            model: RiskAssessment,
            as: 'riskAssessmentsRecords',
            attributes: ['riskLevel'],
            order: [['createdAt', 'DESC']],
            limit: 1,
            required: false
          }]
        }
      ],
      order: [['date', 'ASC']],
      limit: 5
    }).catch(() => []);

    // Get recent alerts with default empty array
    const recentAlerts = await Appointment.findAll({
      where: {
        status: 'Missed',
        date: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: [
        {
          model: Mother,
          as: 'mother',
          attributes: ['firstName', 'lastName'],
          required: false
        }
      ],
      order: [['date', 'DESC']],
      limit: 5
    }).catch(() => []).then(appointments => 
      appointments.map(appointment => ({
        title: 'Missed Appointment',
        description: `${appointment.mother?.firstName || 'Unknown'} ${appointment.mother?.lastName || 'Patient'} missed their appointment on ${new Date(appointment.date).toLocaleDateString()}`,
        date: appointment.date,
        priority: 'high'
      }))
    );

    return {
      totalMothers,
      highRiskCases,
      upcomingAppointments,
      activeCHWs,
      appointmentTrends: appointmentTrends.map(trend => ({
        date: trend.getDataValue('date'),
        count: parseInt(trend.getDataValue('count') || 0)
      })),
      riskChanges: riskChanges.map(change => ({
        date: change.getDataValue('date'),
        high: parseInt(change.getDataValue('high') || 0),
        low: parseInt(change.getDataValue('low') || 0)
      })),
      chwPerformance: chwPerformance.map(chw => ({
        name: `${chw.firstName} ${chw.lastName}`,
        completedFollowUps: parseInt(chw.dataValues.completedFollowUps || 0),
        totalMothers: parseInt(chw.dataValues.totalMothers || 0)
      })),
      upcomingAppointmentsList: upcomingAppointmentsList.map(appointment => ({
        date: appointment.date,
        motherName: `${appointment.mother?.firstName || 'Unknown'} ${appointment.mother?.lastName || 'Patient'}`,
        type: appointment.type,
        riskLevel: appointment.mother?.riskAssessmentsRecords?.[0]?.riskLevel || 'Low'
      })),
      recentAlerts
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return default values in case of error
    return {
      totalMothers: 0,
      highRiskCases: 0,
      upcomingAppointments: 0,
      activeCHWs: 0,
      appointmentTrends: [],
      riskChanges: [],
      chwPerformance: [],
      upcomingAppointmentsList: [],
      recentAlerts: []
    };
  }
}; 