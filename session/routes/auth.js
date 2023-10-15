import express from "express";
import template from "../lib/template.js";
import fs from "fs";
import { JSONPreset } from "lowdb/node";

const router = express.Router();

export const initAuthRouter = (passport) => {
  router
    .get("/login", (req, res) => {
      const fmsg = req.flash();
      console.log(fmsg);
      let feedback = "";
      if (fmsg.error) {
        feedback = fmsg.error[0];
      }
      const title = "Login";
      const list = template.list(req.list);
      const html = template.HTML(
        title,
        list,
        `
        <div style="color: red;">${feedback}</div>
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
    .post(
      "/login_process",
      passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: true,
      }),
    )
    .get("/register", (req, res) => {
      const fmsg = req.flash();
      let feedback = "";
      if (fmsg.error) {
        feedback = fmsg.error[0];
      }

      const title = "WEB - login";
      const list = template.list(req.list);
      const html = template.HTML(
        title,
        list,
        `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="pwd" placeholder="password"></p>
            <p><input type="password" name="pwd2" placeholder="password"></p>
            <p><input type="text" name="displayName" placeholder="display name"></p>
            <p><input type="submit" value="register"></p>
        </form>
      `,
        "",
      );

      res.send(html);
    })
    .post("/register_process", (req, res) => {
      const post = req.body;
      const { email, pwd, pwd2, displayName } = post;
    })
    // .post("/login_process", (req, res, next) => {
    //   const post = req.body;
    //   const email = post.email;
    //   const password = post.password;
    //   if (email === authData.email && password === authData.password) {
    //     req.session.is_logined = true;
    //     req.session.nickname = authData.nickname;
    //     req.session.save(() => {
    //       res.redirect("/");
    //     });
    //   } else {
    //     res.send("Who?");
    //   }
    // })
    .get("/logout", (req, res, next) => {
      // req.session.destroy((err) => {
      //   res.redirect("/");
      // });
      // req.logout(res.redirect("/"));
      // passport version up으로 인한 사용법 변화
      req.logout((err) => {
        if (err) throw err;
        res.redirect("/");
      });
    });
  return router;
};