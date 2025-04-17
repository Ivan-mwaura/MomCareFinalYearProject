const Appointment = require('../models/Appointment');
const Mother = require('../models/Mother');
const CHW = require('../models/CHW');
const RiskAssessment = require('../models/RiskAssessment');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../db/connect');

exports.getDashboardData = async () => {
  try {
    // Get total counts
    const totalMothers = await Mother.count();
    const highRiskCases = await RiskAssessment.count({
      where: { riskLevel: 'High' }
    });
    const upcomingAppointments = await Appointment.count({
      where: {
        date: {
          [Op.gte]: new Date(),
          [Op.lte]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
        }
      }
    });
    const activeCHWs = await CHW.count({
      where: { status: 'Active' }
    });

    // Get appointment trends (last 30 days)
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
    });

    // Get risk level changes (last 30 days)
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
    });

    // Get CHW performance data
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
    });

    // Get upcoming appointments list
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
            limit: 1
          }]
        }
      ],
      order: [['date', 'ASC']],
      limit: 5
    });

    // Get recent alerts
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
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']],
      limit: 5
    }).then(appointments => appointments.map(appointment => ({
      title: 'Missed Appointment',
      description: `${appointment.mother.firstName} ${appointment.mother.lastName} missed their appointment on ${new Date(appointment.date).toLocaleDateString()}`,
      date: appointment.date,
      priority: 'high'
    })));

    return {
      totalMothers,
      highRiskCases,
      upcomingAppointments,
      activeCHWs,
      appointmentTrends,
      riskChanges,
      chwPerformance: chwPerformance.map(chw => ({
        name: `${chw.firstName} ${chw.lastName}`,
        completedFollowUps: chw.dataValues.completedFollowUps,
        totalMothers: chw.dataValues.totalMothers
      })),
      upcomingAppointmentsList: upcomingAppointmentsList.map(appointment => ({
        date: appointment.date,
        motherName: `${appointment.mother.firstName} ${appointment.mother.lastName}`,
        type: appointment.type,
        riskLevel: appointment.mother.riskAssessmentsRecords[0]?.riskLevel || 'Low'
      })),
      recentAlerts
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}; 