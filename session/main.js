import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import { default as store } from "session-file-store";
import { router as topicRouter } from "./routes/topic.js";
import { router as indexRouter } from "./routes/index.js";
import { router as authRouter } from "./routes/auth.js";

const app = express();
const FileStore = store(session);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static("public"));
app.use(
  session({
    secret: "youngpage@@@!!",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  }),
);
app.get("*", function (request, response, next) {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
