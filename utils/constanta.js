const mongoAdress = 'mongodb://localhost:27017/bitfilmsdb';
const port = 3000;
const allowedCors = [
  'https://movies-explorer.anastas.s.nomoredomains.work',
  'http://movies-explorer.anastas.s.nomoredomains.work',
  'https://localhost:3000',
  'http://localhost:3000',
];

module.exports = { mongoAdress, port, allowedCors };
