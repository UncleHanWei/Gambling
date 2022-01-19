const socket = io('/');

socket.on('start', (arg) => {
  let html = `<a href="/game?game_id=${arg['game_id']}" id="gameLink" class='btn btn-primary'>前往下注</a>`;
  document.getElementById('show').innerHTML = html;
  if(parseInt(document.getElementById('wallet').innerHTML) <= 0) {
    document.getElementById('gameLink').classList.add('disabled');
    document.getElementById('gameLink').innerHTML = '錢包餘額不足';
  }
});