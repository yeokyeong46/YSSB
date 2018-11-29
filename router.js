'use strict';
const express = require('express');
const router = express.Router();

const index = require('./routers/index');

const manager_page_list = require('./routers/manager_page_list');
const get_client_profile =require('./routers/get_client_profile');
const get_freelancer_profile =require('./routers/get_freelancer_profile');

router.use('/', index);

router.use('/manager_page_list', manager_page_list);
router.use('/get_client_profile', get_client_profile);
router.use('/get_freelancer_profile', get_freelancer_profile);

module.exports = router;