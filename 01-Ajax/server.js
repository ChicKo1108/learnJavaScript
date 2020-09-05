const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();

server.listen(8081, () => console.log("http://localhost:8081 端口已经启动！"));

server.on("request", (req, res) => {
  console.log("服务器收到请求", req.url);
  if (req.url == "/") {
    fs.readFile(path.join(__dirname, "./index.html"), (err, data) => {
      if (err) {
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
  } else if (req.url == "/person.json") {
    fs.readFile(path.join(__dirname, "./person.json"), "utf-8", (err, data) => {
      if (err) res.end();
      res.write(data);
      res.end();
    });
  }
});
