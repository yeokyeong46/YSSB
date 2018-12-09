'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT Id, Title, Pay, Min_career, State, Client_id, DATE_FORMAT(Apply_start_date,'%Y-%m-%d') Apply_start_date, DATE_FORMAT(Apply_end_date,'%Y-%m-%d') Apply_end_date, DATE_FORMAT(Working_start_date,'%Y-%m-%d') Working_start_date, DATE_FORMAT(Working_end_date,'%Y-%m-%d') Working_end_date FROM request WHERE Id="+Id);
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/update', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const attr = req.body.attr;
    const value = req.body.value;
    console.log("ah");
    var ret = await db.getQueryResult("UPDATE request SET "+attr+"='"+value+"' WHERE Id="+Id);
    console.log("ah!!!");
    console.log(ret);
    res.json({success: true});
}));

router.post('/delete_request', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id; //get request_id
    console.log(Id);
    var ret = await db.getQueryResult("DELETE FROM request WHERE Id="+Id);
    res.json({success: true});
}));

router.get('/freelancer_apply/:Id', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.params.Id;
    const Participant_id = req.session.curr_id;//req.body.Participant_id;
    var msg = "FALSE";

    var retR = await db.getQueryResult("SELECT Id FROM request WHERE Id="+Request_id+" AND State = 'APPLIABLE';");
    console.log(retR);
    if(Object.keys(retR).length==0){ // 의뢰가 모집중이 아님: 거절
        res.send(msg);
    }
    else{
        //queryPL 언어 요건 충족되면 아무것도 출력하지 않음
        var queryPL = "WITH Temp as (SELECT R.Language FROM REQUEST_LANGUAGE_SKILL as R, FREELANCER_LANGUAGE_SKILL as F WHERE R.Request_id="+Request_id+" and F.Freelancer_id='"+Participant_id+"' and R.Language = F.Language and R.Level <= F.Level) SELECT * FROM REQUEST_LANGUAGE_SKILL as R2 LEFT JOIN Temp ON Temp.Language = R2.Language WHERE R2.Request_id = "+Request_id+" and Temp.Language is NULL;";
        var retPL = await db.getQueryResult(queryPL);

        if (Object.keys(retPL).length==0){    // 언어요건 충족 확인
            //queryCR 최소경력 충족되면 아무것도 출력하지 않음
            console.log("언어요건충족");
            var queryCR = "SELECT F.Career FROM Freelancer as F, Request as R WHERE R.Id = "+Request_id+" AND F.Id = '"+Participant_id+"' AND F.Career < R.Min_career;";
            var retCR = await db.getQueryResult(queryCR);
            if (Object.keys(retCR).length==0){ // 최소 경력 충족 확인
                console.log("최소경력충족");
                msg = "TRUE";
            }
        }
        res.send(msg);
    }
}));

router.post('/apply_request', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    // 어플라이 버튼이 보이는거면 조건이 이미 충족된 상태이므로 바로 신청 가능
    // 이전에 신청한 이력이 있는지 확인 부터 한다.
    var tmp_ret = await db.getQueryResult("SELECT State FROM apply WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
    if(Object.keys(tmp_ret).length==0)
        var ret = await db.getQueryResult("Insert INTO APPLY (Request_id, Participant_id, State)  VALUES ('"+Request_id+"', '"+Participant_id+"', 'WAITING');");
    else
        var ret = await db.getQueryResult("UPDATE APPLY set State='WAITING'");
    res.json(ret);
}));

router.get('/get_language/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT RL.Language AS Language, RL.Level AS Level, R.Client_id AS Client_id, R.State As State FROM request_language_skill RL, request R WHERE RL.Request_id="+Id+" AND R.Id="+Id);
    res.json(user);
}));

