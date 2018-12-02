'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/index.html'));
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
router.get('/index', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.get('/login', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/login.html'));
});

router.get('/signup', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/signup.html'));
});

router.get('/signup_client', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/signup_client.html'));
});

router.get('/signup_freelancer', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/signup_freelancer.html'));
});
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
router.get('/view_message/:id', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/view_message.html'));
});
module.exports = router;
