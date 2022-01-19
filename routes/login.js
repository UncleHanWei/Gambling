var express = require('express');
var router = express.Router();

// 跟資料庫做比較的函數，return Promise
let checkLogin = (db, formData) => {
  return new Promise((rs, rj) => {
    let sql = "SELECT * FROM user WHERE username=? AND password=?";
    let params = [formData['username'], formData['password']];
    db.query(sql, params, function(err, rows) {
      if(err) {
        console.log("[SELECT ERROR] -", err);
        rj('DB ERROR');
      } else {
        if(rows.length == 0) {
          rj('login ERROR');
        } else {
          rs(rows[0]);
        }
      }
    })
  })
}

router.post('/', async function (req, res, next) {
  let formData = req.body;
  console.log(formData);
  try {
    // 檢查傳過來的資料，跟資料庫做比對
    let userData = await checkLogin(req.db, formData);
    req.session.user = {
      role: userData['role'],
      id: userData['id'],
      username: userData['username'],
      wallet: userData['wallet']
    }
    if(userData['role'] == 0) {
      res.redirect('/admin');
    } else {
      res.redirect('/');
    }
  } catch(err) {
    console.log(err);
    res.render('message', { message: '登入失敗', js: 'location.href="/login"' })
  }
});

module.exports = router;
