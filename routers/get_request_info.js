'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Title, Pay, Min_career, State, Client_id FROM request WHERE Id='"+Id+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.get('/get_worker_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Participant_id, State FROM work WHERE Request_id='"+Id+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.get('/get_applier_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Participant_id, State FROM apply WHERE Request_id='"+Id+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/apply', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    const State = req.body.State;
    console.log(Request_id);
    console.log(Participant_id);
    console.log(State);
    var ret = await db.getQueryResult("Insert INTO APPLY (Request_id, Participant_id, State)  VALUES ('"+Request_id+"', '"+Participant_id+"', '"+State+"')");
    console.log(ret);
    res.json({success: true});
}));
module.exports = router;
