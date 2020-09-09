const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const server = http.createServer();
const server2 = http.createServer();

server.listen(8081, () => console.log("http://localhost:8081 端口已经启动！"));
server2.listen(5000, () => console.log("http://localhost:5000 端口启动！"));

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
    /*  } else if (req.url == "/person.json") { // 正常ajax请求
    fs.readFile(path.join(__dirname, "./person.json"), "utf-8", (err, data) => {
      if (err) res.end();
      res.write(data);
      res.end();
    });
  } */
  } else if (req.url.indexOf("/person.json") >= 0) {
    // JSONP跨域请求
    var params = querystring.parse(req.url.split("?")[1]);
    var fn = params.callback;
    console.log(fn);
    fs.readFile(path.join(__dirname, "./person.json"), "utf-8", (err, data) => {
      if (err) res.end();
      res.writeHead(200, { "Content-type": "text/javascript" });
      res.write(fn + "(" + JSON.stringify(data) + ")");
      res.end();
    });
  }
});

server2.on("request", (req, res) => {
  if (req.url == "/") {
    fs.readFile(path.join(__dirname, "./JSONP跨域/index.html"), (err, data) => {
      if (err) {
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
  }
});
