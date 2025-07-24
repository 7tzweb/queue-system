const mongoose = require('mongoose');

const isEmpty = value =>
  value === undefined || value === null || value.toString().trim() === '';

const isValidPhone = phone =>
  /^[0-9]{9,15}$/.test(phone.trim());

const isValidName = name =>
  /^[a-zA-Zא-ת0-9\s\-]{2,50}$/.test(name.trim());

const validateIdParam = id => mongoose.Types.ObjectId.isValid(id);

const validateQueueData = ({ name, phone }) => {
  if (isEmpty(name) || isEmpty(phone)) {
    return { valid: false, message: 'Name and phone are required' };
  }
  if (!isValidName(name)) {
    return { valid: false, message: 'Invalid name format' };
  }
  if (!isValidPhone(phone)) {
    return { valid: false, message: 'Invalid phone number format' };
  }
  return { valid: true };
};

const validateAgentData = ({ name, department }) => {
  if (isEmpty(name) || isEmpty(department)) {
    return { valid: false, message: 'Name and department are required' };
  }
  if (!isValidName(name) || department.length > 50) {
    return { valid: false, message: 'Invalid data format' };
  }
  return { valid: true };
};

module.exports = {
  validateQueueData,
  validateAgentData,
  validateIdParam
};
