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
    fileList.forEach((element) => (list += `<li><a href="/?id=${element.id}">${element.title}</a></li>`));
    list += '</ul>';
    return list;
  },
  AuthorSelect: (authors, author_id) => {
    let tag = '';
    authors.forEach((author) => {
      let selected = '';
      if (author.id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${author.id}"${selected}>${author.name}</option>`;
    });
    return `
    <select name="author">
      ${tag}
    </select>
    `;
  },
});
