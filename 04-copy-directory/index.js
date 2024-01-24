const path = require('path');
const fs = require('fs/promises');
const files = path.join(__dirname, 'files');
const files_copy = path.join(__dirname, 'files-copy');

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
copyDir(files, files_copy);
