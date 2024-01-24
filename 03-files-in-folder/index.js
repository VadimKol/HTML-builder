const path = require('path');
const fs = require('fs/promises');

// дабы не создавать async функцию и запускать ее, можно просто IIFE
(async () => {
  try {
    // возврат именно данных, а не промиса. Promise.resolve(data) или Promise.result
    const files = await fs.readdir(path.join(__dirname, 'secret-folder'));
    for (let file of files) {
      const stat = await fs.stat(path.join(__dirname, 'secret-folder/', file));
      if (!stat.isDirectory())
        console.log(
          `${path.parse(file).name} - ${path.extname(file).slice(1)} - ${
            stat.size
          } bytes`,
        );
    }
  } catch (err) {
    console.log(err);
  }
})();
