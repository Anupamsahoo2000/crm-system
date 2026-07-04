const { Customer } = require('../models');
const { Op } = require('sequelize');

// Create a new customer
exports.createCustomer = async (req, res) => {
  const { name, email, phone, company, status } = req.body;

  try {
    // Check if email already exists
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      status: status || 'Active'
    });

    res.status(201).json(customer);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create customer error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all customers (with optional search and pagination)
exports.getCustomers = async (req, res) => {
  const { search, page, limit } = req.query;
  let whereClause = {};

  if (search) {
    whereClause = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ]
    };
  }

  try {
    if (page || limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Customer.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset
      });

      return res.json({
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
        customers: rows
      });
    }

    const customers = await Customer.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(customers);
  } catch (err) {
    console.error('Get customers error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, status } = req.body;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if new email is taken by another customer
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }
    }

    await customer.update({
      name: name || customer.name,
      email: email || customer.email,
      phone: phone || customer.phone,
      company: company || customer.company,
      status: status || customer.status
    });

    res.json(customer);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update customer error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ message: 'Customer removed successfully' });
  } catch (err) {
    console.error('Delete customer error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
