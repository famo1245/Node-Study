import express from "express";
import template from "../lib/template.js";
import auth from "../lib/auth.js";

export const router = express.Router();

router.get("/", function (request, response) {
  const fmsg = request.flash();
  let feedback = "";
  if (fmsg.success) {
    feedback = `<div style="color: blue;">fmsg.success[0]</div>`;
  } else if (fmsg.error) {
    feedback = `<div style="color: red;">fmsg.error[0]</div>`;
  }

  console.log("/", request.user);
  const title = "Welcome";
  const description = "Hello, Node.js";
  const list = template.list(request.list);
  const html = template.HTML(
    title,
    list,
    `
        ${feedback}
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response),
  );
  response.send(html);
});
