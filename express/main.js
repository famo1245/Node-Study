import express from 'express';
import fs from 'fs';
import template from './lib/template.js';
import sanitize from 'sanitize-html';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
//get method에만 미들웨어 사용
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, fileList) => {
    req.list = fileList;
    next();
  });
});

app
  .get('/', (req, res) => {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px">
      `,
      `<a href="/create">create</a>`
    );
    res.send(html);
  })
  .get('/page/:pageId', (req, res, next) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf-8', (err, description) => {
      if (err) {
        next(err);
        return;
      }

      const title = req.params.pageId;
      const sanitizedTitle = sanitize(title);
      const sanitizedDescription = sanitize(description, {
        allowedTags: ['h1'],
      });
      const list = template.list(req.list);
      const html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `<a href="/create">create</a>
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
      );

      res.send(html);
    });
  })
  .get('/create', (req, res) => {
    const title = 'WEB - create';
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
          <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title" /></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
            <input type="submit" />
          </p>
        </form>
        `,
      ''
    );

    res.send(html);
  })
  .post('/create_process', (req, res) => {
    const post = req.body;
    const { title, description } = post;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
      res.redirect(`/page/${title}`);
    });
  })
  .get('/update/:pageId', (req, res) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      const title = req.params.pageId;
      const list = template.list(req.list);
      const html = template.HTML(
        title,
        list,
        `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p>
                <input type="text" name="title" placeholder="title" value="${title}" />
            </p>
            <p>
                <textarea name="description" placeholder="description" >${description}</textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>`,
        `<a href="/create">create</a> <a href="/update/${title}}">update</a>`
      );
      res.send(html);
    });
  })
  .post('/update_process', (req, res) => {
    const post = req.body;
    fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
      fs.writeFile(`data/${post.title}`, post.description, 'utf8', (err) => {
        res.redirect(`/page/${post.title}`);
      });
    });
  })
  .post('/delete_process', (req, res) => {
    const post = req.body;
    const id = post.id;
    const filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, (err) => {
      res.redirect('/');
    });
  });

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
