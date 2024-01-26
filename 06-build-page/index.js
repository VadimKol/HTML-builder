const path = require('path');
const fs = require('fs/promises');

const destDir = path.join(__dirname, 'project-dist');
bundling(destDir);

async function bundling(dest) {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });
  bundleHtml(dest);
  bundleCss(dest);
  copyDir(path.join(__dirname, 'assets'), path.join(destDir, 'assets'));
}

async function bundleHtml(dest) {
  try {
    const promises = [];
    const files = await fs.readdir(path.join(__dirname, 'components'));
    let templateHtml = await fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    for (let file of files) {
      const stat = await fs.stat(path.join(__dirname, 'components/', file));
      if (!stat.isDirectory() && path.extname(file).slice(1) === 'html')
        promises.push(
          fs.readFile(path.join(__dirname, 'components/', file), 'utf-8'),
        );
    }
    // тут есть хитрость, порядок соот-вует тому как запушили
    // не важно кто самый быстрый
    const htmlArr = await Promise.all(promises);
    for (let i = 0; i < htmlArr.length; i++) {
      templateHtml = templateHtml.replace(
        new RegExp(`{{${path.parse(files[i]).name}}}`, 'g'),
        htmlArr[i],
      );
    }
    fs.writeFile(path.join(dest, 'index.html'), templateHtml);
  } catch (err) {
    console.log(err);
  }
}

async function bundleCss(dest) {
  try {
    const promises = [];
    const files = await fs.readdir(path.join(__dirname, 'styles'));
    for (let file of files) {
      const stat = await fs.stat(path.join(__dirname, 'styles/', file));
      if (!stat.isDirectory() && path.extname(file).slice(1) === 'css')
        promises.push(
          fs.readFile(path.join(__dirname, 'styles/', file), 'utf-8'),
        );
    }
    const styleCss = await Promise.all(promises);
    fs.writeFile(path.join(dest, 'style.css'), styleCss.join(''));
  } catch (err) {
    console.log(err);
  }
}

async function copyDir(src, dest) {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });
    const files = await fs.readdir(src);
    for (let file of files) {
      const fileSrc = path.join(src, '/', file);
      const fileDest = path.join(dest, '/', file);
      const stat = await fs.stat(fileSrc);
      if (!stat.isDirectory()) fs.copyFile(fileSrc, fileDest);
      else copyDir(fileSrc, fileDest);
    }
  } catch (err) {
    console.log(err);
  }
}
