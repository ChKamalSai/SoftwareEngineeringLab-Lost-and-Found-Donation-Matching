const User = require('../models/User');

const loginController = {
  login: (req, res) => {
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    User.findUserByEmail(email, password, (error, user) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Authentication successful
      return res.status(200).json({ message: 'Authentication successful' });
    });
  }
};

module.exports = loginController;
