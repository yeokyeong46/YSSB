'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const config = require('../config');
const fs = require('fs');

router.get('/', (req, res, next) => {
  res.render('index', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
router.get('/index', (req, res, next) => {
  res.render('index', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

router.get('/login', (req, res, next) => {
  res.render('login', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

router.post('/login', wrapper.asyncMiddleware(async (req, res, next) => {
  var id = req.body.login_id;
  var pwd = req.body.login_pwd;

  var queryC = "SELECT * FROM CLIENT WHERE Id='"+id+"'and Password=SHA2('"+pwd+"', "+config.db_config.length+");";
  var queryF = "SELECT * FROM FREELANCER WHERE Id='"+id+"'and Password=SHA2('"+pwd+"', "+config.db_config.length+");";

  var resultC = await db.getQueryResult(queryC);
  var resultF = await db.getQueryResult(queryF);

  var level=-1; // -1:not login, 0:admin, 1:client, 2:freelancer
  if(id==config.admin_config.id && pwd==config.admin_config.pwd){
    level = 0;
  }
  else if(Object.keys(resultC).length > 0){
    level = 1;
  }
  else if(Object.keys(resultF).length > 0){
    level = 2;
  }

  if(level!=-1){
    req.session.auth_level = level;
    req.session.curr_id = id;
    res.redirect('/');
  }
  else{
    var msg = '<script type="text/javascript">alert("해당하는 회원정보가 존재하지 않습니다.");window.location.href="/login"</script>';
    res.send(msg);
  }
}));

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/signup', (req, res, next) => {
  res.render('signup', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

router.post('/checkId', wrapper.asyncMiddleware(async (req, res, next) => {
  var id = req.body.signup_id;

  var msg;
  if(/\s/.test(id)){
    msg = "empty";
  }
  else{
    var queryC = "SELECT * FROM CLIENT WHERE Id='"+id+"';";
    var queryF = "SELECT * FROM FREELANCER WHERE Id='"+id+"';";

    var resultC = await db.getQueryResult(queryC);
    var resultF = await db.getQueryResult(queryF);

    if(id==config.admin_config.id || Object.keys(resultC).length > 0 || Object.keys(resultF).length > 0){
      msg = "exist";
    }
    else{
      msg = "new";
    }
  }
  res.send(msg);
}));


router.get('/signup_client', (req, res, next) => {
  res.render('signup_client', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

router.post('/signup_client', wrapper.asyncMiddleware(async (req, res, next) => {
  var id = req.body.signup_id;
  var pwd = req.body.signup_pwd;
  var name = req.body.signup_name;
  var phone = req.body.signup_phone;

  var queryC = "INSERT INTO CLIENT (Id, Password, Name, Phone) VALUES ('"+id+"', SHA2('"+pwd+"', "+config.db_config.length+"), '"+name+"', '"+phone+"');";
  var resultC = await db.getQueryResult(queryC);

  //console.log(resultC);

  var msg = '<script type="text/javascript">alert("새로운 클라이언트가 되었습니다! 로그인해주세요.");window.location.href="/login"</script>';
  res.send(msg);

}));

router.get('/signup_freelancer', (req, res, next) => {
  res.render('signup_freelancer', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

router.get('/write_request', wrapper.asyncMiddleware(async (req, res, next) => {
  res.render('write_request', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
}));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

router.get('/manager_page', (req,res,next) => {
  res.render('manager_page',{
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
});

router.get('/client_profile/:id', (req,res,next) => {
  res.render('client_profile',{
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id,
    sess_page_id: req.params.id
  });
});

router.get('/freelancer_profile/:id', (req,res,next) => {
  res.render('freelancer_profile',{
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id,
    sess_page_id: req.params.id
  });
});

router.get('/view_file/:folder/:name', function(req, res){
  var tempFile='./public/upload/'+req.params.folder+'/'+req.params.name;
  fs.readFile(tempFile, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

router.get('/request_list', (req, res, next) => {
  res.render('request_list', {
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id
  });
  console.log(req.session);
});
router.get('/request_info/:id', (req,res,next) => {
  res.render('request_info',{
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id,
    sess_page_id: req.params.id
  });
  console.log(req.session);
});
router.get('/view_message/:id', (req,res,next) => {
  res.render('view_message',{
    sess_level: req.session.auth_level,
    sess_id: req.session.curr_id,
    sess_page_id: req.params.id
  });
  console.log(req.session);
});
module.exports = router;
