const express = require('express');
const router = express.Router();
const connection = require('./Connection');
router.get('/donations', (req, res) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  connection.query('SELECT * FROM MessDonations WHERE DateandTimeOfEntry >= ?  ',[yesterday], (err, result) => {
    if (err) {
      console.error('Error fetching donations:', err);
      res.status(500).json({ error: 'Internal Server Error. Please try again later' });
      return;
    }
    // console.log({ result });
    res.status(200).json({ result });
  });
});

router.post('/donation/request', (req, res) => {
  const { emailID, userType, donationId, quantityRequested } = req.body;
  connection.query(
    'INSERT INTO CharityDonations (Email, DonationId, QuantityRequested, RequestStatus, OrderTaken) VALUES (?, ?, ?, ?, ?)',
    [emailID, donationId, quantityRequested, 'pending', 'No'],
    (err, result) => {
      if (err) {
        console.error('Error requesting donation:', err);
        res.status(500).json({ error: 'Internal Server Error. Please try again later' });
        return;
      }
      res.status(200).json({ message: 'Donation request sent successfully.' });
    }
  );
});

// router.get('/donation/requests/:emailID', (req, res) => {
//   const emailID = req.params.emailID;
//   connection.query('SELECT * FROM CharityDonations WHERE Email = ?', [emailID], (err, result) => {
//     if (err) {
//       console.error('Error fetching donation requests:', err);
//       res.status(500).json({ error: 'Internal Server Error. Please try again later' });
//       return;
//     }
//     res.status(200).json({ requests: result });
//   });
// });
router.get('/donation/requests/:emailID', (req, res) => {
  const emailID = req.params.emailID;
  const query = `
      SELECT CD.*, MD.ItemName, MD.Quantity, MD.DateandTimeOfProduction 
      FROM CharityDonations CD
      JOIN MessDonations MD ON CD.DonationId = MD.ID
      WHERE CD.Email = ?
    `;
  connection.query(query, [emailID], (err, results) => {
    if (err) {
      console.error("Error fetching donation requests:", err);
      res.status(500).json({ error: "Internal Server Error. Please try again later" });
      return;
    }
    console.log({ results })
    res.status(200).json({ results });
  });
});

module.exports = router;
