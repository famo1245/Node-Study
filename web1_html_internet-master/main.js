const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer((request, response) => {
  let _url = request.url;
  // url 모듈의 parse 사용, 쿼리 스트링만 추출함
  const queryData = url.parse(_url, true).query;
  let title = queryData.id;
  //   console.log(queryData.id);
  //   console.log(_url);
  if (_url == '/') {
    title = 'Welcome';
    _url = '/index.html';
  }

  if (_url == '/favicon.ico') {
    return response.writeHead(404);
  }

  response.writeHead(200);
  fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
    const template = `
    <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    <ul>
      <li><a href="/?id=HTML">HTML</a></li>
      <li><a href="/?id=CSS">CSS</a></li>
      <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ul>
    <h2>${title}</h2>
    <p>${description}</p>
  </body>
  </html>`;
    response.end(template);
  });
  //   console.log(__dirname + _url);
  // 웹 브라우저의 요청에 응답하는 명령
  //   response.end(fs.readFileSync(__dirname + _url));
  // end() 안의 내용에 따라 rest controller 처럼 작동
  // response.end('egoing : ' + _url);
  //   response.end(queryData.id);
});

app.listen(3000);
