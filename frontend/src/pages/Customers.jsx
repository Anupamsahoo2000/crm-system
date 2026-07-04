import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  AlertCircle, 
  Check, 
  Briefcase, 
  Mail, 
  Phone, 
  Building 
} from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentId, setCurrentId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, [search]); // Re-fetch when search changes

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/customers?search=${search}`);
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers list.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (e.g. 10 digits)';
    }
    
    if (!formData.company.trim()) errors.company = 'Company is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', phone: '', company: '', status: 'Active' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setModalMode('edit');
    setCurrentId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === 'add') {
        await api.post('/customers', formData);
        showSuccess('Customer added successfully!');
      } else {
        await api.put(`/customers/${currentId}`, formData);
        showSuccess('Customer updated successfully!');
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
      const errMsg = err.response?.data?.message || 'Error occurred while saving customer.';
      setFormErrors({ global: errMsg });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/customers/${id}`);
      showSuccess('Customer deleted successfully!');
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer.');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl text-emerald-300 flex items-center gap-3 text-sm animate-pulse">
          <Check className="h-5 w-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-violet-500/15 shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Customer
        </button>
      </div>

      {/* Grid List */}
      {loading && customers.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-850 p-12 rounded-2xl text-center">
          <Building className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No customers found.</p>
          <p className="text-slate-500 text-xs mt-1">Try refining your search query or add a new customer.</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-900/30 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{customer.name}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
                        {customer.company}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        customer.status === 'Active'
                          ? 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-400'
                          : 'bg-rose-950/50 border border-rose-900/50 text-rose-400'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-800 rounded-xl transition"
                          title="Edit Customer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id, customer.name)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <h5 className="font-bold text-slate-200">
                {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer'}
              </h5>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-200 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.global && (
                <div className="bg-rose-950/30 border border-rose-900/50 p-3.5 rounded-xl text-rose-300 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{formErrors.global}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                    formErrors.name ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
                  }`}
                  placeholder="John Doe"
                />
                {formErrors.name && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      formErrors.email ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`block w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      formErrors.phone ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
                    }`}
                    placeholder="9876543210"
                  />
                  {formErrors.phone && (
                    <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`block w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                    formErrors.company ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
                  }`}
                  placeholder="Acme Corp"
                />
                {formErrors.company && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.company}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-violet-500 transition"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  {modalMode === 'add' ? 'Create Customer' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
