const User = require('../models/User');

const registrationControllerDonationHub = (req, res) => {
  const { name, mobile, email, gender, password } = req.body;

  
  User.createUserDonationHub(name, mobile, email, gender, password, (error, userId) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to register user' });
    }
    return res.status(201).json({ message: 'User registered successfully', userId });
  });
};

module.exports = registrationControllerDonationHub;
