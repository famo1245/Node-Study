import express, { response } from "express";
import sanitize from "sanitize-html";
import path from "path";
import fs from "fs";
import template from "../lib/template.js";
import auth from "../lib/auth.js";

export const router = express.Router();

router.use("*", (req, res, next) => {
  if (!auth.isOwner(req, res)) {
    res.redirect("/");
    return;
  }

  next();
});
router
  .post("/create_process", (req, res) => {
    const post = req.body;
    const { title, description } = post;
    fs.writeFile(`data/${title}`, description, "utf8", (err) => {
      res.redirect(`/topic/${title}`);
    });
  })
  .get("/create", (req, res) => {
    const title = "WEB - create";
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
          <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title" /></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
            <input type="submit" />
          </p>
        </form>
        `,
      "",
      auth.statusUI(req, res),
    );

    res.send(html);
  })
  .get("/update/:pageId", (req, res) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
      const title = req.params.pageId;
      const list = template.list(req.list);
      const html = template.HTML(
        title,
        list,
        `<form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p>
                <input type="text" name="title" placeholder="title" value="${title}" />
            </p>
            <p>
                <textarea name="description" placeholder="description" >${description}</textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>`,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}}">update</a>`,
        auth.statusUI(req, res),
      );
      res.send(html);
    });
  })
  .post("/update_process", (req, res) => {
    const post = req.body;
    fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
      fs.writeFile(`data/${post.title}`, post.description, "utf8", (err) => {
        res.redirect(`/topic/${post.title}`);
      });
    });
  })
  .post("/delete_process", (req, res) => {
    const post = req.body;
    const id = post.id;
    const filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, (err) => {
      res.redirect("/");
    });
  })
  .get("/:pageId", (req, res, next) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf-8", (err, description) => {
      if (err) {
        next(err);
        return;
      }

      const title = req.params.pageId;
      const sanitizedTitle = sanitize(title);
      const sanitizedDescription = sanitize(description, {
        allowedTags: ["h1"],
      });
      const list = template.list(req.list);
      const html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `<a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`,
        auth.statusUI(req, res),
      );

      res.send(html);
    });
  });
