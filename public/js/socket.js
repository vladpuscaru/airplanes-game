let gameRestarted = false;
/*
 * Make a WebSocket connection with the server
 * The WebSocket "handshake"
 */
function initializeWebSocket(playerName, game, chat, connected) {
  const socket = io.connect("http://localhost:8080");

  /*
   * One time emits when the client first connects
   * It sends the name of the player
   */
  socket.emit("new-client", {
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
  socket.on("map-config", data => {
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
      let index = parseInt($(this).attr("id"));
      socket.emit("cell-click", {
        index,
        playerName
      });
    });

    /*
     * Set the list with the connected players
     * based on the data received from the server
     */
    let players = getHtmlConnectedStructure(data.players, data.scores);
    connected.html(players);
  });

  socket.on("cell-click-answer", data => {
    // check the answer
    if (data.value === 0) {
      // no plane was hit
      $("#" + data.cellIndex).addClass("active missed");
    } else if (data.value === 1) {
      // body of a plane was hit
      $("#" + data.cellIndex).addClass("active body");
    } else {
      // head of a plane was hit and the plane is destroyed
      $("#" + data.cellIndex).addClass("active head");
      data.indices.forEach(e => {
        $("#" + e).addClass("active body");
      });
    }

    // update the score
    $("#" + playerName).html(updatePlayerScore(playerName, data.score));

    if (gameRestarted) {
      $(".game__cell").removeClass("active");
      gameRestarted = false;
    }
  });

  socket.on("score-update", data => {
    // update the score
    $("#" + data.player).html(updatePlayerScore(data.player, data.score));
  });

  socket.on("new-arrival", data => {
    /*
     * Update the connected list
     */
    let player = data.playerName;
    let score = data.score;
    connected.append(getHtmlConnectedPlayer(player, score));
  });

  /*
   * Action when the game is finished
   * Gets the new map config, players and scores
   * and updates them
   */
  socket.on("restart-game", ({ mapConfig, players, scores }) => {
    let map = getHtmlMapStructure(mapConfig);
    game.html(map);

    cells = $(".game__cell");

    $(".game__cell").click(function() {
      let index = parseInt($(this).attr("id"));
      socket.emit("cell-click", {
        index,
        playerName
      });
    });

    connected.html(getHtmlConnectedStructure(players, scores));
    gameRestarted = true;
  });

  socket.on("you-won", time => {
    gameOver("Congratulations! You won! The game will restart in ...", time);
  });

  socket.on("game-over", data => {
    let time = data.time;
    let playerName = data.playerName;

    gameOver(
      "Congratulations to <span id='game-over--name'>" +
        playerName +
        "</span> for winning the game! The game will restart in ...",
      time
    );
  });

  socket.on("client-disconnected", data => {
    /*
     * Update the list with the updated array
     */
    players = data.players;
    scores = data.scores;
    connected.html(getHtmlConnectedStructure(players, scores));
  });

  let chatBox = chat.find(".chat--box");
  socket.on("chat-message-incoming", data => {
    /*
     * Update the chat
     */
    chatBox.html(
      getUpdatedHtmlChatBox(chatBox.html(), data.playerName, data.message)
    );
    chatBox.scrollTop(10000000);
  });

  /*
   * Fires upon refresh/window close
   * -> sends the server the 'intention' to disconnect (simulation)
   * -> sends the server the name of the player
   */
  $(window).on("unload", function() {
    socket.emit("trying-disconnect", playerName);
  });

  /*
   * Add click listener for the chat send button
   */
  let btnSubmit = chat.find("input[type='submit']");
  let inputChat = chat.find("input[type='text']");

  btnSubmit.click(function(e) {
    e.preventDefault();
    if (inputChat.val().length > 0) {
      let message = inputChat.val();
      socket.emit("chat-message", {
        playerName,
        message
      });
      chatBox.html(
        getUpdatedHtmlChatBox(chatBox.html(), playerName, inputChat.val())
      );
      chatBox.scrollTop(10000000);
      inputChat.val("");
    }
  });
}
