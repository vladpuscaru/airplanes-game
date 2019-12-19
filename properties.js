/*
 * This is a configuration file which holds an object
 * with the constants needed for this app like:
 * PORT - the port where the server should listen
 * HOST - the host (default: localhost/127.0.0.1)
 * DB_PATH - the path to the folder with maps configuration (database path)
 *
 * As this constants may change and there are many files
 * which use them, it's easier to have them in one place
 */

module.exports = {
  PORT: 8080,
  HOST: "http://localhost",
  DB_PATH: "./server-assets/map-configs",
  WAIT_TIME: 5000
};
