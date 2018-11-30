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
    var user = await db.getQueryResult("SELECT Portfolio_id, Type, Internal_request_id, External_file FROM portfolio WHERE Freelancer_id='"+Id+"'");
    res.json(user);
}));

router.get('/get_work_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Request_id, State FROM work WHERE Participant_id='"+Id+"'");
    res.json(user);
}));

router.get('/get_apply_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Request_id, State FROM apply WHERE Participant_id='"+Id+"'");
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
    res.json({success: true});
}));

router.post('/add_portfolio', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const title = req.body.title;
    const portfolio_id = req.body.num;
    var ret = await db.getQueryResult("INSERT INTO portfolio(Freelancer_id,Portfolio_id,Type,External_file) VALUES('"+Id+"',"+portfolio_id+",1,'"+title+"')");
    res.json({success: true});
}));

router.post('/add_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    const level = req.body.level;
    console.log("---add language---");
    console.log(Id);
    console.log(language);
    console.log(level);
    console.log("------------------");
    var ret = await db.getQueryResult("INSERT INTO freelancer_language_skill(Freelancer_id,Language,Level) VALUES('"+Id+"','"+language+"',"+level+")");
    res.json({success: true});
}));

router.post('/delete_portfolio', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const portfolio_id = req.body.portfolio_id;
    var ret = await db.getQueryResult("DELETE FROM portfolio WHERE Freelancer_id='"+Id+"' and Portfolio_id='"+portfolio_id+"'");
    res.json({success: true});
}));

router.post('/delete_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    var ret = await db.getQueryResult("DELETE FROM freelancer_language_skill WHERE Freelancer_id='"+Id+"' and Language='"+language+"'");
    res.json({success: true});
}));


module.exports = router;
