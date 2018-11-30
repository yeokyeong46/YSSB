'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/get_client_list', wrapper.asyncMiddleware(async (req, res, next) => {
  const user = await db.getQueryResult('SELECT Id, Name, Phone, Score FROM client');
  //console.log('-------------------------------');
  //console.log(JSON.stringify(user, null, 2));
	//console.log('-------------------------------');
  res.json(user);
}));

router.get('/get_freelancer_list', wrapper.asyncMiddleware(async (req, res, next) => {
    const user = await db.getQueryResult('SELECT Id, Name, Age, Career, Major, Phone, Score FROM freelancer');
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
    //console.log('-------------------------------');
    res.json(user);
  }));

router.post('/delete_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    console.log(Id);
    var ret = await db.getQueryResult("DELETE FROM freelancer WHERE Id='"+Id+"'");
    console.log(ret);
    res.json({success: true});
}));

router.post('/delete_client', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Id = req.body.id;
  console.log(Id);
  var ret = await db.getQueryResult("DELETE FROM client WHERE Id='"+Id+"'");
  console.log(ret);
  res.json({success: true});
}));

module.exports = router;
