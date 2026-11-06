const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  res.render('db1', { data: station });
});

app.get("/keiyo2", (req, res) => {

  res.render('db2', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  let id = Number( req.query.id );
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );


  res.redirect('/keiyo2');
});

// プログラミング言語の一覧
let lang = [
  { id:1, name:"C", year:1972, creator:"Dennis Ritchie" },
  { id:2, name:"Python", year:1991, creator:"Guido van Rossum" },
  { id:3, name:"Java", year:1995, creator:"James Gosling" },
  { id:4, name:"JavaScript", year:1995, creator:"Brendan Eich" },
  { id:5, name:"Ruby", year:1995, creator:"まつもとゆきひろ" },
  { id:6, name:"Go", year:2009, creator:"Robert Griesemer, Rob Pike, Ken Thompson" },
];

app.get("/lang", (req, res) => {
  res.render('lang', { data: lang });
});

app.get("/lang_add", (req, res) => {
  // IDは自動で振る（今ある最大のID + 1）
  let id = Math.max( 0, ...lang.map( (row) => row.id ) ) + 1;
  let name = req.query.name;
  let year = Number( req.query.year );
  let creator = req.query.creator;
  lang.push( { id: id, name: name, year: year, creator: creator } );
  // 再読み込みによる二重登録を防ぐため一覧へリダイレクトする
  res.redirect('/lang');
});

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

// ラジオボタンで手を選ぶじゃんけん（/jankenはそのまま残している）
app.get("/janken2", (req, res) => {
  const hands = ['グー', 'チョキ', 'パー'];
  const hand = req.query.hand;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;
  console.log( {hand, win, total} );

  // ラジオボタン以外から不正な値が来た場合は最初のページに戻す
  if( !hands.includes( hand ) ) {
    res.redirect( '/public/janken2.html' );
    return;
  }

  const cpu = hands[ Math.floor( Math.random() * 3 ) ];
  // 手の番号 グー:0 チョキ:1 パー:2
  // (人間 - CPU + 3) % 3 が 0ならあいこ，2なら人間の勝ち，1なら人間の負け
  const diff = ( hands.indexOf( hand ) - hands.indexOf( cpu ) + 3 ) % 3;
  let judgement = '';
  if( diff == 0 ) {
    judgement = 'あいこ';
  } else if( diff == 2 ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken2', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
