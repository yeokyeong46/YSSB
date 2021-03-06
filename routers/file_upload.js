'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const config = require('../config');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// disk storage

// 의뢰 작성하면서 의뢰 스펙 첨부
var count = 0;
const storage_spec_from_write = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/req_spec');
  },
  filename: wrapper.asyncMiddleware(async (req, file, cb) => {
    var now =  new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth()+1)).slice(-2);
    var date = ("0" + now.getDate()).slice(-2);
    var today = year+"-"+month+"-"+date;

    var id = req.session.curr_id;
    var title = req.body.write_title;
    var pay = req.body.write_pay;
    var end = req.body.write_end;
    var min_career = req.body.write_min_career;
    var lng = req.body.write_lng;
    var skill = req.body.write_skill;

    if(count == 0){
      // 리퀘스트 insert
      var queryR = "INSERT INTO REQUEST (Client_id, Title, Pay, Apply_start_date, Apply_end_date, Min_career) VALUES ('"+id+"', '"+title+"', '"+pay+"', '"+today+"', '"+end+"', '"+min_career+"');"
      var resultR = await db.getQueryResult(queryR);
    }

    // 리퀘스트 id 가져오기
    var queryI = "SELECT MAX(Id) FROM REQUEST;";
    var resultI = await db.getQueryResult(queryI);
    var reqId = Object.values(resultI)[0]['MAX(Id)'];
    
    if(count == 0){
      if(skill != undefined){ // pl 조건이 있다면
        // 리퀘스트 pl 조건 insert
        var queryL = [];
        var queryLC = [];
        for(var i=0; i<skill.length; i++){
          if(skill[i]==undefined) // this if for the deleted object
            continue;
          queryL.push("INSERT INTO REQUEST_LANGUAGE_SKILL (Request_id, Language, Level) VALUES ('"+reqId+"', '"+lng[i]+"', '"+skill[i]+"');");
          queryLC.push("SELECT * FROM REQUEST_LANGUAGE_SKILL WHERE Request_id='"+reqId+"' and Language='"+lng[i]+"';");
        }
        for(var i=0; i<queryL.length; i++){
          var resultLC = await db.getQueryResult(queryLC[i]);
          if(Object.keys(resultLC).length > 0){ // 이미 이 언어에 대한 level이 존재하므로 스킵 for 같은 언어 중복 상황에 대한 핸들링
            continue;
          }
          await db.getQueryResult(queryL[i]);
        }
      }
    }
    
    // 리퀘스트 스펙 문서 insert
    var queryRF = "INSERT INTO REQUEST_FILE (Request_id, File_id) VALUES ('"+reqId+"', '"+file.originalname+"');";
    var resultRF = await db.getQueryResult(queryRF);

    count = count+1;
    if(count == req.body.write_file_num){
      count = 0;
    }

    cb(null, reqId+'_'+file.originalname);
  })
});

// 회원가입시 포트폴리오 첨부
const storage_ptf_from_signup = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/portfolio');
  },
  filename: wrapper.asyncMiddleware(async (req, file, cb) => {
    var id = req.body.signup_id;
    var pwd = req.body.signup_pwd;
    var name = req.body.signup_name;
    var age = req.body.signup_age;
    var career = req.body.signup_career;
    var major = req.body.signup_major;
    var phone = req.body.signup_phone;
    var lng = req.body.signup_lng;
    var skill = req.body.signup_skill;

    var queryF = "INSERT INTO FREELANCER (Id, Password, Name, Age, Career, Major, Phone) VALUES ('"+id+"', SHA2('"+pwd+"', "+config.db_config.length+"), '"+name+"', '"+age+"', '"+career+"', '"+major+"', '"+phone+"');";
    var queryP = "INSERT INTO PORTFOLIO (Freelancer_id, Portfolio_id, Type, External_file) VALUES ('"+id+"', '1', '1', '"+file.originalname+"');";
    var queryL = [];
    var queryLC = [];
    for(var i=0; i<skill.length; i++){
      if(skill[i]==undefined) // this if for the deleted object & 랭귀지 레벨을 선택하지 않았을때
        continue;
      queryL.push("INSERT INTO FREELANCER_LANGUAGE_SKILL (Freelancer_id, Language, Level) VALUES ('"+id+"', '"+lng[i]+"', '"+skill[i]+"');");
      queryLC.push("SELECT * FROM FREELANCER_LANGUAGE_SKILL WHERE Freelancer_id='"+id+"' and Language='"+lng[i]+"';");
    }

    var resultF = await db.getQueryResult(queryF);
    var resultP = await db.getQueryResult(queryP);
    for(var i=0; i<queryL.length; i++){
      var resultLC = await db.getQueryResult(queryLC[i]);
      if(Object.keys(resultLC).length > 0){ // 이미 이 언어에 대한 level이 존재하므로 스킵 for 같은 언어 중복 상황에 대한 핸들링
        continue;
      }
      await db.getQueryResult(queryL[i]);
    }
    
    cb(null, id+'_1_'+file.originalname);
  })
});

