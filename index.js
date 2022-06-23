require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));


// / 링크 > 현재 홈페이지에서 index.html 링크
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

// index.html에서 버튼 주소가 /auth 인데, 해당 버튼을 클릭할 시,
// oauth 유저 로그인 창으로 redirect
app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

// 로그인을 했다면, callback 으로 되돌아오는데 돌아온 정보들 (client_id, secret, code 및 데이터들을 axios post 링크)
app.get('/oauth-callback', ({ query: { code } }, res) => {
  
    const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };

  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');

// 출처 : https://www.youtube.com/watch?v=PdFdd4N6LtI