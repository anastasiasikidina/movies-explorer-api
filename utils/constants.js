const port = 3000;
const mongoAdress = 'mongodb://localhost:27017/bitfilmsdb';
// eslint-disable-next-line import/prefer-default-export
// Массив доменов, с которых разрешены кросс-доменные запросы
const ALLOWED_CORS = [
  'http://localhost:3000',
  'https://movies-explorer-api.nomoredomains.rocks',
  'https://movies-explorer.anastas.s.nomoredomains.work',
  'http://movies-explorer.anastas.s.nomoredomains.work',

];

module.exports = {
  mongoAdress, port, ALLOWED_CORS,
};

module.exports = {
  JWT_SECRET_LOCAL: 'some-very-secret-code',
};
