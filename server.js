const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const properties = require('./properties');
const util = require('./server-assets/lib/util-functions');

const app = express();

app.use(express.static('public'));

const server = app.listen(properties.PORT, () => {
  console.log(`Listening on port ${properties.PORT}...`);
});


// initialize the server socket
const io = socket(server);

// initialize listeners
io.on('connection', (socket) => {
  // TODO: log connection in a csv file
  console.log('ws connection made! ->', socket.id);

  // send the map structure as an ARRAY
  // also, keep the map in the locals
  app.locals.data = util.readRandomMapConfig()
                    .split('')
                    .filter(e => e !== '\n' && e !== '\r');
  socket.emit('map-config', app.locals.data);

  /*
    * Add WebSocket listeners
    * 'cell-click' - receives the index of the cell that was clicked
    * 
  */
  socket.on('cell-click', (index) => {
    /*
      * Determine what answer to send, based on the value of the cell
      * that was clicked.
      * 0 -> shot missed
      * 1 -> shot hit on the BODY of the airplane
      * X -> shot hit on the HEAD of the airplane
      * 
      * params:
      * *cellIndex -> returns the index of the cell that was clicked
      * *value -> the actual answer from above 
      * *planeDestroyed -> flag that indicates wheter or not the plane was shutdown
      * *indices -> if the plane was destroyed, the server will send all of the indices
      *             which compose the airplane, so that the front-end could adjoust the cells
      *             accordingly
    */
    let cellValue = app.locals.data[index];
    let value,
        indices = [];
    // console.log('Was hit!:', cellValue);
    if (util.isLetter(cellValue)) {
      // hit to the head
      value = 'X';
      planeDestroyed = true;

      let planeValue;
      switch (cellValue) {
        case 'A': planeValue = '1'; break;
        case 'B': planeValue = '2'; break;
        case 'C': planeValue = '3'; break;
      }

      app.locals.data.forEach((e, index) => {
        if (e === planeValue) {
          indices.push(index);
        }
      });

    } else if (cellValue === '0') {
      // no hit
      value = 0;
    } else {
      // hit to the body
      value = 1;
    }

    // Send the data
    socket.emit('cell-click-answer', {
      cellIndex: index,
      value: value,
      indices: indices
    });
  });
});