import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import { default as store } from "session-file-store";
import flash from "connect-flash";
import { router as topicRouter } from "./routes/topic.js";
import { router as indexRouter } from "./routes/index.js";
import { initAuthRouter } from "./routes/auth.js";
import passportInit from "./lib/passport.js";

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
app.use(flash());
// app.get("/flash", (req, res) => {
//   req.flash("info", "Flash is back!");
//   res.send("flash");
// });
// app.get("/flash-display", (req, res) => {
//   const fmsg = req.flash();
//   console.log(fmsg);
//   res.send(fmsg);
//   // res.render("index", { message: req.flash("info") });
// });
const passport = passportInit(app);
const authRouter = initAuthRouter(passport);

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
