const { Visitor } = require('../models');

// Check-in a visitor
exports.checkInVisitor = async (req, res) => {
  const { visitorName, phone, personToMeet, purpose } = req.body;

  try {
    // Optional: Can check if this visitor is already checked-in and hasn't checked out
    const activeVisitor = await Visitor.findOne({
      where: {
        phone,
        status: 'Checked-In'
      }
    });

    if (activeVisitor) {
      return res.status(400).json({ 
        message: `${visitorName} is already checked in and has not checked out yet.` 
      });
    }

    const visitor = await Visitor.create({
      visitorName,
      phone,
      personToMeet,
      purpose,
      checkInTime: new Date(),
      status: 'Checked-In'
    });

    res.status(201).json(visitor);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Visitor check-in error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check-out a visitor
exports.checkOutVisitor = async (req, res) => {
  const { id } = req.params;

  try {
    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor record not found' });
    }

    if (visitor.status === 'Checked-Out') {
      return res.status(400).json({ message: 'Visitor is already checked out' });
    }

    await visitor.update({
      status: 'Checked-Out',
      checkOutTime: new Date()
    });

    res.json(visitor);
  } catch (err) {
    console.error('Visitor check-out error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get visitor history (with optional pagination)
exports.getVisitorHistory = async (req, res) => {
  const { page, limit } = req.query;

  try {
    if (page || limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Visitor.findAndCountAll({
        order: [['checkInTime', 'DESC']],
        limit: limitNum,
        offset: offset
      });

      return res.json({
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
        visitors: rows
      });
    }

    const visitors = await Visitor.findAll({
      order: [['checkInTime', 'DESC']]
    });
    res.json(visitors);
  } catch (err) {
    console.error('Get visitor history error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
