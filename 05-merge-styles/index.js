const path = require('path');
const fs = require('fs/promises');

(async () => {
  try {
    let promises = [];
    const files = await fs.readdir(path.join(__dirname, 'styles'));

    for (let file of files) {
      const stat = await fs.stat(path.join(__dirname, 'styles/', file));

      if (!stat.isDirectory() && path.extname(file).slice(1) === 'css')
        promises.push(
          // здесь await лучше не писать
          // нет смысла ждать, а если файлов 500, и среди них большие
          // нужно асинхронно запустить их все и ждать их всех сразу
          fs.readFile(path.join(__dirname, 'styles/', file), 'utf-8'),
        );
    }

    // вернет результаты из всех промисов
    const bundleCss = await Promise.all(promises);

    fs.writeFile(
      path.join(__dirname, 'project-dist/', 'bundle.css'),
      bundleCss.join(''),
    );
  } catch (err) {
    console.log(err);
  }
})();
