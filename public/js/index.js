$(document).ready(function () {

  let cells;

  /*
    * Initialize DOM components
  */
  let game      = $("#game"),
      chat      = $("#chat"),
      connected = $("#connected");

  /*
    * Make a WebSocket connection with the server
    * The WebSocket "handshake"
  */
  const socket = io.connect('http://localhost:5000');

  /*
    * Add WebSocket listeners
    * 'map-config' -> gets the configuration of the map
    * 'cell-click-answer' -> receives the answer upon clicking a cell
  */
  socket.on('map-config', (data) => {
    let map = "";
    data.map((element, index) => {
      if (index % 10 === 0) {
        map += '<div class="game__row game__row__' + index / 10 % 10 + '">';
      }

      map += '<div id="' + index + '" class="game__cell"></div>';
      if (index !== 0 && index % 10 === 9) {
        map += '</div>';
      }
    });
    game.html(map);

    cells = $(".game__cell");
    
    /*
      * Add WebSocket emits
      * The emits are linked to listeners on the front-end
      * like click/hover actions done by the user
      * 'cell-click' - sends the coordinates(index in array ftm) of the cell clicked
      * 
    */
    $(".game__cell").click(function() {
      let index = parseInt($(this).attr('id'));
      socket.emit('cell-click', index);
    });
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

});