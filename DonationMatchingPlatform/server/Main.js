const express = require("express");
const router = express.Router()
const bodyParser = require("body-parser");
const connection = require("./Connection")
const forward = require("./ForwardDonation");
const app = express()
app.use(bodyParser.json());
app.use('/donation', forward)
// app.post('/donation/login/charity/', (req, res) => {
//     const { emailID, password } = req.body;
//     connection.query("select * from donors ", (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "an error occured" })
//         }
//         for (i = 0; i < result.length; i++) {
//             const row = result[i];
//             console.log(row)
//             if (result[i].name === emailID && result[i].password === password) {
//                 return res.status(200).json({ success: "successfully logged in" })
//             }
//         }
//         return res.status(200).json({ failure: "invalid details" })
//     })
// })
// app.post('/donation/register/charity', (req, res) => {
//     const { organizationName, email, address, contactDetails, googleMapLink, password } = req.body;
//     CharityRegistration(organizationName, email, address, contactDetails, googleMapLink, password, (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: result });
//         }
//         return res.status(200).json({ result });
//     })
// })
// app.post('/supervisor/register', (req, res) => {
//     const { name, email, phoneNumber, id, supervisingMess, password } = req.body;
//     SupervisorRegistration(name, email, phoneNumber, id, supervisingMess, password, (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: result });
//         }
//         return res.status(200).json({ result});
//     })
// })
// app.post('/student/register', (req, res) => {
//     const { studentName, organizingGroup, proofsOfOrganizingEvent, contactDetails, dateOfEvent, time, location, password } = req.body;
//     StudentRegistration(studentName, organizingGroup, proofsOfOrganizingEvent, contactDetails, dateOfEvent, time, location, password, (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: result });
//         }
//         return res.status(200).json({ success: true });
//     });
// });
app.listen(9090, () => {
    console.log("server is listening on port 9090");
})