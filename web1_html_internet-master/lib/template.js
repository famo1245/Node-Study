// 연관된 데이터나 함수를 묶어서 객체로 선언
// const template = Object.freeze({
//   HTML: (title, list, body, control) => {
//     return `
//         <!doctype html>
//       <html>
//       <head>
//         <title>WEB1 - ${title}</title>
//         <meta charset="utf-8">
//       </head>
//       <body>
//         <h1><a href="/">WEB</a></h1>
//         ${list}
//         ${control}
//         ${body}
//       </body>
//       </html>`;
//   },
//   List: (fileList) => {
//     let list = '<ul>';
//     fileList.forEach((element) => (list += `<li><a href="/?id=${element}">${element}</a></li>`));
//     list += '</ul>';
//     return list;
//   },
// });

// module.exports = template;

// 위와 동일한 코드
module.exports = Object.freeze({
  HTML: (title, list, body, control) => {
    return `
          <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          ${control}
          ${body}
        </body>
        </html>`;
  },
  List: (fileList) => {
    let list = '<ul>';
    fileList.forEach((element) => (list += `<li><a href="/?id=${element}">${element}</a></li>`));
    list += '</ul>';
    return list;
  },
});
