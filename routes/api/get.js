var express = require('express');
var router = express.Router();

let getWallet = (db, id) => {
  return new Promise((rs, rj) => {
    let sql = 'SELECT wallet FROM user WHERE id=?';
    let params = [id];
    db.query(sql, params, (err, rows) => {
      if(err) {
        console.log("[SELECT ERROR] -", err);
        rj(err);
      } else {
        if(rows.length == 0) {
          rj('No Data');
        } else {
          rs(rows[0])
        }
      }
    })
  });
}

router.get('/wallet', async function (req, res, next) {
  try {
    let wallet = await getWallet(req.db, req.session.user.id);
    res.send(wallet);
  } catch (err) {
    console.log(err);
    res.send(err)
  }
});

module.exports = router;