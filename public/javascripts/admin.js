const socket = io('/');

let game_id;
let num;
function startGame() {
  document.getElementById("start").classList.add('disabled');
  document.getElementById("end").classList.remove('disabled');
  // 先發 ajax 到後端，設定好遊戲，還有資料庫
  // ajax 回來之後才 then 發 socket

  num = parseInt(document.getElementById("num").value);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "Cookie_1=value; connect.sid=s%3A3dWnpVndOdEaSlvzY8ZxMEHDY_bPDuM1.JkYK0J5EPpWgkyV%2F7dNAHPsCj6%2BFffB6wxm2hFyORfU");

  var raw = JSON.stringify({
    "num": num
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/game/set", requestOptions)
    .then(response => response.text())
    .then((result) => {
      game_id = JSON.parse(result)['game_id'];

      console.log(JSON.parse(result))
      console.log('set success');
      socket.emit('start', { game_id: JSON.parse(result)['game_id'] });

    })
    .catch(error => console.log('error', error));
}


socket.on('stake', (arg) => {
  let user = arg['user'];
  let stake = arg['stake'];
  let num = arg['num'];
  let html =
    `<div class="row">
    <div class="col-1 border fw-bold">玩家</div>
    <div class="col-3 border">${user}</div>
    <div class="col-1 border fw-bold">賭金</div>
    <div class="col-3 border">${stake}</div>
    <div class="col-2 border fw-bold">押注數字</div>
    <div class="col-2 border">${num}</div>
  </div>`
  document.getElementById("players").innerHTML += html;
})

function endGame() {
  document.getElementById("end").classList.add('disabled');
  document.getElementById("start").classList.remove('disabled');
  // 先發 ajax 計算結果
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "Cookie_1=value; connect.sid=s%3A3dWnpVndOdEaSlvzY8ZxMEHDY_bPDuM1.JkYK0J5EPpWgkyV%2F7dNAHPsCj6%2BFffB6wxm2hFyORfU");
  let raw = JSON.stringify({
    "num": num,
    "game_id": game_id
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/game/draw", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result)
      console.log('draw success');
      // 再發 socket 顯示
      socket.emit('draw', { game_id: game_id, num: num });
      document.getElementById('wallet').innerHTML = JSON.parse(result)['wallet'];
    })
    .catch(error => console.log('error', error));
}