router.post('/add_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    const level = req.body.level;
    // db에 존재하는 언어이면 update, 아니면 insert
    var tmp_ret = await db.getQueryResult("SELECT Language FROM request_language_skill WHERE Request_id='"+Id+"' AND Language='"+language+"'");
    console.log(tmp_ret);
    var ret;
    if (Object.keys(tmp_ret).length==0) {
        ret = await db.getQueryResult("INSERT INTO request_language_skill(Request_id,Language,Level) VALUES('"+Id+"','"+language+"',"+level+")");
    }
    else {
        ret = await db.getQueryResult("UPDATE request_language_skill SET level="+level+" WHERE Request_id='"+Id+"' AND Language='"+language+"'");
    }
    console.log(ret);
    console.log(typeof ret);
    res.json(ret);
}));

router.post('/delete_language', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const language = req.body.language;
    var ret = await db.getQueryResult("DELETE FROM request_language_skill WHERE Request_id="+Id+" and Language='"+language+"'");
    console.log(ret);
    res.json({success: true});
}));

router.get('/get_request_file/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT RF.File_id AS File_id, R.Client_id AS Client_id, R.State AS State FROM request_file RF, request R WHERE RF.Request_id="+Id+" AND R.Id="+Id);
    res.json(user);
}));

router.post('/delete_request_file', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Id = req.body.id;
    const file_id = req.body.file_id;
    var ret = await db.getQueryResult("DELETE FROM request_file WHERE Request_id="+Id+" and File_id='"+file_id+"'");
    console.log(ret);
    res.json({success: true});
}));

router.get('/get_worker_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT A.Participant_id AS Pid, A.State AS State, R.Client_id AS Cid FROM WORK A, request R WHERE A.Request_id="+Id+" AND R.Id="+Id);
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/completed_request', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Request_id = req.body.Request_id;
  const Participant_id = req.body.Participant_id;
  const Work_state = req.body.Work_state;
  var ret = await db.getQueryResult("UPDATE WORK SET State='"+Work_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
  console.log(ret);
    res.json({success: true});
}));

router.post('/completed_accept', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    const Work_state = req.body.Work_state;

    var now =  new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth()+1)).slice(-2);
    var date = ("0" + now.getDate()).slice(-2);
    var today = year+"-"+month+"-"+date;

    //완료된 의뢰를 포트폴리오에 자동으로 저장하기
    // 포트폴리오 아이디 구하기
    var tmp_ret = await db.getQueryResult("SELECT MAX(Portfolio_id) FROM portfolio WHERE Freelancer_id='"+Participant_id+"'");
    const max = tmp_ret[0]['MAX(Portfolio_id)'];
    var portfolio_id=1;
    if (max!=null)
        portfolio_id = max+1;
    var ret3 =await db.getQueryResult("INSERT INTO PORTFOLIO (Freelancer_id, Portfolio_id, Type, Internal_request_id) VALUES ('"+Participant_id+"','"+portfolio_id+"',0,"+Request_id+")");

    var ret = await db.getQueryResult("UPDATE WORK SET State='"+Work_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
    var ret2 = await db.getQueryResult("UPDATE REQUEST SET Working_end_date='"+today+"' ,State='"+Work_state+"' WHERE Id="+Request_id);
    console.log(ret);
    res.json({success: true});
}));

router.post('/completed_reject', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Request_id = req.body.Request_id;
  const Participant_id = req.body.Participant_id;
  const Work_state = req.body.Work_state;

  var now =  new Date();
  var year = now.getFullYear();
  var month = ("0" + (now.getMonth()+1)).slice(-2);
  var date = ("0" + now.getDate()).slice(-2);
  var today = year+"-"+month+"-"+date;

  var ret = await db.getQueryResult("UPDATE WORK SET State='"+Work_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
  var ret2 = await db.getQueryResult("INSERT INTO rejected_submit(Request_id, Participant_id, Date) VALUES ("+Request_id+",'"+Participant_id+"','"+today+"')");
  console.log(ret);
  console.log(ret);
  res.json({success: true});
}));

