/*
 ** UTILITY Functions used by the client
 * - getHtmlMapStructure(mapConfigArray)
 * - getHtmlConnectedStructure(playersArray)
 *
 */

/*
 * @params:
 **  - mapConfigArray (array) -> the array with the map configuration
 *
 * @return:
 **  - map (string) -> HTML structure
 */
function getHtmlMapStructure(mapConfigArray) {
  let map = "";
  mapConfigArray.map((element, index) => {
    if (index % 10 === 0) {
      map += '<div class="game__row game__row__' + ((index / 10) % 10) + '">';
    }

    map += '<div id="' + index + '" class="game__cell"></div>';
    if (index !== 0 && index % 10 === 9) {
      map += "</div>";
    }
  });

  return map;
}

/*
 * @params:
 **  - playersArray (array) -> the array with the names of the players
 *
 * @return:
 **  - players (string) -> HTML structure
 */
function getHtmlConnectedStructure(playersArray, myPlayerName, scores) {
  let players = "";
  playersArray.map(playerName => {
    players += getHtmlConnectedPlayer(
      playerName,
      myPlayerName,
      scores[playerName]
    );
  });
  return players;
}

/*
 * @params:
 **  - playerName (string) -> the name of the player
 *
 * @return:
 **  - (string) -> HTML structure
 */
function getHtmlConnectedPlayer(playerName, myPlayerName, score) {
  console.log(playerName + ", " + myPlayerName + ", " + score);
  return (
    "<li id='" +
    playerName +
    "'" +
    (playerName === myPlayerName ? " class=" + '"me"' : "") +
    ">" +
    playerName +
    " | <span class='score'>Score: <strong>" +
    score +
    "</strong></span></li>"
  );
}

/*
 * @params:
 **  - playerName (string) -> the name of the player
 **  - score (number) -> the new score
 *
 * @return:
 **  - (string) -> HTML structure
 */
function updatePlayerScore(playerName, score) {
  return (
    playerName +
    " | <span class='score'>Score: <strong>" +
    score +
    "</strong></span>"
  );
}

/*
 * @params:
 **  - playerName (string) -> the name of the player
 **  - message (string) -> the new message to be added
 *
 * @return:
 **  - (string) -> HTML structure
 */
function getUpdatedHtmlChatBox(chatBoxHtml, playerName, message) {
  return (
    chatBoxHtml +
    "<li><strong>" +
    playerName +
    "</strong>: <em>" +
    message +
    "</em></li>"
  );
}

// Restarts the game
function gameOver(message, time) {
  $("#game-over--message").html(
    message + '<span id="game-over--counter">5</span>'
  );

  $("#game-over").addClass("active");
  setTimeout(function() {
    $("#game-over").removeClass("active");
    clearInterval(countDown);
  }, time);

  let counter = time / 1000;
  $("#game-over--counter").html(counter);

  let countDown = setInterval(function() {
    counter--;
    console.log("WTF? " + counter);
    $("#game-over--counter").html(counter);
  }, 1000);
}
