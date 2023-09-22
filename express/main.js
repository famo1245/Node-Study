import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { router as topicRouter } from './routes/topic.js';
import { router as indexRouter } from './routes/index.js';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
//get method에만 미들웨어 사용
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, fileList) => {
    req.list = fileList;
    next();
  });
});

app.use('/topic', topicRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
