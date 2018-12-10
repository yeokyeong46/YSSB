'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const config = require('../config');

router.get('/get_profile/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Name, Phone, Score FROM client WHERE Id='"+Id+"'");
    res.json(user);
}));

router.get('/get_request_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Title, State FROM request WHERE Client_id='"+Id+"'");
    res.json(user);
}));

router.get('/get_request_list_pay/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Title, State FROM request WHERE Client_id='"+Id+"' AND State='WORKING' ORDER BY Pay DESC");
    res.json(user);
}));

router.get('/get_request_list_date/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Title, State FROM request WHERE Client_id='"+Id+"' AND State='WORKING' ORDER BY Working_start_date ASC");
    res.json(user);
}));

router.post('/update', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const attr = req.body.attr;
    const value = req.body.value;
    if (attr!="Password")
        var ret = await db.getQueryResult("UPDATE client SET "+attr+"='"+value+"' WHERE Id='"+Id+"'");
    else
        var ret = await db.getQueryResult("UPDATE client SET Password=SHA2('"+value+"', "+config.db_config.length+") WHERE Id='"+Id+"'");
    //console.log(ret);
    res.json({success: true});
}));



module.exports = router;
