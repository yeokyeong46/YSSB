'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/get_profile/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Name, Age, Career, Major, Phone, Score FROM freelancer WHERE Id='"+Id+"'");
    res.json(user);
}));

router.get('/get_portfolio/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("(SELECT Portfolio_id, Type, Title, Internal_request_id FROM PORTFOLIO, REQUEST WHERE Freelancer_id = '"+Id+"' AND Internal_request_id=Id) UNION (SELECT Portfolio_id, Type, External_file, Internal_request_id FROM PORTFOLIO WHERE Freelancer_id = '"+Id+"' AND Type=1) ORDER BY Portfolio_id");
    res.json(user);
}));

router.get('/get_work_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Request_id, WORK.State, Title FROM WORK, REQUEST WHERE Participant_id='"+Id+"' AND WORK.state != 'COMPLETED' AND Request_id=Id");
    res.json(user);
}));

router.get('/get_apply_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Request_id, APPLY.State, Title FROM APPLY, REQUEST  WHERE Participant_id='"+Id+"' AND Request_id=Id");
    res.json(user);
}));

router.get('/get_rejected_submit_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT RS.Id, RS.Request_id, DATE_FORMAT(RS.Date,'%Y-%m-%d') Date, R.Title FROM REJECTED_SUBMIT AS RS, REQUEST AS R WHERE RS.Participant_id='"+Id+"' AND RS.Request_id=R.Id");
    res.json(user);
}));

router.get('/get_language/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Language, Level FROM freelancer_language_skill WHERE Freelancer_id='"+Id+"'");
    res.json(user);
}));

router.post('/update', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const attr = req.body.attr;
    const value = req.body.value;
    var ret = await db.getQueryResult("UPDATE freelancer SET "+attr+"='"+value+"' WHERE Id='"+Id+"'");
    console.log(ret);
    res.json({success: true});
}));

router.post('/add_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    const level = req.body.level;
    // db에 존재하는 언어이면 update, 아니면 insert
    var tmp_ret = await db.getQueryResult("SELECT Language FROM freelancer_language_skill WHERE Freelancer_id='"+Id+"' AND Language='"+language+"'");
    console.log(tmp_ret);
    var ret;
    if (Object.keys(tmp_ret).length==0) {
        ret = await db.getQueryResult("INSERT INTO freelancer_language_skill(Freelancer_id,Language,Level) VALUES('"+Id+"','"+language+"',"+level+")");
    }
    else {
        ret = await db.getQueryResult("UPDATE freelancer_language_skill SET level="+level+" WHERE Freelancer_id='"+Id+"' AND Language='"+language+"'");
    }
    console.log(ret);
    console.log(typeof ret);
    res.json(ret);
}));

router.post('/delete_portfolio', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const portfolio_id = req.body.portfolio_id;
    var ret = await db.getQueryResult("DELETE FROM portfolio WHERE Freelancer_id='"+Id+"' and Portfolio_id='"+portfolio_id+"'");
    console.log(ret);
    res.json({success: true});
}));

router.post('/delete_rejected_submit', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.rejected_submit_id;
    var ret = await db.getQueryResult("DELETE FROM rejected_submit WHERE Id="+Id);
    console.log(ret);
    res.json({success: true});
}));

router.post('/delete_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    var ret = await db.getQueryResult("DELETE FROM freelancer_language_skill WHERE Freelancer_id='"+Id+"' and Language='"+language+"'");
    console.log(ret);
    res.json({success: true});
}));


module.exports = router;
