const User = require('../models/User');

const registrationControllerLostandFound = {
  checkEmailLostAndFound: (req, res) => {
    const { email } = req.body;
    User.checkEmailLostAndFound(email, (error, exists) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to check email availability' });
      }
      return res.status(200).json({ exists });
    });
  },

  register: (req, res) => {
    const { name, mobile, email, gender, password } = req.body;

    User.createUserLostAndFound(name, mobile, email, gender, password, (error, userId) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to register user' });
      }
      return res.status(201).json({ message: 'User registered successfully', userId });
    });
  }
};

module.exports = registrationControllerLostandFound;
