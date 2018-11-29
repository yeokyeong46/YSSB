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

module.exports = router;
