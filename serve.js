/* 本地静态预览服务器（零依赖）。运行： node serve.js  → 打开 http://localhost:5500 */
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = __dirname, PORT = process.env.PORT || 5500;
const TYPES = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".css":"text/css", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg",
  ".ico":"image/x-icon", ".json":"application/json", ".webp":"image/webp" };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; return res.end("404 Not Found"); }
    res.setHeader("Content-Type", TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
    res.end(data);
  });
}).listen(PORT, () => console.log("Haichang Brand preview → http://localhost:" + PORT));
