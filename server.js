"use strict";
const express = require("express");
const socket = require("socket.io");
const fs = require("fs");
const properties = require("./properties");
const util = require("./server-assets/lib/util-functions");

/*
 * Initialize server
 * -> get the express app in a constant
 * -> set the middleware for serving static html
 * -> populate local storage with the map config (app.locals.data)
 * -> initialize an empty array for player connected (app.locals.players)
 * -> start the server
 */
const app = express();
app.use(express.static("public"));

app.locals.data = util
  .readRandomMapConfig()
  .split("")
  .filter(e => e !== "\n" && e !== "\r");
app.locals.players = [];
app.locals.scores = {};

const server = app.listen(properties.PORT, () => {
  console.log(`Listening on port ${properties.PORT}...`);
});

// initialize the server socket
const io = socket(server);

// initialize listeners
io.on("connection", socket => {
  /*
   * Update server when a new client has connected
   * -> update the list of connected players
   * TODO: log connections in a csv file
   */
  socket.on("new-client", data => {
    app.locals.players.push(data.playerName);
    app.locals.scores[data.playerName] = 0;
    // console.log("CONN:");
    // console.log(app.locals.scores);

    console.log(
      `${app.locals.players[app.locals.players.length - 1]} has connected!`
    );
    /*
     * Send data to the new client and also alert the other players
     * -> send the current map configuration
     * -> send the list of clients already connected
     * -> broadcast to the other clients the new arriver
     */
    socket.emit("map-config", {
      mapConfig: app.locals.data,
      players: app.locals.players,
      scores: app.locals.scores
    });

    socket.broadcast.emit("new-arrival", {
      playerName: data.playerName,
      score: app.locals.scores[data.playerName]
    });
  });

  /*
   * Checks if someone has destroyed all 3 planes
   * send the winner a message
   * broadcast the name of the winner to other players
   */
  function checkIfGameIsOver(playerName) {
    app.locals.players.forEach(e => {
      if (app.locals.scores[e] >= 3) {
        // someone won
        socket.emit("you-won", properties.WAIT_TIME);
        socket.broadcast.emit("game-over", {
          playerName: playerName,
          time: properties.WAIT_TIME
        });
      }
    });
  }

  /*
   * Add WebSocket listeners
   * 'cell-click' - receives the index of the cell that was clicked
   * 'trying-disconnect' - handler when a client disconnects (browser refresh or closed)
   *
   */
  socket.on("cell-click", data => {
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
    let index = data.index;
    let playerName = data.playerName;

    let cellValue = app.locals.data[index];
    let value,
      indices = [];
    // console.log('Was hit!:', cellValue);
    if (util.isLetter(cellValue)) {
      // hit to the head
      value = "X";

      app.locals.scores[playerName] = app.locals.scores[playerName] + 1;

      checkIfGameIsOver(playerName);

      let planeValue;
      switch (cellValue) {
        case "A":
          planeValue = "1";
          break;
        case "B":
          planeValue = "2";
          break;
        case "C":
          planeValue = "3";
          break;
      }

      app.locals.data.forEach((e, index) => {
        if (e === planeValue) {
          indices.push(index);
        }
      });
    } else if (cellValue === "0") {
      // no hit
      value = 0;
    } else {
      // hit to the body
      value = 1;
    }

    // Send the data
    socket.emit("cell-click-answer", {
      cellIndex: index,
      value: value,
      indices: indices,
      score: app.locals.scores[playerName]
    });

    // Send the score to the other clients
    socket.broadcast.emit("score-update", {
      player: playerName,
      score: app.locals.scores[playerName]
    });
  });

  socket.on("trying-disconnect", playerName => {
    /*
     * Handles the players array when a client disconnects
     * -> pops the player from the players array
     * -> broadcast the other still connected players the name of the disconnected one
     */
    console.log(playerName + " disconnected!");
    app.locals.players = app.locals.players.filter(e => e !== playerName);
    delete app.locals.scores[playerName];
    socket.broadcast.emit("client-disconnected", {
      players: app.locals.players,
      scores: app.locals.scores
    });
  });

  socket.on("chat-message", data => {
    /*
     * Handles the chat
     * -> receives the message from a client
     * -> broadcast the other still connected clients
     */
    let playerName = data.playerName;
    let message = data.message;
    socket.broadcast.emit("chat-message-incoming", {
      playerName,
      message
    });
  });
});
