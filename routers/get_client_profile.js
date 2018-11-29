'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    console.log(Id+"!!!!!!!");
    var user = await db.getQueryResult("SELECT Id, Name, Phone, Score FROM client WHERE Id='"+Id+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.get('/get_request_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Title, State FROM request WHERE Client_id='"+Id+"'");
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

module.exports = router;
