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

router.post('/send_message', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Rid = req.body.id;
    const Value = req.body.value;
    console.log(Rid);
    console.log(Value);
    var queryM1 = "SELECT * FROM message WHERE Request_id ='"+Rid+"';"
    var resultM1 = await db.getQueryResult(queryM1);
    var num_message = Object.keys(resultM1).length+1;

    var ret = await db.getQueryResult("INSERT INTO message (Id, Request_id, Participant_id, Contents) VALUES ('"+num_message+"', '"+Rid+"', '201', '"+Value+"')");
    console.log(ret);
    res.json({success: true});
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
