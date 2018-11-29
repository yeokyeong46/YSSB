'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const user = await db.getQueryResult('SELECT Id, Name FROM client');
  //console.log('-------------------------------');
  //console.log(JSON.stringify(user, null, 2));
	//console.log('-------------------------------');
  res.json(user);
}));

router.post('/insert', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newId = req.body.id;
  const newPw = req.body.pw;
  const newName = req.body.name;
  const newPhone = req.body.phone;

  console.log(await db.getQueryResult(`INSERT INTO Client (Id, Password, Name, Phone) values ('${newId}', '${newPw}', '${newName}', '${newPhone}')`));
  res.json({success: true});
}));

module.exports = router;
