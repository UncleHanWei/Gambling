var express = require('express');
var router = express.Router();

const loginCheck = require('./middleware/loginCheck');
const roleCheck = require('./middleware/roleCheck');

let getWallet = (db, id) => {
  return new Promise((rs, rj) => {
    let sql = 'SELECT wallet FROM user WHERE id=?';
    let params = [id];
    db.query(sql, params, (err, rows) => {
      if (err) {
        console.log("[SELECT ERROR] -", err);
        rj(err);
      } else {
        if (rows.length == 0) {
          rj('error')
        } else {
          rs(rows[0]);
        }
      }
    })
  })
}

/* GET home page. */
router.get('/', loginCheck, async function (req, res, next) {
  try {
    let wallet = await getWallet(req.db, req.session.user.id);
    req.session.user.wallet = wallet['wallet'];
    res.render('index', { title: '線上聚賭平台', index: '/', username: req.session.user.username, wallet: req.session.user.wallet });
  } catch (err) {
    console.log(err);
    res.render('message', { message: '系統錯誤，請重新登入', js: 'location.href="/logout"' })
  }
});

router.get('/admin', loginCheck, roleCheck, function (req, res, next) {
  res.render('admin', { title: '線上聚賭平台', index: '/admin', username: req.session.user.username, wallet: req.session.user.wallet });
});

router.get('/signUp', function (req, res, next) {
  res.render('signUp', { title: '線上聚賭平台' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/game', loginCheck, function (req, res, next) {
  res.render('game', { title: 'Express',index: '/', wallet: req.session.user.wallet });
});

module.exports = router;
