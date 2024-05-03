const express = require("express");
const router = express.Router()
const bodyParser=require("body-parser")
const connection = require("./Connection")
// router.use(bodyParser.json())
router.post('/charity/', (req, res) => {
    const {emailID, password} = req.body
    console.log("select * from CharityOrganisations where email=? and password=? and access='accepted'", [emailID, password])
    connection.query("select * from CharityOrganisations where email=? and password=? and access='accepted'", [emailID, password], (err, result) => {
        if (err) {
            console.log('charity login error')
            return res.status(500).json({ error: "an error occured" })
        }
        if (result.length === 1) {
            return res.status(200).json({ success: true })
        }
        return res.status(200).json({ success: false })
    })
})
router.post('/supervisor/', (req, res) => {
    const {emailID, password} = req.body
    connection.query("select * from Mess where Messname=? and password=? ", [emailID, password], (err, result) => {
        if (err) {
            console.log('Mess login error')
            return res.status(500).json({ error: "an error occured" })
        }
        if (result.length === 1) {
            return res.status(200).json({ success: true});
        }
        return res.status(200).json({ success: false})
    })
})
router.post('/student/', (req, res) => {
    const {emailID, password} = req.body
    connection.query("select * from Students where email=? and password=? and access='accepted'", [emailID, password], (err, result) => {
        if (err) {
            console.log('Student login error')
            return res.status(500).json({ error: "an error occured" })
        }
        console.log({result})
        if (result.length === 1) {
            return res.status(200).json({ success: true});
        }
        return res.status(200).json({ success: false})
    })
})
module.exports=router;