import express from "express";
import template from "../lib/template.js";
import auth from "../lib/auth.js";

export const router = express.Router();

router.get("/", function (request, response) {
  const title = "Welcome";
  const description = "Hello, Node.js";
  const list = template.list(request.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response),
  );
  response.send(html);
});
