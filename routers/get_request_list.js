'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Apply_start_date,'%Y-%m-%d') Apply_start_date, DATE_FORMAT(Working_start_date,'%Y-%m-%d') Working_start_date, Min_career, State FROM request");
  res.json(user);
}));

router.get('/get_offering_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Apply_start_date,'%Y-%m-%d') Apply_start_date, Min_career, State FROM request WHERE State='APPLIABLE'");
  res.json(user);
}));

router.get('/get_offering_early_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Apply_start_date,'%Y-%m-%d') Apply_start_date, Min_career, State FROM request WHERE State='APPLIABLE' ORDER BY Apply_start_date");
  res.json(user);
}));

router.get('/get_offering_pricy_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Apply_start_date,'%Y-%m-%d') Apply_start_date, Min_career, State FROM request WHERE State='APPLIABLE' ORDER BY Pay");
  res.json(user);
}));

router.get('/get_working_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Working_start_date,'%Y-%m-%d') Working_start_date, Min_career, State FROM request WHERE State='WORKING'");
  res.json(user);
}));

router.get('/get_working_early_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Working_start_date,'%Y-%m-%d') Working_start_date, Min_career, State FROM request WHERE State='WORKING' ORDER BY Working_start_date");
  res.json(user);
}));

router.get('/get_working_pricy_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user = await db.getQueryResult("SELECT Id, Title, Pay, DATE_FORMAT(Working_start_date,'%Y-%m-%d') Working_start_date, Min_career, State FROM request WHERE State='WORKING' ORDER BY Pay");
  res.json(user);
}));

module.exports = router;
