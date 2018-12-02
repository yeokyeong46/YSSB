'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/view_message_info/:request_id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Rid = req.params.request_id;
    var user = await db.getQueryResult("SELECT Request_id, Participant_id FROM message WHERE Request_id='"+Rid+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.get('/view_message/:request_id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Rid = req.params.request_id;
    var user = await db.getQueryResult("SELECT Id, Contents FROM message WHERE Request_id='"+Rid+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

module.exports = router;
