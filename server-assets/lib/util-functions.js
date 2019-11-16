const fs = require('fs');
const properties = require('../../properties');
// const countFiles = require('count-files');

const getRandomMapConfig = () => {
  // get the number of map configurations
  let n = fs.readdirSync(`${properties.DB_PATH}`).length;
  // get a random configuration
  n = Math.floor(Math.random() * n) + 1;

  // construct the name of the file
  const fileName = (n + '.txt');

  return fileName;
}

const isLetter = (char) => {
  const letters = /^[A-Za-z]+$/;
  return char.match(letters);
}

const readRandomMapConfig = () => {
  return fs.readFileSync(`${properties.DB_PATH}/${getRandomMapConfig()}`, 'utf8');
}

module.exports = {
  readRandomMapConfig: readRandomMapConfig,
  isLetter: isLetter
}
