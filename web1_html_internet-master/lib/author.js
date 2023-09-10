const db = require('./db');
const template = require('./template');
const qs = require('querystring');
const url = require('url');
const sanitizeHtml = require('sanitize-html');

exports.home = (request, response) => {
  db.query('SELECT * FROM topic', (err, topics) => {
    if (err) {
      throw err;
    }

    db.query('SELECT * FROM author', (err2, authors) => {
      const title = 'Author';
      const list = template.List(topics);
      const html = template.HTML(
        title,
        list,
        `${template.AuthorTable(authors)}
    <style>
        table {
            border-collapse: collapse;
        }
        td {
            border: 1px solid black;
        }
    </style>
    <form action="/author/create_process" method="post">
        <p>
            <input type="text" name="name" placeholder="name" />
        </p>
        <p>
            <textarea name="profile" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit" />
        </p>
    </form>`,
        ``
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
    db.query(
      `INSERT INTO author (name, profile)
            VALUES(?, ?)`,
      [post.name, post.profile],
      (err, result) => {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: '/author' });
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  db.query('SELECT * FROM topic', (err, topics) => {
    if (err) {
      throw err;
    }

    db.query(`SELECT * FROM author`, (err2, authors) => {
      if (err2) {
        throw err2;
      }

      const _url = request.url;
      const queryData = url.parse(_url, true).query;
      db.query('SELECT * FROM author WHERE id=?', [queryData.id], (err3, author) => {
        const title = 'Author';
        const list = template.List(topics);
        const html = template.HTML(
          title,
          list,
          `${template.AuthorTable(authors)}
        <style>
            table {
                border-collapse: collapse;
            }
            td {
                border: 1px solid black;
            }
        </style>
        <form action="/author/update_process" method="post">
            <p>
                <input type="hidden" name="id" value="${queryData.id}" />
            </p>
            <p>
                <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" />
            </p>
            <p>
                <textarea name="profile" placeholder="description">${sanitizeHtml(author[0].profile)}</textarea>
            </p>
            <p>
                <input type="submit" value="update" />
            </p>
        </form>`,
          ``
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
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], (err, result) => {
      if (err) {
        throw err;
      }
      response.writeHead(302, { Location: '/author' });
      response.end();
    });
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
    db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], (err1, result1) => {
      if (err1) {
        throw err1;
      }
      db.query(`DELETE FROM author WHERE id=?`, [post.id], (err, result) => {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: '/author' });
        response.end();
      });
    });
  });
};