// 포트폴리오 수정
const storage_ptf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/portfolio')
  },
  filename: wrapper.asyncMiddleware(async(req, file, cb)=>{
    // get portfolio number
    var query = "SELECT MAX(Portfolio_id) FROM portfolio WHERE Freelancer_id='"+req.body.freelancer_id+"'";
    var ret = await db.getQueryResult(query);
    const max = ret[0]['MAX(Portfolio_id)'];
    var portfolio_id;
    if (max!=null)
        portfolio_id = max+1;
    else
        portfolio_id = 1;

    var query2 = "INSERT INTO portfolio(Freelancer_id,Portfolio_id,Type,External_file) VALUES('"+req.body.freelancer_id+"',"+portfolio_id+",1,'"+file.originalname+"')";
    var ret2 = await db.getQueryResult(query2);

    cb(null, req.body.freelancer_id+'_'+portfolio_id+'_'+file.originalname)
  })
});

// 의뢰 상세 페이지에서 의뢰 문서 추가
const storage_add_req_spec = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/req_spec')
  },
  filename: wrapper.asyncMiddleware(async(req, file, cb)=>{
    var query = "INSERT INTO request_file(request_id,file_id) VALUES("+req.body.request_id+",'"+file.originalname+"')";
    var ret = await db.getQueryResult(query);

    cb(null, req.body.request_id+'_'+file.originalname)
  })
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// multer
const upload_spec_from_write = multer({
  storage: storage_spec_from_write,
});
const upload_ptf_from_signup = multer({
  storage: storage_ptf_from_signup,
});
const upload_ptf = multer({
  storage: storage_ptf,
});

const upload_add_req_spec = multer({
  storage: storage_add_req_spec,
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// upload
const up_spec_from_write = upload_spec_from_write.fields([{name: 'file', maxCount: 5}]);
const up_ptf_from_signup = upload_ptf_from_signup.fields([{name: 'file', maxCount: 5}]);
const up_ptf = upload_ptf.fields([{name: 'file', maxCount: 5}]);
const up_add_req_spec = upload_add_req_spec.fields([{name: 'file', maxCount: 5}]);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// router
router.post('/req_spec_from_write', up_spec_from_write, (req, res, next) => {
  var msg = '<script type="text/javascript">alert("의뢰가 작성되었습니다!");window.location.href="/request_list"</script>';
  res.send(msg);
});

router.post('/ptf_from_signup', up_ptf_from_signup, wrapper.asyncMiddleware(async (req, res, next) => {
  if(req.body.signup_file_num == 0){
    var id = req.body.signup_id;
    var pwd = req.body.signup_pwd;
    var name = req.body.signup_name;
    var age = req.body.signup_age;
    var career = req.body.signup_career;
    var major = req.body.signup_major;
    var phone = req.body.signup_phone;
    var lng = req.body.signup_lng;
    var skill = req.body.signup_skill;

    var queryF = "INSERT INTO FREELANCER (Id, Password, Name, Age, Career, Major, Phone) VALUES ('"+id+"', SHA2('"+pwd+"', "+config.db_config.length+"), '"+name+"', '"+age+"', '"+career+"', '"+major+"', '"+phone+"');";
    var queryL = [];
    var queryLC = [];
    for(var i=0; i<skill.length; i++){
      if(skill[i]==undefined) // this if for the deleted object & 랭귀지 레벨을 선택하지 않았을때
        continue;
      queryL.push("INSERT INTO FREELANCER_LANGUAGE_SKILL (Freelancer_id, Language, Level) VALUES ('"+id+"', '"+lng[i]+"', '"+skill[i]+"');");
      queryLC.push("SELECT * FROM FREELANCER_LANGUAGE_SKILL WHERE Freelancer_id='"+id+"' and Language='"+lng[i]+"';");
    }

    var resultF = await db.getQueryResult(queryF);
    for(var i=0; i<queryL.length; i++){
      var resultLC = await db.getQueryResult(queryLC[i]);
      if(Object.keys(resultLC).length > 0){ // 이미 이 언어에 대한 level이 존재하므로 스킵 for 같은 언어 중복 상황에 대한 핸들링
        continue;
      }
      await db.getQueryResult(queryL[i]);
    }
  }
  var msg = '<script type="text/javascript">alert("새로운 프리랜서가 되었습니다! 로그인해주세요.");window.location.href="/login"</script>';
  res.send(msg);
}));

router.post('/portfolio', up_ptf, (req, res, next) => {
  res.redirect('/freelancer_profile/'+req.body.freelancer_id);
});

router.post('/add_req_spec', up_add_req_spec, (req, res, next) => {
  res.redirect('/request_info/'+req.body.request_id);
});

module.exports = router;
