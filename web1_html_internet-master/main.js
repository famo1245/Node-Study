const http = require('http');
const fs = require('fs');
const url = require('url');

const dirName = './data';
const app = http.createServer((request, response) => {
  let _url = request.url;
  // url 모듈의 parse 사용, 쿼리 스트링만 추출함
  const queryData = url.parse(_url, true).query;
  // url 정보 중 경로 이름만 추출
  const pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  // url 분석
  // console.log(url.parse(_url, true));

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir(dirName, (err, fileList) => {
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        let list = '<ul>';
        fileList.forEach((element) => (list += `<li><a href="/?id=${element}">${element}</a></li>`));
        list += '</ul>';
        const template = `
    <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <h2>${title}</h2>
    <p>${description}</p>
  </body>
  </html>`;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      let list = '<ul>';
      fs.readdir(dirName, (err, fileList) => {
        fileList.forEach((element) => (list += `<li><a href="/?id=${element}">${element}</a></li>`));
        list += '</ul>';
      });
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        const title = queryData.id;
        const template = `
    <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <h2>${title}</h2>
    <p>${description}</p>
  </body>
  </html>`;
        response.writeHead(200);
        response.end(template);
      });
    }
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
  //   console.log(__dirname + _url);
  // 웹 브라우저의 요청에 응답하는 명령
  //   response.end(fs.readFileSync(__dirname + _url));
  // end() 안의 내용에 따라 rest controller 처럼 작동
  // response.end('egoing : ' + _url);
  //   response.end(queryData.id);
});

app.listen(3000);
