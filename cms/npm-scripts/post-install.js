const fs = require('fs');
const path = require('path');

const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

const distPath = `${__dirname}/../public/dist`;

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

const tinymcePath = `${distPath}/tinymce`;

if (!fs.existsSync(tinymcePath)) {
  copyRecursiveSync(`${__dirname}/../node_modules/tinymce`, tinymcePath);
}
