/**
 * Trivia Game Logic
 * Ronny Tomasetti
 * 2016 UCF Coding Bootcamp
 */

/* Declare new global TriviaGame object */
var game = {};
/* Trivia questions template stored in index.html */
var qTemplate;
/* Trivia answers template stored in index.html */
var aTemplate;
/* Declare global time interval variable */
var timer;

$( document ).ready( function()
{

  /**
   *  Start new game
   *
   *  Initializes global game objects declared above.
   *  Calls function to retrieve json containing questions.
   *  Binds one click event listener to start button.
   *
   *  @param (button) start-button object clicked
   *  @return undefined
   */
   function startGame()
   {
    /* Initialize global game variables */
    game = new TriviaGame();
    qTemplate = $( '#question-template' ).html();
    aTemplate = $( '#answers-template' ).html();

    /* Start retrieving questions json */
    game.retrieveQuestions();

    /* Bind event listener to start button */
    $( 'button.start-button' ).one( 'click', startRound );

   }
   /* END startGame() ---------------------------- */

  /**
   *  Start new round
   *
   *  Hides start button.
   *  Reset game object variables.
   *  Reset time remaining.
   *  Calls displayNextQuestion() function.
   *
   *  @param ()
   *  @return undefined
   *
   */
   function startRound()
   {

    /* Hide start button */
    $( this ).addClass( 'hide' );

    /* Initiate new round and reset time remaining */
    game.newRound();
    game.resetTimeRemaining();

    displayQuestion();

   }
   /* END startRound() ---------------------------- */

  /**
   *  Display the next question
   *
   *  Clone template in order to create question.
   *  Adds current question and choices to new question template.
   *  Appends new question to trivia-cards div.
   *  Starts timer.
   *
   *  @param ()
   *  @return undefined
   *
   */
   function displayQuestion()
   {
    /* Store copy of question template */
    var questionTemplate = $( qTemplate ).clone();

    /* Grab question string and choices array from trivia game object */
    var question = game.questionsBank[ game.currentQuestion ].question;
    var choices = game.questionsBank[ game.currentQuestion ].choices;

    /* Set up html for current question */
    $( questionTemplate ).find( '#question' )
                         .html( question );

    /* Loop through choices array in order to set up html and click listeners */
    $.each( choices, function( index, value )
    {

      $( questionTemplate ).find( '#' + index )
                           .html( value )
                           .click( checkAnswer );

    });
    /* END .each() loop */

    /* Add question to div with id trivia-cards */
    $( '#trivia-cards' ).append( questionTemplate );

    /* Time starts now!! */
    startTimer();
   }
   /* END displayQuestion() ---------------------------- */

  /**
   *  Checks answer after every question
   *
   *  Clear previous questions timer.
   *  Unbinds click event from choices.
   *  Compare user's answer with correct answer.
   *
   *  @param (object) element clicked
   *  @return undefined
   *
   */
   function checkAnswer()
   {

    clearInterval( timer );

    $( '#trivia-cards' ).children()
                        .unbind( 'click', checkAnswer );

    var userChoice = $( this ).attr( 'id' );
    var correctAnswer = game.questionsBank[ game.currentQuestion ].answer;

    if ( userChoice === null ) /* Player did not answer question in time */
    {
      game.unanswered++;
      displayAnswer( false );
    }
    else if ( userChoice == correctAnswer ) /* Player answered correctly */
    {
      game.correctAnswers++;
      displayAnswer( true );
    }
    else /* Player answered incorrectly */
    {
      game.incorrectAnswers++;
      displayAnswer( false );
    }

   }
   /* END checkAnswer() ---------------------------- */

  /**
   *  Displays the answer to previous question
   *
   *  If more questions are available, shows next question.
   *  Else, show final results of trivia round.
   *
   *  @param (bool) true, if user answered question correctly
   *  @return undefined
   *
   */
   function displayAnswer( isCorrect )
   {
    /* Store copy of question template */
    var answerTemplate = $( aTemplate ).clone();

    /* Grab question string and choices array from trivia game object */
    var question = game.questionsBank[ game.currentQuestion ].question;
    var choices = game.questionsBank[ game.currentQuestion ].choices;

    /* Set up html for current question */
    $( questionTemplate ).find( '#question' )
                         .html( question );

    /* Loop through choices array in order to set up html and click listeners */
    $.each( choices, function( index, value )
    {

      $( questionTemplate ).find( '#' + index )
                           .html( value )
                           .click( checkAnswer );

    });
    /* END .each() loop */

    /* Add question to div with id trivia-cards */
    $( '#trivia-cards' ).append( questionTemplate );

    game.currentQuestion++;

    if ( game.currentQuestion == (game.questionsBank.length - 1) )
      setTimeout( endRound, 7000 );
    else
      setTimeout( displayQuestion, 7000 );
   }
   /* END displayAnswer() ---------------------------- */

  /**
   *  Ends the current trivia round
   *
   *  Print results of previous trivia round
   *  Displays new round button to restart
   *
   *  @param ()
   *  @return undefined
   *
   */
   function endRound()
   {

    game.currentQuestion++;

    if ( game.currentQuestion == (game.questionsBank.length - 1) )
      setTimeout( endRound, 7000 );
    else
      setTimeout( displayQuestion, 7000 );
   }
   /* END endRound() ---------------------------- */

  /**
   *  Sets new timer interval
   *
   *  @param ()
   *  @return undefined
   *
   */
   function startTimer()
   {
    /* Set new timing interval */
    timer = setInterval( updateTimer, 1000 );
   }
   /* END startTimer() ---------------------------- */

  /**
   *  Updates corresponding timer html and corresponding time remaining variable.
   *  Checks if time allowed equals zero, if true fires checkAnswer().
   *
   *  @param ()
   *  @return undefined
   *
   */
   function updateTimer()
   {

    $( '#timer' ).html( '<h2>' + game.timeRemaining.toString() + '</h2>' );

    game.timeRemaining--;

    if ( game.timeRemaining == 0 )
      checkAnswer();
   }
   /* END updateTimer() ---------------------------- */

  /** --------------------------
   *  APPLICATION ENTRY POINT *
   ------------------------- **/
   startGame();

});
