'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    console.log("hi");
    var user = await db.getQueryResult("SELECT Id, Title, Pay, Min_career, State, Client_id FROM request WHERE Id="+Id);
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/delete_request', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id; //get request_id
    console.log(Id);
    var ret = await db.getQueryResult("DELETE FROM request WHERE Id="+Id);
    res.json({success: true});
}));

router.get('/get_worker_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT A.Participant_id AS Pid, A.State AS State, R.Client_id AS Cid FROM WORK A, request R WHERE A.Request_id="+Id+" AND R.Id="+Id);
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/completed_request', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Request_id = req.body.Request_id;
  const Participant_id = req.body.Participant_id;
  const Work_state = req.body.Work_state;
  var ret = await db.getQueryResult("UPDATE WORK SET State='"+Work_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
  console.log(ret);
    res.json({success: true});
}));

router.get('/get_applier_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT A.Participant_id AS Pid, A.State AS State, R.Client_id AS Cid FROM apply A, request R WHERE A.Request_id="+Id+" AND A.State='WAITING' AND R.Id="+Id);
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/accept_request', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    const Apply_state = req.body.Apply_state;
    const Work_state = req.body.Work_state;
    var ret = await db.getQueryResult("UPDATE APPLY SET State='"+Apply_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
    var ret2 = await db.getQueryResult("INSERT into WORK (Request_id, Participant_id, State) VALUES ('"+Request_id+"', '"+Participant_id+"', '"+Work_state+"')");
    console.log(ret);
    console.log(ret2);
    res.json({success: true});
}));

router.post('/reject_request', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Request_id = req.body.Request_id;
  const Participant_id = req.body.Participant_id;
  const Apply_state = req.body.Apply_state;
  var ret = await db.getQueryResult("UPDATE APPLY SET State='"+Apply_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
  console.log(ret);
    res.json({success: true});
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
