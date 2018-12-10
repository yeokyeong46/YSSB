'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.post('/send_message', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Rid = req.body.id;
    const Value = req.body.value;
    const Sender_id = req.body.sender_id;
    console.log(Rid);
    console.log(Value);
    var queryM1 = "SELECT * FROM message WHERE Request_id ="+Rid+";"
    var resultM1 = await db.getQueryResult(queryM1);
    var num_message = Object.keys(resultM1).length+1;

    var ret = await db.getQueryResult("INSERT INTO message (Id, Request_id, Sender_id, Contents) VALUES ('"+num_message+"', '"+Rid+"', '"+Sender_id+"', '"+Value+"')");
    console.log(ret);
    res.json({success: true});
}));

router.get('/view_message/:request_id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Rid = req.params.request_id;
    var user = await db.getQueryResult("SELECT Id, Sender_id, Contents FROM message WHERE Request_id='"+Rid+"'");
    res.json(user);
}));

module.exports = router;
