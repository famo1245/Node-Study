const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');

const dirName = './data';
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'famo1245',
  database: 'opentutorials',
});

db.connect();

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
      db.query('SELECT * FROM topic', (err, topics) => {
        if (err) {
          throw err;
        }

        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.List(topics);
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
      db.query('SELECT * FROM topic', (err, topics) => {
        if (err) {
          throw err;
        }

        db.query(
          `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id
          WHERE topic.id=?`,
          [queryData.id],
          (err2, topic) => {
            if (err2) {
              throw err2;
            }

            const title = topic[0].title;
            const description = topic[0].description;
            const list = template.List(topics);
            const html = template.HTML(
              title,
              list,
              `<h2>${title}</h2>
              <p>${description}</p><p>by ${topic[0].name}</p>`,
              `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
              <input type="hidden" name="id" value="${queryData.id}" />
              <input type="submit" value="delete" />
            </form>`
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }
  } else if (pathname === '/create') {
    db.query('SELECT * FROM topic', (err, topics) => {
      if (err) {
        throw err;
      }

      const title = 'WEB - create';
      const list = template.List(topics);
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
        `<a href="/create">create</a>`
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
      db.query(
        `INSERT INTO topic (title, description, created, author_id)
          VALUES(?, ?, NOW(), ?)`,
        [title, description, 1],
        (err, result) => {
          if (err) {
            throw err;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end();
        }
      );
    });
  } else if (pathname === '/update') {
    db.query('SELECT * FROM topic', (err, topics) => {
      if (err) {
        throw err;
      }

      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic) => {
        if (err2) {
          throw err2;
        }

        const title = topic[0].title;
        const description = topic[0].description;
        const list = template.List(topics);
        const html = template.HTML(
          title,
          list,
          `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
          <p>
            <textarea name="description" placeholder="description" >${description}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>`,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
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
      db.query(
        `UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,
        [post.title, post.description, post.id],
        (err, result) => {
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        }
      );
    });
  } else if (pathname === '/delete_process') {
    let body = '';
    let post;
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      post = qs.parse(body);
      db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err, result) => {
        if (err) {
          throw err;
        }

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
