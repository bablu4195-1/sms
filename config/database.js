const pg = require('pg');

const config = require('./config.json');

const pool = new pg.Pool(config.development);
const connect = () => {
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      console.log('Database is connected');
    }
  });
}

module.exports = {
  connect: connect,
  pool: pool
};
