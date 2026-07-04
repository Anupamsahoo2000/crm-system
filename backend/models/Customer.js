const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Customer name is required' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please enter a valid email address' },
      notEmpty: { msg: 'Email is required' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Phone number is required' },
      is: {
        args: [/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/], // Basic international or 10-digit phone format
        msg: 'Please enter a valid phone number'
      }
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Company name is required' }
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
    validate: {
      isIn: {
        args: [['Active', 'Inactive']],
        msg: 'Status must be either Active or Inactive'
      }
    }
  }
}, {
  timestamps: true
});

module.exports = Customer;
