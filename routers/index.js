'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const config = require('../config');

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

  var queryC = "SELECT * FROM CLIENT WHERE Id='"+id+"'and Password='"+pwd+"';";
  var queryF = "SELECT * FROM FREELANCER WHERE Id='"+id+"'and Password='"+pwd+"';";

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

  var queryC = "INSERT INTO CLIENT (Id, Password, Name, Phone) VALUES ('"+id+"', '"+pwd+"', '"+name+"', '"+phone+"');";
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

router.post('/signup_freelancer', wrapper.asyncMiddleware(async (req, res, next) => {
  var id = req.body.signup_id;
  var pwd = req.body.signup_pwd;
  var name = req.body.signup_name;
  var age = req.body.signup_age;
  var career = req.body.signup_career;
  var major = req.body.signup_major;
  var phone = req.body.signup_phone;
  var langage = '';
  var skill = '';
  var ptf = req.body.signup_ptf;

  var queryP1 = "SELECT * FROM PORTFOLIO WHERE Freelancer_id='"+id+"';"
  var resultP1 = await db.getQueryResult(queryP1);
  var num_ptf = Object.keys(resultP1).length;

  var queryF = "INSERT INTO FREELANCER (Id, Password, Name, Age, Career, Major, Phone) VALUES ('"+id+"', '"+pwd+"', '"+name+"', '"+age+"', '"+career+"', '"+major+"', '"+phone+"';";
  var queryP = "INSERT INTO PORTFOLIO (Freelancer_id, Portfolio_id, Type, External_file) VALUES ('"+id+"', '"+num_ptf+"', '1', '"+ptf+"';";

  var resultF = await db.getQueryResult(queryF);
  var resultP = await db.getQueryResult(queryP);

  console.log('- - - - - - - - - - - - -');
  console.log(resultF);
  console.log('- - - - - - - - - - - - -');
  console.log(resultP);
  console.log('- - - - - - - - - - - - -');

  var msg = '<script type="text/javascript">alert("새로운 프리랜서가 되었습니다! 로그인해주세요.");window.location.href="/login"</script>';
  res.send(msg);

}));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
router.get('/manager_page', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/manager_page.html'));
});

router.get('/client_profile/:id', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/client_profile.html'));
});

/*
router.get('/client_profile/:id', (req,res,next) => {
  res.render('client_profile',{
    level: req.session.auth_level,
    id: req.session.curr_id,
    page_id: req.params.id
  });
});
*/

router.get('/freelancer_profile/:id', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/freelancer_profile.html'));
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
router.get('/request_list', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/request_list.html'));
});
router.get('/request_info/:id', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/request_info.html'));
});
router.get('/view_message/:request_id/:participant_id', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/view_message.html'));
});
/*----------------message server-----------------
var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen('3000', function(){
  console.log("server on!");
});
*/
module.exports = router;
