const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

// ясно зачем path, запуск идет из папки выше
const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

pipeline(rs, process.stdout, (err) => {
  if (err) console.log(err.message);
});
