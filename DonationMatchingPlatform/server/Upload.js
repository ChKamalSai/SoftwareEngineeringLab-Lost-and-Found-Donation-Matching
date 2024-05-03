const express = require("express");
const router = express.Router()
const connection = require("./Connection")
router.post('/supervisor/', (req, res) => {
    const { email, itemName, quantityType, quantity, date } = req.body;
    const date1 = new Date(date);
    // console.l?\og(email);
    const formattedDatetime = `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')} ${date1.getHours().toString().padStart(2, '0')}:${date1.getMinutes().toString().padStart(2, '0')}:${date1.getSeconds().toString().padStart(2, '0')}`;
    connection.query("INSERT INTO MessDonations ( ItemName,Quantity,QuantityType,DateAndTimeOfProduction,Messname,RemainingQuantity) VALUES (?, ?, ?, ?, ?,?)", [itemName, quantity, quantityType, formattedDatetime, email, quantity], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }
        console.log("Data inserted successfully into database");
        res.status(200).json({ success: "Data uploaded successfully" });
    });
});
router.post('/student/', (req, res) => {
    const { email, itemName, quantityType, quantity, date } = req.body;
    const date1 = new Date(date);
    // console.log(email);
    const formattedDatetime = `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')} ${date1.getHours().toString().padStart(2, '0')}:${date1.getMinutes().toString().padStart(2, '0')}:${date1.getSeconds().toString().padStart(2, '0')}`;
    connection.query("INSERT INTO MessDonations ( ItemName,Quantity,QuantityType,DateAndTimeOfProduction,StudentID,RemainingQuantity) VALUES (?, ?, ?, ?, ?, ?)", [itemName, quantity, quantityType, formattedDatetime, email, quantity], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).json({ error: "Internal Server Error. Please try again later" });
            return;
        }
        console.log("Data inserted successfully into database");
        res.status(200).json({ success: "Data uploaded successfully" });
    });
});
module.exports = router