const fs = require('fs');
const path = require('path');

// ясно зачем path, запуск идет из папки выше
const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

//console.log(rs.data);

let data = '';

// читаем блоками по 64кб, поэтому надо складывать все вместе куда-то
rs.on('data', (chunk) => (data += chunk));

rs.on('end', () => console.log(data));

// ловим ошибки
rs.on('error', (error) => console.log(error.message));
