var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

let setGame = (db, game_id, num) => {
  return new Promise((rs, rj) => {
    let sql = 'INSERT INTO `game`(`game_id`, `num`) VALUES (?,?)';
    let params = [game_id, num];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log("[INSERT ERROR] -", err);
        rj(err);
      } else {
        rs('OK');
      }
    })
  })
}

router.post('/set', async function (req, res, next) {
  let formData = req.body;
  console.log(formData);
  try {
    // 產生 hash code
    let game_id = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    await setGame(req.db, game_id, formData['num']);
    res.send({ game_id: game_id });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

let insertStake = (db, user_id, data) => {
  return new Promise((rs, rj) => {
    let sql = 'INSERT INTO `stake`(`game_id`, `user_id`, `num`, `stake`) VALUES (?,?,?,?)';
    let params = [data['game_id'], user_id, data['num'], data['stake']];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log("[INSERT ERROR] -", err);
        rj(err);
      } else {
        rs('OK');
      }
    })
  })
}

router.post('/stake', async function (req, res, next) {
  let formData = req.body;
  console.log(formData);
  try {
    let username = req.session.user.username;
    let user_id = req.session.user.id;
    let stake = formData['stake'];
    let num = formData['num'];
    await insertStake(req.db, user_id, formData);
    res.send({ user: username, stake: stake, num: num });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

let getStakeData = (db, game_id) => {
  return new Promise((rs, rj) => {
    let sql = 'SELECT `user_id`, `num`, `stake` FROM `stake` WHERE game_id=?';
    let params = [game_id];
    db.query(sql, params, (err, rows) => {
      if (err) {
        console.log("[SELECT ERROR] -", err);
        rj(err);
      } else {
        if (rows.length == 0) {
          rj('No data');
        } else {
          rs(rows);
        }
      }
    })
  })
}

let updateWallet = (db, id, money) => {
  return new Promise((rs, rj) => {
    let sql = 'UPDATE `user` SET `wallet`=`wallet`+? WHERE id=?';
    let params = [money, id];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log("[UPDATE ERROR] -", err);
        rj(err);
      } else {
        rs('OK');
      }
    })
  })
}


router.post('/draw', async function (req, res, next) {
  let formData = req.body;
  console.log(formData);
  try {
    let game_id = formData['game_id'];
    let num = formData['num'];
    // 去 stake 表撈出參與這次賭注的資料
    let data = await getStakeData(req.db, game_id);
    console.log("getStakeData ==> ", data);
    let adminWallet = 0;
    // 把資料做比對
    data.forEach(player => {
      // 猜對的 錢包 + 下注金額的五倍
      if (player['num'] == num) {
        let money = parseInt(player["stake"]) * 5;
        updateWallet(req.db, player['user_id'], money);
        // 莊家 錢包 - 下注金額的五倍
        adminWallet = adminWallet - money;
      } else {
        let money = parseInt(player["stake"]);
        // 猜錯的 錢包 - 下注金額
        updateWallet(req.db, player['user_id'], 0 - money);
        // 莊家 錢包 + 下注金額
        adminWallet = adminWallet + money;
      }
    });
    req.session.user.wallet += adminWallet;
    console.log(adminWallet);
    updateWallet(req.db, req.session.user.id, adminWallet);
    res.send({ wallet: req.session.user.wallet });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;