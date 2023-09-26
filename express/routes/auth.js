import express from "express";
import template from "../lib/template.js";

export const router = express.Router();
router
  .get("/", (req, res) => {
    const title = "Login";
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
        <form action="/login/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
        `,
      `<a href="/topic/create">create</a>`,
    );
    res.send(html);
  })
  .post("/login_process", (req, res, next) => {
    const body = req.body;
    if (body.email === "famo1245" && body.password === "1234") {
      res.writeHead(302, {
        "Set-Cookie": [
          `email=${body.email}; Path=/`,
          `password=${body.password}; Path=/`,
          `nickname=kim; Path=/`,
        ],
        Location: "/",
      });
      res.end();
      return;
    }

    res.end("Who?");
  })
  .get("/logout_process", (req, res, next) => {
    if (!req.isOwner) {
      res.end("Login required!");
      return;
    }
    res.writeHead(302, {
      "Set-Cookie": [
        `email=; Path=/; Max-Age=0`,
        `password=; Path=/; Max-Age=0`,
        `nickname=; Path=/; Max-Age=0`,
      ],
      Location: "/",
    });
    res.end();
  });
