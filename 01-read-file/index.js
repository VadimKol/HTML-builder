const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

// ясно зачем path, запуск идет из папки выше
pipeline(
  fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8'),
  process.stdout,
  (err) => {
    if (err) console.log(err.message);
  },
);
