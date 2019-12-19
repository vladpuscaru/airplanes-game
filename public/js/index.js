$(document).ready(function() {
  /*
   * Initialize DOM components
   */
  let game = $("#game"),
    chat = $("#chat"),
    connected = $("#connected ul");
  logInScreen = $("#logIn");
  logInName = $("#logIn__name");
  logInBtn = $("#logIn__btn");

  /*
   * Click Handler on the log in button at the start
   * Checks if the user entered a name in the input field
   * If so, initializes the websocket connection with the server
   * If there is no input, makes the app to display an error message
   */
  logInBtn.click(e => {
    e.preventDefault();
    if (logInName.val().length > 0) {
      initializeWebSocket(logInName.val(), game, chat, connected);
      logInScreen.addClass("handled");
    } else {
      logInName.addClass("animated inputErrorFlicker");
    }
  });

  /*
   * Change Handler for the input field
   * It removes the error animation when the user tryes to type
   */
  logInName.keypress(() => {
    if (logInName.hasClass("animated inputErrorFlicker")) {
      logInName.removeClass("animated inputErrorFlicker");
    }
  });
});
