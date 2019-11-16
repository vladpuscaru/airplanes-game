/*
  * Make a WebSocket connection with the server
  * The WebSocket "handshake"
*/
function initializeWebSocket(playerName, game, chat, connected) {
  const socket = io.connect('http://localhost:5000');

  /*
    * One time emits when the client first connects
    * It sends the name of the player
  */
  socket.emit('new-client', {
    playerName: playerName
  });

  /*
  * Add WebSocket listeners
  * 'map-config' -> gets the configuration of the map
  * 'cell-click-answer' -> receives the answer upon clicking a cell
  * 'new-arrival' -> receives the name of the newly connected client
  * 'client-disconnected' -> receives the updated players array and updates the front end
  * 
  */
  socket.on('map-config', (data) => {
    /*
      * Set the HTML structure based on the 
      * map configuration array received from the server
    */
    let map = getHtmlMapStructure(data.mapConfig);
    game.html(map);

    /*
      * Add click listeners to the newly created cells
      * When a cell is clicked, the client emits a message to
      * the server, sending the index of the cell clicked
    */
    cells = $(".game__cell");
    
    $(".game__cell").click(function() {
      let index = parseInt($(this).attr('id'));
      socket.emit('cell-click', index);
    });

    /*
      * Set the list with the connected players
      * based on the data received from the server
    */
    let players = getHtmlConnectedStructure(data.players);
    connected.html(players);
  });


  socket.on('cell-click-answer', (data) => {
    console.log(JSON.stringify(data));
    // TODO: status answer bar
    // check the answer
    if (data.value === 0) {
      // no plane was hit
      // TODO: update the status
      $("#" + data.cellIndex).addClass('active missed');
    } else if (data.value === 1) {
      // body of a plane was hit
      // TODO: update the status
      $("#" + data.cellIndex).addClass('active body');
    } else {
      // head of a plane was hit and the plane is destroyed
      // TODO: update the status
      $("#" + data.cellIndex).addClass('active head');
      data.indices.forEach((e) => {
        $("#" + e).addClass('active body');
      });
    }
  });


  socket.on('new-arrival', (playerName) => {
    /*
      * Update the connected list
    */
    connected.append(getHtmlConnectedPlayer(playerName));
  });


  socket.on('client-disconnected', (playersArray) => {
    /*
      * Update the list with the updated array
    */
    connected.html(getHtmlConnectedStructure(playersArray));
  });
  
  /*
    * Fires upon refresh/window close
    * -> sends the server the 'intention' to disconnect (simulation)
    * -> sends the server the name of the player
  */
  $(window).on("unload", function() {
    alert('a');
    socket.emit('trying-disconnect', playerName);
  });


}


