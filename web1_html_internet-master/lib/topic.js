const db = require('./db');
const template = require('./template');
const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

exports.home = (request, response) => {
  db.query('SELECT * FROM topic', (err, topics) => {
    if (err) {
      throw err;
    }

    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const list = template.List(topics);
    const html = template.HTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
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
          `<h2>${sanitizeHtml(title)}</h2>
          <p>${sanitizeHtml(description)}</p><p>by ${sanitizeHtml(topic[0].name)}</p>`,
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
};

exports.create = (request, response) => {
  db.query('SELECT * FROM topic', (err, topics) => {
    if (err) {
      throw err;
    }

    db.query('SELECT * FROM author', (err2, authors) => {
      // console.log(authors);

      const title = 'WEB - create';
      const list = template.List(topics);
      const html = template.HTML(
        sanitizeHtml(title),
        list,
        `
          <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title" /></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.AuthorSelect(authors)}
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
  });
};

exports.create_process = (request, response) => {
  let body = '';
  let post;
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    post = qs.parse(body);
    const title = post.title;
    const description = post.description;
    const author = post.author;
    db.query(
      `INSERT INTO topic (title, description, created, author_id)
          VALUES(?, ?, NOW(), ?)`,
      [title, description, author],
      (err, result) => {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic', (err, topics) => {
    if (err) {
      throw err;
    }

    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic) => {
      if (err2) {
        throw err2;
      }

      db.query('SELECT * FROM author', (err2, authors) => {
        const title = topic[0].title;
        const description = topic[0].description;
        const list = template.List(topics);
        const html = template.HTML(
          sanitizeHtml(title),
          list,
          `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(title)}" /></p>
            <p>
              <textarea name="description" placeholder="description" >${sanitizeHtml(description)}</textarea>
            </p>
            <p>
              ${template.AuthorSelect(authors, topic[0].author_id)}
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
  });
};

exports.update_process = (request, response) => {
  let body = '';
  let post;
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    post = qs.parse(body);
    db.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title, post.description, post.author, post.id],
      (err, result) => {
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      }
    );
  });
};

exports.delete_process = (request, response) => {
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
};
