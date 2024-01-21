const path = require('path');
const fs = require('fs');

let bundleCss = '';
let streamCounter = 0;
let cssCounter = 0;

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) throw err;

  for (let file of files) {
    fs.stat(path.join(__dirname, 'styles/', file), (err, stat) => {
      if (err) throw err;
      if (!stat.isDirectory() && path.extname(file).slice(1) === 'css') {
        cssCounter += 1;
        //console.time(file);

        //const rs = fs.createReadStream(
        //path.join(__dirname, 'styles/', file),
        //'utf-8',
        //);
        // полным куском писать не красиво, теряется вся мощь чанков
        fs.readFile(
          path.join(__dirname, 'styles/', file),
          'utf-8',
          (err, data) => {
            if (err) throw err;
            bundleCss += data;
            streamCounter += 1;
            //console.timeEnd(file);
            if (streamCounter === cssCounter) {
              const output = fs.createWriteStream(
                path.join(__dirname, 'project-dist/', 'bundle.css'),
              );
              output.write(bundleCss);
            }
          },
        );

        //rs.on('data', (chunk) => (bundleCss += chunk));

        // можно было и через readFile и в колбэке записать тоже самое
        // косяк, если файлы будут жирные, и чанки будут в перемешку
        // тогда стили сломаются
        // либо терять асинхронность, либо делать блокировки для жирного файла
        /*rs.on('end', () => {
          streamCounter += 1;
          console.timeEnd(file);
          if (streamCounter === cssCounter) {
            const output = fs.createWriteStream(
              path.join(__dirname, 'project-dist/', 'bundle.css'),
            );
            output.write(bundleCss);
          }
          rs.destroy();
        });

        rs.on('error', (error) => {
          throw error;
        });*/
      }
    });
  }
});
