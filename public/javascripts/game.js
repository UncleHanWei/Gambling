const socket = io('/');
let stake_num;
let stake_money;
function stake() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let game_id = location.href.substring(location.href.search('game_id') + 8);
  let num = parseInt(document.getElementById('num').value);
  let stake = parseInt(document.getElementById('stake').value);
  stake_num = num;
  stake_money = stake;
  var raw = JSON.stringify({
    "game_id": game_id,
    "num": num,
    "stake": stake
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/game/stake", requestOptions)
    .then(response => response.text())
    .then((result) => {
      result = JSON.parse(result);
      console.log(result)
      let user = result['user'];
      let stake = result['stake'];
      let num = result['num'];
      socket.emit('stake', { user: user, stake: stake, num: num })
    })
    .catch(error => console.log('error', error));
}

socket.on('draw', (arg) => {
  

  let html =
    `<h1>謎底揭曉</h1>
  <span class="fw-boder">正確答案 ： </span><span>${arg['num']}</span>
  <span class="fw-boder">你的答案 ： </span><span>${stake_num}</span>
  `
  if (stake_num == arg['num']) {
    html += `<h1>你贏了 ${parseInt(stake_money) * 5} 元</h1>`
  } else {
    html += `<h1>你輸了 ${stake_money} 元</h1>`
  }
  html += `<a href="/">點此回首頁</a>`
  document.getElementById('show').innerHTML = html;
  // 發 ajax 更新錢包再改變前端
  let new_wallet;
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "Cookie_1=value; connect.sid=s%3AmqvitAPVEcSMiae0s_uJu5dvjjhK_2Jr.8Kb%2FyYzmMLjQgPpgYmUn3M6oC0JWhIFKantooknyuQ8");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("/api/get/wallet", requestOptions)
    .then(response => response.text())
    .then((result) => {
      result = JSON.parse(result);
      console.log(result);
      new_wallet = result['wallet'];
      document.getElementById('wallet').innerHTML = new_wallet;
    })
    .catch(error => console.log('error', error));
})