const express = require("express");
const router = express.Router();
const connection = require("./Connection");
const mySql2 = require("mysql2/promise")
const connection2 = mySql2.createPool({
    host: "localhost",
    user: "root",
    password: "Kamal@7989",
    database: "uohhelphub"
})
router.post('/supervisor/', (req, res) => {
    const { emailID, userType } = req.body;
    connection.query("select * from MessDonations where messname=?", [emailID], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }

        // console.log("Data inserted successfully into database");
        res.status(200).json({ result });
    });
});
router.post('/student/', (req, res) => {
    const { emailID, userType } = req.body;
    connection.query("select * from MessDonations where studentID=?", [emailID], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }
        // console.log(result);
        res.status(200).json({ result });
    });
});
router.get('/:donationId/requests', (req, res) => {
    const donationId = req.params.donationId;
    const query = `
      SELECT CD.*, CO.Name AS OrganisationName, CO.Email AS OrganisationEmail
      FROM CharityDonations CD
      JOIN CharityOrganisations CO ON CD.Email = CO.Email
      WHERE DonationId = ${donationId};
    `;
    console.log(donationId)
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error("Error fetching charity requests:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }
        // console.log(results)
        res.status(200).json({ results });
    });
});
router.post('/accept-request/:requestId', async (req, res) => {
    const { requestId } = req.params;
    const {id}=req.body;
    // connection.query(`UPDATE CharityDonations SET RequestStatus = 'accepted' WHERE ID = ?`, [requestId], (err, results) => {
    //     if (err) {
    //         console.error("Error fetching charity requests:", err);
    //         res.status(500).json({ error: "Internal Server Error. Please try again later" });
    //         return;
    //     }
    // res.status(200).json({ success: true });
    //     // console.log(results)

    // });
    const connection3 = await connection2.getConnection();
    try {
        await connection3.beginTransaction();
        await connection3.query(`UPDATE CharityDonations SET RequestStatus = 'accepted' WHERE ID = ?`, [requestId])
        // await connection.query(``)

        const [donationResult] = await connection3.query(`SELECT DonationId, QuantityRequested FROM CharityDonations WHERE ID = ?`, [requestId]);
        const donationId = donationResult[0].DonationId;
        const requestedQuantity = donationResult[0].QuantityRequested;

        const [remainingResult] = await connection3.query(`SELECT RemainingQuantity FROM MessDonations WHERE ID = ?`, [id]);
        console.log(remainingResult,id)
        const currentRemainingQuantity = remainingResult[0].RemainingQuantity;

        const newRemainingQuantity = currentRemainingQuantity - requestedQuantity;

        await connection3.query(`UPDATE MessDonations SET RemainingQuantity = ? WHERE ID = ?`, [newRemainingQuantity, donationId]);
        await connection3.commit();
        res.status(200).json({ success: true });
    } catch (error) {
        await connection3.rollback();
        console.error('Transaction rolled back due to error:', error);
    } finally {
        await connection3.release();
    }
});

router.post('/deny-request/:requestId', (req, res) => {
    const { requestId } = req.params;
    connection.query(`UPDATE CharityDonations SET RequestStatus = 'rejected' WHERE ID = ?`, [requestId], (err, results) => {
        if (err) {
            console.error("Error fetching charity requests:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }
        // console.log(results)
        res.status(200).json({ success: true });
    });
});
router.post('/delete/:donationId', (req, res) => {
    const { donationId } = req.params;
    connection.query(`delete from MessDonations where ID=?`, [donationId], (err, results) => {
        if (err) {
            console.error("Error fetching charity requests:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }
        res.status(200).json({ success: true });
    });
});
module.exports = router