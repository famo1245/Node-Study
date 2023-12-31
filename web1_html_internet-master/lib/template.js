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
const sanitizeHtml = require('sanitize-html');
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
          <a href="/author">author</a>
          ${list}
          ${control}
          ${body}
        </body>
        </html>`;
  },
  List: (fileList) => {
    let list = '<ul>';
    fileList.forEach((element) => (list += `<li><a href="/?id=${element.id}">${sanitizeHtml(element.title)}</a></li>`));
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
      tag += `<option value="${author.id}"${selected}>${sanitizeHtml(author.name)}</option>`;
    });
    return `
    <select name="author">
      ${tag}
    </select>
    `;
  },
  AuthorTable: (authors) => {
    let tag = '<table>';
    authors.forEach((author) => {
      tag += `
            <tr>
                <td>${sanitizeHtml(author.name)}</td>
                <td>${sanitizeHtml(author.profile)}</td>
                <td><a href="/author/update?id=${author.id}">update</a></td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${author.id}" />
                    <input type="submit" value="delete" />
                  </form>
                </td>
            </tr>
        `;
    });
    tag += '</table>';
    return tag;
  },
});
