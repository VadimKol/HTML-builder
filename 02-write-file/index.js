const fs = require('fs');
const path = require('path');
const { stdin } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Hi! Write something(type exit to end typing):');

stdin.on('data', (data) => {
  let out = data.toString();
  // enter, незнаю что с ним делать
  if (out === 'exit\r\n' || out === 'exit\n') process.exit();
  output.write(out);
});

// ctrl+c жмут, такое событие генерится
process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Farewell and check text.txt'));
