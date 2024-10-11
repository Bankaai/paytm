const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const AccountRouter = require('./accounts');




// /api/v1/user

router.use('/user',userRouter);
router.use('/accounts', AccountRouter);

module.exports = router;