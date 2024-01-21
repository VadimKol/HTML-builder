const path = require('path');
const fs = require('fs');
const files = path.join(__dirname, 'files');
const files_copy = path.join(__dirname, 'files-copy');

function copyDir(src, dest) {
  // колбэки на колбэках, 5 вложенных вызовов :(

  fs.access(dest, (err) => {
    // если папка dest уже есть, удаляем ее, чтобы учитывать любые изменения в src папке
    if (err) {
      if (err.code === 'ENOENT') {
        mainLogic();
      } else throw err;
    } else {
      fs.rm(dest, { recursive: true, force: true }, (err) => {
        if (err) {
          throw err;
        }
        mainLogic();
      });
    }
  });

  function mainLogic() {
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) throw err;

      fs.readdir(src, (err, files) => {
        if (err) throw err;

        for (let file of files) {
          fs.stat(path.join(src, '/', file), (err, stat) => {
            if (err) throw err;

            if (!stat.isDirectory())
              fs.copyFile(
                path.join(src, '/', file),
                path.join(dest, '/', file),
                (err) => {
                  if (err) throw err;
                },
              );
            else copyDir(path.join(src, '/', file), path.join(dest, '/', file)); // подпапки рекурсивно копируем
          });
        }
      });
    });
  }
}

copyDir(files, files_copy);
