'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    console.log("hi");
    var user = await db.getQueryResult("SELECT Id, Title, Pay, Min_career, State, Client_id, DATE_FORMAT(Apply_start_date,'%Y-%m-%d') Apply_start_date, DATE_FORMAT(Apply_end_date,'%Y-%m-%d') Apply_end_date, DATE_FORMAT(Working_start_date,'%Y-%m-%d') Working_start_date, DATE_FORMAT(Working_end_date,'%Y-%m-%d') Working_end_date FROM request WHERE Id="+Id);
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

router.get('/get_language/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Language, Level FROM request_language_skill WHERE request_id='"+Id+"'");
    res.json(user);
}));

router.post('/delete_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    var ret = await db.getQueryResult("DELETE FROM request_language_skill WHERE Request_id='"+Id+"' and Language='"+language+"'");
    console.log(ret);
    res.json({success: true});
}));

router.get('/get_request_file/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT File_id FROM REQUEST_FILE WHERE Request_id = "+Id);
    res.json(user);
}));

router.post('/delete_request_file', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const file_id = req.body.file_id;
    var ret = await db.getQueryResult("DELETE FROM request_file WHERE Request_id="+Id+" and File_id='"+file_id+"'");
    console.log(ret);
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

router.post('/completed_accept', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Request_id = req.body.Request_id;
  const Participant_id = req.body.Participant_id;
  const Work_state = req.body.Work_state;
  var ret = await db.getQueryResult("UPDATE WORK SET State='"+Work_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
  console.log(ret);
    res.json({success: true});
}));

router.post('/completed_reject', wrapper.asyncMiddleware(async (req, res, next) =>{
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

router.post('/rate_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Rid = req.body.Rid;
    const Pid = req.body.Pid;
    const Rate = req.body.Rate;
    var ret2 = await db.getQueryResult("UPDATE request SET Pscore="+Rate+" WHERE Id="+Rid);
    var new_rate = await db.getQueryResult("SELECT AVG(Pscore) FROM request WHERE Id in (SELECT Request_id FROM work WHERE State='COMPLETED' AND Participant_id='"+Pid+"')");
    const Nrate = new_rate[0]['AVG(Pscore)'];
    var ret = await db.getQueryResult("UPDATE freelancer SET Score="+Nrate+" WHERE Id='"+Pid+"'");
    console.log(ret);
    res.json(ret);
}));

router.post('/rate_client', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Rid = req.body.Rid;
    const Cid = req.body.Cid;
    const Rate = req.body.Rate;
    var ret2 = await db.getQueryResult("UPDATE request SET Cscore="+Rate+" WHERE Id="+Rid);
    var new_rate = await db.getQueryResult("SELECT AVG(Cscore) FROM request WHERE Id in (SELECT Request_id FROM work WHERE State='COMPLETED' AND Client_id='"+Cid+"')");
    const Nrate = new_rate[0]['AVG(Cscore)'];
    var ret = await db.getQueryResult("UPDATE client SET Score="+Nrate+" WHERE Id='"+Cid+"'");
    console.log(ret);
    res.json(ret);
}));

router.post('/apply', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    const State = req.body.State;
    console.log(Request_id);
    console.log(Participant_id);
    console.log(State);
    var ret = await db.getQueryResult("Insert INTO APPLY (Request_id, Participant_id, State)  VALUES ('"+Request_id+"', '"+Participant_id+"', '"+State+"')");
    var ret2 = await db.getQueryResult("UPDATE request SET State='WORKING' WHERE Id="+Request_id);
    console.log(ret);
    res.json({success: true});
}));
module.exports = router;
