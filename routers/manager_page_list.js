'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/get_client_list', wrapper.asyncMiddleware(async (req, res, next) => {
  const user = await db.getQueryResult('SELECT Id, Name, Phone, Score FROM client');
  res.json(user);
}));

router.get('/get_freelancer_list', wrapper.asyncMiddleware(async (req, res, next) => {
    const user = await db.getQueryResult('SELECT Id, Name, Age, Career, Major, Phone, Score FROM freelancer');
    res.json(user);
  }));

router.post('/delete_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    var ret = await db.getQueryResult("DELETE FROM FREELANCER WHERE ID='"+Id+"' AND ID NOT IN (SELECT DISTINCT Participant_id FROM WORK WHERE State!='COMPLETED')");
    //console.log(ret);
    res.json(ret);
}));

router.post('/delete_client', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Id = req.body.id;
  var ret = await db.getQueryResult("DELETE FROM CLIENT WHERE Id NOT IN (SELECT DISTINCT Client_id FROM REQUEST WHERE STATE='WORKING') AND Id='"+Id+"'");
  //console.log(ret);
  res.json(ret);
}));

module.exports = router;
