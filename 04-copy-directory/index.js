const path = require('path');
const fs = require('fs/promises');
const files = path.join(__dirname, 'files');
const files_copy = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  try {
    await fs.access(dest);
    await fs.rm(dest, { recursive: true, force: true });
    mainLogic();
  } catch (err) {
    if (err.code === 'ENOENT') {
      mainLogic();
    } else throw err;
  }

  async function mainLogic() {
    try {
      await fs.mkdir(dest, { recursive: true });
      const files = await fs.readdir(src);
      for (let file of files) {
        const stat = await fs.stat(path.join(src, '/', file));
        if (!stat.isDirectory())
          fs.copyFile(path.join(src, '/', file), path.join(dest, '/', file));
        else copyDir(path.join(src, '/', file), path.join(dest, '/', file)); // подпапки рекурсивно копируем
      }
    } catch (err) {
      throw err;
    }
  }
}
copyDir(files, files_copy);
