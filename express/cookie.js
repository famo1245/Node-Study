import http from "http";
import cookie from "cookie";

http
  .createServer((req, res) => {
    console.log(req.headers.cookie);
    if (req.headers.cookie !== undefined) {
      // header에 cookie가 없으면 parse 동작시 에러 발생
      const cookies = cookie.parse(req.headers.cookie);
      console.log(cookies);
      console.log(cookies.yummy_cookie);
    }

    res.writeHead(200, {
      "Set-Cookie": [
        "yummy_cookie=choco",
        "tasty_cookie=strawberry",
        `Permanet=cookie; Max-Age=${60 * 60 * 24 * 30}`,
        "Secure=Secure; Secure",
        "Httponly=hi; HttpOnly",
        "Path=path; Path=/cookie",
        "Domain=domain; Domain=o2.org",
      ],
    });
    res.end("Cookie!");
  })
  .listen(3000);
