const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require("cors")
const port = process.env.PORT || 3000

app.use(cors())

app.get("/", (req, res) => {
  res.sendStatus(200)
})

app.get("/video", (req, res) => {
  const range = req.headers.range;
  console.log("Request received");
  if (!range) {
    res.status(400).send("no range found")
  }
  const videoPath = path.join(__dirname, "videos/sample1.mp4")
  const videoSize = fs.statSync(videoPath).size;
  const chunkSize = 10 ** 6;

  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res);

})
app.listen(3000)