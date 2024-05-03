const express = require("express");
const router= express.Router()
const DonationLogin=require("./DonationLogin")
const DonorRegistrations=require("./DonorRegistrations");
const Upload=require('./Upload')
const View=require('./View')
const Charity=require('./Charity')
router.use('/login',DonationLogin)
router.use('/register',DonorRegistrations)
router.use('/upload',Upload)
router.use('/view',View)
router.use('/charity',Charity)
module.exports=router;