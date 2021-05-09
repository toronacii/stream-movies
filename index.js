const path = require('path');
const express = require('express')
const mustacheExpress = require('mustache-express');
require('dotenv').config()

const { readdir, isFile, getSubtitle } = require('./util');

const app = express()
const port = 8080

const baseUrl = process.env.BASE_URL;

app.use(express.static(baseUrl));
app.engine('html', mustacheExpress());


app.get('/', async (req, res) => {
  const fileOrFolder = path.join(baseUrl, req.query.p || '');

  const _isFile = await isFile(fileOrFolder);

  if (_isFile && fileOrFolder.includes('.mp4')) {
    const movie = fileOrFolder.replace(baseUrl, '');

    return res.render('video.html', { movie })
  }

  const files = await readdir(fileOrFolder);
  res.render('index.html', { files });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});