'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

const storage_spec = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/req_spec')
  },
  filename: (req, file, cb) => {
    cb(null, req.session.curr_id+'_'+file.originalname)
  }
});
const storage_ptf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/protfolio')
  },
  filename: (req, file, cb) => {
    cb(null, req.session.curr_id+'_'+file.originalname)
  }
});

const upload_spec = multer({
  storage: storage_spec,
});
const upload_ptf = multer({
  storage: storage_ptf,
});

const up_spec = upload_spec.fields([{name: 'file', maxCount: 5}]);
const up_ptf = upload_ptf.fields([{name: 'file', maxCount: 5}]);

router.post('/req_spec', up_spec, wrapper.asyncMiddleware(async (req, res, next) => {
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

  var queryR = "INSERT INTO REQUEST (Client_id, Title, Pay, Apply_start_date, Apply_end_date, Min_career) VALUES ('"+id+"', '"+title+"', '"+pay+"', '"+today+"', '"+end+"', '"+min_career+"');"
  var resultR = await db.getQueryResult(queryR);

  var msg = '<script type="text/javascript">alert("의뢰가 작성되었습니다!");window.location.href="/request_list"</script>';
  res.send(msg);
}));

router.post('/portfolio', up_ptf, (req, res, next) => {
  res.redirect('/');
});
module.exports = router;
