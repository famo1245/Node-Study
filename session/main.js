import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import { default as store } from "session-file-store";
import passport from "passport";
import flash from "connect-flash";
import { Strategy as LocalStrategy } from "passport-local";
import { router as topicRouter } from "./routes/topic.js";
import { router as indexRouter } from "./routes/index.js";
import { router as authRouter } from "./routes/auth.js";

const app = express();
const FileStore = store(session);
const authData = {
  email: "famo1245",
  password: "1234",
  nickname: "young",
};

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
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (username, password, done) => {
      console.log("LocalStrategy", username, password);
      if (username === authData.email) {
        console.log(1);
        if (password === authData.password) {
          console.log(2);
          return done(null, authData, { message: "Welcome." });
        } else {
          console.log(3);
          return done(null, false, { message: "Incorrect password." });
        }
      } else {
        console.log(4);
        return done(null, false, { message: "Incorrect username." });
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("serialize", user);
  done(null, user.email);
});
passport.deserializeUser((id, done) => {
  console.log("deserialize", id);
  done(null, authData);
});

app.get("*", function (request, response, next) {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.post(
  "/auth/login_process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
);
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
