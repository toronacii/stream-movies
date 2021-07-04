const path = require('path');
const express = require('express')
const mustacheExpress = require('mustache-express');
require('dotenv').config()

const { BASE_URL, PORT } = process.env;

const { readdir, isFile, getSubtitle } = require('./util');

const app = express()

app.use(express.static(BASE_URL));
app.engine('html', mustacheExpress());


app.get('/', async (req, res) => {
  const fileOrFolder = path.join(BASE_URL, req.query.p || '');

  const _isFile = await isFile(fileOrFolder);

  if (_isFile && fileOrFolder.includes('.mp4')) {
    const movie = fileOrFolder.replace(BASE_URL, '');

    return res.render('video.html', { movie })
  }

  const files = await readdir(fileOrFolder);
  res.render('index.html', { files });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});