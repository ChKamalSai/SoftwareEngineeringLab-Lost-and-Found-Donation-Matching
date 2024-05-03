const mysql = require('mysql2');


const lostAndFoundPool = mysql.createPool({
  connectionLimit: 10, 
  host: 'localhost',
  user: 'root',
  password: 'Akhil2004@',
  database: 'LostandFound' 
});


const donationHubPool = mysql.createPool({
  connectionLimit: 10, 
  host: 'localhost',
  user: 'root',
  password: 'Akhil2004@',
  database: 'DonationHub' 
});


lostAndFoundPool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to Lost and Found database:', err);
    return;
  }
  console.log('Connected to Lost and Found database');
  connection.release();
});


donationHubPool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to Donation Hub database:', err);
    return;
  }
  console.log('Connected to Donation Hub database');
  connection.release();
});

module.exports = {
  lostAndFoundPool,
  donationHubPool
};
