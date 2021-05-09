const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const baseUrl = process.env.BASE_URL;

const readdirFn = promisify(fs.readdir);
const statFn = promisify(fs.stat);

async function readdir(dir) {

  const _files = await readdirFn(dir);
  const files = [];

  if (dir !== baseUrl) {
    files.push({
      name: '..',
      path: path.join(dir, '..').replace(baseUrl, ''),
      isDirectory: true
    })
  }

  for (const file of _files) {
    const absolutePath = path.join(dir, file);
    const _isFile = await isFile(absolutePath);
    files.push({
      name: file,
      path: absolutePath.replace(baseUrl, ''),
      isFile: _isFile,
      isDirectory: !_isFile,
    })
  }

  return files;
}

function isFile(fileOrFolder) {
  return statFn(fileOrFolder)
    .then(stat => stat.isFile());
}

module.exports = {
  readdir,
  isFile
}