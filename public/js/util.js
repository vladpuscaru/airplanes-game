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
      map += '<div class="game__row game__row__' + index / 10 % 10 + '">';
    }

    map += '<div id="' + index + '" class="game__cell"></div>';
    if (index !== 0 && index % 10 === 9) {
      map += '</div>';
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
function getHtmlConnectedStructure(playersArray) {
  let players = "";
  playersArray.map((playerName) => {
    players += getHtmlConnectedPlayer(playerName);
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
function getHtmlConnectedPlayer(playerName) {
  return '<li>' + playerName + '</li>';
}