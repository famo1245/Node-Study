import express from "express";
import parseurl from "parseurl";
import session from "express-session";
import { default as store } from "session-file-store";

const app = express();
const FileStore = store(session);

app.use(
  session({
    // secret 옵션은 변수처리 필요, 노출되면 안되는 값
    secret: "keyboard cat",
    // 데이터를 세션 저장소에 저장할지 여부, false이면 세션 데이터가 바뀌지 않는한 세션 저장소에 저장x
    resave: false,
    // 세션의 구동여부, true이면 세션이 필요하기 전까지 구동 x
    saveUninitialized: true,
    store: new FileStore(),
  }),
);

app.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = {};
  }

  // get the url pathname
  const pathname = parseurl(req).pathname;

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  next();
});

app
  .get("/", (req, res, next) => {
    console.log(req.session);
    if (req.session.num === undefined) {
      req.session.num = 1;
    } else {
      req.session.num += 1;
    }
    res.send(`Views: ${req.session.num}`);
  })
  .get("/foo", (req, res, next) => {
    res.send("You viewed this page " + req.session.views["/foo"] + " times");
  })
  .get("/bar", (req, res, next) => {
    res.send("You viewed this page " + req.session.views["/bar"] + " times");
  });

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
