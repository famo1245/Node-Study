const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const dirName = './data';
const app = http.createServer((request, response) => {
  let _url = request.url;
  // url 모듈의 parse 사용, 쿼리 스트링만 추출함
  const queryData = url.parse(_url, true).query;
  // url 정보 중 경로 이름만 추출
  const pathname = url.parse(_url, true).pathname;

  // url 분석
  // console.log(url.parse(_url, true));

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir(dirName, (err, fileList) => {
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.List(fileList);
        const html = template.HTML(
          title,
          list,
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir(dirName, (err, fileList) => {
        const filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
          const title = queryData.id;
          const sanitizedTitle = sanitizeHtml(title);
          const sanitizedDescription = sanitizeHtml(description, {
            allowedTags: ['h1'],
          });
          const list = template.List(fileList);
          const html = template.HTML(
            sanitizedTitle,
            list,
            `<h2>${title}</h2><p>${sanitizedDescription}</p>`,
            `<a href="/create">create</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
              <input type="hidden" name="id" value="${sanitizedTitle}" />
              <input type="submit" value="delete" />
            </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir(dirName, (err, fileList) => {
      const title = 'WEB - create';
      const list = template.List(fileList);
      const html = template.HTML(
        title,
        list,
        `
      <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title" /></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
    `,
        ''
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    let body = '';
    let post;
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', (err, fileList) => {
      const filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        const title = queryData.id;
        const list = template.List(fileList);
        const html = template.HTML(
          title,
          list,
          `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
          <p>
            <textarea name="description" placeholder="description" >${description}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>`,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    let body = '';
    let post;
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === '/delete_process') {
    let body = '';
    let post;
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      post = qs.parse(body);
      const id = post.id;
      const filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (err) => {
        response.writeHead(302, { Location: '/' });
        response.end();
      });
    });
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
