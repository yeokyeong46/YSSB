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

router.get('/client_profile', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/client_profile.html'));
});

router.get('/freelancer_profile', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/freelancer_profile.html'));
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

module.exports = router;