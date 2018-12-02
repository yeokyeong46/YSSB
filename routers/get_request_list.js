'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult('SELECT Id, Title, Pay, Min_career, State FROM request');
  //console.log('-------------------------------');
  //console.log(JSON.stringify(user, null, 2));
	//console.log('-------------------------------');
  res.json(user);
}));

router.get('/get_offering_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, Min_career, State FROM request WHERE State='appliable'");
  //console.log('-------------------------------');
  //console.log(JSON.stringify(user, null, 2));
	//console.log('-------------------------------');
  res.json(user);
}));

module.exports = router;
