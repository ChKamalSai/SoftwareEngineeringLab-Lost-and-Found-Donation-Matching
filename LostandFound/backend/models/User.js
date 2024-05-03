const { lostAndFoundPool, donationHubPool } = require('../config/db');

class User {
  static checkEmailLostAndFound(email, callback) {
    console.log('Email:', email); 

    lostAndFoundPool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          console.error('Database Error:', error); 
          return callback(error);
        }
        console.log('Query Results:', results);
        if (results.length > 0) {
          
          console.log('Email already exists');
          return callback(null, true);
        } else {
          
          console.log('Email does not exist');
          return callback(null, false);
        }
      }
    );
  }

  static createUserLostAndFound(name, mobile, email, gender, password, callback) {
    lostAndFoundPool.query(
      'INSERT INTO Users (name, mobile, email, gender, password) VALUES (?, ?, ?, ?, ?)',
      [name, mobile, email, gender, password],
      (error, results) => {
        if (error) {
          console.error('Database Error:', error); 
          return callback(error);
        }
        console.log('User created successfully. Insert ID:', results.insertId); 
        return callback(null, results.insertId);
      }
    );
  }

  static createUserDonationHub(name, mobile, email, gender, password, callback) {
    donationHubPool.query(
      'INSERT INTO Users (name, mobile, email, gender, password) VALUES (?, ?, ?, ?, ?)',
      [name, mobile, email, gender, password],
      (error, results) => {
        if (error) {
          console.error('Database Error:', error);
          return callback(error);
        }
        console.log('User created successfully. Insert ID:', results.insertId); 
        return callback(null, results.insertId);
      }
    );
  }

  static findUserByEmail(email, password, callback) {
    lostAndFoundPool.query(
      'SELECT * FROM Users WHERE email = ? AND password = ?',
      [email, password],
      (error, results) => {
        if (error) {
          console.error('Database Error:', error);
          return callback(error, null);
        }
        if (results.length === 0) {
        
          return callback(null, null);
        }
       
        return callback(null, results[0]);
      }
    );
  }

}

module.exports = User;
