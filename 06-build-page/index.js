const path = require('path');
const fs = require('fs');

const destDir = path.join(__dirname, 'project-dist');

let templateHtml = '';
let htmlreadCounter = 0;
let htmlCounter = 0;

let styleCss = '';
let cssreadCounter = 0;
let cssCounter = 0;

fs.access(destDir, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      bundling(destDir);
    } else throw err;
  } else {
    fs.rm(destDir, { recursive: true, force: true }, (err) => {
      if (err) throw err;
      bundling(destDir);
    });
  }
});

function bundling(dest) {
  // создается папка dest
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;

    // собираем html
    function bundleHtml() {
      fs.readdir(path.join(__dirname, 'components'), (err, files) => {
        if (err) throw err;

        fs.readFile(
          path.join(__dirname, 'template.html'),
          'utf-8',
          (err, data) => {
            if (err) throw err;

            templateHtml = data;
            compileHtml(dest, files);
          },
        );
      });
    }
    bundleHtml();

    // собираем css
    function bundleCss() {
      fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
        if (err) throw err;

        for (let file of files) {
          fs.stat(path.join(__dirname, 'styles/', file), (err, stat) => {
            if (err) throw err;
            if (!stat.isDirectory() && path.extname(file).slice(1) === 'css') {
              cssCounter += 1;

              fs.readFile(
                path.join(__dirname, 'styles/', file),
                'utf-8',
                (err, data) => {
                  if (err) throw err;

                  styleCss += data;
                  cssreadCounter += 1;

                  if (cssreadCounter === cssCounter) {
                    const output = fs.createWriteStream(
                      path.join(dest, 'style.css'),
                    );
                    output.write(styleCss);
                  }
                },
              );
            }
          });
        }
      });
    }
    bundleCss();

    // копируем assets
    copyDir(path.join(__dirname, 'assets'), path.join(destDir, 'assets'));
  });
}

function compileHtml(dest, files) {
  for (let file of files) {
    fs.stat(path.join(__dirname, 'components/', file), (err, stat) => {
      if (err) throw err;

      if (!stat.isDirectory() && path.extname(file).slice(1) === 'html') {
        htmlCounter += 1;

        fs.readFile(
          path.join(__dirname, 'components/', file),
          'utf-8',
          (err, data) => {
            if (err) throw err;
            htmlreadCounter += 1;

            templateHtml = templateHtml.replace(
              new RegExp(`{{${path.parse(file).name}}}`, 'g'),
              data,
            );

            if (htmlreadCounter === htmlCounter) {
              const output = fs.createWriteStream(
                path.join(dest, 'index.html'),
              );
              output.write(templateHtml);
            }
          },
        );
      }
    });
  }
}

function copyDir(src, dest) {
  fs.access(dest, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        mainLogic();
      } else throw err;
    } else {
      fs.rm(dest, { recursive: true, force: true }, (err) => {
        if (err) throw err;
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