router.get('/get_applier_list/:Id', wrapper.asyncMiddleware(async (req, res, next) => {
    var Id = req.params.Id;
    var user = await db.getQueryResult("SELECT A.Participant_id AS Pid, A.State AS State, R.Client_id AS Cid FROM apply A, request R WHERE A.Request_id="+Id+" AND A.State='WAITING' AND R.Id="+Id);
    //console.log('-------------------------------');
    //console.log(JSON.stringify(user, null, 2));
        //console.log('-------------------------------');
    res.json(user);
}));

router.post('/accept_request', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    const Apply_state = req.body.Apply_state;
    const Work_state = req.body.Work_state;

    var now =  new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth()+1)).slice(-2);
    var date = ("0" + now.getDate()).slice(-2);
    var today = year+"-"+month+"-"+date;

    var ret = await db.getQueryResult("UPDATE APPLY SET State='"+Apply_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
    var ret2 = await db.getQueryResult("INSERT into WORK (Request_id, Participant_id, State) VALUES ('"+Request_id+"', '"+Participant_id+"', '"+Work_state+"')");
    var ret3 = await db.getQueryResult("UPDATE request SET Working_start_date='"+today+"', State='"+Work_state+"' WHERE Id="+Request_id);
    console.log(ret);
    console.log(ret2);
    res.json({success: true});
}));

router.post('/reject_request', wrapper.asyncMiddleware(async (req, res, next) =>{
  const Request_id = req.body.Request_id;
  const Participant_id = req.body.Participant_id;
  const Apply_state = req.body.Apply_state;
  var ret = await db.getQueryResult("UPDATE APPLY SET State='"+Apply_state+"' WHERE Request_id="+Request_id+" AND Participant_id='"+Participant_id+"'");
  console.log(ret);
    res.json({success: true});
}));

router.post('/rate_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Rid = req.body.Rid;
    const Pid = req.body.Pid;
    const Rate = req.body.Rate;
    var ret2 = await db.getQueryResult("UPDATE request SET Pscore="+Rate+" WHERE Id="+Rid);
    var new_rate = await db.getQueryResult("SELECT AVG(Pscore) FROM request WHERE Id in (SELECT Request_id FROM work WHERE State='COMPLETED' AND Participant_id='"+Pid+"')");
    const Nrate = new_rate[0]['AVG(Pscore)'];
    var ret = await db.getQueryResult("UPDATE freelancer SET Score="+Nrate+" WHERE Id='"+Pid+"'");
    console.log(ret);
    res.json(ret);
}));

router.post('/rate_client', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Rid = req.body.Rid;
    const Cid = req.body.Cid;
    const Rate = req.body.Rate;
    var ret2 = await db.getQueryResult("UPDATE request SET Cscore="+Rate+" WHERE Id="+Rid);
    var new_rate = await db.getQueryResult("SELECT AVG(Cscore) FROM request WHERE State='COMPLETED' AND Client_id='"+Cid+"'");
    const Nrate = new_rate[0]['AVG(Cscore)'];
    var ret = await db.getQueryResult("UPDATE client SET Score="+Nrate+" WHERE Id='"+Cid+"'");
    console.log(ret);
    res.json(ret);
}));

router.post('/apply', wrapper.asyncMiddleware(async (req, res, next) =>{
    const Request_id = req.body.Request_id;
    const Participant_id = req.body.Participant_id;
    const State = req.body.State;
    console.log(Request_id);
    console.log(Participant_id);
    console.log(State);
    var ret = await db.getQueryResult("Insert INTO APPLY (Request_id, Participant_id, State)  VALUES ('"+Request_id+"', '"+Participant_id+"', '"+State+"')");
    var ret2 = await db.getQueryResult("UPDATE request SET State='WORKING' WHERE Id="+Request_id);
    console.log(ret);
    res.json({success: true});
}));
module.exports = router;
