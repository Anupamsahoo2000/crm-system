const { Customer, Visitor } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    // Total Customers count
    const totalCustomers = await Customer.count();

    // Active Customers count
    const activeCustomers = await Customer.count({
      where: { status: 'Active' }
    });

    // Visitors Today (check-in time since start of today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const visitorsToday = await Visitor.count({
      where: {
        checkInTime: {
          [Op.gte]: startOfToday
        }
      }
    });

    // Currently Checked-In Visitors
    const checkedInVisitors = await Visitor.count({
      where: { status: 'Checked-In' }
    });

    // Recent Visitors for the dashboard view (limit to 5)
    const recentVisitors = await Visitor.findAll({
      limit: 5,
      order: [['checkInTime', 'DESC']]
    });

    // Recent Customers for the dashboard view (limit to 5)
    const recentCustomers = await Customer.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      stats: {
        totalCustomers,
        activeCustomers,
        visitorsToday,
        checkedInVisitors
      },
      recentVisitors,
      recentCustomers
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
