import express from "express";
import template from "../lib/template.js";

export const router = express.Router();

const authData = {
  email: "famo1245",
  password: "1234",
  nickname: "young",
};
router
  .get("/login", (req, res) => {
    const title = "Login";
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
        <form action="/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="login"></p>
        </form>
        `,
      `<a href="/topic/create">create</a>`,
    );
    res.send(html);
  })
  .post("/login_process", (req, res, next) => {
    const post = req.body;
    const email = post.email;
    const password = post.password;
    if (email === authData.email && password === authData.password) {
      req.session.is_logined = true;
      req.session.nickname = authData.nickname;
      req.session.save(() => {
        res.redirect("/");
      });
    } else {
      res.send("Who?");
    }
  })
  .get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  });
