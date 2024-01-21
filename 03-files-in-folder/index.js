const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) throw err;

  for (let file of files) {
    fs.stat(path.join(__dirname, 'secret-folder/', file), (err, stat) => {
      if (err) throw err;
      if (!stat.isDirectory())
        console.log(
          `${path.parse(file).name} - ${path.extname(file).slice(1)} - ${
            stat.size
          } bytes`,
        );
    });
  }
});
