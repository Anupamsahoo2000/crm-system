const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  visitorName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Visitor name is required' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Phone number is required' },
      is: {
        args: [/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/],
        msg: 'Please enter a valid phone number'
      }
    }
  },
  personToMeet: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Person to meet is required' }
    }
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Purpose of visit is required' }
    }
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Checked-In', 'Checked-Out'),
    defaultValue: 'Checked-In',
    validate: {
      isIn: {
        args: [['Checked-In', 'Checked-Out']],
        msg: 'Status must be either Checked-In or Checked-Out'
      }
    }
  }
}, {
  timestamps: true
});

module.exports = Visitor;
