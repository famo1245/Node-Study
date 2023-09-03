const http = require('http');
const url = require('url');
const author = require('./lib/author');
const topic = require('./lib/topic');

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
      topic.home(request, response);
    } else {
      topic.page(request, response);
    }
  } else if (pathname === '/create') {
    topic.create(request, response);
  } else if (pathname === '/create_process') {
    topic.create_process(request, response);
  } else if (pathname === '/update') {
    topic.update(request, response);
  } else if (pathname === '/update_process') {
    topic.update_process(request, response);
  } else if (pathname === '/delete_process') {
    topic.delete_process(request, response);
  } else if (pathname === '/author') {
    author.home(request, response);
  } else if (pathname === '/author/create_process') {
    author.create_process(request, response);
  } else if (pathname === '/author/update') {
    author.update(request, response);
  } else if (pathname === '/author/update_process') {
    author.update_process(request, response);
  } else if (pathname === '/author/delete_process') {
    author.delete_process(request, response);
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
