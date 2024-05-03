const express = require("express");
const router = express.Router()
const connection = require("./Connection")

router.post('/charity/', (req, res) => {
    const { organizationName, email, address, contactDetails, googleMapLink, password } = req.body;
    connection.query("select * from CharityOrganisations where email=?", [email], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "unkown error occured, please try after some time" });
        }
        else if (result.length != 0) {
            return res.status(200).json({ failure: "Email already registered" });
            // return callback(null, "Email already registered");
        }
        connection.query("select * from CharityOrganisations where mobile=?", [contactDetails], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ error: "unkown error occured, please try after some time" });
            }
            else if (result.length != 0) {
                return res.status(200).json({ failure: "Mobile number already exists" });
                // return callback(null, "Mobile number already exists");
            }
            connection.query("INSERT INTO CharityOrganisations VALUES (?, ?, ?, ?, ?, ?,'accepted')",
                [organizationName, email, address, contactDetails, googleMapLink, password], (err, result) => {
                    if (err) {
                        console.error("Error registering charity organisation", err);
                        return res.status(500).json({ error: "unkown error occured, please try after some time" });
                        // return callback(err, "unkown error occured, please try after some time");
                    }
                    // console.log("Charity organisation registered successfully");
                    return res.status(200).json({ success: "Charity organisation registered successfully" });
                });
        })
    })
})
router.post('/supervisor/', (req, res) => {
    const { name, email, phoneNumber, id, supervisingMess, password } = req.body;
    connection.query("SELECT * FROM Supervisors WHERE email=?", [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "unkown error occured, please try after some time" });
        }
        else if (result.length != 0) {
            return res.status(200).json({ failure: "Email already registered" });
        }
        connection.query("SELECT * FROM Supervisors WHERE phoneNumber=?", [phoneNumber], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "unkown error occured, please try after some time" });
            }
            else if (result.length != 0) {
                return res.status(200).json({ failure: "Mobile number already exists" });
            }
            connection.query("INSERT INTO Supervisors (name, email, phoneNumber, id, supervisingMess, password) VALUES (?, ?, ?, ?, ?, ?)",
                [name, email, phoneNumber, id, supervisingMess, password], (err, result) => {
                    if (err) {
                        console.error("Error registering supervisor", err);
                        return res.status(500).json({ error: "unkown error occured, please try after some time" });
                    }
                    console.log("Supervisor registered successfully");
                    return res.status(200).json({ success: "Supervisor registered successfully" });
                });
        });
    });
})
router.post('/student/', (req, res) => {
    const { email,
        organizingGroup,
        proofsOfOrganizingEvent,
        contactDetails,
        date,
        location,
        password } = req.body;
        const date1 = new Date(date);

const formattedDatetime = `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')} ${date1.getHours().toString().padStart(2, '0')}:${date1.getMinutes().toString().padStart(2, '0')}:${date1.getSeconds().toString().padStart(2, '0')}`;
connection.query("select * from Students where email=?", [email], (err, result) => {
    if (err) {
        console.log(err)
        return res.status(500).json({ error: "unkown error occured, please try after some time" });
    }
    else if (result.length != 0) {
        return res.status(200).json({ result: "Email already exists" });
        // return callback(null, "Mobile number already exists");
    }
    connection.query("INSERT INTO Students (email, organizingGroup, proofsOfOrganizingEvent, contactDetails, dateAndTime, location, password,Access) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [email, organizingGroup, proofsOfOrganizingEvent, contactDetails, formattedDatetime, location, password,'accepted'], (err, result) => {
            if (err) {
                console.error("Error registering student", err);
                return res.status(500).json({ error: "unkown error occured, please try after some time" });
            }
            console.log("Student registered successfully");
            return res.status(200).json({ result: true });
        });

    })


    })
module.exports = router